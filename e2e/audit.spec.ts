import { test, expect, Page } from "@playwright/test";
import {
  CATALOG_MANIFEST,
  CATALOG_STATS,
  PUBLICATION_AUDIT_CASES,
  PUBLICATION_TARGETS,
} from "../src/catalog/manifest.generated";
import type { PublicationHeroFrame } from "../src/catalog/publication-plan";

const CATALOG_TOPIC_COUNT = CATALOG_STATS.topics;

const TOPIC_KEYS = PUBLICATION_TARGETS.map(({ styleId, topicId }) => ({
  styleId,
  topicId,
}));

const SCENE_TRANSITION_KINDS = [
  "slide-x",
  "slide-y",
  "fade",
  "scale-fade",
  "hard-cut",
  "wipe",
  "page-flip",
  "glitch",
];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build URL query string from params. Format: ?view=lab&style=...&topic=... */
function buildQuery(params: {
  view: string;
  style?: string;
  topic?: string;
  scene?: number;
  beat?: number;
  language?: "en" | "zh";
  pure?: boolean;
  frozen?: boolean;
}): string {
  const search = new URLSearchParams();
  search.set("view", params.view);
  if (params.style) search.set("style", params.style);
  if (params.topic) search.set("topic", params.topic);
  if (params.scene !== undefined) search.set("scene", String(params.scene));
  if (params.beat !== undefined) search.set("beat", String(params.beat));
  if (params.language) search.set("lang", params.language);
  if (params.pure) search.set("pure", "1");
  if (params.frozen) search.set("frozen", "1");
  return `?${search.toString()}`;
}

/** Parse current URL query into a key-value map. */
function parseQueryFromUrl(url: string): Record<string, string> {
  const params = new URL(url).searchParams;
  const result: Record<string, string> = {};
  params.forEach((v, k) => {
    result[k] = v;
  });
  return result;
}

/** Navigate to a lab view with the given style/scene/beat via query params. */
async function openLab(
  page: Page,
  styleId: string,
  scene: number,
  beat: number,
  opts: { topic?: string; pure?: boolean; frozen?: boolean } = {},
) {
  const query = buildQuery({
    view: "lab",
    style: styleId,
    topic: opts.topic ?? getFirstTopicId(styleId),
    scene,
    beat,
    pure: opts.pure ?? false,
    frozen: opts.frozen ?? false,
  });
  await page.goto(`/${query}`, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="stage"]', {
    state: "visible",
    timeout: 10000,
  });
  // Give components a beat to settle after mount
  await page.waitForTimeout(300);
}

/** Navigate to overview (gallery) view via query params. */
async function openOverview(page: Page) {
  const query = buildQuery({ view: "overview" });
  await page.goto(`/${query}`, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="catalog-view"]', {
    state: "visible",
    timeout: 10000,
  });
  await page.waitForTimeout(500);
}

async function dispatchScreenSwipe(
  page: Page,
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  await page.locator('[data-testid="stage"]').evaluate(
    (stage, points) => {
      const touch = (point: { x: number; y: number }) =>
        new Touch({
          identifier: 1,
          target: stage,
          clientX: point.x,
          clientY: point.y,
        });
      const startTouch = touch(points.start);
      stage.dispatchEvent(
        new TouchEvent("touchstart", {
          bubbles: true,
          cancelable: true,
          touches: [startTouch],
          changedTouches: [startTouch],
        }),
      );
      const endTouch = touch(points.end);
      stage.dispatchEvent(
        new TouchEvent("touchend", {
          bubbles: true,
          cancelable: true,
          touches: [],
          changedTouches: [endTouch],
        }),
      );
    },
    { start, end },
  );
}

/** Collect console errors, filtering out favicon / source map noise. */
function attachErrorCollector(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!text.includes("favicon") && !text.includes("Source Map")) {
        errors.push(text);
      }
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`PAGE_ERROR: ${err.message}`);
  });
  return errors;
}

/** Measure stage content overflow (scroll dims minus layout dims). */
async function measureOverflow(
  page: Page,
): Promise<{ overflowX: number; overflowY: number }> {
  return page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>('[data-testid="stage"]');
    if (!stage) return { overflowX: 0, overflowY: 0 };
    return {
      overflowX: stage.scrollWidth - stage.clientWidth,
      overflowY: stage.scrollHeight - stage.clientHeight,
    };
  });
}

function getManifestStyle(styleId: string) {
  const styleGroup = CATALOG_MANIFEST.find(
    (entry) => entry.style.id === styleId,
  );
  if (!styleGroup) {
    throw new Error(`Style is missing from the manifest: ${styleId}`);
  }
  return styleGroup;
}

function getFirstTopicId(styleId: string): string {
  const topic = getManifestStyle(styleId).topics[0];
  if (!topic) throw new Error(`Style is missing its first Topic: ${styleId}`);
  return topic.id;
}

/** Get the final authored beat ID for a given style/topic and scene. */
function getLastBeat(
  styleId: string,
  scene: number,
  topicId: string = getFirstTopicId(styleId),
): number {
  const topic = getManifestTopic(styleId, topicId);
  const sceneMetadata = topic.metadata.en.scenes.find(
    (candidate) => candidate.id === scene,
  );
  if (!sceneMetadata) {
    throw new Error(
      `Scene is missing from the manifest: ${styleId}/${topicId}/${scene}`,
    );
  }

  const finalBeat = sceneMetadata.beats[sceneMetadata.beats.length - 1];
  if (!finalBeat) {
    throw new Error(
      `Scene has no beats in the manifest: ${styleId}/${topicId}/${scene}`,
    );
  }
  return finalBeat.id;
}

function getTopicSequence(styleId: string): string[] {
  return getManifestStyle(styleId).topics.map((topic) => topic.id);
}

function getLastTopic(styleId: string): string {
  const topics = getManifestStyle(styleId).topics;
  const topic = topics[topics.length - 1];
  if (!topic) throw new Error(`Style has no Topics in the manifest: ${styleId}`);
  return topic.id;
}

function getFirstStyleId(): string {
  const styleGroup = CATALOG_MANIFEST[0];
  if (!styleGroup) throw new Error("The manifest has no Styles");
  return styleGroup.style.id;
}

function getLastStyleId(): string {
  const styleGroup = CATALOG_MANIFEST[CATALOG_MANIFEST.length - 1];
  if (!styleGroup) throw new Error("The manifest has no Styles");
  return styleGroup.style.id;
}

function getBandBoundaryTransitions(): Array<{ from: string; to: string }> {
  return [...PUBLICATION_AUDIT_CASES.bandBoundaryTransitions];
}

function getManifestTopic(styleId: string, topicId: string) {
  const style = getManifestStyle(styleId);

  const topic = style.topics.find((entry) => entry.id === topicId);
  if (!topic) {
    throw new Error(
      `Topic is missing from the manifest: ${styleId}/${topicId}`,
    );
  }

  return topic;
}

const TOPIC_HERO_FINAL_FRAMES: readonly PublicationHeroFrame[] =
  PUBLICATION_AUDIT_CASES.heroFinalFrames;

const TOPIC_HERO_FRAME_AUDITS = TOPIC_KEYS.map(
  ({ styleId, topicId }) => ({
    styleId,
    topicId,
    frames: TOPIC_HERO_FINAL_FRAMES.filter(
      (frame) => frame.styleId === styleId && frame.topicId === topicId,
    ),
  }),
);

async function openTopicHeroFinalFrame(
  page: Page,
  frame: TopicHeroFinalFrame,
) {
  const query = buildQuery({
    view: "lab",
    style: frame.styleId,
    topic: frame.topicId,
    scene: frame.scene,
    beat: frame.beat,
    language: frame.language,
    frozen: true,
  });

  await page.goto(`/${query}`, { waitUntil: "domcontentloaded" });
  const stage = page.locator('[data-testid="stage"]');
  await expect(stage).toBeVisible();
  await expect(stage).toHaveAttribute("data-topic-ready", "true");
  await expect(
    page.locator('[data-testid="spatial-scene-panel"][data-active="true"]'),
  ).toBeVisible();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
      }),
  );
}

async function getFrozenStageState(page: Page) {
  return page.evaluate(() => {
    const stage = document.querySelector<HTMLElement>('[data-testid="stage"]');
    const activePanel = document.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );

    return {
      frozen: document.documentElement.dataset.frozen,
      stageReady: stage?.dataset.topicReady,
      overflowX: (stage?.scrollWidth ?? 0) - (stage?.clientWidth ?? 0),
      overflowY: (stage?.scrollHeight ?? 0) - (stage?.clientHeight ?? 0),
      activeScene: activePanel?.dataset.sceneId,
      activeContent: activePanel?.textContent?.trim() ?? "",
      runningAnimations: document
        .getAnimations({ subtree: true })
        .filter(
          (animation) =>
            animation.playState === "running" || animation.playState === "pending",
        ).length,
    };
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

// ─── 1 & 2: All registered styles — console errors + overflow (parallel) ───

test.describe.parallel("Style audit — all registered styles", () => {
  for (const styleAudit of PUBLICATION_AUDIT_CASES.styleStarts) {
    const styleId = styleAudit.styleId;
    test(`style ${styleId} scene 1 beat 0 — no console errors, no overflow`, async ({
      page,
    }) => {
      const errors = attachErrorCollector(page);

      await openLab(page, styleId, 1, 0, {
        topic: styleAudit.topicId,
        frozen: true,
      });

      // Verify stage is rendered
      await expect(page.locator('[data-testid="stage"]')).toBeVisible();
      await expect(page.locator('[data-testid="spatial-scene-track"]')).toBeVisible();

      // Give lazy-loaded assets a beat to finish
      await page.waitForTimeout(800);

      // Assert no console / page errors
      expect(
        errors,
        `Console errors in style ${styleId}: ${errors.join("; ")}`,
      ).toEqual([]);

      // Assert no horizontal or vertical overflow beyond 2px tolerance
      const { overflowX, overflowY } = await measureOverflow(page);
      expect(
        overflowX,
        `Style ${styleId} scene 1 overflows horizontally by ${overflowX}px`,
      ).toBeLessThanOrEqual(2);
      expect(
        overflowY,
        `Style ${styleId} scene 1 overflows vertically by ${overflowY}px`,
      ).toBeLessThanOrEqual(2);

      const transitionState = await page.evaluate(() => {
        const activePanel = document.querySelector<HTMLElement>(
          '[data-testid="spatial-scene-panel"][data-active="true"]',
        );
        return {
          transitionKind: document.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-track"]',
          )?.dataset.sceneTransitionKind,
          panelCount: document.querySelectorAll(
            '[data-testid="spatial-scene-panel"]',
          ).length,
          activeScene: activePanel?.dataset.sceneId,
          activeState: activePanel?.dataset.transitionState,
          cloneCount: document.querySelectorAll('[data-transition-clone="true"]')
            .length,
        };
      });

      expect(
        transitionState.panelCount,
        `Style ${styleId} must keep spatial scene panels mounted`,
      ).toBeGreaterThanOrEqual(5);
      expect(
        SCENE_TRANSITION_KINDS,
        `Style ${styleId} must expose a supported scene transition kind`,
      ).toContain(transitionState.transitionKind);
      expect(transitionState.activeScene, `Style ${styleId}`).toBe("1");
      expect(transitionState.activeState, `Style ${styleId}`).toBe("active");
      expect(
        transitionState.cloneCount,
        `Style ${styleId} must not render outgoing transition clones`,
      ).toBe(0);
    });

    test(`style ${styleId} first multi-beat scene declares beat layout mode`, async ({
      page,
    }) => {
      const scene = styleAudit.firstMultiBeatScene;

      await openLab(page, styleId, scene, 0, {
        topic: styleAudit.topicId,
        frozen: true,
      });
      await expect(page.locator('[data-testid="spatial-scene-track"]')).toBeVisible();

      const layoutState = await page.evaluate(() => {
        const activePanel = document.querySelector<HTMLElement>(
          '[data-testid="spatial-scene-panel"][data-active="true"]',
        );
        const layout = activePanel?.matches(
          '[data-beat-layout-container="true"]',
        )
          ? activePanel
          : activePanel?.querySelector<HTMLElement>(
            '[data-beat-layout-container="true"]',
          );

        return {
          activeScene: activePanel?.dataset.sceneId,
          layoutMode: layout?.dataset.beatLayoutMode,
        };
      });

      expect(layoutState.activeScene, `Style ${styleId}`).toBe(String(scene));
      expect(
        layoutState.layoutMode,
        `Style ${styleId} scene ${scene} must declare a beat layout mode`,
      ).toMatch(/^(motion|reserved)$/);
    });
  }
});

test.describe.parallel("Topic hero-frame audit", () => {
  for (const audit of TOPIC_HERO_FRAME_AUDITS) {
    test(
      `${audit.styleId}/${audit.topicId} EN and ZH hero final frames are frozen and settled`,
      async ({ page }) => {
        test.setTimeout(30000);
        const errors = attachErrorCollector(page);

        for (const frame of audit.frames) {
          const errorCountBeforeFrame = errors.length;
          await openTopicHeroFinalFrame(page, frame);

          const topicMenuTrigger = page
            .locator("button[aria-haspopup='menu']:not([aria-label])")
            .filter({ hasText: frame.topicName });
          await expect(
            topicMenuTrigger,
            `${frame.styleId}/${frame.topicId}/${frame.language} must expose its exact Topic label`,
          ).toHaveCount(1);
          await expect(topicMenuTrigger).toBeVisible();

          const query = parseQueryFromUrl(page.url());
          expect(query.style, `${frame.styleId}/${frame.language}`).toBe(
            frame.styleId,
          );
          expect(query.topic, `${frame.styleId}/${frame.language}`).toBe(
            frame.topicId,
          );
          expect(query.lang, `${frame.styleId}/${frame.topicId}`).toBe(
            frame.language,
          );
          expect(Number(query.scene), `${frame.styleId}/${frame.topicId}`).toBe(
            frame.scene,
          );
          expect(Number(query.beat), `${frame.styleId}/${frame.topicId}`).toBe(
            frame.beat,
          );
          expect(query.frozen, `${frame.styleId}/${frame.topicId}`).toBe("1");

          const stageState = await getFrozenStageState(page);
          if (frame.evidenceBoundary) {
            const boundary = page.locator(
              '[data-topic-evidence-boundary="true"]',
            );
            await expect(
              boundary,
              `${frame.styleId}/${frame.topicId}/${frame.language} must display its evidence boundary`,
            ).toHaveCount(1);
            await expect(boundary).toContainText(frame.evidenceBoundary);
          }
          expect(
            errors.slice(errorCountBeforeFrame),
            `Console errors in ${frame.styleId}/${frame.topicId}/${frame.language}`,
          ).toEqual([]);
          expect(stageState.stageReady, `${frame.styleId}/${frame.topicId}`).toBe(
            "true",
          );
          expect(stageState.frozen, `${frame.styleId}/${frame.topicId}`).toBe(
            "true",
          );
          expect(
            stageState.activeScene,
            `${frame.styleId}/${frame.topicId} active Scene`,
          ).toBe(String(frame.scene));
          expect(
            stageState.activeContent,
            `${frame.styleId}/${frame.topicId} active content`,
          ).not.toBe("");
          expect(
            stageState.overflowX,
            `${frame.styleId}/${frame.topicId} overflows horizontally by ${stageState.overflowX}px`,
          ).toBeLessThanOrEqual(2);
          expect(
            stageState.overflowY,
            `${frame.styleId}/${frame.topicId} overflows vertically by ${stageState.overflowY}px`,
          ).toBeLessThanOrEqual(2);
          expect(
            stageState.runningAnimations,
            `${frame.styleId}/${frame.topicId} must settle in frozen mode`,
          ).toBe(0);
        }
      },
    );
  }
});

// ─── 3: Navigation — keyboard and stage inputs advance scenes ───────────────

test.describe("Navigation", () => {
  test("ArrowRight advances beat within scene", async ({ page }) => {
    // Style 01 scene 2 has 2 beats (ids 0, 1). From beat 0, right should go to beat 1.
    await openLab(page, "minimal-product-keynote", 2, 0, { frozen: true });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(2);
    expect(Number(query.beat)).toBe(1);
  });

  test("ArrowRight advances to next scene when at last beat", async ({
    page,
  }) => {
    // Style 01 scene 2 has 2 beats (ids 0, 1). Last beat = 1.
    const lastBeat = getLastBeat("minimal-product-keynote", 2);
    await openLab(page, "minimal-product-keynote", 2, lastBeat, { frozen: true });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(3);
    expect(Number(query.beat)).toBe(0);
  });

  test("Space advances to next scene when at last beat", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    await page.keyboard.press("Space");
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(2);
    expect(Number(query.beat)).toBe(0);
  });

  test("mouse click on the stage advances to next scene", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const stage = page.locator('[data-testid="stage"]');
    const box = await stage.boundingBox();
    expect(box).not.toBeNull();
    await stage.click({
      position: { x: (box?.width ?? 1) * 0.75, y: (box?.height ?? 1) * 0.5 },
    });
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(2);
    expect(Number(query.beat)).toBe(0);
  });

  test("coarse mobile screen accepts horizontal and vertical swipes while rotate guidance expires", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    try {
      await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });
      await expect(page.locator('[data-testid="portrait-hint"]')).toBeVisible();

      await dispatchScreenSwipe(
        page,
        { x: 320, y: 420 },
        { x: 220, y: 420 },
      );
      await expect.poll(() => parseQueryFromUrl(page.url()).scene).toBe("2");

      await dispatchScreenSwipe(
        page,
        { x: 195, y: 520 },
        { x: 195, y: 420 },
      );
      await expect.poll(() => parseQueryFromUrl(page.url()).beat).toBe("1");
      await expect(page.locator('[data-testid="portrait-hint"]')).toHaveCount(0, {
        timeout: 4000,
      });

      await page.setViewportSize({ width: 844, height: 390 });
      await dispatchScreenSwipe(
        page,
        { x: 650, y: 195 },
        { x: 550, y: 195 },
      );
      await expect.poll(() => parseQueryFromUrl(page.url()).scene).toBe("3");
    } finally {
      await context.close();
    }
  });

  test("presentation shortcuts yield to Library and Topic menu focus", async ({
    page,
  }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const rail = page.getByRole("navigation", { name: "Player navigation" });
    await rail.getByRole("button", { name: "Library" }).click();
    const drawer = page.getByRole("dialog", { name: "Library" });
    const librarySearch = drawer.getByRole("searchbox", {
      name: "Search styles, topics, or Model ID",
    });
    await librarySearch.focus();
    await expect(librarySearch).toBeFocused();
    await page.keyboard.press("ArrowRight");

    let query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);

    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);

    const topicMenuTrigger = page
      .locator("button[aria-haspopup='menu']")
      .filter({ hasText: "Product Keynote" });
    await expect(topicMenuTrigger).toBeVisible();
    await topicMenuTrigger.focus();
    await page.keyboard.press("Space");

    await expect(
      page.locator('[role="menu"]').filter({ hasText: "Quiet Launch" }),
    ).toBeVisible();

    query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);
  });

  test("ArrowLeft goes to previous beat", async ({ page }) => {
    // Style 01 scene 3 has 3 beats (ids 0, 1, 2). Start at beat 2.
    await openLab(page, "minimal-product-keynote", 3, 2, { frozen: true });

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(3);
    expect(Number(query.beat)).toBe(1);
  });

  test("ArrowLeft at scene 1 beat 0 wraps to previous topic", async ({ page }) => {
    await openLab(page, "objective-swiss-grid", 1, 0, {
      topic: getFirstTopicId("objective-swiss-grid"),
      frozen: true,
    });

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(300);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    const previousTopic = getLastTopic("minimal-product-keynote");
    expect(query.topic).toBe(previousTopic);
    expect(Number(query.scene)).toBe(5);
    expect(Number(query.beat)).toBe(
      getLastBeat(
        "minimal-product-keynote",
        5,
        previousTopic,
      ),
    );
  });

  test("ArrowRight advances through multiple scenes within same style", async ({
    page,
  }) => {
    // Start at style 01 scene 1 beat 0
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    // Press ArrowRight enough times to traverse all of style 01
    // Style 01: s1(1b) s2(2b) s3(3b) s4(2b) s5(1b)
    // Total positions: 1+2+3+2+1 = 9 beats/scenes combos
    // From scene 1 beat 0, pressing right:
    //   1: s1b0 → s2b0 (scene 1 has 1 beat, 0 is last)
    //   2: s2b0 → s2b1 (scene 2 has 2 beats, 0 < 1)
    //   3: s2b1 → s3b0
    //   4: s3b0 → s3b1
    //   5: s3b1 → s3b2
    //   6: s3b2 → s4b0
    //   7: s4b0 → s4b1
    //   8: s4b1 → s5b0
    //   9: s5b0 → next style s01b0 (cross-style)
    // So after 8 presses we should be at s5b0
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(5);
    expect(Number(query.beat)).toBe(0);
  });
});

test.describe("Minimal Product Keynote transition contract", () => {
  const MINIMAL_PRODUCT_KEYNOTE_BEATS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 2,
    5: 1,
  };

  test("non-frozen scene advance uses transition states instead of outgoing clones", async ({
    page,
  }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, {
      frozen: false,
    });

    await expect(page.locator('[data-testid="spatial-scene-track"]')).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);

    const trackState = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-track"]',
      );
      const strip = document.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-strip"]',
      );
      const panels = Array.from(
        document.querySelectorAll<HTMLElement>(
          '[data-testid="spatial-scene-panel"]',
        ),
      );
      const stage = document.querySelector<HTMLElement>('[data-testid="stage"]');
      const activePanel = document.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );
      const stageRect = stage?.getBoundingClientRect();
      const activeRect = activePanel?.getBoundingClientRect();
      return {
        activeScene: track?.dataset.activeScene,
        axis: track?.dataset.axis,
        transitionKind: track?.dataset.sceneTransitionKind,
        stripKind: strip?.dataset.sceneTransitionKind,
        panelSceneIds: panels.map((panel) => panel.dataset.sceneId),
        activeFlags: panels.map((panel) => panel.dataset.active),
        transitionStates: panels.map((panel) => panel.dataset.transitionState),
        activePanelVisible:
          !!stageRect &&
          !!activeRect &&
          activeRect.left < stageRect.right &&
          activeRect.right > stageRect.left &&
          activeRect.top < stageRect.bottom &&
          activeRect.bottom > stageRect.top,
        cloneCount: document.querySelectorAll('[data-transition-clone="true"]')
          .length,
      };
    });

    expect(trackState.axis).toBe("x");
    expect(trackState.transitionKind).toBe("scale-fade");
    expect(trackState.stripKind).toBe("scale-fade");
    expect(trackState.activeScene).toBe("2");
    expect(trackState.panelSceneIds).toEqual(["1", "2", "3", "4", "5"]);
    expect(trackState.activeFlags).toEqual([
      "false",
      "true",
      "false",
      "false",
      "false",
    ]);
    expect(trackState.transitionStates).toEqual([
      "outgoing",
      "active",
      "idle",
      "idle",
      "idle",
    ]);
    expect(trackState.activePanelVisible).toBe(true);
    expect(trackState.cloneCount).toBe(0);
  });

  test("every first Topic frame keeps active content inside the stage", async ({
    page,
  }) => {
    for (const [sceneText, beatCount] of Object.entries(MINIMAL_PRODUCT_KEYNOTE_BEATS)) {
      const scene = Number(sceneText);
      for (let beat = 0; beat < beatCount; beat++) {
        await openLab(page, "minimal-product-keynote", scene, beat, {
          frozen: false,
        });

        const state = await page.evaluate(() => {
          const stage = document.querySelector<HTMLElement>(
            '[data-testid="stage"]',
          );
          const activePanel = document.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-panel"][data-active="true"]',
          );
          const activeContent = activePanel?.querySelector<HTMLElement>(
            "h1, h2, [data-beat-layout-item='true']",
          );
          const stageRect = stage?.getBoundingClientRect();
          const panelRect = activePanel?.getBoundingClientRect();
          const contentRect = activeContent?.getBoundingClientRect();

          const intersectsStage = (rect: DOMRect | undefined) =>
            !!stageRect &&
            !!rect &&
            rect.left < stageRect.right &&
            rect.right > stageRect.left &&
            rect.top < stageRect.bottom &&
            rect.bottom > stageRect.top;

          return {
            activeScene: activePanel?.dataset.sceneId,
            activeText: activePanel?.textContent?.trim().slice(0, 80) ?? "",
            activePanelVisible: intersectsStage(panelRect),
            panelWidthDelta:
              stageRect && panelRect ? Math.abs(stageRect.width - panelRect.width) : null,
            panelHeightDelta:
              stageRect && panelRect ? Math.abs(stageRect.height - panelRect.height) : null,
            cloneCount: document.querySelectorAll('[data-transition-clone="true"]')
              .length,
            activeContentVisible: intersectsStage(contentRect),
          };
        });

        expect(state.activeScene, `scene ${scene} beat ${beat}`).toBe(
          String(scene),
        );
        expect(state.activeText.length, `scene ${scene} beat ${beat}`).toBeGreaterThan(0);
        expect(state.activePanelVisible, `scene ${scene} beat ${beat}`).toBe(
          true,
        );
        expect(state.activeContentVisible, `scene ${scene} beat ${beat}`).toBe(
          true,
        );
        expect(state.panelWidthDelta, `scene ${scene} beat ${beat}`).not.toBeNull();
        expect(state.panelWidthDelta!, `scene ${scene} beat ${beat}`).toBeLessThanOrEqual(2);
        expect(state.panelHeightDelta, `scene ${scene} beat ${beat}`).not.toBeNull();
        expect(state.panelHeightDelta!, `scene ${scene} beat ${beat}`).toBeLessThanOrEqual(2);
        expect(state.cloneCount, `scene ${scene} beat ${beat}`).toBe(0);
      }
    }
  });

  test("beat reveal animates existing layout items in motion scenes", async ({
    page,
  }) => {
    for (const scene of [2, 4]) {
      await openLab(page, "minimal-product-keynote", scene, 0, {
        frozen: false,
      });

      await page.keyboard.press("ArrowRight");

      const titleStartedLayoutMotion = await page.waitForFunction(
        () => {
          const title = document.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-panel"][data-active="true"] [data-beat-layout-mode="motion"] [data-beat-layout-item="true"]',
          );
          if (!title) return false;
          const computed = window.getComputedStyle(title);
          return computed.transform !== "none" || title.style.transition.includes("transform");
        },
        undefined,
        { timeout: 2000 },
      );

      expect(titleStartedLayoutMotion, `scene ${scene}`).toBeTruthy();
    }
  });

  test("reserved beat layout keeps scene 3 question slots mounted before reveal", async ({
    page,
  }) => {
    await openLab(page, "minimal-product-keynote", 3, 0, {
      frozen: false,
    });

    const reservedState = await page.evaluate(() => {
      const activePanel = document.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );
      const reserved = activePanel?.querySelector<HTMLElement>(
        '[data-beat-layout-mode="reserved"]',
      );
      const questions = Array.from(
        reserved?.querySelectorAll<HTMLElement>("li") ?? [],
      );
      return {
        hasReservedLayout: !!reserved,
        questionCount: questions.length,
        visibleCount: questions.filter(
          (item) => getComputedStyle(item).opacity === "1",
        ).length,
      };
    });

    expect(reservedState.hasReservedLayout).toBe(true);
    expect(reservedState.questionCount).toBe(3);
    expect(reservedState.visibleCount).toBe(1);
  });
});

// ─── 4: Pure mode hides chrome ─────────────────────────────────────────────

test.describe("Pure mode", () => {
  test("pure=1 renders the Stage without Player rail, top bar, or timeline", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { pure: true, frozen: true });

    await expect(
      page.getByRole("navigation", { name: "Player navigation" }),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Present" })).toHaveCount(0);
    await expect(
      page
        .locator("button[aria-haspopup='menu']")
        .filter({ hasText: "Product Keynote" }),
    ).toHaveCount(0);
    await expect(page.locator('[data-testid="player-transport"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();

    await page.keyboard.press("Control+K");
    await page.keyboard.type("?");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toHaveCount(0);
    await expect(page.getByRole("dialog", { name: "Controls" })).toHaveCount(0);
  });

  test("pure=0 restores the normal Player chrome", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { pure: false, frozen: true });

    await expect(
      page.getByRole("navigation", { name: "Player navigation" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Present" })).toBeVisible();
    await expect(page.locator('[data-testid="player-transport"]')).toBeVisible();
  });

  test("pure=1 keeps semantic headers inside the active slide visible", async ({
    page,
  }) => {
    await openLab(page, "sketch-board-emoji", 4, 4, {
      topic: "stadium-wave",
      pure: true,
      frozen: true,
    });

    await expect(
      page.locator(
        '[data-testid="spatial-scene-panel"][data-active="true"] header',
      ),
    ).toBeVisible();
  });
});

// ─── 5: Frozen mode works ──────────────────────────────────────────────────

test.describe("Frozen mode", () => {
  test("frozen=1 sets data-frozen attribute on html element", async ({
    page,
  }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const frozenAttr = await page.evaluate(() =>
      document.documentElement.getAttribute("data-frozen"),
    );
    expect(frozenAttr).toBe("true");
  });

  test("frozen=0 removes data-frozen attribute", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: false });

    const frozenAttr = await page.evaluate(() =>
      document.documentElement.getAttribute("data-frozen"),
    );
    expect(frozenAttr).toBeNull();
  });

  test("frozen mode stage is still visible", async ({ page }) => {
    await openLab(page, "front-page-broadsheet", 1, 0, { frozen: true });
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
  });
});

// ─── 6: Language toggle ────────────────────────────────────────────────────

test.describe("Language toggle", () => {
  test("selecting a language from the menu changes the current mode", async ({ page }) => {
    await openOverview(page);

    await page.getByRole("button", { name: "Language: Auto" }).click();
    const englishMenu = page.getByRole("menu", { name: "Language" });
    await expect(
      englishMenu.getByRole("menuitemradio", { name: /Auto$/ }),
    ).toHaveAttribute("aria-checked", "true");
    await englishMenu.getByRole("menuitemradio", { name: /English$/ }).click();
    await expect(page.getByRole("button", { name: "Language: EN" })).toBeVisible();

    await page.getByRole("button", { name: "Language: EN" }).click();
    await page
      .getByRole("menu", { name: "Language" })
      .getByRole("menuitemradio", { name: /中文$/ })
      .click();
    await expect(page.getByRole("button", { name: "语言: 中" })).toBeVisible();

    await page.getByRole("button", { name: "语言: 中" }).click();
    await page
      .getByRole("menu", { name: "语言" })
      .getByRole("menuitemradio", { name: /Auto$/ })
      .click();
    await expect(page.getByRole("button", { name: "Language: Auto" })).toBeVisible();
  });

  test("language persists after navigation", async ({ page }) => {
    await openOverview(page);

    await page.getByRole("button", { name: "Language: Auto" }).click();
    await page
      .getByRole("menu", { name: "Language" })
      .getByRole("menuitemradio", { name: /English$/ })
      .click();
    await expect(page.getByRole("button", { name: "Language: EN" })).toBeVisible();

    await page
      .locator('[data-topic-key="minimal-product-keynote/product-keynote"]')
      .getByRole("link")
      .click();
    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });

    await expect(page.getByRole("button", { name: "Language: EN" })).toBeVisible();
  });
});

// ─── 7: URL query persistence ───────────────────────────────────────────────

test.describe("URL query persistence", () => {
  test("query reflects current lab view state", async ({ page }) => {
    await openLab(page, "front-page-broadsheet", 3, 1, { frozen: true });

    const query = parseQueryFromUrl(page.url());
    expect(query.view).toBe("lab");
    expect(query.style).toBe("front-page-broadsheet");
    expect(query.topic).toBe(getFirstTopicId("front-page-broadsheet"));
    expect(Number(query.scene)).toBe(3);
    expect(Number(query.beat)).toBe(1);
    expect(query.frozen).toBe("1");
    expect(query.pure).toBeUndefined();
  });

  test("query updates after keyboard navigation", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 2, 0, { frozen: true });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.view).toBe("lab");
    expect(query.style).toBe("minimal-product-keynote");
    // Scene 2 has 2 beats (0, 1). From beat 0, right goes to beat 1.
    expect(Number(query.scene)).toBe(2);
    expect(Number(query.beat)).toBe(1);
  });

  test("direct query navigation loads correct style and scene", async ({
    page,
  }) => {
    const query = buildQuery({
      view: "lab",
      style: "liquid-glass",
      topic: getFirstTopicId("liquid-glass"),
      scene: 4,
      beat: 0,
      frozen: true,
    });
    await page.goto(`/${query}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });
    await page.waitForTimeout(300);

    const parsed = parseQueryFromUrl(page.url());
    expect(parsed.view).toBe("lab");
    expect(parsed.style).toBe("liquid-glass");
    expect(parsed.topic).toBe(getFirstTopicId("liquid-glass"));
    expect(Number(parsed.scene)).toBe(4);
    expect(Number(parsed.beat)).toBe(0);
  });

  test("overview query loads gallery view", async ({ page }) => {
    const query = buildQuery({ view: "overview" });
    await page.goto(`/${query}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="catalog-view"]', {
      state: "visible",
      timeout: 10000,
    });

    const parsed = parseQueryFromUrl(page.url());
    expect(parsed.view).toBe("overview");
  });

  test("pure and frozen flags are preserved in query", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { pure: true, frozen: true });

    const query = parseQueryFromUrl(page.url());
    expect(query.pure).toBe("1");
    expect(query.frozen).toBe("1");
  });
});

// ─── 8: Cross-style cycling ────────────────────────────────────────────────

test.describe("Cross-style cycling", () => {
  test("ArrowRight from last style first Topic advances to its second Topic", async ({
    page,
  }) => {
    const lastStyleId = getLastStyleId();
    const [firstTopic, secondTopic] = getTopicSequence(lastStyleId);
    if (!firstTopic || !secondTopic) {
      throw new Error(`Last Style must expose at least two Topics: ${lastStyleId}`);
    }
    const lastScene = 5;
    const lastBeat = getLastBeat(lastStyleId, lastScene, firstTopic);

    await openLab(page, lastStyleId, lastScene, lastBeat, {
      topic: firstTopic,
      frozen: true,
    });

    const queryBefore = parseQueryFromUrl(page.url());
    expect(queryBefore.style).toBe(lastStyleId);
    expect(queryBefore.topic).toBe(firstTopic);
    expect(Number(queryBefore.scene)).toBe(lastScene);
    expect(Number(queryBefore.beat)).toBe(lastBeat);

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400); // cross-style flash may take a beat

    const queryAfter = parseQueryFromUrl(page.url());
    expect(queryAfter.style).toBe(lastStyleId);
    expect(queryAfter.topic).toBe(secondTopic);
    expect(Number(queryAfter.scene)).toBe(1);
    expect(Number(queryAfter.beat)).toBe(0);
  });

  test("ArrowRight from last style final topic wraps to first style first Topic", async ({
    page,
  }) => {
    const lastStyleId = getLastStyleId();
    const firstStyleId = getFirstStyleId();
    const lastTopic = getLastTopic(lastStyleId);
    const lastBeat = getLastBeat(lastStyleId, 5, lastTopic);

    await openLab(page, lastStyleId, 5, lastBeat, {
      topic: lastTopic,
      frozen: true,
    });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);

    const queryAfter = parseQueryFromUrl(page.url());
    expect(queryAfter.style).toBe(firstStyleId);
    expect(queryAfter.topic).toBe(getFirstTopicId(firstStyleId));
    expect(Number(queryAfter.scene)).toBe(1);
    expect(Number(queryAfter.beat)).toBe(0);
  });

  test("ArrowLeft from first style first Topic wraps to last style final topic", async ({
    page,
  }) => {
    const firstStyleId = getFirstStyleId();

    await openLab(page, firstStyleId, 1, 0, {
      topic: getFirstTopicId(firstStyleId),
      frozen: true,
    });

    // Press ArrowLeft — should wrap to last style
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);

    const query = parseQueryFromUrl(page.url());
    const lastStyleId = getLastStyleId();
    const lastTopic = getLastTopic(lastStyleId);
    expect(query.style).toBe(lastStyleId);
    expect(query.topic).toBe(lastTopic);

    const expectedLastBeat = getLastBeat(lastStyleId, 5, lastTopic);
    expect(Number(query.scene)).toBe(5);
    expect(Number(query.beat)).toBe(expectedLastBeat);
  });

  test("cycling across band boundaries is topic-aware", async ({ page }) => {
    test.setTimeout(60000);
    const boundaryTransitions = getBandBoundaryTransitions();
    expect(boundaryTransitions).not.toHaveLength(0);

    for (const { from, to } of boundaryTransitions) {
      const topics = getTopicSequence(from);
      for (const [index, topic] of topics.entries()) {
        const lastBeat = getLastBeat(from, 5, topic);
        await openLab(page, from, 5, lastBeat, {
          topic,
          frozen: true,
        });

        await page.keyboard.press("ArrowRight");
        await page.waitForTimeout(400);

        const queryAfter = parseQueryFromUrl(page.url());
        const nextTopic = topics[index + 1];
        if (nextTopic) {
          expect(
            queryAfter.style,
            `${from}/${topic} should advance to ${from}/${nextTopic}`,
          ).toBe(from);
          expect(
            queryAfter.topic,
            `${from}/${topic} should advance to ${from}/${nextTopic}`,
          ).toBe(nextTopic);
        } else {
          const nextPrimaryTopic = getFirstTopicId(to);
          expect(
            queryAfter.style,
            `${from}/${topic} should advance to ${to}/${nextPrimaryTopic}`,
          ).toBe(to);
          expect(
            queryAfter.topic,
            `${from}/${topic} should advance to ${to}/${nextPrimaryTopic}`,
          ).toBe(nextPrimaryTopic);
        }
        expect(Number(queryAfter.scene)).toBe(1);
        expect(Number(queryAfter.beat)).toBe(0);
      }
    }
  });
});

// ─── 9: Catalog / overview view ────────────────────────────────────────────

test.describe("Catalog / overview view", () => {
  test("published Catalog stats reflect the generated manifest", async ({
    request,
  }) => {
    const response = await request.get("/catalog-stats.json");

    expect(response.ok()).toBe(true);
    expect(await response.json()).toEqual(CATALOG_STATS);
  });

  test("reduced motion removes visible Topic Card transitions", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openOverview(page);

    const transitionSeconds = await page
      .locator("[data-testid='topic-card'] a")
      .first()
      .evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).transitionDuration),
      );

    expect(transitionSeconds).toBeLessThanOrEqual(0.001);
  });

  test("mobile Filters render above the Catalog header", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openOverview(page);
    await page.getByRole("button", { name: "Filters" }).click();
    await page.getByRole("dialog", { name: "Filters" }).waitFor();

    const topElement = await page.evaluate(() =>
      document.elementFromPoint(12, 12)?.tagName,
    );

    expect(topElement).not.toBe("HEADER");
  });

  test("Catalog renders every generated Topic Card with its facet controls", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openOverview(page);

    await expect(page.locator('[data-testid="catalog-view"]')).toBeVisible();
    await expect(page.locator('[data-testid="catalog-filter-bar"]')).toBeVisible();
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible();
    await expect(page.getByRole("group", { name: "Category" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Model ID" })).toBeVisible();
    await expect(page.locator('[data-testid="catalog-summary"]')).toHaveText(
      `All ${CATALOG_TOPIC_COUNT} Topics · ${CATALOG_MANIFEST.length} Styles`,
    );
    await expect(page.locator('[data-testid="topic-card"]')).toHaveCount(
      CATALOG_TOPIC_COUNT,
    );

    await page.waitForTimeout(1000);
    expect(errors, `Console errors: ${errors.join("; ")}`).toEqual([]);
  });

  test("Catalog facets constrain Topic Cards and remain URL-addressable", async ({
    page,
  }) => {
    await openOverview(page);

    const selectedBand = "minimal-keynote";
    const selectedModel = "Doubao-Seed-Evolving";
    const topicsInSelectedBand = CATALOG_MANIFEST.flatMap((styleGroup) =>
      styleGroup.style.band === selectedBand ? styleGroup.topics : [],
    );
    const topicsInSelectedBandAndModel = topicsInSelectedBand.filter(
      (topic) => topic.modelId === selectedModel,
    );
    const category = page.getByRole("group", { name: "Category" });
    await category
      .getByRole("button", { name: /^Minimal Keynote,/ })
      .click();
    await expect(page.locator('[data-testid="topic-card"]')).toHaveCount(
      topicsInSelectedBand.length,
    );

    let query = parseQueryFromUrl(page.url());
    expect(query.band).toBe(selectedBand);
    expect(query.model).toBeUndefined();

    const model = page
      .getByRole("group", { name: "Model ID" })
      .getByRole("button", { name: /^Doubao-Seed-Evolving,/ });
    await model.click();
    await expect(page.locator('[data-testid="topic-card"]')).toHaveCount(
      topicsInSelectedBandAndModel.length,
    );

    query = parseQueryFromUrl(page.url());
    expect(query.band).toBe(selectedBand);
    expect(query.model).toBe(selectedModel);

    await page.getByRole("button", { name: "Clear all" }).click();
    await expect(page.locator('[data-testid="topic-card"]')).toHaveCount(
      CATALOG_TOPIC_COUNT,
    );
    query = parseQueryFromUrl(page.url());
    expect(query.band).toBeUndefined();
    expect(query.model).toBeUndefined();
  });

  test("Topic Cards are native exact links to their Scene 1 / Beat 0 destination", async ({
    page,
  }) => {
    await openOverview(page);

    const card = page.locator(
      '[data-topic-key="front-page-broadsheet/broadsheet"]',
    );
    const link = card.getByRole("link");
    await expect(link).toBeVisible();
    await expect(link).toHaveJSProperty("tagName", "A");

    const href = await link.getAttribute("href");
    const target = new URL(href ?? "", page.url());
    expect(target.pathname).toBe("/");
    expect(target.search).toBe(
      buildQuery({
        view: "lab",
        style: "front-page-broadsheet",
        topic: getFirstTopicId("front-page-broadsheet"),
        scene: 1,
        beat: 0,
      }),
    );

    await link.click();

    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });

    const query = parseQueryFromUrl(page.url());
    expect(query.view).toBe("lab");
    expect(query.style).toBe("front-page-broadsheet");
    expect(query.topic).toBe(getFirstTopicId("front-page-broadsheet"));
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);
  });
});

// ─── 10: Player / lab view ─────────────────────────────────────────────────

test.describe("Player / lab view", () => {
  test("Envelope keeps the contained Stage practical on wide and narrow screens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });
    let box = await page.locator('[data-testid="stage"]').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(1200);
    expect(box!.x).toBeGreaterThanOrEqual(47);
    expect(box!.x + box!.width).toBeLessThanOrEqual(1441);
    expect(box!.y + box!.height).toBeLessThanOrEqual(901);

    await page.setViewportSize({ width: 375, height: 812 });
    await expect
      .poll(async () =>
        (await page.locator('[data-testid="stage"]').boundingBox())?.width,
      )
      .toBeLessThanOrEqual(376);
    box = await page.locator('[data-testid="stage"]').boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(370);
    expect(box!.x).toBeGreaterThanOrEqual(-1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(376);
    await expect(page.getByRole("button", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Library" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("mobile top bar keeps Overview, Library, and Search available at 375px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    await expect(page.getByRole("button", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Library" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
  });

  test("lab view renders stage for style 01", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
    await expect(page.locator('[data-testid="player-runtime"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("lab view renders stage for the final registered style", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openLab(page, "object-metaphor-hero", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="stage"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("Player exposes rail, top bar, and an on-demand Library Drawer", async ({
    page,
  }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const rail = page.getByRole("navigation", { name: "Player navigation" });
    await expect(rail).toBeVisible();
    await expect(rail.getByRole("button", { name: "Overview" })).toBeVisible();
    await expect(rail.getByRole("button", { name: "Library" })).toBeVisible();
    await expect(rail.getByRole("button", { name: "Search" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Present" })).toBeVisible();

    const topicMenuTrigger = page
      .locator("button[aria-haspopup='menu']")
      .filter({ hasText: "Product Keynote" });
    await expect(topicMenuTrigger).toBeVisible();

    await rail.getByRole("button", { name: "Library" }).click();
    const drawer = page.getByRole("dialog", { name: "Library" });
    await expect(drawer).toBeVisible();
    await expect(
      drawer.getByRole("searchbox", {
        name: "Search styles, topics, or Model ID",
      }),
    ).toBeVisible();
    await expect(
      drawer.getByRole("button", {
        name: "Product Keynote · Doubao-Seed-Evolving",
      }),
    ).toHaveAttribute("aria-current", "page");

    await drawer
      .getByRole("button", { name: "Quiet Launch · GPT 5.5" })
      .click();
    await expect(drawer).toHaveCount(0);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(query.topic).toBe("quiet-launch");
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);
  });

  test("Player Topic menu is scoped to the current Style", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const style = CATALOG_MANIFEST.find(
      (entry) => entry.style.id === "minimal-product-keynote",
    );
    if (!style) throw new Error("Minimal Product Keynote is missing from the manifest");

    const topicMenuTrigger = page
      .locator("button[aria-haspopup='menu']")
      .filter({ hasText: "Product Keynote" });
    await topicMenuTrigger.click();
    const topicMenu = page
      .locator('[role="menu"]')
      .filter({ hasText: "Quiet Launch" });
    await expect(topicMenu).toBeVisible();
    await expect(topicMenu.getByRole("menuitemradio")).toHaveCount(
      style.topics.length,
    );
    await expect(
      topicMenu.getByRole("menuitemradio", { name: /Product Keynote/ }),
    ).toHaveAttribute("aria-checked", "true");

    await topicMenu
      .getByRole("menuitemradio", { name: /Quiet Launch/ })
      .click();
    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(query.topic).toBe("quiet-launch");
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);
  });

  test("Player timeline exposes five direct scene destinations", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="player-transport"]')).toBeVisible();

    for (let s = 1; s <= 5; s++) {
      const sceneDestination = page.locator(`[data-testid="scene-dot-${s}"]`);
      await expect(sceneDestination).toBeVisible();
      await expect(sceneDestination).toHaveAttribute("aria-label", `Scene ${s}`);
    }
    await expect(page.locator('[data-testid="scene-dot-1"]')).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  test("Player Retry reloads the exact destination after a Topic chunk failure", async ({
    page,
  }) => {
    let chunkAttempts = 0;
    await page.route(
      /\/assets\/product-keynote-[^/]+\.js(?:\?.*)?$/,
      async (route) => {
        chunkAttempts += 1;
        if (chunkAttempts === 1) {
          await route.abort("failed");
          return;
        }
        await route.continue();
      },
    );

    const query = buildQuery({
      view: "lab",
      style: "minimal-product-keynote",
      topic: "product-keynote",
      scene: 1,
      beat: 0,
      frozen: true,
    });
    await page.goto(`/${query}`, { waitUntil: "domcontentloaded" });
    await expect(page.getByText("Slides failed to load")).toBeVisible();
    await page.getByRole("button", { name: "Retry" }).click();

    await expect(page.locator('[data-player-state="ready"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
    expect(chunkAttempts).toBeGreaterThanOrEqual(2);
    expect(new URL(page.url()).search).toBe(query);
  });

  test("bottom bar next/prev buttons are functional", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const nextBtn = page.locator('[data-testid="next-button"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForTimeout(200);

    // Style 01 scene 1 has 1 beat, so from beat 0 it advances to scene 2 beat 0
    const query = parseQueryFromUrl(page.url());
    expect(Number(query.scene)).toBe(2);
    expect(Number(query.beat)).toBe(0);

    // Prev button should go back
    const prevBtn = page.locator('[data-testid="prev-button"]');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await page.waitForTimeout(200);

    const queryBack = parseQueryFromUrl(page.url());
    expect(Number(queryBack.scene)).toBe(1);
    expect(Number(queryBack.beat)).toBe(0);
  });

  test("clicking scene dot jumps to that scene", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const dot4 = page.locator('[data-testid="scene-dot-4"]');
    await expect(dot4).toBeVisible();
    await dot4.click();
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(Number(query.scene)).toBe(4);
    expect(Number(query.beat)).toBe(0);
  });

  test("beat counter reflects current position", async ({ page }) => {
    // Style 01 scene 3 has 3 beats
    await openLab(page, "minimal-product-keynote", 3, 1, { frozen: true });

    const beatCounter = page.locator('[data-testid="beat-counter"]');
    await expect(beatCounter).toBeVisible();
    const text = await beatCounter.textContent();
    expect(text).toBe("2/3"); // beat index 1 → display "2/3"
  });

});
