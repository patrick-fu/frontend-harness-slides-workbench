import { describe, expect, it, vi } from "vitest";
import type { StyleDefinitions } from "../domain/style";
import { makeTopicDefinition } from "../testing/topic-fixture";
import {
  RUNTIME_REGISTRY,
  createRuntimeRegistry,
  findRuntimeTopic,
  getNextRuntimeTopic,
  getPreviousRuntimeTopic,
} from "./runtime-registry";
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

  it("shares in-flight loads and allows an explicit retry after a failed import", async () => {
    const definition = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const catalog = createTopicCatalog(styles, [[definition]]);
    const resolveStage = vi
      .fn<(modulePath: string) => Promise<typeof definition.Stage>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(definition.Stage);
    const runtime = createRuntimeRegistry(catalog.manifest, resolveStage);
    const topic = runtime[0]?.topics[0];
    if (!topic) throw new Error("Fixture Runtime Topic was not created.");

    await expect(topic.loadStage()).rejects.toThrow("offline");
    await expect(Promise.all([topic.loadStage(), topic.loadStage()])).resolves.toEqual([
      definition.Stage,
      definition.Stage,
    ]);
    expect(resolveStage).toHaveBeenCalledTimes(2);
  });

  it("resolves globally unique Topic IDs for canonical navigation", () => {
    const first = RUNTIME_REGISTRY[0]?.topics[0];
    if (!first) throw new Error("Runtime Registry is empty.");

    const entry = findRuntimeTopic(first.id);

    expect(entry?.style.id).toBe(first.styleId);
    expect(entry?.topic).toBe(first);
    expect(getNextRuntimeTopic(first.id)).not.toBeNull();
    expect(getPreviousRuntimeTopic(first.id)).not.toBeNull();
    expect(findRuntimeTopic("missing-topic")).toBeNull();
  });
});
