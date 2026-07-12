import { describe, expect, it } from "vitest";
import {
  CATALOG_MANIFEST,
  CATALOG_STATS,
  PUBLICATION_AUDIT_CASES,
  PUBLICATION_TARGETS,
} from "./manifest.generated";
import { createTopicCatalog, validateTopicRegistry } from "./topic-catalog";
import { buildPublicationPlan } from "./publication-plan";
import { TOPIC_REGISTRY } from "./topic-registry";
import { STYLE_DEFINITIONS } from "./style-definitions";

describe("TOPIC_REGISTRY", () => {
  const styleGroups = validateTopicRegistry(STYLE_DEFINITIONS, TOPIC_REGISTRY);
  const registeredTopics = TOPIC_REGISTRY.flat();
  const registeredIds = registeredTopics.map((topic) => topic.id);

  it("is the unique global ordering source and projects exactly into the generated Manifest", () => {
    const publicationPlan = buildPublicationPlan(
      createTopicCatalog(STYLE_DEFINITIONS, TOPIC_REGISTRY),
    );
    expect(new Set(registeredIds).size).toBe(registeredIds.length);
    expect(CATALOG_STATS).toEqual(publicationPlan.stats);
    expect(PUBLICATION_TARGETS).toEqual(publicationPlan.targets);
    expect(PUBLICATION_AUDIT_CASES).toEqual(publicationPlan.auditCases);
    expect(
      CATALOG_MANIFEST.map((group) => [
        group.style.id,
        group.topics.map((topic) => topic.id),
      ]),
    ).toEqual(
      styleGroups.map((group) => [
        group.style.id,
        group.topics.map((topic) => topic.id),
      ]),
    );

    for (const topic of registeredTopics) {
      const { Stage: _stage, ...catalogTopic } = topic;
      const manifestTopic = CATALOG_MANIFEST
        .flatMap((group) => group.topics)
        .find((candidate) => candidate.id === topic.id);

      expect(manifestTopic).toEqual({
        ...catalogTopic,
        modulePath: `../topics/${topic.id}.tsx`,
      });
    }
  });

});
