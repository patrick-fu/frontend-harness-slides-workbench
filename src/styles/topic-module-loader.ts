import type { TopicComponent, TopicComponentLoader } from "../types";

export type TopicModuleLoaders = Record<
  string,
  () => Promise<TopicComponent>
>;

const topicModules = import.meta.glob<TopicComponent>(
  ["./*.tsx", "!./*.test.tsx", "!./__test-template.tsx"],
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
    return loadModule();
  };
}
