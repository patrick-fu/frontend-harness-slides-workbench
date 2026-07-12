import { readdir, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

export const repositoryRoot = resolve(scriptDirectory, "../..");
export const showcaseDirectory = resolve(repositoryRoot, "public/showcase");

export async function createThumbnailViteServer() {
  return createServer({
    root: repositoryRoot,
    logLevel: "warn",
    server: {
      host: "127.0.0.1",
      port: 4175,
      strictPort: false,
    },
  });
}

export async function removeUnmappedShowcaseWebps(filenames) {
  const expectedFilenames = new Set(filenames);
  const entries = await readdir(showcaseDirectory, { withFileTypes: true });
  const staleFilenames = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".webp") &&
        !expectedFilenames.has(entry.name),
    )
    .map((entry) => entry.name);

  await Promise.all(
    staleFilenames.map((filename) => unlink(resolve(showcaseDirectory, filename))),
  );
  return staleFilenames;
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}
