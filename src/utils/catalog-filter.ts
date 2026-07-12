import type { RuntimeStyleGroup, RuntimeTopic } from "../catalog/runtime-registry";
import {
  hasUnresolvedWorkbenchFilters,
  matchesWorkbenchFilters,
  type WorkbenchFilters,
} from "../domain/filter";
import type { ModelId } from "../domain/model";
import type { Band, StyleDefinition } from "../domain/style";
import type { TopicMetadata } from "../domain/topic";

export type CatalogFilters = WorkbenchFilters;

export interface CatalogTopicEntry {
  style: StyleDefinition;
  topic: RuntimeTopic;
  metadata: TopicMetadata;
}

export interface CatalogBandOption {
  band: Band;
  count: number;
}

export interface CatalogModelOption {
  modelId: ModelId;
  count: number;
}

export interface CatalogFacetCounts {
  bands: CatalogBandOption[];
  models: CatalogModelOption[];
}

export interface CatalogFilterResolution {
  allTopics: CatalogTopicEntry[];
  visibleTopics: CatalogTopicEntry[];
  facetCounts: CatalogFacetCounts;
  unavailableBands: string[];
  unavailableModels: string[];
}

/**
 * Flattens the Registry into Topic-level catalog entries without changing its
 * Style or Topic order.
 */
export function buildCatalogTopics(
  registry: readonly RuntimeStyleGroup[],
  language: "en" | "zh",
): CatalogTopicEntry[] {
  const topics: CatalogTopicEntry[] = [];

  for (const group of registry) {
    for (const topic of group.topics) {
      topics.push({
        style: group.style,
        topic,
        metadata: topic.metadata[language],
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
  topics: readonly CatalogTopicEntry[],
  filters: CatalogFilters,
): CatalogTopicEntry[] {
  return topics.filter(
    (topic) => matchesWorkbenchFilters(
      topic.style.band,
      topic.topic.modelId,
      filters,
    ),
  );
}

/**
 * Counts each facet against the current selection in the other facet.
 * This keeps a Band choice from hiding its own alternatives, and vice versa.
 */
export function getCatalogFacetCounts(
  topics: readonly CatalogTopicEntry[],
  filters: CatalogFilters,
): CatalogFacetCounts {
  const bands: CatalogBandOption[] = [];
  const models: CatalogModelOption[] = [];
  const knownBands = new Set<Band>();
  const knownModels = new Set<ModelId>();

  for (const topic of topics) {
    if (!knownBands.has(topic.style.band)) {
      knownBands.add(topic.style.band);
      bands.push({
        band: topic.style.band,
        count: topics.filter(
          (candidate) =>
            candidate.style.band === topic.style.band &&
            (filters.models.length === 0 ||
              filters.models.includes(candidate.topic.modelId)),
        ).length,
      });
    }

    if (!knownModels.has(topic.topic.modelId)) {
      knownModels.add(topic.topic.modelId);
      models.push({
        modelId: topic.topic.modelId,
        count: topics.filter(
          (candidate) =>
            candidate.topic.modelId === topic.topic.modelId &&
            (filters.bands.length === 0 ||
              filters.bands.includes(candidate.style.band)),
        ).length,
      });
    }
  }

  return { bands, models };
}

/** Resolves shareable Filter criteria once for every Workbench surface. */
export function resolveCatalogFilters(
  registry: readonly RuntimeStyleGroup[],
  language: "en" | "zh",
  filters: CatalogFilters,
): CatalogFilterResolution {
  const allTopics = buildCatalogTopics(registry, language);
  const knownBands = new Set<string>(
    allTopics.map((entry) => entry.style.band),
  );
  const knownModels = new Set<string>(
    allTopics.map((entry) => entry.topic.modelId),
  );
  const unavailableBands = filters.bands.filter(
    (band) => !knownBands.has(band),
  );
  const unavailableModels = filters.models.filter(
    (model) => !knownModels.has(model),
  );
  const hasUnavailableFilters = hasUnresolvedWorkbenchFilters(
    knownBands,
    knownModels,
    filters,
  );

  return {
    allTopics,
    visibleTopics: hasUnavailableFilters
      ? []
      : filterCatalogTopics(allTopics, filters),
    facetCounts: getCatalogFacetCounts(allTopics, filters),
    unavailableBands,
    unavailableModels,
  };
}
