import { describe, expect, it } from "vitest";
import type {
  RuntimeCatalogStyleGroup,
  RuntimeCatalogTopic,
} from "../catalog/runtime-catalog";
import type { Band, StyleDefinition } from "../domain/style";
import type { TopicMetadata } from "../domain/topic";
import {
  buildCatalogTopics,
  filterCatalogTopics,
  getCatalogFacetCounts,
  type CatalogTopicEntry,
} from "./catalog-filter";

function makeTopic(
  styleId: string,
  topicId: string,
  band: Band,
  modelId: RuntimeCatalogTopic["modelId"],
): CatalogTopicEntry {
  const metadata = makeMetadata();
  return {
    topicId,
    band,
    modelId,
    style: {
      id: styleId,
      name: { en: `Style ${styleId}`, zh: `风格 ${styleId}` },
      band,
    },
    topic: makeDiscoveryTopic(styleId, topicId, modelId, metadata),
    metadata,
  };
}

function makeMetadata(): TopicMetadata {
  return {
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

function makeDiscoveryTopic(
  styleId: string,
  id: string,
  modelId: RuntimeCatalogTopic["modelId"],
  metadata: TopicMetadata,
): RuntimeCatalogTopic {
  return {
    id,
    styleId,
    title: { en: `Topic ${id}`, zh: `题材 ${id}` },
    modelId,
    metadata: { en: metadata, zh: metadata },
    navigation: { mode: "none" },
    transitionScore: {
      "1->2": "hard-cut",
      "2->3": "hard-cut",
      "3->4": "hard-cut",
      "4->5": "hard-cut",
    },
    evidence: { kind: "none" },
  };
}

function makeGroup(
  style: StyleDefinition,
  topics: RuntimeCatalogTopic[],
): RuntimeCatalogStyleGroup {
  return { style, topics };
}

describe("filterCatalogTopics", () => {
  it("uses OR within each facet and AND between the Band and Model facets", () => {
    const topics = [
      makeTopic("minimal", "keynote", "minimal-keynote", "GPT 5.5"),
      makeTopic("minimal", "research", "minimal-keynote", "Claude Opus 4.8"),
      makeTopic("balanced", "process", "balanced-hybrid", "GPT 5.5"),
      makeTopic("editorial", "brief", "editorial-print", "Doubao-Seed-Evolving"),
    ];

    const visible = filterCatalogTopics(topics, {
      bands: ["minimal-keynote", "editorial-print"],
      models: ["GPT 5.5", "Doubao-Seed-Evolving"],
    });

    expect(visible.map((entry) => entry.topic.id)).toEqual([
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
    const registry: readonly RuntimeCatalogStyleGroup[] = [
      makeGroup(
        {
          id: "alpha",
          name: { en: "Alpha", zh: "甲" },
          band: "minimal-keynote",
        },
        [
          makeDiscoveryTopic("alpha", "first", "GPT 5.5", makeMetadata()),
          makeDiscoveryTopic(
            "alpha",
            "second",
            "Claude Opus 4.8",
            makeMetadata(),
          ),
        ],
      ),
      makeGroup(
        {
          id: "beta",
          name: { en: "Beta", zh: "乙" },
          band: "editorial-print",
        },
        [makeDiscoveryTopic("beta", "third", "GPT 5.5", makeMetadata())],
      ),
    ];

    const topics = buildCatalogTopics(registry, "zh");

    expect(
      topics.map(({ style, topic }) => ({
        styleId: style.id,
        styleName: style.name.zh,
        topicId: topic.id,
        topicName: topic.title.zh,
        band: style.band,
        modelId: topic.modelId,
      })),
    ).toEqual([
      {
        styleId: "alpha",
        styleName: "甲",
        topicId: "first",
        topicName: "题材 first",
        band: "minimal-keynote",
        modelId: "GPT 5.5",
      },
      {
        styleId: "alpha",
        styleName: "甲",
        topicId: "second",
        topicName: "题材 second",
        band: "minimal-keynote",
        modelId: "Claude Opus 4.8",
      },
      {
        styleId: "beta",
        styleName: "乙",
        topicId: "third",
        topicName: "题材 third",
        band: "editorial-print",
        modelId: "GPT 5.5",
      },
    ]);
  });
});

describe("getCatalogFacetCounts", () => {
  it("uses Topic counts from the opposite facet and keeps exact model strings in first-occurrence order", () => {
    const topics = [
      makeTopic("minimal", "keynote", "minimal-keynote", "GPT 5.5"),
      makeTopic("minimal", "research", "minimal-keynote", "Claude Opus 4.8"),
      makeTopic("editorial", "brief", "editorial-print", "GPT 5.5"),
      makeTopic("balanced", "process", "balanced-hybrid", "GPT 5.6 Sol"),
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
      { modelId: "GPT 5.5", count: 2 },
      { modelId: "Claude Opus 4.8", count: 1 },
      { modelId: "GPT 5.6 Sol", count: 0 },
    ]);
  });
});
