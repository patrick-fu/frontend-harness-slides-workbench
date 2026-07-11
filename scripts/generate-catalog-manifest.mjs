import { readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const stylesDirectory = resolve(root, "src/styles");
const topicsDirectory = resolve(root, "src/topics");
const outputPath = resolve(stylesDirectory, "catalog-manifest.generated.ts");

function isStyleModule(filename) {
  return (
    filename.endsWith(".tsx") &&
    !filename.endsWith(".test.tsx") &&
    filename !== "__test-template.tsx"
  );
}

function renderManifest(manifest) {
  return [
    'import type { CatalogStyleManifest } from "../types";',
    "",
    "/**",
    " * Generated from catalog-source.ts. Keep the Catalog metadata synchronous",
    " * while every Stage component remains behind its Topic loader.",
    " */",
    `export const CATALOG_MANIFEST = ${JSON.stringify(manifest, null, 2)} as unknown as CatalogStyleManifest[];`,
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
    const { STYLE_CATALOG_SOURCE } = await vite.ssrLoadModule(
      "/src/styles/catalog-source.ts",
    );
    const styleFilenames = (await readdir(stylesDirectory))
      .filter(isStyleModule)
      .sort();
    const topicFilenames = (await readdir(topicsDirectory, { recursive: false }).catch(
      () => [],
    ))
      .filter(isStyleModule)
      .sort();
    const modules = await Promise.all(
      [
        ...styleFilenames.map((filename) => ({
          path: `./${filename}`,
          sourcePath: `/src/styles/${filename}`,
        })),
        ...topicFilenames.map((filename) => ({
          path: `../topics/${filename}`,
          sourcePath: `/src/topics/${filename}`,
        })),
      ].map(async ({ path, sourcePath }) => ({
        path,
        module: await vite.ssrLoadModule(sourcePath),
      })),
    );
    const manifest = STYLE_CATALOG_SOURCE.map((style) => ({
      id: style.id,
      name: style.name,
      topics: style.topics.map((topic) => {
        const matchingModule = modules.find(
          ({ module }) =>
            module.default === topic.component ||
            module.default?.Stage === topic.component,
        );
        if (!matchingModule) {
          throw new Error(
            `No default module export matches ${style.id}/${topic.id}.`,
          );
        }

        return {
          id: topic.id,
          topic: topic.topic,
          model: topic.model,
          metadata: {
            en: topic.getMetadata("en"),
            zh: topic.getMetadata("zh"),
          },
          modulePath: matchingModule.path,
          navigation: topic.navigation,
          topicSet: topic.topicSet,
          sources: topic.sources,
          evidence: topic.evidence,
          transitionScore: topic.transitionScore,
        };
      }),
    }));

    await writeFile(outputPath, renderManifest(manifest), "utf8");
    const topicCount = manifest.reduce(
      (count, style) => count + style.topics.length,
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
