// @vitest-environment node

import { describe, expect, it, vi } from "vitest";
import {
  createPublicationSnapshot,
  publicationSnapshot,
} from "./snapshot.mjs";
import { publicationInventory } from "./inventory.mjs";

const generated = {
  manifest: [{ style: { id: "first-style" }, topics: [{ id: "first-topic" }] }],
  stats: { styles: 1, topics: 1 },
  targets: [{ topicId: "first-topic", previewFilename: "first-topic.webp" }],
  auditCases: {
    styleStarts: [{ styleId: "first-style", topicId: "first-topic" }],
    heroFinalFrames: [],
    bandBoundaryTransitions: [],
  },
};

describe("Publication Snapshot", () => {
  it("loads the complete generated snapshot from exported values", async () => {
    const close = vi.fn(async () => undefined);
    const loadModule = vi.fn(async () => ({
      CATALOG_MANIFEST: generated.manifest,
      CATALOG_STATS: generated.stats,
      PUBLICATION_TARGETS: generated.targets,
      PUBLICATION_AUDIT_CASES: generated.auditCases,
    }));
    const snapshot = createPublicationSnapshot({
      createRuntime: vi.fn(async () => ({ loadModule, close })),
    });

    await expect(snapshot.loadGenerated()).resolves.toEqual(generated);
    expect(loadModule).toHaveBeenCalledOnce();
    expect(loadModule).toHaveBeenCalledWith(
      "/src/catalog/manifest.generated.ts",
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it("loads the current Publication Plan through one local runtime", async () => {
    const registry = [[{ id: "first-topic" }]];
    const styles = { "first-style": { id: "first-style" } };
    const catalog = { styleGroups: [{ style: styles["first-style"] }] };
    const createTopicCatalog = vi.fn(() => catalog);
    const buildPublicationPlan = vi.fn(() => generated);
    const modules = new Map([
      ["/src/catalog/topic-registry.ts", { TOPIC_REGISTRY: registry }],
      ["/src/catalog/style-definitions.ts", { STYLE_DEFINITIONS: styles }],
      ["/src/catalog/topic-catalog.ts", { createTopicCatalog }],
      ["/src/catalog/publication-plan.ts", { buildPublicationPlan }],
    ]);
    const close = vi.fn(async () => undefined);
    const loadModule = vi.fn(async (modulePath) => modules.get(modulePath));
    const createRuntime = vi.fn(async () => ({ loadModule, close }));
    const snapshot = createPublicationSnapshot({ createRuntime });

    await expect(snapshot.loadCurrent()).resolves.toBe(generated);
    expect(createRuntime).toHaveBeenCalledOnce();
    expect(createTopicCatalog).toHaveBeenCalledWith(styles, registry);
    expect(buildPublicationPlan).toHaveBeenCalledWith(catalog);
    expect(close).toHaveBeenCalledOnce();
  });

  it("checks every generated projection semantically with actionable errors", () => {
    const snapshot = createPublicationSnapshot({ createRuntime: vi.fn() });

    expect(() => snapshot.assertFresh(generated, structuredClone(generated)))
      .not.toThrow();
    expect(() =>
      snapshot.assertFresh(generated, {
        ...structuredClone(generated),
        stats: { topics: 1, styles: 1 },
      }),
    ).not.toThrow();

    for (const [projection, mutate] of [
      ["Manifest", (value) => value.manifest.push({ style: { id: "stale" }, topics: [] })],
      ["statistics", (value) => { value.stats.topics = 2; }],
      ["Publication targets", (value) => { value.targets[0].previewFilename = "stale.webp"; }],
      ["browser-audit cases", (value) => value.auditCases.heroFinalFrames.push({ topicId: "stale" })],
    ]) {
      const stale = structuredClone(generated);
      mutate(stale);
      expect(() => snapshot.assertFresh(generated, stale)).toThrow(
        new RegExp(`${projection}.*npm run generate:catalog`, "s"),
      );
    }
  });

  it("renders unchanged snapshots as deterministic TypeScript exports", () => {
    const snapshot = createPublicationSnapshot({ createRuntime: vi.fn() });

    const first = snapshot.renderGenerated(generated);
    const second = snapshot.renderGenerated(structuredClone(generated));

    expect(second).toBe(first);
    expect(first).toContain(
      'import type { CatalogStyleGroup } from "./topic-catalog";',
    );
    expect(first).toContain("export const CATALOG_MANIFEST = [");
    expect(first).toContain("export const CATALOG_STATS = {");
    expect(first).toContain("export const PUBLICATION_TARGETS = [");
    expect(first).toContain("export const PUBLICATION_AUDIT_CASES = {");
  });

  it.each(["loadCurrent", "loadGenerated"])(
    "closes the local runtime when %s fails",
    async (operation) => {
      const close = vi.fn(async () => undefined);
      const snapshot = createPublicationSnapshot({
        createRuntime: vi.fn(async () => ({
          loadModule: vi.fn(async () => {
            throw new Error("module failed");
          }),
          close,
        })),
      });

      await expect(snapshot[operation]()).rejects.toThrow("module failed");
      expect(close).toHaveBeenCalledOnce();
    },
  );

  it("rejects an incomplete generated module and still closes its runtime", async () => {
    const close = vi.fn(async () => undefined);
    const snapshot = createPublicationSnapshot({
      createRuntime: vi.fn(async () => ({
        loadModule: vi.fn(async () => ({ CATALOG_MANIFEST: [] })),
        close,
      })),
    });

    await expect(snapshot.loadGenerated()).rejects.toThrow(
      "Generated Publication snapshot is incomplete",
    );
    expect(close).toHaveBeenCalledOnce();
  });

  it("matches the committed generated snapshot to the current Registry", async () => {
    const current = await publicationSnapshot.loadCurrent();
    const committed = await publicationSnapshot.loadGenerated();

    expect(() => publicationSnapshot.assertFresh(current, committed)).not.toThrow();
    expect(publicationSnapshot.renderGenerated(committed)).toBe(
      publicationSnapshot.renderGenerated(current),
    );
  }, 20_000);

  it("validates the repository through the production source adapter", async () => {
    const { targets } = await publicationSnapshot.loadGenerated();

    await expect(
      publicationInventory.validateSource(targets),
    ).resolves.toBeUndefined();
  }, 20_000);

  it("validates committed previews through the production adapter", async () => {
    const { targets } = await publicationSnapshot.loadGenerated();

    await expect(publicationInventory.validatePreviews(targets)).resolves.toEqual({
      count: targets.length,
      bytes: expect.any(Number),
    });
  }, 20_000);
});
