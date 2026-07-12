import { publicationInventory } from "../publication/inventory.mjs";
import { formatBytes } from "./shared.mjs";

export async function verifyShowcaseThumbnails(
  targets,
  { inventory = publicationInventory, log = console.log } = {},
) {
  const summary = await inventory.validatePreviews(targets);
  log(
    `Verified ${summary.count} Registry topic thumbnails (${formatBytes(summary.bytes)}).`,
  );
  return summary;
}
