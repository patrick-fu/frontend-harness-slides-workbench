// @vitest-environment node

import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const catalogRoot = resolve(process.cwd(), "src/catalog");

describe("Runtime Catalog boundary", () => {
  it("removes the compatibility Runtime Registry and its fixtures", async () => {
    await expect(
      access(resolve(catalogRoot, "runtime-registry.ts")),
    ).rejects.toMatchObject({ code: "ENOENT" });
    await expect(
      access(resolve(catalogRoot, "runtime-registry.test.ts")),
    ).rejects.toMatchObject({ code: "ENOENT" });
  });

  it("keeps discovery free of React and loading implementation", async () => {
    const source = await readFile(
      resolve(catalogRoot, "runtime-catalog.ts"),
      "utf8",
    );
    const discovery = source.match(
      /export interface RuntimeCatalogDiscovery {[\s\S]*?\n}/,
    )?.[0];
    expect(discovery).toBeDefined();
    expect(discovery).not.toMatch(
      /React|Stage|loader|modulePath|retry|prefetch|styleIndex|topicIndex/,
    );
    expect(source).not.toMatch(/from "react"|\blazy\s*\(/);
  });

  it("leaves no production forwarding import to the legacy Registry", async () => {
    const filenames = (await readdir(catalogRoot)).filter(
      (filename) => filename.endsWith(".ts") && !filename.includes(".test."),
    );
    for (const filename of filenames) {
      const source = await readFile(resolve(catalogRoot, filename), "utf8");
      expect(source, filename).not.toContain("runtime-registry");
    }
  });
});
