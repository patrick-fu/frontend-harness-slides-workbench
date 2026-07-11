import { lazy, type LazyExoticComponent } from "react";
import type { TopicStage } from "../domain/topic";
import { CATALOG_MANIFEST } from "./manifest.generated";
import type { CatalogStyleGroup, CatalogTopic } from "./topic-catalog";
import {
  createTopicStageResolver,
  type TopicStageResolver,
} from "./topic-loader";

export type { TopicStageResolver } from "./topic-loader";

export interface RuntimeTopic extends CatalogTopic {
  loadStage: () => Promise<TopicStage>;
  Stage: LazyExoticComponent<TopicStage>;
}

export interface RuntimeStyleGroup {
  style: CatalogStyleGroup["style"];
  topics: readonly RuntimeTopic[];
}

export interface RuntimeTopicEntry {
  style: RuntimeStyleGroup["style"];
  styleIndex: number;
  topicIndex: number;
  topic: RuntimeTopic;
}

function createStageLoader(
  topic: CatalogTopic,
  resolveStage: TopicStageResolver,
): () => Promise<TopicStage> {
  let request: Promise<TopicStage> | undefined;

  return () => {
    if (!request) {
      request = Promise.resolve()
        .then(() => resolveStage(topic.modulePath))
        .catch((error: unknown) => {
          request = undefined;
          throw error;
        });
    }
    return request;
  };
}

function buildRuntimeTopic(
  topic: CatalogTopic,
  resolveStage: TopicStageResolver,
): RuntimeTopic {
  const loadStage = createStageLoader(topic, resolveStage);

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

/** Runtime Catalog data is synchronous; Stage imports stay on demand. */
export const RUNTIME_REGISTRY = createRuntimeRegistry(
  CATALOG_MANIFEST,
  createTopicStageResolver(),
);

const RUNTIME_TOPIC_ENTRIES: readonly RuntimeTopicEntry[] =
  RUNTIME_REGISTRY.flatMap((group, styleIndex) =>
    group.topics.map((topic, topicIndex) => ({
      style: group.style,
      styleIndex,
      topicIndex,
      topic,
    })),
  );

export function getAllRuntimeTopics(): readonly RuntimeTopicEntry[] {
  return RUNTIME_TOPIC_ENTRIES;
}

/** Resolves the globally unique Topic ID and exposes its canonical Style. */
export function findRuntimeTopic(topicId: string): RuntimeTopicEntry | null {
  return (
    RUNTIME_TOPIC_ENTRIES.find((entry) => entry.topic.id === topicId) ?? null
  );
}

/** Loads one Stage while retaining retry behavior after a dynamic import failure. */
export function loadRuntimeTopicStage(topicId: string): Promise<TopicStage> {
  const entry = findRuntimeTopic(topicId);
  if (!entry) {
    return Promise.reject(new Error(`Unknown Topic "${topicId}".`));
  }
  return entry.topic.loadStage();
}

/** Warms immediate neighbors without surfacing background failures to the Player. */
export async function prefetchAdjacentRuntimeTopics(
  topicId: string,
): Promise<void> {
  const currentIndex = RUNTIME_TOPIC_ENTRIES.findIndex(
    (entry) => entry.topic.id === topicId,
  );
  if (currentIndex < 0 || RUNTIME_TOPIC_ENTRIES.length < 2) return;

  const next =
    RUNTIME_TOPIC_ENTRIES[(currentIndex + 1) % RUNTIME_TOPIC_ENTRIES.length];
  const previous =
    RUNTIME_TOPIC_ENTRIES[
      (currentIndex - 1 + RUNTIME_TOPIC_ENTRIES.length) %
        RUNTIME_TOPIC_ENTRIES.length
    ];
  const topics = new Set(
    [next?.topic, previous?.topic].filter(
      (topic): topic is RuntimeTopic => Boolean(topic),
    ),
  );

  await Promise.all(
    [...topics].map(async (topic) => {
      try {
        await topic.loadStage();
      } catch {
        // The explicit Player request owns recoverable load errors and retry.
      }
    }),
  );
}

export function getTotalTopicCount(): number {
  return RUNTIME_TOPIC_ENTRIES.length;
}
