import type { TopicComponent, TopicComponentLoader } from "../types";

export type { TopicComponent, TopicComponentLoader } from "../types";

/** Imports one Topic's Stage component without making the Catalog depend on it. */
/** The metadata shape required to locate adjacent Topic component loaders. */
export interface LoadableTopic {
  id: string;
  loadComponent: TopicComponentLoader;
}

export interface LoadableStyleRegistryEntry {
  id: string;
  topics: readonly LoadableTopic[];
}

export type LoadableStyleRegistry = readonly LoadableStyleRegistryEntry[];

const componentPromises = new WeakMap<
  TopicComponentLoader,
  Promise<TopicComponent>
>();

/**
 * Starts (or joins) a Topic component request. Failed requests are deliberately
 * not cached, so the Player's retry action can make a fresh request.
 */
export function loadTopicComponent(
  loadComponent: TopicComponentLoader,
): Promise<TopicComponent> {
  const cached = componentPromises.get(loadComponent);
  if (cached) return cached;

  const request = Promise.resolve()
    .then(loadComponent)
    .catch((error: unknown) => {
      componentPromises.delete(loadComponent);
      throw error;
    });

  componentPromises.set(loadComponent, request);
  return request;
}

/**
 * Warms the two topics neighboring the active Topic in registry order. A
 * background prefetch never surfaces an error; the explicit Player load owns
 * loading and retry UI.
 */
export async function prefetchAdjacentTopicComponents(
  registry: LoadableStyleRegistry,
  styleId: string,
  topicId: string,
): Promise<void> {
  const topics = registry.flatMap((style) =>
    style.topics.map((topic) => ({ styleId: style.id, topic })),
  );
  const currentIndex = topics.findIndex(
    (entry) => entry.styleId === styleId && entry.topic.id === topicId,
  );

  if (currentIndex < 0 || topics.length < 2) return;

  const next = topics[(currentIndex + 1) % topics.length]?.topic;
  const previous = topics[(currentIndex - 1 + topics.length) % topics.length]
    ?.topic;
  const loaders = new Set(
    [next, previous]
      .filter((topic): topic is LoadableTopic => Boolean(topic))
      .map((topic) => topic.loadComponent),
  );

  await Promise.all(
    [...loaders].map(async (loadComponent) => {
      try {
        await loadTopicComponent(loadComponent);
      } catch {
        // A future explicit load renders the retry state.
      }
    }),
  );
}
