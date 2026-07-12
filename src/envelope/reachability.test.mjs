import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const legacyModules = [
  "components/chrome",
  "components/layout/Header.tsx",
  "components/layout/Sidebar.tsx",
  "components/layout/TopicBar.tsx",
  "components/layout/BottomBar.tsx",
  "components/layout/bands.ts",
];

function productionSources(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return productionSources(path);
    if (!/\.(ts|tsx)$/.test(entry.name) || /\.test\./.test(entry.name)) {
      return [];
    }
    return [{ path, source: readFileSync(path, "utf8") }];
  });
}

describe("Envelope production reachability", () => {
  it("has one Envelope family and no legacy chrome or layout imports", () => {
    expect(
      legacyModules.filter((path) => existsSync(join(sourceRoot, path))),
    ).toEqual([]);
    const violations = productionSources(sourceRoot).flatMap(({ path, source }) =>
      source.includes("components/chrome") ||
      source.includes("components/layout") ||
      /\b(?:LabView|BottomBar|TopicBar)\b/.test(source)
        ? [relative(sourceRoot, path)]
        : [],
    );
    expect(violations).toEqual([]);
  });
});
