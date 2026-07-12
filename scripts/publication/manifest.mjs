import { rename, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { publicationInventory } from "./inventory.mjs";
import { publicationSnapshot } from "./snapshot.mjs";

const repositoryRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const outputPath = resolve(
  repositoryRoot,
  "src/catalog/manifest.generated.ts",
);

export function createAtomicGeneratedWriter({
  outputPath,
  temporaryPath,
  writeFile,
  rename,
  remove,
}) {
  return async (source) => {
    try {
      await writeFile(temporaryPath, source, "utf8");
      await rename(temporaryPath, outputPath);
    } catch (error) {
      try {
        await remove(temporaryPath, { force: true });
      } catch {
        // Preserve the write failure; a stale temporary file is never committed.
      }
      throw error;
    }
  };
}

export function createManifestPublication({
  snapshot,
  inventory,
  writeGenerated,
  log,
}) {
  return {
    async generate() {
      const current = await snapshot.loadCurrent();
      await inventory.validateSource(current.targets);
      const generated = snapshot.renderGenerated(current);
      await writeGenerated(generated);
      log(`Generated Catalog manifest for ${current.stats.topics} Topics.`);
    },
  };
}

const writeGenerated = createAtomicGeneratedWriter({
  outputPath,
  temporaryPath: `${outputPath}.tmp-${process.pid}`,
  writeFile,
  rename,
  remove: rm,
});

export const publicationManifest = createManifestPublication({
  snapshot: publicationSnapshot,
  inventory: publicationInventory,
  writeGenerated,
  log: console.log,
});
