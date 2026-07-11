import type { TopicComponent, TopicComponentLoader } from "../types";
import type { TopicDefinition } from "../domain/topic";

export type TopicModuleDefault = TopicComponent | TopicDefinition;

export type TopicModuleLoaders = Record<
  string,
  () => Promise<TopicModuleDefault>
>;

const topicModules = import.meta.glob<TopicModuleDefault>(
  [
    "./*.tsx",
    "../topics/*.tsx",
    "!./*.test.tsx",
    "!./__test-template.tsx",
  ],
  { import: "default" },
) as TopicModuleLoaders;

/** Verifies a Catalog module path without triggering its dynamic import. */
export function hasTopicModule(modulePath: string): boolean {
  return Boolean(topicModules[modulePath]);
}

/**
 * Connects a static Catalog manifest path to Vite's lazy module graph. The
 * lookup happens on Player demand, so a bad path is rendered as a recoverable
 * Topic load failure instead of taking down the Catalog.
 */
export function createTopicComponentLoader(
  modulePath: string,
  modules: TopicModuleLoaders = topicModules,
): TopicComponentLoader {
  return async () => {
    const loadModule = modules[modulePath];
    if (!loadModule) {
      throw new Error(
        `Catalog manifest references unknown Topic module "${modulePath}".`,
      );
    }
    const moduleDefault = await loadModule();
    return typeof moduleDefault === "object" &&
      moduleDefault !== null &&
      "Stage" in moduleDefault
      ? moduleDefault.Stage
      : moduleDefault;
  };
}
