import { afterEach, describe, expect, it, vi } from "vitest";
import type { TopicDefinition } from "../domain/topic";
import type { StyleDefinitions } from "../domain/style";
import { makeTopicDefinition } from "../testing/topic-fixture";
import {
  RUNTIME_REGISTRY,
  createRuntimeRegistry,
  findRuntimeTopic,
} from "./runtime-registry";
import {
  createTopicCatalog,
  type CatalogStyleGroup,
} from "./topic-catalog";
import { buildPublicationPlan } from "./publication-plan";
import type { TopicStageResolver } from "./topic-loader";

const styles: StyleDefinitions = {
  "first-style": {
    id: "first-style",
    name: { en: "First Style", zh: "第一风格" },
    band: "minimal-keynote",
  },
};

function buildFixtureManifest(
  fixtureStyles: StyleDefinitions,
  registry: readonly (readonly TopicDefinition[])[],
): readonly CatalogStyleGroup[] {
  return buildPublicationPlan(
    createTopicCatalog(fixtureStyles, registry),
  ).manifest;
}

async function loadProductionRuntimeRegistry(
  manifest: readonly CatalogStyleGroup[],
  resolveStage: TopicStageResolver,
) {
  vi.resetModules();
  vi.doMock("./manifest.generated", () => ({ CATALOG_MANIFEST: manifest }));
  vi.doMock("./topic-loader", () => ({
    createTopicStageResolver: () => resolveStage,
  }));
  return import("./runtime-registry");
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.doUnmock("./manifest.generated");
  vi.doUnmock("./topic-loader");
  vi.resetModules();
});

describe("createRuntimeRegistry", () => {
  it("keeps Catalog construction lazy and resolves only the selected Topic Stage", async () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const selected = makeTopicDefinition({
      id: "selected-topic",
      styleId: "first-style",
    });
    const manifest = buildFixtureManifest(styles, [[first, selected]]);
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      if (modulePath === "../topics/first-topic.tsx") return first.Stage;
      if (modulePath === "../topics/selected-topic.tsx") {
        return selected.Stage;
      }
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });

    const runtime = createRuntimeRegistry(manifest, resolveStage);

    expect(runtime[0]?.topics[0]?.title).toEqual(first.title);
    expect(resolveStage).not.toHaveBeenCalled();

    await expect(runtime[0]?.topics[1]?.loadStage()).resolves.toBe(
      selected.Stage,
    );
    expect(resolveStage).toHaveBeenCalledTimes(1);
    expect(resolveStage).toHaveBeenCalledWith("../topics/selected-topic.tsx");
  });

  it("shares in-flight loads and allows an explicit retry after a failed import", async () => {
    const definition = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const catalog = createTopicCatalog(styles, [[definition]]);
    const plan = buildPublicationPlan(catalog);
    const resolveStage = vi
      .fn<(modulePath: string) => Promise<typeof definition.Stage>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(definition.Stage);
    const runtime = createRuntimeRegistry(plan.manifest, resolveStage);
    const topic = runtime[0]?.topics[0];
    if (!topic) throw new Error("Fixture Runtime Topic was not created.");

    await expect(topic.loadStage()).rejects.toThrow("offline");
    await expect(Promise.all([topic.loadStage(), topic.loadStage()])).resolves.toEqual([
      definition.Stage,
      definition.Stage,
    ]);
    expect(resolveStage).toHaveBeenCalledTimes(2);
  });

  it("prefetches global neighbors in Registry order and wraps at the final Topic", async () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const second = makeTopicDefinition({
      id: "second-topic",
      styleId: "first-style",
    });
    const final = makeTopicDefinition({
      id: "final-topic",
      styleId: "second-style",
    });
    const twoStyleDefinitions: StyleDefinitions = {
      ...styles,
      "second-style": {
        id: "second-style",
        name: { en: "Second Style", zh: "第二风格" },
        band: "minimal-keynote",
      },
    };
    const resolverCalls: string[] = [];
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      resolverCalls.push(modulePath);
      if (modulePath === "../topics/first-topic.tsx") return first.Stage;
      if (modulePath === "../topics/second-topic.tsx") return second.Stage;
      if (modulePath === "../topics/final-topic.tsx") return final.Stage;
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });
    const runtime = await loadProductionRuntimeRegistry(
      buildFixtureManifest(twoStyleDefinitions, [[first, second], [final]]),
      resolveStage,
    );

    await expect(
      runtime.prefetchAdjacentRuntimeTopics(final.id),
    ).resolves.toBeUndefined();

    expect(resolverCalls).toEqual([
      "../topics/first-topic.tsx",
      "../topics/second-topic.tsx",
    ]);
  });

  it("deduplicates the same adjacent Topic in a two-Topic Registry", async () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const second = makeTopicDefinition({
      id: "second-topic",
      styleId: "first-style",
    });
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      if (modulePath === "../topics/first-topic.tsx") return first.Stage;
      if (modulePath === "../topics/second-topic.tsx") return second.Stage;
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });
    const runtime = await loadProductionRuntimeRegistry(
      buildFixtureManifest(styles, [[first, second]]),
      resolveStage,
    );

    await expect(
      runtime.prefetchAdjacentRuntimeTopics(first.id),
    ).resolves.toBeUndefined();

    expect(resolveStage).toHaveBeenCalledTimes(1);
    expect(resolveStage).toHaveBeenCalledWith("../topics/second-topic.tsx");
  });

  it("keeps a failed background prefetch recoverable", async () => {
    const previous = makeTopicDefinition({
      id: "previous-topic",
      styleId: "first-style",
    });
    const selected = makeTopicDefinition({
      id: "selected-topic",
      styleId: "first-style",
    });
    const next = makeTopicDefinition({
      id: "next-topic",
      styleId: "first-style",
    });
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      if (modulePath === "../topics/previous-topic.tsx") {
        throw new Error("offline");
      }
      if (modulePath === "../topics/next-topic.tsx") return next.Stage;
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });
    const runtime = await loadProductionRuntimeRegistry(
      buildFixtureManifest(styles, [[previous, selected, next]]),
      resolveStage,
    );

    await expect(
      runtime.prefetchAdjacentRuntimeTopics(selected.id),
    ).resolves.toBeUndefined();

    expect(resolveStage).toHaveBeenCalledWith("../topics/next-topic.tsx");
    expect(resolveStage).toHaveBeenCalledWith("../topics/previous-topic.tsx");
  });

  it("resolves globally unique Topic IDs for canonical navigation", () => {
    const first = RUNTIME_REGISTRY[0]?.topics[0];
    if (!first) throw new Error("Runtime Registry is empty.");

    const entry = findRuntimeTopic(first.id);

    expect(entry?.style.id).toBe(first.styleId);
    expect(entry?.topic).toBe(first);
    expect(findRuntimeTopic("missing-topic")).toBeNull();
  });
});
