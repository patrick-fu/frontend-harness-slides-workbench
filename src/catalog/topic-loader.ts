import type { TopicDefinition, TopicStage } from "../domain/topic";
import type { TopicStageResolver } from "./runtime-registry";

export type TopicDefinitionLoaders = Record<
  string,
  () => Promise<TopicDefinition>
>;

const topicModules = import.meta.glob<TopicDefinition>("../topics/*.tsx", {
  import: "default",
}) as TopicDefinitionLoaders;

export function createTopicStageResolver(
  modules: TopicDefinitionLoaders = topicModules,
): TopicStageResolver {
  return async (modulePath: string): Promise<TopicStage> => {
    const loadDefinition = modules[modulePath];
    if (!loadDefinition) {
      throw new Error(
        `Catalog references unknown Topic module "${modulePath}".`,
      );
    }

    const definition = await loadDefinition();
    return definition.Stage;
  };
}
