import {
  removeUnmappedShowcaseWebps,
} from "./shared.mjs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export async function cleanShowcaseThumbnails(
  expectedFilenames,
  { remove = removeUnmappedShowcaseWebps, log = console.log } = {},
) {
  const removedFilenames = await remove(expectedFilenames);
  log(`Removed ${removedFilenames.length} obsolete showcase WebPs.`);
  return removedFilenames;
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  console.error("Use `npm run clean:showcase-thumbnails`.");
  process.exitCode = 1;
}
