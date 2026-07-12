// @vitest-environment node

import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const publicationRoot = resolve(root, "scripts/publication");
const thumbnailRoot = resolve(root, "scripts/thumbnail");

describe("Publication state loading contract", () => {
  it("keeps current and generated Publication state loading in Snapshot only", async () => {
    const snapshot = await readFile(
      resolve(publicationRoot, "snapshot.mjs"),
      "utf8",
    );
    const cli = await readFile(resolve(publicationRoot, "cli.mjs"), "utf8");
    const manifest = await readFile(
      resolve(publicationRoot, "manifest.mjs"),
      "utf8",
    );

    expect(snapshot).toContain("async loadCurrent()");
    expect(snapshot).toContain("async loadGenerated()");
    expect(snapshot).toContain('runtime.loadModule("/src/catalog/topic-registry.ts")');
    expect(snapshot).toContain('"/src/catalog/manifest.generated.ts"');
    expect(cli).not.toMatch(/ssrLoadModule|readFile\s*\(/);
    expect(manifest).not.toMatch(/ssrLoadModule|readFile\s*\(|topic-registry/);
  });

  it("removes the legacy duplicate Plan loader and source-text parser", async () => {
    await expect(
      access(resolve(publicationRoot, "load-plan.mjs")),
    ).rejects.toMatchObject({ code: "ENOENT" });
    await expect(
      access(resolve(publicationRoot, "load-plan.test.mjs")),
    ).rejects.toMatchObject({ code: "ENOENT" });
  });

  it.each(["generate.mjs", "clean.mjs", "verify.mjs"])(
    "%s accepts resolved values without loading Publication metadata",
    async (filename) => {
      const source = await readFile(resolve(thumbnailRoot, filename), "utf8");
      expect(source).not.toMatch(
        /publicationSnapshot|loadCurrent|loadGenerated|loadPublicationPlan|loadGeneratedPublicationTargets|ssrLoadModule|manifest\.generated|topic-registry|style-definitions|publication-plan/,
      );
    },
  );

  it("keeps shared thumbnail helpers free of generated target loading", async () => {
    const source = await readFile(resolve(thumbnailRoot, "shared.mjs"), "utf8");
    expect(source).not.toMatch(
      /collectThumbnailTargets|PUBLICATION_TARGETS|ssrLoadModule|manifest\.generated/,
    );
  });
});
