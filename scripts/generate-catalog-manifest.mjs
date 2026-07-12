import { readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const catalogDirectory = resolve(root, "src/catalog");
const topicsDirectory = resolve(root, "src/topics");
const outputPath = resolve(catalogDirectory, "manifest.generated.ts");

function topicId(filename, suffix) {
  return filename.slice(0, -suffix.length);
}

function exactFileCoverage(label, actual, expected) {
  const actualIds = new Set(actual);
  const expectedIds = new Set(expected);
  const missing = [...expectedIds].filter((id) => !actualIds.has(id));
  const extra = [...actualIds].filter((id) => !expectedIds.has(id));

  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `${label} coverage differs from TOPIC_REGISTRY. Missing: ${missing.join(", ") || "none"}. Extra: ${extra.join(", ") || "none"}.`,
    );
  }
}

function rejectOrphanFiles(label, candidates, registeredIds) {
  const registered = new Set(registeredIds);
  const orphans = candidates.filter((candidate) => !registered.has(candidate));
  if (orphans.length > 0) {
    throw new Error(
      `${label} files do not belong to TOPIC_REGISTRY: ${orphans.join(", ")}.`,
    );
  }
}

async function validateTopicFiles(vite, plan) {
  const registeredIds = plan.targets.map((target) => target.topicId);
  const topicFiles = await readdir(topicsDirectory);
  const productionModules = topicFiles
    .filter((filename) => filename.endsWith(".tsx") && !filename.endsWith(".test.tsx"))
    .map((filename) => topicId(filename, ".tsx"));
  const focusedTests = topicFiles
    .filter((filename) => filename.endsWith(".test.tsx"))
    .map((filename) => topicId(filename, ".test.tsx"));
  const optionalStyles = topicFiles
    .filter((filename) => filename.endsWith(".module.css"))
    .map((filename) => topicId(filename, ".module.css"));
  const barrels = topicFiles.filter((filename) =>
    ["index.ts", "index.tsx", "index.js", "index.jsx"].includes(filename),
  );

  if (barrels.length > 0) {
    throw new Error(`src/topics must not expose an eager barrel: ${barrels.join(", ")}.`);
  }

  exactFileCoverage("Topic module", productionModules, registeredIds);
  exactFileCoverage("Focused Topic test", focusedTests, registeredIds);
  rejectOrphanFiles("Optional Topic CSS", optionalStyles, registeredIds);

  await Promise.all(
    plan.targets.map(async (target) => {
      const moduleUrl = `/src/${target.modulePath.replace(/^\.\.\//, "")}`;
      const module = await vite.ssrLoadModule(moduleUrl);
      if (
        module.default?.id !== target.topicId ||
        module.default?.styleId !== target.styleId
      ) {
        throw new Error(
          `Publication target "${target.styleId}/${target.topicId}" must match the default export of src/topics/${target.topicId}.tsx.`,
        );
      }
    }),
  );
}

function renderManifest(plan) {
  return [
    'import type { CatalogStyleGroup } from "./topic-catalog";',
    'import type { PublicationAuditCases, PublicationStats, PublicationTarget } from "./publication-plan";',
    "",
    "/**",
    " * Generated from the validated Publication Plan. Keep Catalog metadata synchronous",
    " * while every Stage component remains behind the Topic loader.",
    " */",
    `export const CATALOG_MANIFEST = ${JSON.stringify(plan.manifest, null, 2)} as unknown as readonly CatalogStyleGroup[];`,
    "",
    `export const CATALOG_STATS = ${JSON.stringify(plan.stats, null, 2)} as const satisfies PublicationStats;`,
    "",
    `export const PUBLICATION_TARGETS = ${JSON.stringify(plan.targets, null, 2)} as const satisfies readonly PublicationTarget[];`,
    "",
    `export const PUBLICATION_AUDIT_CASES = ${JSON.stringify(plan.auditCases, null, 2)} as const satisfies PublicationAuditCases;`,
    "",
  ].join("\n");
}

export async function generatePublicationArtifacts() {
  const vite = await createServer({
    root,
    logLevel: "warn",
    server: { host: "127.0.0.1", port: 4176, strictPort: false },
  });

  try {
    await vite.listen();
    const [
      { TOPIC_REGISTRY },
      { STYLE_DEFINITIONS },
      { createTopicCatalog },
      { buildPublicationPlan },
    ] =
      await Promise.all([
        vite.ssrLoadModule("/src/catalog/topic-registry.ts"),
        vite.ssrLoadModule("/src/catalog/style-definitions.ts"),
        vite.ssrLoadModule("/src/catalog/topic-catalog.ts"),
        vite.ssrLoadModule("/src/catalog/publication-plan.ts"),
      ]);
    const catalog = createTopicCatalog(STYLE_DEFINITIONS, TOPIC_REGISTRY);
    const plan = buildPublicationPlan(catalog);

    await validateTopicFiles(vite, plan);
    await writeFile(outputPath, renderManifest(plan), "utf8");

    console.log(`Generated Catalog manifest for ${plan.stats.topics} Topics.`);
  } finally {
    await vite.close();
  }
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  generatePublicationArtifacts().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
