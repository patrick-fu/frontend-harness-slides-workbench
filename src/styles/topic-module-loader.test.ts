import { describe, expect, it } from "vitest";
import type { ComponentType } from "react";
import type { BespokeStyleProps } from "../types";
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

  it("delays a missing-manifest-path failure until the Player requests that Topic", async () => {
    const loader = createTopicComponentLoader("./missing-topic.tsx", {});

    await expect(loader()).rejects.toThrow(
      'Catalog manifest references unknown Topic module "./missing-topic.tsx".',
    );
  });
});
