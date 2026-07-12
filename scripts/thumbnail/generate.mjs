import { execFile as execFileCallback } from "node:child_process";
import { mkdtemp, mkdir, readFile, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { chromium } from "playwright";
import { publicationInventory } from "../publication/inventory.mjs";
import { publishStagedPreviews } from "../publication/staged-previews.mjs";
import {
  createThumbnailViteServer,
  formatBytes,
  removeUnmappedShowcaseWebps,
  showcaseDirectory,
} from "./shared.mjs";

const execFile = promisify(execFileCallback);
const screenshotViewport = { width: 1920, height: 1080 };

async function assertCwebpAvailable() {
  try {
    await execFile("cwebp", ["-version"]);
  } catch {
    throw new Error(
      "cwebp is required to produce WebP files. Install it with `brew install webp`.",
    );
  }
}

function captureUrl(baseUrl, target) {
  const params = new URLSearchParams({
    view: "lab",
    style: target.styleId,
    topic: target.topicId,
    scene: String(target.capture.scene),
    beat: String(target.capture.beat),
    lang: target.capture.language,
    pure: target.capture.pure ? "1" : "0",
    frozen: target.capture.frozen ? "1" : "0",
  });
  return `${baseUrl}?${params}`;
}

async function waitForFonts(page) {
  await page.evaluate(
    () =>
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 3000)),
      ]),
  );
}

async function captureTargetOnce(page, baseUrl, target, stagingDirectory) {
  const targetLabel = `${target.styleId}/${target.topicId}`;
  try {
    await page.goto(captureUrl(baseUrl, target), {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    const stage = page.getByTestId("stage");
    await stage.waitFor({ state: "visible", timeout: 30000 });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="stage"]')?.getAttribute("data-topic-ready") === "true",
      undefined,
      { timeout: 30000 },
    );
    await page.waitForFunction(
      () => document.documentElement.getAttribute("data-frozen") === "true",
      undefined,
      { timeout: 30000 },
    );
    await waitForFonts(page);

    const stageBox = await stage.boundingBox();
    if (
      !stageBox ||
      Math.round(stageBox.width) !== screenshotViewport.width ||
      Math.round(stageBox.height) !== screenshotViewport.height
    ) {
      throw new Error(
        `stage is ${stageBox?.width ?? 0}×${stageBox?.height ?? 0}, expected 1920×1080`,
      );
    }

    const pngPath = resolve(stagingDirectory, `${target.previewFilename}.png`);
    const webpPath = resolve(stagingDirectory, target.previewFilename);
    await stage.screenshot({ path: pngPath, type: "png" });
    await execFile("cwebp", ["-quiet", "-q", "85", "-m", "6", pngPath, "-o", webpPath]);

    return { path: webpPath };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to capture ${targetLabel}: ${reason}`);
  }
}

async function captureTarget(page, baseUrl, target, stagingDirectory) {
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      return await captureTargetOnce(page, baseUrl, target, stagingDirectory);
    } catch (error) {
      if (attempt === 2) throw error;
      const reason = error instanceof Error ? error.message : String(error);
      console.warn(
        `Retrying ${target.styleId}/${target.topicId} after transient capture failure: ${reason}`,
      );
      await page.waitForTimeout(500);
    }
  }

  throw new Error(`Unable to capture ${target.styleId}/${target.topicId}`);
}

export async function captureShowcaseThumbnails({
  targets,
  allTargets,
  removeOrphans,
}) {
  await assertCwebpAvailable();
  const vite = await createThumbnailViteServer();
  const stagingDirectory = await mkdtemp(join(tmpdir(), "fh-showcase-thumbnails-"));
  let browser;

  try {
    await vite.listen();
    const address = vite.httpServer?.address();
    if (!address || typeof address === "string") {
      throw new Error("Vite thumbnail server did not expose a TCP address");
    }
    const baseUrl = `http://127.0.0.1:${address.port}/`;
    await mkdir(showcaseDirectory, { recursive: true });

    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: screenshotViewport,
      deviceScaleFactor: 1,
      locale: "en-US",
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => {
      localStorage.setItem("fhsw:language", "en");
    });
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    const results = [];
    for (const [index, target] of targets.entries()) {
      const result = await captureTarget(page, baseUrl, target, stagingDirectory);
      results.push({
        target,
        filename: target.previewFilename,
        ...result,
      });
      console.log(
        `[${index + 1}/${targets.length}] ${target.styleId}/${target.topicId}`,
      );
    }

    const inspections = await publishStagedPreviews(results, {
      read: readFile,
      inspect: publicationInventory.inspectPreview,
      commit: (artifact) =>
        rename(artifact.path, resolve(showcaseDirectory, artifact.filename)),
    });
    const removedFilenames = removeOrphans
      ? await removeUnmappedShowcaseWebps(
          allTargets.map((target) => ({ filename: target.previewFilename })),
        )
      : [];

    const bytes = inspections.reduce(
      (sum, inspection) => sum + inspection.bytes,
      0,
    );
    console.log(
      `Generated ${results.length} 1920×1080 WebP thumbnails (${formatBytes(bytes)}).`,
    );
    if (removedFilenames.length > 0) {
      console.log(`Removed ${removedFilenames.length} obsolete showcase WebPs.`);
    }
  } finally {
    await browser?.close();
    await vite.close();
    await rm(stagingDirectory, { recursive: true, force: true });
  }
}

if (resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
  console.error(
    "Use `npm run generate:showcase-thumbnails -- --topic <id>` or `--all`.",
  );
  process.exitCode = 1;
}
