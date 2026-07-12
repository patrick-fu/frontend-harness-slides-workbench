import type { StyleDefinition } from "../domain/style";
import type { TopicStage } from "../domain/topic";
import { CATALOG_MANIFEST } from "./manifest.generated";
import type { CatalogStyleGroup, CatalogTopic } from "./topic-catalog";
import {
  createTopicStageResolver,
  type TopicStageResolver,
} from "./topic-loader";

export type RuntimeCatalogTopic = Pick<
  CatalogTopic,
  | "id"
  | "styleId"
  | "title"
  | "modelId"
  | "metadata"
  | "navigation"
  | "transitionScore"
  | "evidence"
>;

export interface RuntimeCatalogStyleGroup {
  style: StyleDefinition;
  topics: readonly RuntimeCatalogTopic[];
}

export interface RuntimeCatalogTopicEntry {
  style: StyleDefinition;
  topic: RuntimeCatalogTopic;
}

export type RuntimePlayerTopic = Pick<
  RuntimeCatalogTopic,
  "id" | "styleId" | "title" | "modelId" | "metadata"
>;

export interface RuntimePlayerTopicEntry {
  style: Pick<StyleDefinition, "id" | "name">;
  topic: RuntimePlayerTopic;
}

export interface RuntimeCatalogDiscovery {
  styleGroups: readonly RuntimeCatalogStyleGroup[];
  totals: Readonly<{ styles: number; topics: number }>;
  findTopic: (topicId: string) => RuntimeCatalogTopicEntry | null;
}

export interface RuntimePlayerCatalog {
  findTopic: (topicId: string) => RuntimePlayerTopicEntry | null;
  loadStage: (topicId: string) => Promise<TopicStage>;
  prefetchAdjacent: (topicId: string) => Promise<void>;
}

export interface RuntimeCatalogInterfaces {
  discovery: RuntimeCatalogDiscovery;
  player: RuntimePlayerCatalog;
}

interface PrivateRuntimeTopicEntry {
  discovery: RuntimeCatalogTopicEntry;
  player: RuntimePlayerTopicEntry;
  loadStage: () => Promise<TopicStage>;
}

function createStageLoader(
  modulePath: string,
  resolveStage: TopicStageResolver,
): () => Promise<TopicStage> {
  let request: Promise<TopicStage> | undefined;

  return () => {
    if (!request) {
      request = Promise.resolve()
        .then(() => resolveStage(modulePath))
        .catch((error: unknown) => {
          request = undefined;
          throw error;
        });
    }
    return request;
  };
}

function toDiscoveryTopic(topic: CatalogTopic): RuntimeCatalogTopic {
  return {
    id: topic.id,
    styleId: topic.styleId,
    title: topic.title,
    modelId: topic.modelId,
    metadata: topic.metadata,
    navigation: topic.navigation,
    transitionScore: topic.transitionScore,
    evidence: topic.evidence,
  };
}

function toPlayerTopicEntry(
  style: StyleDefinition,
  topic: RuntimeCatalogTopic,
): RuntimePlayerTopicEntry {
  return {
    style: { id: style.id, name: style.name },
    topic: {
      id: topic.id,
      styleId: topic.styleId,
      title: topic.title,
      modelId: topic.modelId,
      metadata: topic.metadata,
    },
  };
}

export function createRuntimeCatalog(
  manifest: readonly CatalogStyleGroup[],
  resolveStage: TopicStageResolver,
): RuntimeCatalogInterfaces {
  const entries: PrivateRuntimeTopicEntry[] = [];
  const styleGroups = manifest.map((group) => {
    const topics = group.topics.map((source) => {
      const topic = toDiscoveryTopic(source);
      entries.push({
        discovery: { style: group.style, topic },
        player: toPlayerTopicEntry(group.style, topic),
        loadStage: createStageLoader(source.modulePath, resolveStage),
      });
      return topic;
    });

    return { style: group.style, topics };
  });
  const findPrivateTopic = (topicId: string) =>
    entries.find((entry) => entry.discovery.topic.id === topicId) ?? null;
  const findTopic = (topicId: string) =>
    findPrivateTopic(topicId)?.discovery ?? null;
  const findPlayerTopic = (topicId: string) =>
    findPrivateTopic(topicId)?.player ?? null;

  return {
    discovery: {
      styleGroups,
      totals: {
        styles: styleGroups.length,
        topics: styleGroups.reduce(
          (total, group) => total + group.topics.length,
          0,
        ),
      },
      findTopic,
    },
    player: {
      findTopic: findPlayerTopic,
      loadStage: (topicId) => {
        const entry = findPrivateTopic(topicId);
        if (!entry) {
          return Promise.reject(new Error(`Unknown Topic "${topicId}".`));
        }
        return entry.loadStage();
      },
      prefetchAdjacent: async (topicId) => {
        const currentIndex = entries.findIndex(
          (entry) => entry.discovery.topic.id === topicId,
        );
        if (currentIndex < 0 || entries.length < 2) return;

        const adjacent = new Set<PrivateRuntimeTopicEntry>();
        const next = entries[(currentIndex + 1) % entries.length];
        const previous =
          entries[(currentIndex - 1 + entries.length) % entries.length];
        if (next) adjacent.add(next);
        if (previous) adjacent.add(previous);
        await Promise.all(
          [...adjacent].map(async (entry) => {
            try {
              await entry.loadStage();
            } catch {
              // Explicit Player loads own recoverable errors and retry.
            }
          }),
        );
      },
    },
  };
}

export const RUNTIME_CATALOG = createRuntimeCatalog(
  CATALOG_MANIFEST,
  createTopicStageResolver(),
);
