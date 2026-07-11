import {
  collectThumbnailTargets,
  createThumbnailViteServer,
  removeUnmappedShowcaseWebps,
} from "./shared.mjs";

async function main() {
  const vite = await createThumbnailViteServer();

  try {
    await vite.listen();
    const targets = await collectThumbnailTargets(vite);
    const removedFilenames = await removeUnmappedShowcaseWebps(targets);
    console.log(`Removed ${removedFilenames.length} obsolete showcase WebPs.`);
  } finally {
    await vite.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
