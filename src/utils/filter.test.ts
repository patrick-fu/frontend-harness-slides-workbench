import { describe, it, expect } from "vitest";
import type { StyleMetadata } from "../types";
import { applyFilters, aggregateTags } from "./filter";

// ── Mock factory ────────────────────────────────────────────────────────────

function makeStyle(
  id: string,
  band: StyleMetadata["band"],
  tags: string[],
): StyleMetadata {
  return {
    id,
    band,
    name: `Style ${id}`,
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
}

// ── Fixtures ────────────────────────────────────────────────────────────────

const allStyles: StyleMetadata[] = [
  makeStyle("01", "minimal-keynote", ["clean", "corporate", "light"]),
  makeStyle("02", "minimal-keynote", ["clean", "dark"]),
  makeStyle("09", "balanced-hybrid", ["systematic", "corporate", "light"]),
  makeStyle("10", "balanced-hybrid", ["process", "dark", "technical"]),
  makeStyle("17", "editorial-print", ["serif", "elegant", "light"]),
  makeStyle("18", "editorial-print", ["serif", "corporate", "dark"]),
  makeStyle("25", "craft-cultural", ["handmade", "warm", "cultural"]),
  makeStyle("33", "contemporary-digital", ["glass", "modern", "dark"]),
  makeStyle("41", "text-report", ["dense", "technical", "corporate"]),
  makeStyle("42", "text-report", ["dense", "evidence"]),
];

// ── applyFilters ────────────────────────────────────────────────────────────

describe("applyFilters", () => {
  it("returns all styles when no filters are selected", () => {
    const result = applyFilters(allStyles, [], []);
    expect(result).toHaveLength(allStyles.length);
    expect(result).toEqual(allStyles);
  });

  it("returns empty array for empty input", () => {
    expect(applyFilters([], ["minimal-keynote"], ["clean"])).toEqual([]);
  });

  it("filters by a single band", () => {
    const result = applyFilters(allStyles, ["minimal-keynote"], []);
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual(["01", "02"]);
  });

  it("filters by multiple bands (OR logic)", () => {
    const result = applyFilters(
      allStyles,
      ["minimal-keynote", "editorial-print"],
      [],
    );
    expect(result).toHaveLength(4);
    expect(result.map((s) => s.id)).toEqual(["01", "02", "17", "18"]);
  });

  it("filters by a single tag", () => {
    const result = applyFilters(allStyles, [], ["dark"]);
    expect(result).toHaveLength(4);
    expect(result.map((s) => s.id)).toEqual(["02", "10", "18", "33"]);
  });

  it("filters by multiple tags (AND logic — all must be present)", () => {
    const result = applyFilters(allStyles, [], ["corporate", "light"]);
    // "01" has both, "09" has both; "17" has light but not corporate; "41" has corporate but not light
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.id)).toEqual(["01", "09"]);
  });

  it("applies both band and tag filters together", () => {
    const result = applyFilters(
      allStyles,
      ["balanced-hybrid"],
      ["corporate"],
    );
    // Only "09" is balanced-hybrid AND has "corporate"
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("09");
  });

  it("returns empty array when band filter matches nothing", () => {
    const result = applyFilters(allStyles, ["text-report"], ["handmade"]);
    expect(result).toEqual([]);
  });

  it("returns empty array when tag filter matches nothing", () => {
    const result = applyFilters(allStyles, [], ["nonexistent-tag"]);
    expect(result).toEqual([]);
  });

  it("preserves original order of styles", () => {
    const result = applyFilters(allStyles, ["text-report", "minimal-keynote"], []);
    // Should appear in original order: 01, 02, 41, 42
    expect(result.map((s) => s.id)).toEqual(["01", "02", "41", "42"]);
  });

  it("handles tag filter with single tag that appears once", () => {
    const result = applyFilters(allStyles, [], ["evidence"]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("42");
  });
});

// ── aggregateTags ───────────────────────────────────────────────────────────

describe("aggregateTags", () => {
  it("returns empty array for empty input", () => {
    expect(aggregateTags([])).toEqual([]);
  });

  it("counts tag occurrences across all styles", () => {
    const result = aggregateTags(allStyles);
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
    const result = aggregateTags(allStyles);
    const tags = result.map((r) => r.tag);
    expect(tags).toEqual([...tags].sort());
  });

  it("handles styles with no tags", () => {
    const styles = [
      makeStyle("01", "minimal-keynote", []),
      makeStyle("02", "minimal-keynote", ["clean"]),
    ];
    const result = aggregateTags(styles);
    expect(result).toEqual([{ tag: "clean", count: 1 }]);
  });

  it("returns correct total number of unique tags", () => {
    const result = aggregateTags(allStyles);
    // From the fixture above, unique tags:
    // clean, corporate, light, dark, systematic, process, technical,
    // serif, elegant, handmade, warm, cultural, glass, modern, dense, evidence
    expect(result).toHaveLength(16);
  });
});
