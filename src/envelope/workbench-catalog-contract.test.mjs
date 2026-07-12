// @vitest-environment node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workbenchPath = resolve(
  process.cwd(),
  "src/envelope/WorkbenchEnvelope.tsx",
);

describe("Workbench Catalog composition contract", () => {
  it("resolves discovery identity semantically through the deep Catalog", async () => {
    const source = await readFile(workbenchPath, "utf8");

    expect(source).toContain("RUNTIME_CATALOG.discovery.findTopic");
    expect(source).toContain("RUNTIME_CATALOG.discovery.findStyleGroup");
    expect(source).not.toMatch(/findRuntimeTopic|styleIndex|topicIndex/);
  });

  it("keeps exact prefetch and Stage loading behind Player behavior seams", async () => {
    const source = await readFile(workbenchPath, "utf8");

    expect(source).toContain("RUNTIME_CATALOG.player.prefetchTopic");
    expect(source).toContain("catalog={RUNTIME_CATALOG.player}");
    expect(source).not.toMatch(
      /runtime-registry|topic-loader|modulePath|\.loadStage\s*\(|\blazy\s*\(|\bStage\b/,
    );
  });
});
