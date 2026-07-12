import { describe, expect, it } from "vitest";
import type { StyleDefinitions } from "../domain/style";
import { makeTopicDefinition } from "../testing/topic-fixture";
import { createTopicCatalog } from "./topic-catalog";
import { buildPublicationPlan } from "./publication-plan";

const styles: StyleDefinitions = {
  "first-style": {
    id: "first-style",
    name: { en: "First", zh: "第一" },
    band: "minimal-keynote",
  },
  "second-style": {
    id: "second-style",
    name: { en: "Second", zh: "第二" },
    band: "balanced-hybrid",
  },
};

function fixtureCatalog(modelId: "GPT 5.5" | "GPT 5.6 Sol" = "GPT 5.5") {
  const first = makeTopicDefinition({
    id: "first-topic",
    styleId: "first-style",
    modelId,
  });
  const second = makeTopicDefinition({
    id: "second-topic",
    styleId: "second-style",
  });
  return createTopicCatalog(styles, [[first], [second]]);
}

describe("buildPublicationPlan", () => {
  it("projects every publication artifact from one validated Catalog order", () => {
    const catalog = fixtureCatalog();
    const plan = buildPublicationPlan(catalog);

    expect(plan.manifest.map((group) => group.style.id)).toEqual([
      "first-style",
      "second-style",
    ]);
    expect(plan.stats).toEqual({ styles: 2, topics: 2 });
    expect(plan.targets.map((target) => target.topicId)).toEqual([
      "first-topic",
      "second-topic",
    ]);
    expect(plan.targets[0]).toMatchObject({
      styleId: "first-style",
      topicId: "first-topic",
      modulePath: "../topics/first-topic.tsx",
      testPath: "src/topics/first-topic.test.tsx",
      previewFilename: "first-topic.webp",
      capture: { language: "en", pure: true, frozen: true },
    });
    expect(plan.auditCases.heroFinalFrames).toHaveLength(4);
    expect(plan.auditCases.styleStarts).toEqual([
      { styleId: "first-style", topicId: "first-topic", firstMultiBeatScene: 1 },
      { styleId: "second-style", topicId: "second-topic", firstMultiBeatScene: 1 },
    ]);
    expect(plan.auditCases.bandBoundaryTransitions).toEqual([
      { from: "first-style", to: "second-style" },
      { from: "second-style", to: "first-style" },
    ]);
  });

  it("is deterministic and keeps capture and audit selection model-neutral", () => {
    const first = buildPublicationPlan(fixtureCatalog("GPT 5.5"));
    const second = buildPublicationPlan(fixtureCatalog("GPT 5.6 Sol"));

    expect(buildPublicationPlan(fixtureCatalog())).toEqual(first);
    expect(second.targets).toEqual(first.targets);
    expect(second.auditCases).toEqual(first.auditCases);
    expect(second.manifest[0]?.topics[0]?.modelId).not.toBe(
      first.manifest[0]?.topics[0]?.modelId,
    );
  });
});
