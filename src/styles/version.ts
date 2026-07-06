import type { StyleMetadata, StyleRegistryEntry, StyleVersion } from "../types";

const DEFAULT_MODEL = "Doubao-Seed-Evolving";
const VERSION_ID_PATTERN = /^[a-z0-9][a-z0-9-]*$/;

export interface StyleVersionModule {
  id: string;
  topic: string;
  model: string;
  component: StyleVersion["component"];
  getMetadata: StyleVersion["getMetadata"];
}

interface LegacyVersionTuple {
  component: StyleVersion["component"];
  getMetadata: StyleVersion["getMetadata"];
  model?: string;
}

type VersionInput = LegacyVersionTuple | StyleVersionModule;

function extractTopic(theme: string): string {
  return theme.split(/[—–\-:：]/)[0].trim();
}

function validateVersionId(id: string): void {
  if (!VERSION_ID_PATTERN.test(id)) {
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

export function defineStyleVersion(module: StyleVersionModule): StyleVersionModule {
  validateVersionId(module.id);
  if (!module.topic.trim()) {
    throw new Error(`Version "${module.id}" must define a topic.`);
  }
  if (!module.model.trim()) {
    throw new Error(`Version "${module.id}" must define a model.`);
  }
  return module;
}

function isStyleVersionModule(input: VersionInput): input is StyleVersionModule {
  return "id" in input && "topic" in input && "model" in input;
}

function buildVersion(
  styleId: string,
  input: VersionInput,
  generatedId: string,
): {
  version: StyleVersion;
  name: { en: string; zh: string };
} {
  const metaEn = input.getMetadata("en");
  const metaZh = input.getMetadata("zh");
  validateMetadata(styleId, metaEn);
  validateMetadata(styleId, metaZh);

  const id = isStyleVersionModule(input) ? input.id : generatedId;
  validateVersionId(id);

  return {
    version: {
      id,
      topic: isStyleVersionModule(input) ? input.topic : extractTopic(metaZh.theme),
      model: isStyleVersionModule(input) ? input.model : input.model ?? DEFAULT_MODEL,
      component: input.component,
      getMetadata: input.getMetadata,
    },
    name: { en: metaEn.name, zh: metaZh.name },
  };
}

export function buildStyleRegistryEntry(
  styleId: string,
  versions: VersionInput[],
): StyleRegistryEntry {
  const seen = new Set<string>();
  const built = versions.map((version, index) => {
    const builtVersion = buildVersion(styleId, version, `v${index + 1}`);
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
