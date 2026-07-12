export interface WorkbenchFilters {
  bands: string[];
  models: string[];
}

export interface WorkbenchFilterStyleFacts {
  band: string;
}

export interface WorkbenchFilterTopicIdentity {
  id: string;
  modelId: string;
}

export interface WorkbenchFilterTopicFacts<
  Style extends WorkbenchFilterStyleFacts,
  Topic extends WorkbenchFilterTopicIdentity,
> {
  topicId: string;
  band: Style["band"];
  modelId: Topic["modelId"];
  style: Style;
  topic: Topic;
}

export interface WorkbenchFilterResolution<
  Style extends WorkbenchFilterStyleFacts,
  Topic extends WorkbenchFilterTopicIdentity,
> {
  allTopics: readonly WorkbenchFilterTopicFacts<Style, Topic>[];
  matchingTopics: readonly WorkbenchFilterTopicFacts<Style, Topic>[];
  unresolved: WorkbenchFilters;
  facetCounts: {
    bands: readonly { band: Style["band"]; count: number }[];
    models: readonly { modelId: Topic["modelId"]; count: number }[];
  };
  isTopicInCycleScope: (topicId: string) => boolean;
  currentTopicInCycleScope: boolean;
}

export type WorkbenchFilterRegistry<
  Style extends WorkbenchFilterStyleFacts,
  Topic extends WorkbenchFilterTopicIdentity,
> = readonly {
  style: Style;
  topics: readonly Topic[];
}[];

function toggleMatches(
  topic: WorkbenchFilterTopicFacts<WorkbenchFilterStyleFacts, WorkbenchFilterTopicIdentity>,
  filters: WorkbenchFilters,
) {
  return (
    (filters.bands.length === 0 || filters.bands.includes(topic.band)) &&
    (filters.models.length === 0 || filters.models.includes(topic.modelId))
  );
}

export function resolveWorkbenchFilters<
  Style extends WorkbenchFilterStyleFacts,
  Topic extends WorkbenchFilterTopicIdentity,
>(
  registry: WorkbenchFilterRegistry<Style, Topic>,
  filters: WorkbenchFilters,
  currentTopicId: string,
): WorkbenchFilterResolution<Style, Topic> {
  const allTopics = registry.flatMap((group) =>
    group.topics.map((topic) => ({
      topicId: topic.id,
      band: group.style.band,
      modelId: topic.modelId,
      style: group.style,
      topic,
    })),
  );
  const knownBands = new Set(allTopics.map((topic) => topic.band));
  const knownModels = new Set(allTopics.map((topic) => topic.modelId));
  const unresolved = {
    bands: filters.bands.filter((band) => !knownBands.has(band)),
    models: filters.models.filter((model) => !knownModels.has(model)),
  };
  const hasUnresolvedCriteria =
    unresolved.bands.length > 0 || unresolved.models.length > 0;
  const bands: { band: Style["band"]; count: number }[] = [];
  const models: { modelId: Topic["modelId"]; count: number }[] = [];

  for (const topic of allTopics) {
    if (!bands.some((option) => option.band === topic.band)) {
      bands.push({
        band: topic.band,
        count: allTopics.filter(
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
        count: allTopics.filter(
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
    : allTopics.filter((topic) => toggleMatches(topic, filters));
  const cycleScopeTopicIds = new Set(
    matchingTopics.map((topic) => topic.topicId),
  );

  return {
    allTopics,
    matchingTopics,
    unresolved,
    facetCounts: { bands, models },
    isTopicInCycleScope: (topicId) => cycleScopeTopicIds.has(topicId),
    currentTopicInCycleScope: cycleScopeTopicIds.has(currentTopicId),
  };
}
