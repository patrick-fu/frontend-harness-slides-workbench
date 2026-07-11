import { describe, it, expect } from "vitest";
import { lazy } from "react";
import type { RuntimeTopic } from "../catalog/runtime-registry";
import type { Band } from "../domain/style";
import type { TopicMetadata, TopicStageProps } from "../domain/topic";
import type { CatalogTopicEntry } from "./catalog-filter";
import { applyFilters, aggregateTags } from "./filter";

// ── Mock factory ────────────────────────────────────────────────────────────

const EmptyStage = (_props: TopicStageProps) => null;

function makeTopic(
  id: string,
  band: Band,
  tags: string[],
): CatalogTopicEntry {
  const metadata: TopicMetadata = {
    theme: "test theme",
    densityLabel: "Sparse",
    heroScene: 1,
    colors: { bg: "#fff", ink: "#000", panel: "#eee" },
    typography: { header: "Inter", body: "Inter" },
    tags,
    fonts: ["Inter"],
    scenes: [
      {
        id: 1,
        title: "Scene 1",
        beats: [{ id: 0, action: "show", title: "Beat 1", body: "" }],
      },
    ],
  };
  const topic: RuntimeTopic = {
    id,
    styleId: `style-${id}`,
    title: { en: `Topic ${id}`, zh: `题材 ${id}` },
    modelId: "GPT 5.5",
    metadata: { en: metadata, zh: metadata },
    navigation: { mode: "none" },
    transitionScore: {
      "1->2": "hard-cut",
      "2->3": "hard-cut",
      "3->4": "hard-cut",
      "4->5": "hard-cut",
    },
    evidence: { kind: "none" },
    modulePath: `../topics/${id}.tsx`,
    Stage: lazy(async () => ({ default: EmptyStage })),
    loadStage: async () => EmptyStage,
  };
  return {
    style: {
      id: `style-${id}`,
      name: { en: `Style ${id}`, zh: `风格 ${id}` },
      band,
    },
    topic,
    metadata,
  };
}

// ── Fixtures ────────────────────────────────────────────────────────────────

const allTopics: CatalogTopicEntry[] = [
  makeTopic("01", "minimal-keynote", ["clean", "corporate", "light"]),
  makeTopic("02", "minimal-keynote", ["clean", "dark"]),
  makeTopic("09", "balanced-hybrid", ["systematic", "corporate", "light"]),
  makeTopic("10", "balanced-hybrid", ["process", "dark", "technical"]),
  makeTopic("17", "editorial-print", ["serif", "elegant", "light"]),
  makeTopic("18", "editorial-print", ["serif", "corporate", "dark"]),
  makeTopic("25", "craft-cultural", ["handmade", "warm", "cultural"]),
  makeTopic("33", "contemporary-digital", ["glass", "modern", "dark"]),
  makeTopic("41", "text-report", ["dense", "technical", "corporate"]),
  makeTopic("42", "text-report", ["dense", "evidence"]),
];

// ── applyFilters ────────────────────────────────────────────────────────────

describe("applyFilters", () => {
  it("returns all Topics when no filters are selected", () => {
    const result = applyFilters(allTopics, [], []);
    expect(result).toHaveLength(allTopics.length);
    expect(result).toEqual(allTopics);
  });

  it("returns empty array for empty input", () => {
    expect(applyFilters([], ["minimal-keynote"], ["clean"])).toEqual([]);
  });

  it("filters by a single band", () => {
    const result = applyFilters(allTopics, ["minimal-keynote"], []);
    expect(result).toHaveLength(2);
    expect(result.map((entry) => entry.topic.id)).toEqual(["01", "02"]);
  });

  it("filters by multiple bands (OR logic)", () => {
    const result = applyFilters(
      allTopics,
      ["minimal-keynote", "editorial-print"],
      [],
    );
    expect(result).toHaveLength(4);
    expect(result.map((entry) => entry.topic.id)).toEqual(["01", "02", "17", "18"]);
  });

  it("filters by a single tag", () => {
    const result = applyFilters(allTopics, [], ["dark"]);
    expect(result).toHaveLength(4);
    expect(result.map((entry) => entry.topic.id)).toEqual(["02", "10", "18", "33"]);
  });

  it("filters by multiple tags (AND logic — all must be present)", () => {
    const result = applyFilters(allTopics, [], ["corporate", "light"]);
    // "01" has both, "09" has both; "17" has light but not corporate; "41" has corporate but not light
    expect(result).toHaveLength(2);
    expect(result.map((entry) => entry.topic.id)).toEqual(["01", "09"]);
  });

  it("applies both band and tag filters together", () => {
    const result = applyFilters(
      allTopics,
      ["balanced-hybrid"],
      ["corporate"],
    );
    // Only "09" is balanced-hybrid AND has "corporate"
    expect(result).toHaveLength(1);
    expect(result[0]?.topic.id).toBe("09");
  });

  it("returns empty array when band filter matches nothing", () => {
    const result = applyFilters(allTopics, ["text-report"], ["handmade"]);
    expect(result).toEqual([]);
  });

  it("returns empty array when tag filter matches nothing", () => {
    const result = applyFilters(allTopics, [], ["nonexistent-tag"]);
    expect(result).toEqual([]);
  });

  it("preserves original Topic order", () => {
    const result = applyFilters(allTopics, ["text-report", "minimal-keynote"], []);
    // Should appear in original order: 01, 02, 41, 42
    expect(result.map((entry) => entry.topic.id)).toEqual(["01", "02", "41", "42"]);
  });

  it("handles tag filter with single tag that appears once", () => {
    const result = applyFilters(allTopics, [], ["evidence"]);
    expect(result).toHaveLength(1);
    expect(result[0]?.topic.id).toBe("42");
  });
});

// ── aggregateTags ───────────────────────────────────────────────────────────

describe("aggregateTags", () => {
  it("returns empty array for empty input", () => {
    expect(aggregateTags([])).toEqual([]);
  });

  it("counts tag occurrences across all Topics", () => {
    const result = aggregateTags(allTopics.map((entry) => entry.metadata));
    const map = Object.fromEntries(result.map((r) => [r.tag, r.count]));

    expect(map["clean"]).toBe(2);
    expect(map["corporate"]).toBe(4);
    // 01: clean, corporate, light
    // 02: clean, dark
    // 09: systematic, corporate, light
    // 10: process, dark, technical
    // 17: serif, elegant, light
    // 18: serif, corporate, dark
    // 25: handmade, warm, cultural
    // 33: glass, modern, dark
    // 41: dense, technical, corporate
    // 42: dense, evidence

    // corporate: 01, 09, 18, 41 → 4
    // light: 01, 09, 17 → 3
    // dark: 02, 10, 18, 33 → 4
    // clean: 01, 02 → 2
    // serif: 17, 18 → 2
    // dense: 41, 42 → 2
    // technical: 10, 41 → 2

    expect(map["corporate"]).toBe(4);
    expect(map["light"]).toBe(3);
    expect(map["dark"]).toBe(4);
    expect(map["clean"]).toBe(2);
    expect(map["serif"]).toBe(2);
    expect(map["dense"]).toBe(2);
    expect(map["technical"]).toBe(2);
    expect(map["elegant"]).toBe(1);
    expect(map["handmade"]).toBe(1);
  });

  it("sorts tags alphabetically", () => {
    const result = aggregateTags(allTopics.map((entry) => entry.metadata));
    const tags = result.map((r) => r.tag);
    expect(tags).toEqual([...tags].sort());
  });

  it("handles styles with no tags", () => {
    const topics = [
      makeTopic("01", "minimal-keynote", []),
      makeTopic("02", "minimal-keynote", ["clean"]),
    ];
    const result = aggregateTags(topics.map((entry) => entry.metadata));
    expect(result).toEqual([{ tag: "clean", count: 1 }]);
  });

  it("returns correct total number of unique tags", () => {
    const result = aggregateTags(allTopics.map((entry) => entry.metadata));
    // From the fixture above, unique tags:
    // clean, corporate, light, dark, systematic, process, technical,
    // serif, elegant, handmade, warm, cultural, glass, modern, dense, evidence
    expect(result).toHaveLength(16);
  });
});
