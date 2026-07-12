import { describe, expect, it } from "vitest";
import {
  resolveWorkbenchFilters,
  type WorkbenchFilterRegistry,
} from "./filter";

const topics = [
  ["alpha", "minimal-keynote", "GPT 5.5"],
  ["beta", "minimal-keynote", "Claude Opus 4.8"],
  ["gamma", "editorial-print", "GPT 5.5"],
  ["delta", "editorial-print", "Doubao-Seed-Evolving"],
  ["epsilon", "balanced-hybrid", "GPT 5.5"],
  ["zeta", "craft-cultural", "GPT 5.6 Sol"],
].map(([id, band, modelId]) => ({
  style: { band },
  topics: [{ id, modelId }],
})) satisfies WorkbenchFilterRegistry<
  { band: string },
  { id: string; modelId: string }
>;

describe("resolveWorkbenchFilters", () => {
  const topicIds = (resolution: ReturnType<typeof resolveWorkbenchFilters>) =>
    resolution.matchingTopics.map((topic) => topic.topicId);

  it("returns every Topic in Registry order when no Filters are active", () => {
    expect(
      topicIds(resolveWorkbenchFilters(topics, { bands: [], models: [] }, "")),
    ).toEqual(["alpha", "beta", "gamma", "delta", "epsilon", "zeta"]);
  });

  it.each([
    [
      "one Band",
      { bands: ["minimal-keynote"], models: [] },
      ["alpha", "beta"],
    ],
    [
      "multiple Bands with OR semantics",
      { bands: ["minimal-keynote", "craft-cultural"], models: [] },
      ["alpha", "beta", "zeta"],
    ],
    [
      "one Model ID",
      { bands: [], models: ["GPT 5.5"] },
      ["alpha", "gamma", "epsilon"],
    ],
    [
      "multiple Model IDs with OR semantics",
      { bands: [], models: ["GPT 5.5", "Claude Opus 4.8"] },
      ["alpha", "beta", "gamma", "epsilon"],
    ],
  ] as const)("resolves %s", (_label, filters, expected) => {
    expect(
      topicIds(
        resolveWorkbenchFilters(
          topics,
          { bands: [...filters.bands], models: [...filters.models] },
          "",
        ),
      ),
    ).toEqual(expected);
  });

  it("uses OR within facets and AND between facets while preserving Registry order", () => {
    const resolution = resolveWorkbenchFilters(
      topics,
      {
        bands: ["minimal-keynote", "editorial-print"],
        models: ["GPT 5.5", "Doubao-Seed-Evolving"],
      },
      "alpha",
    );

    expect(resolution.matchingTopics.map((topic) => topic.topicId)).toEqual([
      "alpha",
      "gamma",
      "delta",
    ]);
  });

  it("returns no matches for a known Band and Model combination with no intersection", () => {
    const resolution = resolveWorkbenchFilters(
      topics,
      { bands: ["craft-cultural"], models: ["Claude Opus 4.8"] },
      "zeta",
    );

    expect(topicIds(resolution)).toEqual([]);
    expect(resolution.unresolved).toEqual({ bands: [], models: [] });
    expect(resolution.currentTopicInCycleScope).toBe(false);
  });

  it("keeps unknown criteria unresolved and returns an empty Cycle Scope", () => {
    const resolution = resolveWorkbenchFilters(
      topics,
      {
        bands: ["minimal-keynote", "retired-band"],
        models: ["GPT 5.5", "retired-model"],
      },
      "alpha",
    );

    expect({
      matchingTopicIds: resolution.matchingTopics.map((topic) => topic.topicId),
      unresolved: resolution.unresolved,
    }).toEqual({
      matchingTopicIds: [],
      unresolved: {
        bands: ["retired-band"],
        models: ["retired-model"],
      },
    });
  });

  it("counts each facet against the opposite facet in first-appearance order", () => {
    const resolution = resolveWorkbenchFilters(
      topics,
      {
        bands: ["minimal-keynote", "editorial-print"],
        models: ["GPT 5.5", "Doubao-Seed-Evolving"],
      },
      "alpha",
    );

    expect(resolution.facetCounts).toEqual({
      bands: [
        { band: "minimal-keynote", count: 1 },
        { band: "editorial-print", count: 2 },
        { band: "balanced-hybrid", count: 1 },
        { band: "craft-cultural", count: 0 },
      ],
      models: [
        { modelId: "GPT 5.5", count: 2 },
        { modelId: "Claude Opus 4.8", count: 1 },
        { modelId: "Doubao-Seed-Evolving", count: 1 },
        { modelId: "GPT 5.6 Sol", count: 0 },
      ],
    });
  });

  it("exposes Cycle Scope membership and current-Topic scope status", () => {
    const inScope = resolveWorkbenchFilters(
      topics,
      { bands: [], models: ["GPT 5.5"] },
      "alpha",
    );
    const outOfScope = resolveWorkbenchFilters(
      topics,
      { bands: [], models: ["GPT 5.5"] },
      "beta",
    );

    expect({
      matchingTopicIds: inScope.matchingTopics.map((topic) => topic.topicId),
      alpha: inScope.isTopicInCycleScope("alpha"),
      beta: inScope.isTopicInCycleScope("beta"),
      missing: inScope.isTopicInCycleScope("missing"),
      currentTopicInScope: inScope.currentTopicInCycleScope,
      currentTopicOutOfScope: outOfScope.currentTopicInCycleScope,
    }).toEqual({
      matchingTopicIds: ["alpha", "gamma", "epsilon"],
      alpha: true,
      beta: false,
      missing: false,
      currentTopicInScope: true,
      currentTopicOutOfScope: false,
    });
  });

  it("keeps membership and order independent from localized labels", () => {
    const localizedRegistry = (label: string) =>
      topics.map((group) => ({
        style: { ...group.style, name: label },
        topics: group.topics.map((topic) => ({ ...topic, title: label })),
      }));
    const filters = {
      bands: ["minimal-keynote", "editorial-print"],
      models: ["GPT 5.5"],
    };
    const english = resolveWorkbenchFilters(
      localizedRegistry("English"),
      filters,
      "alpha",
    );
    const chinese = resolveWorkbenchFilters(
      localizedRegistry("中文"),
      filters,
      "alpha",
    );

    expect(topicIds(english)).toEqual(topicIds(chinese));
    expect(english.facetCounts).toEqual(chinese.facetCounts);
    expect(english.unresolved).toEqual(chinese.unresolved);
  });
});
