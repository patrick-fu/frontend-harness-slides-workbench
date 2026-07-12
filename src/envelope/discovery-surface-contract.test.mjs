// @vitest-environment node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd(), "src/envelope");
const surfaces = [
  "CatalogView",
  "LibraryDrawer",
  "CommandPalette",
  "IdentityBadge",
];

describe("discovery surface contract", () => {
  it("keeps every discovery surface behind metadata-only Catalog records", async () => {
    for (const surface of surfaces) {
      const source = await readFile(resolve(root, `${surface}.tsx`), "utf8");
      expect(source, surface).toContain("catalog/runtime-catalog");
      expect(source, surface).not.toMatch(
        /runtime-registry|topic-loader|modulePath|loadStage|\blazy\s*\(|\bStage\b/,
      );
    }
  });

  it("keeps discovery UI fixtures free of Stage implementation knowledge", async () => {
    for (const surface of surfaces) {
      const source = await readFile(
        resolve(root, `${surface}.test.tsx`),
        "utf8",
      );
      expect(source, `${surface} fixture`).not.toMatch(
        /runtime-registry|TopicStageProps|modulePath|loadStage|\blazy\s*\(|\bStage\s*:/,
      );
    }
  });
});
