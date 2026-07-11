import type { TopicDefinition } from "../domain/topic";
import type { TopicEvidence } from "../types";
import type { StyleTopicModule } from "../styles/topic";
import { STYLE_DEFINITIONS } from "./style-definitions";

function projectEvidence(topic: TopicDefinition): {
  evidence?: TopicEvidence;
  sources?: StyleTopicModule["sources"];
} {
  switch (topic.evidence.kind) {
    case "none":
      return {};
    case "facts":
      return {
        evidence: { kind: "facts" },
        sources: topic.evidence.sources,
      };
    case "illustrative":
      return {
        evidence: topic.evidence,
      };
    case "mixed":
      return {
        evidence: topic.evidence,
        sources: topic.evidence.sources,
      };
  }
}

/**
 * Temporary green-migration boundary. Delete with the legacy Catalog in #17.
 */
export function toMigratingStyleTopic(
  topic: TopicDefinition,
): StyleTopicModule {
  const style = STYLE_DEFINITIONS[topic.styleId];
  if (!style) {
    throw new Error(
      `Topic "${topic.id}" references unknown Style "${topic.styleId}".`,
    );
  }

  return {
    id: topic.id,
    topic: topic.title,
    model: topic.modelId,
    component: topic.Stage,
    getMetadata: (language) => ({
      ...topic.metadata[language],
      id: style.id,
      name: style.name[language],
      band: style.band,
    }),
    navigation: topic.navigation,
    transitionScore: topic.transitionScore,
    ...projectEvidence(topic),
  };
}
