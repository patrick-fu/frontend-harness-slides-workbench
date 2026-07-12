import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);

export async function loadPublicationPlan() {
  const { createServer } = await import("vite");
  const vite = await createServer({
    root: repositoryRoot,
    logLevel: "warn",
    server: { middlewareMode: true },
    appType: "custom",
  });
  try {
    const [
      { TOPIC_REGISTRY },
      { STYLE_DEFINITIONS },
      { createTopicCatalog },
      { buildPublicationPlan },
    ] = await Promise.all([
      vite.ssrLoadModule("/src/catalog/topic-registry.ts"),
      vite.ssrLoadModule("/src/catalog/style-definitions.ts"),
      vite.ssrLoadModule("/src/catalog/topic-catalog.ts"),
      vite.ssrLoadModule("/src/catalog/publication-plan.ts"),
    ]);
    return buildPublicationPlan(
      createTopicCatalog(STYLE_DEFINITIONS, TOPIC_REGISTRY),
    );
  } finally {
    await vite.close();
  }
}

export async function loadGeneratedPublicationTargets() {
  const manifestPath = resolve(
    repositoryRoot,
    "src/catalog/manifest.generated.ts",
  );
  const source = await readFile(manifestPath, "utf8");
  const prefix = "export const PUBLICATION_TARGETS = ";
  const suffix = " as const satisfies readonly PublicationTarget[];";
  const start = source.indexOf(prefix);
  const end = source.indexOf(suffix, start + prefix.length);
  if (start < 0 || end < 0) {
    throw new Error(
      "Generated Publication targets are missing. Run `npm run generate:catalog`.",
    );
  }
  return JSON.parse(source.slice(start + prefix.length, end));
}

export function assertGeneratedTargetsCurrent(current, generated) {
  if (JSON.stringify(current) !== JSON.stringify(generated)) {
    throw new Error(
      "Generated Publication targets are stale. Run `npm run generate:catalog` before capture.",
    );
  }
}
