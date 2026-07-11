import { lazy, type LazyExoticComponent } from "react";
import type { TopicStage } from "../domain/topic";
import type {
  CatalogStyleGroup,
  CatalogTopic,
} from "./topic-catalog";

export type TopicStageResolver = (modulePath: string) => Promise<TopicStage>;

export interface RuntimeTopic extends CatalogTopic {
  loadStage: () => Promise<TopicStage>;
  Stage: LazyExoticComponent<TopicStage>;
}

export interface RuntimeStyleGroup {
  style: CatalogStyleGroup["style"];
  topics: readonly RuntimeTopic[];
}

function buildRuntimeTopic(
  topic: CatalogTopic,
  resolveStage: TopicStageResolver,
): RuntimeTopic {
  const loadStage = () => resolveStage(topic.modulePath);

  return {
    ...topic,
    loadStage,
    Stage: lazy(async () => ({ default: await loadStage() })),
  };
}

export function createRuntimeRegistry(
  manifest: readonly CatalogStyleGroup[],
  resolveStage: TopicStageResolver,
): readonly RuntimeStyleGroup[] {
  return manifest.map((group) => ({
    style: group.style,
    topics: group.topics.map((topic) =>
      buildRuntimeTopic(topic, resolveStage),
    ),
  }));
}
