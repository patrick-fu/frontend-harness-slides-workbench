import type {
  RuntimeCatalogStyleGroup,
  RuntimeCatalogTopic,
} from "../catalog/runtime-catalog";
import {
  matchesWorkbenchFilters,
  resolveWorkbenchFilters,
  type WorkbenchFilterResolution,
  type WorkbenchFilters,
} from "../domain/filter";
import type { ModelId } from "../domain/model";
import type { Band, StyleDefinition } from "../domain/style";
import type { TopicMetadata } from "../domain/topic";

export type CatalogFilters = WorkbenchFilters;

export interface CatalogTopicEntry {
  topicId: string;
  band: Band;
  modelId: ModelId;
  style: StyleDefinition;
  topic: RuntimeCatalogTopic;
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

export interface CatalogFilterResolution
  extends WorkbenchFilterResolution<CatalogTopicEntry> {
  allTopics: CatalogTopicEntry[];
  /** Temporary aliases retained until the remaining Filter consumers migrate. */
  visibleTopics: CatalogTopicEntry[];
  unavailableBands: string[];
  unavailableModels: string[];
  hasActiveFilters: boolean;
}

/**
 * Flattens the Registry into Topic-level catalog entries without changing its
 * Style or Topic order.
 */
export function buildCatalogTopics(
  registry: readonly RuntimeCatalogStyleGroup[],
  language: "en" | "zh",
): CatalogTopicEntry[] {
  const topics: CatalogTopicEntry[] = [];

  for (const group of registry) {
    for (const topic of group.topics) {
      topics.push({
        topicId: topic.id,
        band: group.style.band,
        modelId: topic.modelId,
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
  registry: readonly RuntimeCatalogStyleGroup[],
  language: "en" | "zh",
  filters: CatalogFilters,
  currentTopicId = "",
): CatalogFilterResolution {
  const allTopics = buildCatalogTopics(registry, language);
  const resolution = resolveWorkbenchFilters(
    allTopics,
    filters,
    currentTopicId,
  );

  return {
    ...resolution,
    allTopics,
    visibleTopics: [...resolution.matchingTopics],
    unavailableBands: [...resolution.unresolved.bands],
    unavailableModels: [...resolution.unresolved.models],
    hasActiveFilters: filters.bands.length > 0 || filters.models.length > 0,
  };
}
