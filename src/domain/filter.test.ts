import { describe, expect, it } from "vitest";
import {
  resolveWorkbenchFilters,
  type WorkbenchFilterTopicFacts,
} from "./filter";

const topics = [
  { topicId: "alpha", band: "minimal-keynote", modelId: "GPT 5.5" },
  {
    topicId: "beta",
    band: "minimal-keynote",
    modelId: "Claude Opus 4.8",
  },
  { topicId: "gamma", band: "editorial-print", modelId: "GPT 5.5" },
  {
    topicId: "delta",
    band: "editorial-print",
    modelId: "Doubao-Seed-Evolving",
  },
  { topicId: "epsilon", band: "balanced-hybrid", modelId: "GPT 5.5" },
  { topicId: "zeta", band: "craft-cultural", modelId: "GPT 5.6 Sol" },
] satisfies readonly WorkbenchFilterTopicFacts[];

describe("resolveWorkbenchFilters", () => {
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
});
