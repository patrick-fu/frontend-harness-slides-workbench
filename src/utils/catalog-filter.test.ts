import { describe, expect, it } from "vitest";
import type { StyleMetadata, StyleRegistryEntry, StyleTopic } from "../types";
import {
  buildCatalogTopics,
  filterCatalogTopics,
  getCatalogFacetCounts,
  type CatalogTopic,
} from "./catalog-filter";

function makeTopic(
  styleId: string,
  topicId: string,
  band: CatalogTopic["band"],
  model: string,
): CatalogTopic {
  return {
    styleId,
    styleName: `Style ${styleId}`,
    topicId,
    topicName: `Topic ${topicId}`,
    band,
    model,
    metadata: {} as StyleMetadata,
  };
}

function makeMetadata(
  id: string,
  band: StyleMetadata["band"],
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
    tags: [],
    fonts: [],
    scenes: [],
  };
}

function makeRegistryTopic(
  id: string,
  model: string,
  band: StyleMetadata["band"],
): StyleTopic {
  return {
    id,
    topic: { en: `Topic ${id}`, zh: `题材 ${id}` },
    model,
    component: () => null,
    getMetadata: () => makeMetadata(id, band),
  };
}

describe("filterCatalogTopics", () => {
  it("uses OR within each facet and AND between the Band and Model facets", () => {
    const topics = [
      makeTopic("minimal", "keynote", "minimal-keynote", "GPT 5.5"),
      makeTopic("minimal", "research", "minimal-keynote", "Claude 4"),
      makeTopic("balanced", "process", "balanced-hybrid", "GPT 5.5"),
      makeTopic("editorial", "brief", "editorial-print", "Gemini 2.5"),
    ];

    const visible = filterCatalogTopics(topics, {
      bands: ["minimal-keynote", "editorial-print"],
      models: ["GPT 5.5", "Gemini 2.5"],
    });

    expect(visible.map((topic) => topic.topicId)).toEqual([
      "keynote",
      "brief",
    ]);
  });

  it("keeps unknown selected criteria active so they cannot broaden results", () => {
    const topics = [
      makeTopic("minimal", "keynote", "minimal-keynote", "GPT 5.5"),
    ];

    expect(
      filterCatalogTopics(topics, {
        bands: ["not-a-band"],
        models: [],
      }),
    ).toEqual([]);
    expect(
      filterCatalogTopics(topics, {
        bands: [],
        models: ["not-a-model"],
      }),
    ).toEqual([]);
  });
});

describe("buildCatalogTopics", () => {
  it("enumerates every Topic in registry order with the requested localized labels", () => {
    const registry: StyleRegistryEntry[] = [
      {
        id: "alpha",
        name: { en: "Alpha", zh: "甲" },
        topics: [
          makeRegistryTopic("first", "GPT 5.5", "minimal-keynote"),
          makeRegistryTopic("second", "Claude 4", "minimal-keynote"),
        ],
      },
      {
        id: "beta",
        name: { en: "Beta", zh: "乙" },
        topics: [makeRegistryTopic("third", "GPT 5.5", "editorial-print")],
      },
    ];

    const topics = buildCatalogTopics(registry, "zh");

    expect(
      topics.map(({ styleId, styleName, topicId, topicName, band, model }) => ({
        styleId,
        styleName,
        topicId,
        topicName,
        band,
        model,
      })),
    ).toEqual([
      {
        styleId: "alpha",
        styleName: "甲",
        topicId: "first",
        topicName: "题材 first",
        band: "minimal-keynote",
        model: "GPT 5.5",
      },
      {
        styleId: "alpha",
        styleName: "甲",
        topicId: "second",
        topicName: "题材 second",
        band: "minimal-keynote",
        model: "Claude 4",
      },
      {
        styleId: "beta",
        styleName: "乙",
        topicId: "third",
        topicName: "题材 third",
        band: "editorial-print",
        model: "GPT 5.5",
      },
    ]);
  });
});

describe("getCatalogFacetCounts", () => {
  it("uses Topic counts from the opposite facet and keeps exact model strings in first-occurrence order", () => {
    const topics = [
      makeTopic("minimal", "keynote", "minimal-keynote", "GPT 5.5"),
      makeTopic("minimal", "research", "minimal-keynote", "Claude 4"),
      makeTopic("editorial", "brief", "editorial-print", "GPT 5.5"),
      makeTopic("balanced", "process", "balanced-hybrid", "GPT-5.5"),
    ];

    const facets = getCatalogFacetCounts(topics, {
      bands: ["minimal-keynote", "editorial-print"],
      models: ["GPT 5.5"],
    });

    expect(facets.bands).toEqual([
      { band: "minimal-keynote", count: 1 },
      { band: "editorial-print", count: 1 },
      { band: "balanced-hybrid", count: 0 },
    ]);
    expect(facets.models).toEqual([
      { model: "GPT 5.5", count: 2 },
      { model: "Claude 4", count: 1 },
      { model: "GPT-5.5", count: 0 },
    ]);
  });
});
