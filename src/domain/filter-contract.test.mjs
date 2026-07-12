// @vitest-environment node

import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(process.cwd(), "src");

async function productionSources(directory = sourceRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return productionSources(path);
      if (!/\.(?:ts|tsx)$/.test(entry.name) || entry.name.includes(".test.")) {
        return [];
      }
      return [{ path, source: await readFile(path, "utf8") }];
    }),
  );
  return nested.flat();
}

describe("Filter authority contract", () => {
  it("removes legacy matching, projection, and compatibility paths", async () => {
    const sources = await productionSources();
    const forbidden = [
      "buildCatalogTopics",
      "filterCatalogTopics",
      "getCatalogFacetCounts",
      "matchesWorkbenchFilters",
      "hasUnresolvedWorkbenchFilters",
      "utils/catalog-filter",
      "catalog/filter-resolution",
      "Temporary aliases retained",
    ];

    for (const token of forbidden) {
      expect(
        sources.filter(({ source }) => source.includes(token)).map(({ path }) => path),
        `${token} must have no production owner`,
      ).toEqual([]);
    }
  });

  it("gives Catalog and Player one Workbench-owned editor interface", async () => {
    const [workbench, catalog, player] = await Promise.all([
      readFile(resolve(sourceRoot, "envelope/WorkbenchEnvelope.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "envelope/CatalogView.tsx"), "utf8"),
      readFile(resolve(sourceRoot, "envelope/PlayerFilterControl.tsx"), "utf8"),
    ]);

    expect(workbench.match(/createFilterEditor\(/g)).toHaveLength(1);
    expect(workbench.match(/filterEditor=\{filterEditor\}/g)).toHaveLength(2);
    for (const source of [catalog, player]) {
      expect(source).toContain("filterEditor: FilterEditor");
      expect(source).not.toContain("function toggleValue");
      expect(source).not.toContain("BAND_ORDER");
    }
  });
});
