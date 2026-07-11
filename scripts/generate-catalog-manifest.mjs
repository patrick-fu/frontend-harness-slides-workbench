import { readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const catalogDirectory = resolve(root, "src/catalog");
const topicsDirectory = resolve(root, "src/topics");
const showcaseDirectory = resolve(root, "public/showcase");
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

async function validateTopicFiles(vite, registry) {
  const registeredTopics = registry.flat();
  const registeredIds = registeredTopics.map((topic) => topic.id);
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
  const showcaseWebps = (await readdir(showcaseDirectory))
    .filter((filename) => filename.endsWith(".webp"))
    .map((filename) => topicId(filename, ".webp"));
  const barrels = topicFiles.filter((filename) =>
    ["index.ts", "index.tsx", "index.js", "index.jsx"].includes(filename),
  );

  if (barrels.length > 0) {
    throw new Error(`src/topics must not expose an eager barrel: ${barrels.join(", ")}.`);
  }

  exactFileCoverage("Topic module", productionModules, registeredIds);
  exactFileCoverage("Focused Topic test", focusedTests, registeredIds);
  exactFileCoverage("Showcase WebP", showcaseWebps, registeredIds);
  rejectOrphanFiles("Optional Topic CSS", optionalStyles, registeredIds);

  await Promise.all(
    registeredTopics.map(async (topic) => {
      const module = await vite.ssrLoadModule(`/src/topics/${topic.id}.tsx`);
      if (module.default !== topic) {
        throw new Error(
          `Topic Registry entry "${topic.id}" must be the default export of src/topics/${topic.id}.tsx.`,
        );
      }
    }),
  );
}

function renderManifest(manifest) {
  return [
    'import type { CatalogStyleGroup } from "./topic-catalog";',
    "",
    "/**",
    " * Generated from topic-registry.ts. Keep Catalog metadata synchronous",
    " * while every Stage component remains behind the Topic loader.",
    " */",
    `export const CATALOG_MANIFEST = ${JSON.stringify(manifest, null, 2)} as unknown as readonly CatalogStyleGroup[];`,
    "",
  ].join("\n");
}

async function main() {
  const vite = await createServer({
    root,
    logLevel: "warn",
    server: { host: "127.0.0.1", port: 4176, strictPort: false },
  });

  try {
    await vite.listen();
    const [{ TOPIC_REGISTRY }, { STYLE_DEFINITIONS }, { createTopicCatalog }] =
      await Promise.all([
        vite.ssrLoadModule("/src/catalog/topic-registry.ts"),
        vite.ssrLoadModule("/src/catalog/style-definitions.ts"),
        vite.ssrLoadModule("/src/catalog/topic-catalog.ts"),
      ]);
    const catalog = createTopicCatalog(STYLE_DEFINITIONS, TOPIC_REGISTRY);

    await validateTopicFiles(vite, TOPIC_REGISTRY);
    await writeFile(outputPath, renderManifest(catalog.manifest), "utf8");

    const topicCount = catalog.manifest.reduce(
      (count, group) => count + group.topics.length,
      0,
    );
    console.log(`Generated Catalog manifest for ${topicCount} Topics.`);
  } finally {
    await vite.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
