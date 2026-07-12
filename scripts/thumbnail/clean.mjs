import {
  removeUnmappedShowcaseWebps,
} from "./shared.mjs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function cleanShowcaseThumbnails(targets) {
  const removedFilenames = await removeUnmappedShowcaseWebps(targets);
  console.log(`Removed ${removedFilenames.length} obsolete showcase WebPs.`);
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  console.error("Use `npm run clean:showcase-thumbnails`.");
  process.exitCode = 1;
}
