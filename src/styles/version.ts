import type { StyleMetadata, StyleRegistryEntry, StyleVersion } from "../types";

const VERSION_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface StyleVersionModule {
  id: string;
  topic: StyleVersion["topic"];
  model: string;
  component: StyleVersion["component"];
  getMetadata: StyleVersion["getMetadata"];
}

function validateVersionId(id: string | undefined): void {
  if (typeof id !== "string" || !VERSION_ID_PATTERN.test(id)) {
    throw new Error(
      `Invalid version id "${id}". Use lowercase letters, numbers, and hyphens.`,
    );
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

function validateTopic(id: string, topic: StyleVersion["topic"] | undefined): void {
  if (!topic?.en.trim() || !topic.zh.trim()) {
    throw new Error(`Version "${id}" must define localized en/zh topic.`);
  }
}

export function defineStyleVersion(module: StyleVersionModule): StyleVersionModule {
  validateVersionId(module.id);
  validateTopic(module.id, module.topic);
  if (!module.model.trim()) {
    throw new Error(`Version "${module.id}" must define a model.`);
  }
  return module;
}

function buildVersion(
  styleId: string,
  input: StyleVersionModule,
): {
  version: StyleVersion;
  name: { en: string; zh: string };
} {
  const metaEn = input.getMetadata("en");
  const metaZh = input.getMetadata("zh");
  validateMetadata(styleId, metaEn);
  validateMetadata(styleId, metaZh);
  validateVersionId(input.id);
  validateTopic(input.id, input.topic);

  return {
    version: {
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
  versions: StyleVersionModule[],
): StyleRegistryEntry {
  const seen = new Set<string>();
  const built = versions.map((version) => {
    const builtVersion = buildVersion(styleId, version);
    const id = builtVersion.version.id;
    if (seen.has(id)) {
      throw new Error(`Duplicate version id "${id}" in style "${styleId}".`);
    }
    seen.add(id);
    return builtVersion;
  });

  return {
    id: styleId,
    name: built[0].name,
    versions: built.map((entry) => entry.version),
  };
}
