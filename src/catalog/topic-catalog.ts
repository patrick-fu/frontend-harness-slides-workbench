import type { StyleDefinition, StyleDefinitions } from "../domain/style";
import { defineTopic, type TopicDefinition } from "../domain/topic";

export interface StyleGroup {
  style: StyleDefinition;
  topics: readonly TopicDefinition[];
}

export type TopicRegistry = readonly (readonly TopicDefinition[])[];

export type CatalogTopic = Omit<TopicDefinition, "Stage"> & {
  modulePath: string;
};

export interface CatalogStyleGroup {
  style: StyleDefinition;
  topics: readonly CatalogTopic[];
}

export interface TopicCatalog {
  styleGroups: readonly StyleGroup[];
  manifest: readonly CatalogStyleGroup[];
}

export function validateStyleDefinitions(styles: StyleDefinitions): void {
  for (const [key, style] of Object.entries(styles)) {
    if (key !== style.id) {
      throw new Error(
        `Style definition key "${key}" does not match canonical ID "${style.id}".`,
      );
    }
  }
}

export function validateTopicRegistry(
  styles: StyleDefinitions,
  registry: TopicRegistry,
): readonly StyleGroup[] {
  const seenStyles = new Set<string>();
  const seenTopics = new Set<string>();

  const styleGroups = registry.map((topics, groupIndex) => {
    const firstTopic = topics[0];
    if (!firstTopic) {
      throw new Error(
        `Topic Registry group ${groupIndex + 1} must contain at least one Topic.`,
      );
    }

    const styleId = firstTopic.styleId;
    const style = styles[styleId];
    if (!style) {
      throw new Error(
        `Topic "${firstTopic.id}" references unknown Style "${styleId}".`,
      );
    }
    if (seenStyles.has(styleId)) {
      throw new Error(
        `Style "${styleId}" appears in more than one Registry group.`,
      );
    }
    seenStyles.add(styleId);

    for (const topic of topics) {
      defineTopic(topic);
      if (topic.styleId !== styleId) {
        throw new Error(
          `Topic Registry group ${groupIndex + 1} mixes Style "${styleId}" with "${topic.styleId}".`,
        );
      }
      if (seenTopics.has(topic.id)) {
        throw new Error(`Duplicate global Topic ID "${topic.id}".`);
      }
      seenTopics.add(topic.id);
    }

    return { style, topics };
  });

  const unregisteredStyles = Object.keys(styles).filter(
    (styleId) => !seenStyles.has(styleId),
  );
  if (unregisteredStyles.length > 0) {
    throw new Error(
      `Style definitions missing from the Topic Registry: ${unregisteredStyles.join(", ")}.`,
    );
  }

  return styleGroups;
}

function projectTopic(topic: TopicDefinition): CatalogTopic {
  const { Stage: _Stage, ...catalogTopic } = topic;
  return {
    ...catalogTopic,
    modulePath: `../topics/${topic.id}.tsx`,
  };
}

export function createTopicCatalog(
  styles: StyleDefinitions,
  registry: TopicRegistry,
): TopicCatalog {
  validateStyleDefinitions(styles);
  const styleGroups = validateTopicRegistry(styles, registry);

  return {
    styleGroups,
    manifest: styleGroups.map((group) => ({
      style: group.style,
      topics: group.topics.map(projectTopic),
    })),
  };
}
