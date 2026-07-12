import { access, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectThumbnailTargets,
  createThumbnailViteServer,
  formatBytes,
  inspectWebp,
  showcaseDirectory,
} from "./shared.mjs";

export async function verifyShowcaseThumbnails() {
  const vite = await createThumbnailViteServer();

  try {
    await vite.listen();
    const targets = await collectThumbnailTargets(vite);
    const failures = [];

    const expectedFilenames = targets.map((target) => target.filename).sort();
    const committedFilenames = (await readdir(showcaseDirectory))
      .filter((filename) => filename.endsWith(".webp"))
      .sort();
    const expected = new Set(expectedFilenames);
    const committed = new Set(committedFilenames);
    for (const target of targets) {
      if (!committed.has(target.filename)) {
        failures.push(
          `Missing showcase WebP for Topic "${target.styleId}/${target.topicId}": ${target.filename}`,
        );
      }
    }
    for (const filename of committedFilenames) {
      if (!expected.has(filename)) {
        failures.push(
          `Orphan showcase WebP "${filename}" has no Publication target`,
        );
      }
    }

    let totalBytes = 0;
    for (const target of targets) {
      if (!committed.has(target.filename)) continue;
      const filePath = resolve(showcaseDirectory, target.filename);
      try {
        await access(filePath);
        const image = await inspectWebp(filePath);
        totalBytes += image.bytes;
        if (image.width !== 1920 || image.height !== 1080) {
          failures.push(
            `${target.filename} is ${image.width}×${image.height}, expected 1920×1080`,
          );
        }
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        failures.push(`${target.filename}: ${reason}`);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Showcase thumbnail verification failed:\n- ${failures.join("\n- ")}`);
    }

    console.log(
      `Verified ${targets.length} Registry topic thumbnails (${formatBytes(totalBytes)}).`,
    );
  } finally {
    await vite.close();
  }
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  verifyShowcaseThumbnails().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
