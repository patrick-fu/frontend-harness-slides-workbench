import { describe, expect, it, vi } from "vitest";
import { makeTopicDefinition } from "../testing/topic-fixture";
import {
  createTopicStageResolver,
  type TopicDefinitionLoaders,
} from "./topic-loader";

describe("createTopicStageResolver", () => {
  it("loads the Stage from the exact default TopicDefinition on demand", async () => {
    const topic = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const load = vi.fn(async () => topic);
    const modules: TopicDefinitionLoaders = {
      "../topics/first-topic.tsx": load,
    };
    const resolveStage = createTopicStageResolver(modules);

    expect(load).not.toHaveBeenCalled();
    await expect(resolveStage("../topics/first-topic.tsx")).resolves.toBe(
      topic.Stage,
    );
  });

  it("reports the exact missing Topic module only when resolution is requested", async () => {
    const resolveStage = createTopicStageResolver({});

    await expect(resolveStage("../topics/missing-topic.tsx")).rejects.toThrow(
      'Catalog references unknown Topic module "../topics/missing-topic.tsx".',
    );
  });
});
