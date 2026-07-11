import { lazy } from "react";
import type {
  CatalogTopicManifest,
  LoadableStyleRegistryEntry,
  LoadableStyleTopic,
  StyleMetadata,
  StyleTopic,
  TopicComponent,
} from "../types";
import { CATALOG_MANIFEST } from "./catalog-manifest.generated";
import {
  loadTopicComponent,
  prefetchAdjacentTopicComponents,
} from "./topic-component-loader";
import { createTopicComponentLoader } from "./topic-module-loader";

function buildTopic(manifest: CatalogTopicManifest): LoadableStyleTopic {
  const loadComponent = createTopicComponentLoader(manifest.modulePath);

  return {
    id: manifest.id,
    topic: manifest.topic,
    model: manifest.model,
    getMetadata: (language) => manifest.metadata[language],
    loadComponent,
    component: lazy(async () => ({
      default: await loadTopicComponent(loadComponent),
    })),
    navigation: manifest.navigation,
    sources: manifest.sources,
    transitionScore: manifest.transitionScore,
  };
}

/**
 * The runtime Catalog + Player registry. Catalog fields are synchronous static
 * data; Stage components are separate Vite chunks reached only through each
 * Topic's loadComponent function.
 */
export const STYLE_REGISTRY: LoadableStyleRegistryEntry[] = CATALOG_MANIFEST.map(
  (style) => ({
    id: style.id,
    name: style.name,
    topics: style.topics.map(buildTopic),
  }),
);

/** A flat list of all Topics across all Styles, in navigation order. */
export interface FlatTopicEntry {
  styleId: string;
  styleName: { en: string; zh: string };
  topicId: string;
  topicIndex: number;
  topic: StyleTopic["topic"];
  model: string;
  component: StyleTopic["component"];
  getMetadata: (lang: "en" | "zh") => StyleMetadata;
  loadComponent: LoadableStyleTopic["loadComponent"];
}

/**
 * Returns a flat array of all Topics in navigation order.
 * Used for cross-style/topic cycling.
 */
export function getAllTopics(): FlatTopicEntry[] {
  const result: FlatTopicEntry[] = [];
  for (const style of STYLE_REGISTRY) {
    for (let topicIndex = 0; topicIndex < style.topics.length; topicIndex += 1) {
      const topic = style.topics[topicIndex];
      result.push({
        styleId: style.id,
        styleName: style.name,
        topicId: topic.id,
        topicIndex,
        topic: topic.topic,
        model: topic.model,
        component: topic.component,
        getMetadata: topic.getMetadata,
        loadComponent: topic.loadComponent,
      });
    }
  }
  return result;
}

/** Finds a Topic by its stable Style and Topic slugs. */
export function findTopic(
  styleId: string,
  topicId: string,
): FlatTopicEntry | null {
  const style = STYLE_REGISTRY.find((entry) => entry.id === styleId);
  if (!style) return null;
  const topicIndex = style.topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex < 0) return null;
  const topic = style.topics[topicIndex];

  return {
    styleId: style.id,
    styleName: style.name,
    topicId: topic.id,
    topicIndex,
    topic: topic.topic,
    model: topic.model,
    component: topic.component,
    getMetadata: topic.getMetadata,
    loadComponent: topic.loadComponent,
  };
}

/** Loads one concrete Stage component, sharing requests with Player prefetches. */
export function loadRegistryTopicComponent(
  styleId: string,
  topicId: string,
): Promise<TopicComponent> {
  const topic = findTopic(styleId, topicId);
  if (!topic) {
    return Promise.reject(
      new Error(`Unknown Topic "${styleId}/${topicId}".`),
    );
  }
  return loadTopicComponent(topic.loadComponent);
}

/** Warms the Topics immediately before and after the active Topic. */
export function prefetchAdjacentRegistryTopics(
  styleId: string,
  topicId: string,
): Promise<void> {
  return prefetchAdjacentTopicComponents(STYLE_REGISTRY, styleId, topicId);
}

/** Gets the next Topic in navigation order, wrapping at the Catalog boundary. */
export function getNextTopic(
  styleId: string,
  topicId: string,
): FlatTopicEntry {
  const all = getAllTopics();
  const index = all.findIndex(
    (topic) => topic.styleId === styleId && topic.topicId === topicId,
  );
  return all[(index + 1) % all.length];
}

/** Gets the previous Topic in navigation order, wrapping at the Catalog boundary. */
export function getPrevTopic(
  styleId: string,
  topicId: string,
): FlatTopicEntry {
  const all = getAllTopics();
  const index = all.findIndex(
    (topic) => topic.styleId === styleId && topic.topicId === topicId,
  );
  return all[(index - 1 + all.length) % all.length];
}

/** Total number of Topics across all Styles. */
export function getTotalTopicCount(): number {
  return STYLE_REGISTRY.reduce((sum, style) => sum + style.topics.length, 0);
}
