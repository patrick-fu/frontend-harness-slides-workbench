import type { ModelId } from "./model";
import type { Band } from "./style";

export interface WorkbenchFilters {
  bands: string[];
  models: string[];
}

export interface WorkbenchFilterTopicFacts {
  topicId: string;
  band: Band;
  modelId: ModelId;
}

export interface WorkbenchFilterResolution<
  Topic extends WorkbenchFilterTopicFacts,
> {
  matchingTopics: readonly Topic[];
  unresolved: WorkbenchFilters;
  facetCounts: {
    bands: readonly { band: Band; count: number }[];
    models: readonly { modelId: ModelId; count: number }[];
  };
  isTopicInCycleScope: (topicId: string) => boolean;
  currentTopicInCycleScope: boolean;
}

function unresolvedWorkbenchFilters(
  knownBands: ReadonlySet<string>,
  knownModels: ReadonlySet<string>,
  filters: WorkbenchFilters,
): WorkbenchFilters {
  return {
    bands: filters.bands.filter((band) => !knownBands.has(band)),
    models: filters.models.filter((model) => !knownModels.has(model)),
  };
}

export function resolveWorkbenchFilters<
  Topic extends WorkbenchFilterTopicFacts,
>(
  topics: readonly Topic[],
  filters: WorkbenchFilters,
  currentTopicId: string,
): WorkbenchFilterResolution<Topic> {
  const knownBands = new Set(topics.map((topic) => topic.band));
  const knownModels = new Set(topics.map((topic) => topic.modelId));
  const unresolved = unresolvedWorkbenchFilters(
    knownBands,
    knownModels,
    filters,
  );
  const hasUnresolvedCriteria =
    unresolved.bands.length > 0 || unresolved.models.length > 0;
  const bands: { band: Band; count: number }[] = [];
  const models: { modelId: ModelId; count: number }[] = [];

  for (const topic of topics) {
    if (!bands.some((option) => option.band === topic.band)) {
      bands.push({
        band: topic.band,
        count: topics.filter(
          (candidate) =>
            candidate.band === topic.band &&
            (filters.models.length === 0 ||
              filters.models.includes(candidate.modelId)),
        ).length,
      });
    }

    if (!models.some((option) => option.modelId === topic.modelId)) {
      models.push({
        modelId: topic.modelId,
        count: topics.filter(
          (candidate) =>
            candidate.modelId === topic.modelId &&
            (filters.bands.length === 0 ||
              filters.bands.includes(candidate.band)),
        ).length,
      });
    }
  }
  const matchingTopics = hasUnresolvedCriteria
    ? []
    : topics.filter((topic) =>
        matchesWorkbenchFilters(topic.band, topic.modelId, filters),
      );
  const cycleScopeTopicIds = new Set(
    matchingTopics.map((topic) => topic.topicId),
  );

  return {
    matchingTopics,
    unresolved,
    facetCounts: { bands, models },
    isTopicInCycleScope: (topicId) => cycleScopeTopicIds.has(topicId),
    currentTopicInCycleScope: cycleScopeTopicIds.has(currentTopicId),
  };
}

/** Band and Model selections are OR within a facet and AND across facets. */
export function matchesWorkbenchFilters(
  band: string,
  modelId: string,
  filters: WorkbenchFilters,
): boolean {
  return (
    (filters.bands.length === 0 || filters.bands.includes(band)) &&
    (filters.models.length === 0 || filters.models.includes(modelId))
  );
}

/** Unknown query values remain unresolved instead of broadening results. */
export function hasUnresolvedWorkbenchFilters(
  knownBands: ReadonlySet<string>,
  knownModels: ReadonlySet<string>,
  filters: WorkbenchFilters,
): boolean {
  const unresolved = unresolvedWorkbenchFilters(
    knownBands,
    knownModels,
    filters,
  );

  return unresolved.bands.length > 0 || unresolved.models.length > 0;
}
