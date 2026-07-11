import { describe, expect, it, vi } from "vitest";
import type { StyleDefinitions } from "../domain/style";
import { makeTopicDefinition } from "../testing/topic-fixture";
import { createRuntimeRegistry } from "./runtime-registry";
import { createTopicCatalog } from "./topic-catalog";

const styles: StyleDefinitions = {
  "first-style": {
    id: "first-style",
    name: { en: "First Style", zh: "第一风格" },
    band: "minimal-keynote",
  },
};

describe("createRuntimeRegistry", () => {
  it("keeps Stage resolution lazy while retaining synchronous Catalog identity", async () => {
    const definition = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const catalog = createTopicCatalog(styles, [[definition]]);
    const resolveStage = vi.fn(async () => definition.Stage);

    const runtime = createRuntimeRegistry(catalog.manifest, resolveStage);

    expect(runtime[0]?.topics[0]?.title).toEqual(definition.title);
    expect(resolveStage).not.toHaveBeenCalled();

    await expect(runtime[0]?.topics[0]?.loadStage()).resolves.toBe(
      definition.Stage,
    );
    expect(resolveStage).toHaveBeenCalledWith("../topics/first-topic.tsx");
  });
});
