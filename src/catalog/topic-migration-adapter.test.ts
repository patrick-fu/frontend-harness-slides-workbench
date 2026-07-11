import { describe, expect, it } from "vitest";
import { makeTopicDefinition } from "../testing/topic-fixture";
import { toMigratingStyleTopic } from "./topic-migration-adapter";

describe("toMigratingStyleTopic", () => {
  it("projects one canonical TopicDefinition into the temporary legacy Catalog boundary", () => {
    const topic = makeTopicDefinition({
      id: "first-topic",
      styleId: "minimal-product-keynote",
      modelId: "GPT 5.6 Sol",
    });

    const migrating = toMigratingStyleTopic(topic);

    expect(migrating).toMatchObject({
      id: "first-topic",
      topic: topic.title,
      model: "GPT 5.6 Sol",
      component: topic.Stage,
      navigation: { mode: "none" },
      transitionScore: topic.transitionScore,
    });
    expect(migrating.getMetadata("zh")).toEqual({
      ...topic.metadata.zh,
      id: "minimal-product-keynote",
      name: "极简产品主题演讲",
      band: "minimal-keynote",
    });
  });
});
