// @vitest-environment node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("Publication Inventory ownership contract", () => {
  it("keeps Registry tests focused on semantic identity and order", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/catalog/topic-registry.test.ts"),
      "utf8",
    );
    expect(source).not.toMatch(
      /getBuiltinModule|node:fs|readdir|readFile|import\.meta\.glob|public\/showcase|module\.css|\.webp/,
    );
  });

  it("keeps thumbnail tests focused on URL derivation", async () => {
    const source = await readFile(
      resolve(process.cwd(), "src/data/showcase-thumbnails.test.ts"),
      "utf8",
    );
    expect(source).not.toMatch(
      /RUNTIME_REGISTRY|getBuiltinModule|node:fs|readdir|readFile|WebpBuffer|1920|1080|RIFF|WEBP/,
    );
  });

  it("keeps the only WebP parser in preview inventory", async () => {
    const inventory = await readFile(
      resolve(process.cwd(), "scripts/publication/inventory.mjs"),
      "utf8",
    );
    const shared = await readFile(
      resolve(process.cwd(), "scripts/thumbnail/shared.mjs"),
      "utf8",
    );
    expect(inventory).toContain("function inspectWebpArtifact");
    expect(shared).not.toMatch(/inspectWebp|RIFF|WEBP|VP8L|VP8X/);
  });
});
