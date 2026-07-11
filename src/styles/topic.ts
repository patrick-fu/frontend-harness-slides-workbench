import type {
  StyleMetadata,
  StyleRegistryEntry,
  StyleTopic,
  TopicComponent,
  TopicNavigationProfile,
  TopicSource,
  TopicTransitionScore,
} from "../types";
import {
  TOPIC_NAVIGATION_FEEDBACK,
  TOPIC_NAVIGATION_GEOMETRIES,
  TOPIC_NAVIGATION_INVOCATIONS,
} from "../types";

const TOPIC_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const LEGACY_VERSION_ID_PATTERN = /^v\d+$/;
const NAVIGATION_VALUES = {
  geometry: new Set<string>(TOPIC_NAVIGATION_GEOMETRIES),
  invocation: new Set<string>(TOPIC_NAVIGATION_INVOCATIONS),
  feedback: new Set<string>(TOPIC_NAVIGATION_FEEDBACK),
};

export interface StyleTopicModule {
  id: string;
  topic: StyleTopic["topic"];
  model: string;
  component: TopicComponent;
  getMetadata: StyleTopic["getMetadata"];
  navigation?: TopicNavigationProfile;
  sources?: readonly TopicSource[];
  transitionScore?: Readonly<TopicTransitionScore>;
}

function validateTopicId(id: string | undefined): void {
  if (typeof id !== "string" || !TOPIC_ID_PATTERN.test(id)) {
    throw new Error(
      `Invalid topic id "${id}". Use lowercase letters, numbers, and hyphens.`,
    );
  }
  if (LEGACY_VERSION_ID_PATTERN.test(id)) {
    throw new Error(`Invalid topic id "${id}". Do not use legacy version ids.`);
  }
}

function validateMetadata(styleId: string, metadata: StyleMetadata): void {
  if (metadata.id !== styleId) {
    throw new Error(
      `Metadata id "${metadata.id}" does not match style id "${styleId}".`,
    );
  }
  if (metadata.scenes.length !== 5) {
    throw new Error(`Style "${styleId}" must define exactly 5 scenes.`);
  }
}

function validateTopic(id: string, topic: StyleTopic["topic"] | undefined): void {
  if (!topic?.en.trim() || !topic.zh.trim()) {
    throw new Error(`Topic "${id}" must define localized en/zh topic.`);
  }
}

function validateNavigation(
  topicId: string,
  navigation: TopicNavigationProfile | undefined,
): void {
  if (!navigation) return;
  if (!TOPIC_ID_PATTERN.test(navigation.carrier)) {
    throw new Error(
      `Topic "${topicId}" navigation carrier must be a lowercase slug.`,
    );
  }
  for (const key of ["geometry", "invocation", "feedback"] as const) {
    if (!NAVIGATION_VALUES[key].has(navigation[key])) {
      throw new Error(
        `Topic "${topicId}" uses unsupported navigation ${key} "${navigation[key]}".`,
      );
    }
  }
}

export function defineStyleTopic(module: StyleTopicModule): StyleTopicModule {
  validateTopicId(module.id);
  validateTopic(module.id, module.topic);
  validateNavigation(module.id, module.navigation);
  if (!module.model.trim()) {
    throw new Error(`Topic "${module.id}" must define a model.`);
  }
  return module;
}

function buildTopic(
  styleId: string,
  input: StyleTopicModule,
): {
  topic: StyleTopic;
  name: { en: string; zh: string };
} {
  const metaEn = input.getMetadata("en");
  const metaZh = input.getMetadata("zh");
  validateMetadata(styleId, metaEn);
  validateMetadata(styleId, metaZh);
  validateTopicId(input.id);
  validateTopic(input.id, input.topic);
  validateNavigation(input.id, input.navigation);

  return {
    topic: {
      id: input.id,
      topic: input.topic,
      model: input.model,
      component: input.component,
      loadComponent: async () => input.component,
      getMetadata: input.getMetadata,
      navigation: input.navigation,
      sources: input.sources,
      transitionScore: input.transitionScore,
    },
    name: { en: metaEn.name, zh: metaZh.name },
  };
}

export function buildStyleRegistryEntry(
  styleId: string,
  topics: StyleTopicModule[],
): StyleRegistryEntry {
  const seen = new Set<string>();
  const built = topics.map((topic) => {
    const builtTopic = buildTopic(styleId, topic);
    const id = builtTopic.topic.id;
    if (seen.has(id)) {
      throw new Error(`Duplicate topic id "${id}" in style "${styleId}".`);
    }
    seen.add(id);
    return builtTopic;
  });
  const builtTopics = built.map((entry) => entry.topic);

  return {
    id: styleId,
    name: built[0].name,
    topics: builtTopics,
  };
}
