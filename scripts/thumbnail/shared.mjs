import { readFile, readdir, stat, unlink } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

export const repositoryRoot = resolve(scriptDirectory, "../..");
export const showcaseDirectory = resolve(repositoryRoot, "public/showcase");
export function thumbnailFilename(topicId) {
  return `${topicId}.webp`;
}

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

export async function collectThumbnailTargets(vite) {
  const { RUNTIME_REGISTRY } = await vite.ssrLoadModule(
    "/src/catalog/runtime-registry.ts",
  );
  const targets = [];

  for (const styleGroup of RUNTIME_REGISTRY) {
    for (const topic of styleGroup.topics) {
      const metadata = topic.metadata.en;
      const heroScene = metadata.scenes.find(
        (scene) => scene.id === metadata.heroScene,
      );
      if (!heroScene) {
        throw new Error(
          `${styleGroup.style.id}/${topic.id} has no hero scene ${metadata.heroScene}`,
        );
      }

      const lastBeat = heroScene.beats.at(-1);
      if (!lastBeat) {
        throw new Error(
          `${styleGroup.style.id}/${topic.id} hero scene ${heroScene.id} has no beats`,
        );
      }

      targets.push({
        styleId: styleGroup.style.id,
        topicId: topic.id,
        heroScene: heroScene.id,
        beat: lastBeat.id,
        filename: thumbnailFilename(topic.id),
      });
    }
  }

  return targets;
}

export async function removeUnmappedShowcaseWebps(targets) {
  const expectedFilenames = new Set(targets.map((target) => target.filename));
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

export async function inspectWebp(filePath) {
  const [buffer, fileStats] = await Promise.all([readFile(filePath), stat(filePath)]);
  if (
    buffer.length < 16 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WEBP"
  ) {
    throw new Error("not a WebP RIFF file");
  }

  for (let offset = 12; offset + 8 <= buffer.length;) {
    const kind = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const payload = offset + 8;
    if (payload + size > buffer.length) {
      throw new Error("truncated WebP chunk");
    }

    if (kind === "VP8 ") {
      if (size < 10) throw new Error("truncated VP8 frame");
      return {
        width: buffer.readUInt16LE(payload + 6) & 0x3fff,
        height: buffer.readUInt16LE(payload + 8) & 0x3fff,
        bytes: fileStats.size,
      };
    }

    if (kind === "VP8L") {
      if (size < 5 || buffer[payload] !== 0x2f) {
        throw new Error("invalid VP8L frame");
      }
      const b1 = buffer[payload + 1];
      const b2 = buffer[payload + 2];
      const b3 = buffer[payload + 3];
      const b4 = buffer[payload + 4];
      return {
        width: 1 + b1 + ((b2 & 0x3f) << 8),
        height: 1 + (b2 >> 6) + (b3 << 2) + ((b4 & 0x0f) << 10),
        bytes: fileStats.size,
      };
    }

    if (kind === "VP8X") {
      if (size < 10) throw new Error("truncated VP8X frame");
      return {
        width: 1 + buffer.readUIntLE(payload + 4, 3),
        height: 1 + buffer.readUIntLE(payload + 7, 3),
        bytes: fileStats.size,
      };
    }

    offset = payload + size + (size % 2);
  }

  throw new Error("WebP image chunk not found");
}

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
}
