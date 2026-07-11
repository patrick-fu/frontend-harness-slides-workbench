import type { StyleMetadata, StyleRegistryEntry } from "../types";

export interface CatalogFilters {
  bands: string[];
  models: string[];
}

export interface CatalogTopic {
  styleId: string;
  styleName: string;
  topicId: string;
  topicName: string;
  band: StyleMetadata["band"];
  model: string;
  metadata: StyleMetadata;
}

export interface CatalogBandOption {
  band: StyleMetadata["band"];
  count: number;
}

export interface CatalogModelOption {
  model: string;
  count: number;
}

export interface CatalogFacetCounts {
  bands: CatalogBandOption[];
  models: CatalogModelOption[];
}

/**
 * Flattens the Registry into Topic-level catalog entries without changing its
 * Style or Topic order.
 */
export function buildCatalogTopics(
  registry: readonly StyleRegistryEntry[],
  language: "en" | "zh",
): CatalogTopic[] {
  const topics: CatalogTopic[] = [];

  for (const style of registry) {
    for (const topic of style.topics) {
      const metadata = topic.getMetadata(language);
      topics.push({
        styleId: style.id,
        styleName: style.name[language],
        topicId: topic.id,
        topicName: topic.topic[language],
        band: metadata.band,
        model: topic.model,
        metadata,
      });
    }
  }

  return topics;
}

/**
 * Applies Overview facets to Topics while retaining registry order.
 * Selections match any value within a facet and both facets must match.
 */
export function filterCatalogTopics(
  topics: readonly CatalogTopic[],
  filters: CatalogFilters,
): CatalogTopic[] {
  return topics.filter(
    (topic) =>
      (filters.bands.length === 0 || filters.bands.includes(topic.band)) &&
      (filters.models.length === 0 || filters.models.includes(topic.model)),
  );
}

/**
 * Counts each facet against the current selection in the other facet.
 * This keeps a Band choice from hiding its own alternatives, and vice versa.
 */
export function getCatalogFacetCounts(
  topics: readonly CatalogTopic[],
  filters: CatalogFilters,
): CatalogFacetCounts {
  const bands: CatalogBandOption[] = [];
  const models: CatalogModelOption[] = [];
  const knownBands = new Set<StyleMetadata["band"]>();
  const knownModels = new Set<string>();

  for (const topic of topics) {
    if (!knownBands.has(topic.band)) {
      knownBands.add(topic.band);
      bands.push({
        band: topic.band,
        count: topics.filter(
          (candidate) =>
            candidate.band === topic.band &&
            (filters.models.length === 0 ||
              filters.models.includes(candidate.model)),
        ).length,
      });
    }

    if (!knownModels.has(topic.model)) {
      knownModels.add(topic.model);
      models.push({
        model: topic.model,
        count: topics.filter(
          (candidate) =>
            candidate.model === topic.model &&
            (filters.bands.length === 0 ||
              filters.bands.includes(candidate.band)),
        ).length,
      });
    }
  }

  return { bands, models };
}
