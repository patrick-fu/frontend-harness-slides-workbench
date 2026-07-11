import { describe, expect, it } from "vitest";
import type { ComponentType } from "react";
import type { BespokeStyleProps } from "../types";
import { makeTopicDefinition } from "../testing/topic-fixture";
import {
  createTopicComponentLoader,
  type TopicModuleLoaders,
} from "./topic-module-loader";

const TopicComponent: ComponentType<BespokeStyleProps> = () => null;

describe("createTopicComponentLoader", () => {
  it("returns the default component supplied by the exact Topic module path", async () => {
    const modules: TopicModuleLoaders = {
      "./first-topic.tsx": async () => TopicComponent,
    };

    await expect(
      createTopicComponentLoader("./first-topic.tsx", modules)(),
    ).resolves.toBe(TopicComponent);
  });

  it("returns the Stage from a migrated default TopicDefinition", async () => {
    const topic = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const modules = {
      "./first-topic.tsx": async () => topic,
    } as TopicModuleLoaders;

    await expect(
      createTopicComponentLoader("./first-topic.tsx", modules)(),
    ).resolves.toBe(topic.Stage);
  });

  it("delays a missing-manifest-path failure until the Player requests that Topic", async () => {
    const loader = createTopicComponentLoader("./missing-topic.tsx", {});

    await expect(loader()).rejects.toThrow(
      'Catalog manifest references unknown Topic module "./missing-topic.tsx".',
    );
  });
});
