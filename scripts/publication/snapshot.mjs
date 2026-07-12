import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

async function createLocalPublicationRuntime() {
  const { createServer } = await import("vite");
  const vite = await createServer({
    root: repositoryRoot,
    logLevel: "warn",
    server: { middlewareMode: true },
    appType: "custom",
  });
  return {
    loadModule: (modulePath) => vite.ssrLoadModule(modulePath),
    close: () => vite.close(),
  };
}

function normalizeSemanticValue(value) {
  if (Array.isArray(value)) return value.map(normalizeSemanticValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, normalizeSemanticValue(value[key])]),
    );
  }
  return value;
}

function semanticEqual(left, right) {
  return (
    JSON.stringify(normalizeSemanticValue(left)) ===
    JSON.stringify(normalizeSemanticValue(right))
  );
}

export function createPublicationSnapshot({ createRuntime }) {
  return {
    renderGenerated(snapshot) {
      return [
        'import type { CatalogStyleGroup } from "./topic-catalog";',
        'import type { PublicationAuditCases, PublicationStats, PublicationTarget } from "./publication-plan";',
        "",
        "/**",
        " * Generated from the validated Publication Plan. Keep Catalog metadata synchronous",
        " * while every Stage component remains behind the Topic loader.",
        " */",
        `export const CATALOG_MANIFEST = ${JSON.stringify(snapshot.manifest, null, 2)} as unknown as readonly CatalogStyleGroup[];`,
        "",
        `export const CATALOG_STATS = ${JSON.stringify(snapshot.stats, null, 2)} as const satisfies PublicationStats;`,
        "",
        `export const PUBLICATION_TARGETS = ${JSON.stringify(snapshot.targets, null, 2)} as const satisfies readonly PublicationTarget[];`,
        "",
        `export const PUBLICATION_AUDIT_CASES = ${JSON.stringify(snapshot.auditCases, null, 2)} as const satisfies PublicationAuditCases;`,
        "",
      ].join("\n");
    },
    assertFresh(current, committed) {
      const projections = [
        ["Manifest", "manifest"],
        ["statistics", "stats"],
        ["Publication targets", "targets"],
        ["browser-audit cases", "auditCases"],
      ];
      for (const [label, key] of projections) {
        if (!semanticEqual(current[key], committed[key])) {
          throw new Error(
            `Generated ${label} is stale. Run \`npm run generate:catalog\` and commit the refreshed snapshot.`,
          );
        }
      }
    },
    async loadCurrent() {
      const runtime = await createRuntime();
      try {
        const [registry, styles, catalog, publication] = await Promise.all([
          runtime.loadModule("/src/catalog/topic-registry.ts"),
          runtime.loadModule("/src/catalog/style-definitions.ts"),
          runtime.loadModule("/src/catalog/topic-catalog.ts"),
          runtime.loadModule("/src/catalog/publication-plan.ts"),
        ]);
        return publication.buildPublicationPlan(
          catalog.createTopicCatalog(
            styles.STYLE_DEFINITIONS,
            registry.TOPIC_REGISTRY,
          ),
        );
      } finally {
        await runtime.close();
      }
    },
    async loadGenerated() {
      const runtime = await createRuntime();
      try {
        const generated = await runtime.loadModule(
          "/src/catalog/manifest.generated.ts",
        );
        const snapshot = {
          manifest: generated.CATALOG_MANIFEST,
          stats: generated.CATALOG_STATS,
          targets: generated.PUBLICATION_TARGETS,
          auditCases: generated.PUBLICATION_AUDIT_CASES,
        };
        if (Object.values(snapshot).some((value) => value === undefined)) {
          throw new Error(
            "Generated Publication snapshot is incomplete. Run `npm run generate:catalog`.",
          );
        }
        return snapshot;
      } finally {
        await runtime.close();
      }
    },
  };
}

export const publicationSnapshot = createPublicationSnapshot({
  createRuntime: createLocalPublicationRuntime,
});
