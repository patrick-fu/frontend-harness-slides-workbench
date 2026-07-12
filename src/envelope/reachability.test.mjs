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

function importSpecifiers(source) {
  return [
    ...source.matchAll(
      /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']/g,
    ),
  ].map((match) => match[1]);
}

function buildLocalImportGraph(sources) {
  const sourcePaths = new Set(sources.map(({ path }) => path));
  return new Map(
    sources.map(({ path, source }) => [
      path,
      importSpecifiers(source).flatMap((specifier) => {
        if (!specifier.startsWith(".")) return [];
        const base = resolve(dirname(path), specifier);
        const target = [
          base,
          `${base}.ts`,
          `${base}.tsx`,
          join(base, "index.ts"),
          join(base, "index.tsx"),
        ].find((candidate) => sourcePaths.has(candidate));
        return target ? [target] : [];
      }),
    ]),
  );
}

function isInside(root, path) {
  return path === root || path.startsWith(`${root}/`);
}

function playerToEnvelopeReachability(sources) {
  const envelopeRoot = resolve(sourceRoot, "envelope");
  const playerRoot = resolve(sourceRoot, "player");
  const graph = buildLocalImportGraph(sources);
  return sources.flatMap(({ path }) => {
    if (!isInside(playerRoot, path)) return [];
    const visited = new Set();
    const pending = [...(graph.get(path) ?? [])];
    while (pending.length > 0) {
      const target = pending.pop();
      if (!target || visited.has(target)) continue;
      if (isInside(envelopeRoot, target)) {
        return [relative(sourceRoot, path)];
      }
      visited.add(target);
      pending.push(...(graph.get(target) ?? []));
    }
    return [];
  });
}

function importersOf(sources, target) {
  const graph = buildLocalImportGraph(sources);
  return [...graph.entries()].flatMap(([path, imports]) =>
    imports.includes(target) ? [relative(sourceRoot, path)] : [],
  );
}

function ownersOf(sources, pattern) {
  return sources.flatMap(({ path, source }) =>
    pattern.test(source) ? [relative(sourceRoot, path)] : [],
  );
}

describe("Envelope production reachability", () => {
  it("has one Envelope family and no legacy chrome or layout imports", () => {
    expect(
      legacyModules.filter((path) => existsSync(join(sourceRoot, path))),
    ).toEqual([]);
    const violations = productionSources(sourceRoot).flatMap(({ path, source }) =>
      source.includes("components/chrome") ||
      source.includes("components/layout") ||
      /\b(?:LabView|BottomBar|TopicBar)\b|(?:overview-view|lab-view|bottom-bar)/.test(source)
        ? [relative(sourceRoot, path)]
        : [],
    );
    expect(violations).toEqual([]);
  });

  it("rejects production Player imports that reach into the Envelope", () => {
    const sources = productionSources(sourceRoot);

    expect(playerToEnvelopeReachability(sources)).toEqual([]);
    expect(
      playerToEnvelopeReachability([
        {
          path: join(sourceRoot, "player", "example.ts"),
          source: 'export { PlayerTransport } from "../shared/forwarder";',
        },
        {
          path: join(sourceRoot, "shared", "forwarder.ts"),
          source: 'export { default as PlayerTransport } from "../envelope/PlayerTransport";',
        },
        {
          path: join(sourceRoot, "envelope", "PlayerTransport.tsx"),
          source: "export default function PlayerTransport() {}",
        },
      ]),
    ).toEqual(["player/example.ts"]);
  });

  it("keeps one import, render, and DOM ownership path for each shell layer", () => {
    const sources = productionSources(sourceRoot);
    const workbench = resolve(sourceRoot, "envelope/WorkbenchEnvelope.tsx");
    const runtime = resolve(sourceRoot, "player/PlayerRuntime.tsx");
    const transport = resolve(sourceRoot, "envelope/PlayerTransport.tsx");

    expect(importersOf(sources, workbench)).toEqual(["App.tsx"]);
    expect(importersOf(sources, runtime)).toEqual([
      "envelope/WorkbenchEnvelope.tsx",
    ]);
    expect(importersOf(sources, transport)).toEqual([
      "envelope/WorkbenchEnvelope.tsx",
    ]);
    expect(ownersOf(sources, /<WorkbenchEnvelope\b/)).toEqual(["App.tsx"]);
    expect(ownersOf(sources, /<PlayerRuntime\b/)).toEqual([
      "envelope/WorkbenchEnvelope.tsx",
    ]);
    expect(ownersOf(sources, /<PlayerTransport\b/)).toEqual([
      "envelope/WorkbenchEnvelope.tsx",
    ]);
    expect(ownersOf(sources, /data-player-runtime=/)).toEqual([
      "player/PlayerRuntime.tsx",
    ]);
    expect(ownersOf(sources, /data-testid="player-transport"/)).toEqual([
      "envelope/PlayerTransport.tsx",
    ]);
  });
});
