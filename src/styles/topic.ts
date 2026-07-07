import type { StyleMetadata, StyleRegistryEntry, StyleTopic } from "../types";

const TOPIC_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const LEGACY_VERSION_ID_PATTERN = /^v\d+$/;

export interface StyleTopicModule {
  id: string;
  topic: StyleTopic["topic"];
  model: string;
  component: StyleTopic["component"];
  getMetadata: StyleTopic["getMetadata"];
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

export function defineStyleTopic(module: StyleTopicModule): StyleTopicModule {
  validateTopicId(module.id);
  validateTopic(module.id, module.topic);
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

  return {
    topic: {
      id: input.id,
      topic: input.topic,
      model: input.model,
      component: input.component,
      getMetadata: input.getMetadata,
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
