import { describe, expect, it, vi } from "vitest";
import type { TopicDefinition } from "../domain/topic";
import type { StyleDefinitions } from "../domain/style";
import { makeTopicDefinition } from "../testing/topic-fixture";
import { CATALOG_MANIFEST } from "./manifest.generated";
import { buildPublicationPlan } from "./publication-plan";
import { createRuntimeCatalog } from "./runtime-catalog";
import { createTopicCatalog, type CatalogStyleGroup } from "./topic-catalog";
import type { TopicStageResolver } from "./topic-loader";

const styles: StyleDefinitions = {
  "first-style": {
    id: "first-style",
    name: { en: "First Style", zh: "第一风格" },
    band: "minimal-keynote",
  },
};

const twoStyles: StyleDefinitions = {
  ...styles,
  "second-style": {
    id: "second-style",
    name: { en: "Second Style", zh: "第二风格" },
    band: "balanced-hybrid",
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

describe("createRuntimeCatalog", () => {
  it("exposes synchronous discovery records and semantic lookup without resolving a Stage", () => {
    const sourceGroup = CATALOG_MANIFEST[0];
    const sourceTopic = sourceGroup?.topics[0];
    if (!sourceGroup || !sourceTopic) {
      throw new Error("Generated Catalog Manifest is empty.");
    }
    const resolveStage = vi.fn<TopicStageResolver>();
    const runtime = createRuntimeCatalog(CATALOG_MANIFEST, resolveStage);

    const discovered = runtime.discovery.styleGroups[0]?.topics[0];

    expect(discovered).toMatchObject({
      id: sourceTopic.id,
      styleId: sourceTopic.styleId,
      title: sourceTopic.title,
      modelId: sourceTopic.modelId,
      metadata: sourceTopic.metadata,
      navigation: sourceTopic.navigation,
      transitionScore: sourceTopic.transitionScore,
      evidence: sourceTopic.evidence,
    });
    expect(discovered).not.toHaveProperty("modulePath");
    expect(discovered).not.toHaveProperty("Stage");
    expect(discovered).not.toHaveProperty("loadStage");
    const found = runtime.discovery.findTopic(sourceTopic.id);
    expect(found).toEqual({
      style: sourceGroup.style,
      topic: discovered,
    });
    expect(found).not.toHaveProperty("styleIndex");
    expect(found).not.toHaveProperty("topicIndex");
    expect(found).not.toHaveProperty("loadStage");
    expect(runtime.discovery.findTopic("missing-topic")).toBeNull();
    expect(resolveStage).not.toHaveBeenCalled();
  });

  it("gives the Player semantic lookup and exact Stage loading", async () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const selected = makeTopicDefinition({
      id: "selected-topic",
      styleId: "first-style",
    });
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      if (modulePath === "../topics/selected-topic.tsx") {
        return selected.Stage;
      }
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });
    const runtime = createRuntimeCatalog(
      buildFixtureManifest(styles, [[first, selected]]),
      resolveStage,
    );

    expect(runtime.player.findTopic(selected.id)).toBe(
      runtime.discovery.findTopic(selected.id),
    );
    await expect(runtime.player.loadStage(selected.id)).resolves.toBe(
      selected.Stage,
    );
    await expect(runtime.player.loadStage("missing-topic")).rejects.toThrow(
      'Unknown Topic "missing-topic".',
    );
    expect(resolveStage).toHaveBeenCalledTimes(1);
    expect(resolveStage).toHaveBeenCalledWith(
      "../topics/selected-topic.tsx",
    );
  });

  it("coalesces concurrent loads and retries after an explicit rejection", async () => {
    const topic = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const resolveStage = vi
      .fn<TopicStageResolver>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(topic.Stage);
    const runtime = createRuntimeCatalog(
      buildFixtureManifest(styles, [[topic]]),
      resolveStage,
    );

    await expect(runtime.player.loadStage(topic.id)).rejects.toThrow(
      "offline",
    );
    await expect(
      Promise.all([
        runtime.player.loadStage(topic.id),
        runtime.player.loadStage(topic.id),
      ]),
    ).resolves.toEqual([topic.Stage, topic.Stage]);
    expect(resolveStage).toHaveBeenCalledTimes(2);
  });

  it("prefetches adjacent Topics in global Catalog Order and wraps", async () => {
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
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      if (modulePath === "../topics/first-topic.tsx") return first.Stage;
      if (modulePath === "../topics/second-topic.tsx") return second.Stage;
      if (modulePath === "../topics/final-topic.tsx") return final.Stage;
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });
    const runtime = createRuntimeCatalog(
      buildFixtureManifest(twoStyles, [[first, second], [final]]),
      resolveStage,
    );

    await expect(
      runtime.player.prefetchAdjacent(final.id),
    ).resolves.toBeUndefined();
    expect(resolveStage.mock.calls.map(([modulePath]) => modulePath)).toEqual([
      "../topics/first-topic.tsx",
      "../topics/second-topic.tsx",
    ]);
  });

  it("deduplicates a shared adjacent Topic in a two-Topic Catalog", async () => {
    const first = makeTopicDefinition({
      id: "first-topic",
      styleId: "first-style",
    });
    const second = makeTopicDefinition({
      id: "second-topic",
      styleId: "first-style",
    });
    const resolveStage = vi.fn<TopicStageResolver>(async () => second.Stage);
    const runtime = createRuntimeCatalog(
      buildFixtureManifest(styles, [[first, second]]),
      resolveStage,
    );

    await runtime.player.prefetchAdjacent(first.id);

    expect(resolveStage).toHaveBeenCalledTimes(1);
    expect(resolveStage).toHaveBeenCalledWith(
      "../topics/second-topic.tsx",
    );
  });

  it("keeps an explicit load retryable after failed background prefetch", async () => {
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
    let previousAttempts = 0;
    const resolveStage = vi.fn<TopicStageResolver>(async (modulePath) => {
      if (modulePath === "../topics/previous-topic.tsx") {
        previousAttempts += 1;
        if (previousAttempts === 1) throw new Error("offline");
        return previous.Stage;
      }
      if (modulePath === "../topics/next-topic.tsx") return next.Stage;
      throw new Error(`Unexpected Topic module "${modulePath}".`);
    });
    const runtime = createRuntimeCatalog(
      buildFixtureManifest(styles, [[previous, selected, next]]),
      resolveStage,
    );

    await expect(
      runtime.player.prefetchAdjacent(selected.id),
    ).resolves.toBeUndefined();
    await expect(runtime.player.loadStage(previous.id)).resolves.toBe(
      previous.Stage,
    );
    expect(previousAttempts).toBe(2);
  });
});
