import { test, expect, Page } from "@playwright/test";

// ── Style beat count metadata ──────────────────────────────────────────────

interface StyleBeatInfo {
  id: string;
  beats: Record<number, number>; // sceneId -> beat count
}

const STYLE_BEATS: StyleBeatInfo[] = [
  { id: "minimal-product-keynote", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "objective-swiss-grid", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "wabi-sabi-ceramic", beats: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 1 } },
  { id: "interactive-dialogue-stage", beats: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 2 } },
  { id: "cyanotype-drafting-table", beats: { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 } },
  { id: "kinetic-type-punchline", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "sketch-board-emoji", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "spotlight-quote-poster", beats: { 1: 2, 2: 2, 3: 2, 4: 3, 5: 1 } },
  { id: "subway-map-of-intent", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "benchmark-matrix", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "signal-pipeline-flow", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "engineering-whiteboard-explainer", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 2 } },
  { id: "soft-pastel-friendly", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "kitchen-prep-station", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "collaborative-pairing-board", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "studio-mixing-console", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "debug-reaction-board", beats: { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 } },
  { id: "front-page-broadsheet", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "magazine-masthead", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "warm-editorial-feature", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "scholars-vellum", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "solar-biennale-poster", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "duotone-session", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2 } },
  { id: "riso-print-zine", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "analog-cutout-collage", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "woodblock-floating-world", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "botanical-specimen-plate", beats: { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 } },
  { id: "machine-age-deco", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "expedition-screenprint", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "cassette-era-packaging", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "neo-brutalist-bulletin", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "red-wedge-agitprop", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "mechanical-scoring-funnel", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "liquid-glass", beats: { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 } },
  { id: "retro-windows", beats: { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 } },
  { id: "mid-century-grove", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "after-hours-luxe", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "operating-manual", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "widescreen-title-card", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "blackboard-chalk-talk", beats: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 3 } },
  { id: "arcade-boss-fight", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "research-memo", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "decision-record", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "maintainer-issue-brief", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "field-notes-report", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "annotated-source-diff", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 3 } },
  { id: "checklist-ledger", beats: { 1: 1, 2: 2, 3: 3, 4: 3, 5: 2 } },
  { id: "context-bento-box", beats: { 1: 1, 2: 2, 3: 3, 4: 3, 5: 2 } },
  { id: "object-metaphor-hero", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 2 } },
];

const ALL_STYLE_IDS = STYLE_BEATS.map((s) => s.id);
const PRIMARY_TOPIC_BY_STYLE: Record<string, string> = {
  "minimal-product-keynote": "product-keynote",
  "objective-swiss-grid": "swiss-grid",
  "wabi-sabi-ceramic": "ceramic-calm",
  "interactive-dialogue-stage": "dialogue-stage",
  "cyanotype-drafting-table": "blueprint",
  "kinetic-type-punchline": "type-poster",
  "sketch-board-emoji": "workshop-board",
  "spotlight-quote-poster": "quote-poster",
  "subway-map-of-intent": "subway-flow",
  "benchmark-matrix": "benchmark",
  "signal-pipeline-flow": "pipeline",
  "engineering-whiteboard-explainer": "from-prompt-to-patch",
  "soft-pastel-friendly": "friendly-onboard",
  "kitchen-prep-station": "prep-station",
  "collaborative-pairing-board": "pairing-board",
  "studio-mixing-console": "mixing-console",
  "debug-reaction-board": "debug-board",
  "front-page-broadsheet": "broadsheet",
  "magazine-masthead": "masthead",
  "warm-editorial-feature": "editorial-feature",
  "scholars-vellum": "scholar-notes",
  "solar-biennale-poster": "biennale-poster",
  "duotone-session": "session-poster",
  "riso-print-zine": "riso-zine",
  "analog-cutout-collage": "cutout-collage",
  "woodblock-floating-world": "woodblock",
  "botanical-specimen-plate": "specimen-plate",
  "machine-age-deco": "deco-gala",
  "expedition-screenprint": "expedition-print",
  "cassette-era-packaging": "cassette-pack",
  "neo-brutalist-bulletin": "brutalist-bulletin",
  "red-wedge-agitprop": "red-wedge",
  "mechanical-scoring-funnel": "scoring-funnel",
  "liquid-glass": "liquid-glass",
  "retro-windows": "retro-desktop",
  "mid-century-grove": "botanical-brand",
  "after-hours-luxe": "after-hours",
  "operating-manual": "manual",
  "widescreen-title-card": "title-card",
  "blackboard-chalk-talk": "chalk-talk",
  "arcade-boss-fight": "boss-fight",
  "research-memo": "research-memo",
  "decision-record": "decision-record",
  "maintainer-issue-brief": "issue-brief",
  "field-notes-report": "field-notes",
  "annotated-source-diff": "source-diff",
  "checklist-ledger": "checklist-ledger",
  "context-bento-box": "context-bento",
  "object-metaphor-hero": "object-metaphor",
};
const SECONDARY_TOPIC_BY_STYLE: Record<string, string> = {
  "minimal-product-keynote": "quiet-launch",
  "objective-swiss-grid": "clean-metrics",
  "wabi-sabi-ceramic": "repair-strategy",
  "interactive-dialogue-stage": "better-question",
  "cyanotype-drafting-table": "resilience-plan",
  "kinetic-type-punchline": "one-constraint",
  "sketch-board-emoji": "human-loop",
  "spotlight-quote-poster": "kept-sentence",
  "subway-map-of-intent": "release-tracks",
  "benchmark-matrix": "durable-tool",
  "signal-pipeline-flow": "event-insight",
  "soft-pastel-friendly": "breathing-onboard",
  "kitchen-prep-station": "clean-brief",
  "collaborative-pairing-board": "shared-artifact",
  "studio-mixing-console": "operating-model",
  "debug-reaction-board": "learning-incident",
  "front-page-broadsheet": "after-launch",
  "magazine-masthead": "product-cover",
  "warm-editorial-feature": "useful-week",
  "scholars-vellum": "margin-argument",
  "solar-biennale-poster": "public-light",
  "duotone-session": "five-takes",
  "riso-print-zine": "community-print",
  "analog-cutout-collage": "rebuilt-archive",
  "woodblock-floating-world": "tide-map",
  "botanical-specimen-plate": "growth-signals",
  "machine-age-deco": "infrastructure-gala",
  "expedition-screenprint": "field-route",
  "cassette-era-packaging": "release-mixtape",
  "neo-brutalist-bulletin": "hard-thing",
  "red-wedge-agitprop": "org-move",
  "mechanical-scoring-funnel": "priority-score",
  "liquid-glass": "spatial-brief",
  "retro-windows": "toolchain-desk",
  "mid-century-grove": "calm-growth",
  "after-hours-luxe": "beta-salon",
  "operating-manual": "habit-runbook",
  "widescreen-title-card": "system-acts",
  "blackboard-chalk-talk": "shortcut",
  "arcade-boss-fight": "latency-boss",
  "research-memo": "small-team",
  "decision-record": "boundary",
  "maintainer-issue-brief": "agent-pickup",
  "field-notes-report": "platform-study",
  "annotated-source-diff": "flow-rewrite",
  "checklist-ledger": "launch-ledger",
  "context-bento-box": "handoff-box",
  "object-metaphor-hero": "recovery-kit",
};
const COORDINATED_TOPIC_BY_STYLE: Record<string, string> = {
  "minimal-product-keynote": "presolar-grain",
  "interactive-dialogue-stage": "vocal-folds",
  "cyanotype-drafting-table": "comet-anatomy",
  "kinetic-type-punchline": "before-a",
  "sketch-board-emoji": "stadium-wave",
  "subway-map-of-intent": "tea-cha-routes",
  "engineering-whiteboard-explainer": "water-tower",
  "front-page-broadsheet": "rogue-wave",
  "scholars-vellum": "hidden-text",
  "botanical-specimen-plate": "leaf-stomata",
  "mechanical-scoring-funnel": "snowflake-branches",
  "expedition-screenprint": "saharan-dust",
  "red-wedge-agitprop": "pneumatic-post",
  "liquid-glass": "safety-glass",
  "retro-windows": "voyager-boundary",
  "after-hours-luxe": "urushi-cure",
  "operating-manual": "escapement",
  "widescreen-title-card": "whale-fall",
  "research-memo": "impact-evidence",
  "object-metaphor-hero": "cocoon-to-cloth",
  "blackboard-chalk-talk": "hearing-path",
};
const SECONDARY_TOPIC_SCENE_5_LAST_BEAT: Record<string, number> = {
  "minimal-product-keynote": 1,
  "spotlight-quote-poster": 2,
  "debug-reaction-board": 2,
  "analog-cutout-collage": 2,
  "mechanical-scoring-funnel": 2,
  "arcade-boss-fight": 3,
  "object-metaphor-hero": 0,
};
const COORDINATED_TOPIC_SCENE_5_LAST_BEAT: Record<string, number> = {
  "minimal-product-keynote": 1,
  "interactive-dialogue-stage": 0,
  "cyanotype-drafting-table": 0,
  "kinetic-type-punchline": 3,
  "sketch-board-emoji": 0,
  "subway-map-of-intent": 0,
  "engineering-whiteboard-explainer": 3,
  "front-page-broadsheet": 0,
  "scholars-vellum": 0,
  "botanical-specimen-plate": 0,
  "mechanical-scoring-funnel": 3,
  "expedition-screenprint": 0,
  "red-wedge-agitprop": 0,
  "liquid-glass": 0,
  "retro-windows": 0,
  "after-hours-luxe": 1,
  "operating-manual": 0,
  "widescreen-title-card": 3,
  "research-memo": 0,
  "object-metaphor-hero": 1,
  "blackboard-chalk-talk": 3,
};
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
  pure?: boolean;
  frozen?: boolean;
}): string {
  const search = new URLSearchParams();
  search.set("view", params.view);
  if (params.style) search.set("style", params.style);
  if (params.topic) search.set("topic", params.topic);
  if (params.scene !== undefined) search.set("scene", String(params.scene));
  if (params.beat !== undefined) search.set("beat", String(params.beat));
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
    topic: opts.topic ?? PRIMARY_TOPIC_BY_STYLE[styleId],
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
  await page.waitForSelector('[data-testid="overview-view"]', {
    state: "visible",
    timeout: 10000,
  });
  await page.waitForTimeout(500);
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

/** Get the last beat index (0-based) for a given style/topic and scene. */
function getLastBeat(
  styleId: string,
  scene: number,
  topicId: string = PRIMARY_TOPIC_BY_STYLE[styleId],
): number {
  if (
    topicId === COORDINATED_TOPIC_BY_STYLE[styleId] &&
    scene === 5 &&
    styleId in COORDINATED_TOPIC_SCENE_5_LAST_BEAT
  ) {
    return COORDINATED_TOPIC_SCENE_5_LAST_BEAT[styleId];
  }
  if (
    topicId === SECONDARY_TOPIC_BY_STYLE[styleId] &&
    scene === 5 &&
    styleId in SECONDARY_TOPIC_SCENE_5_LAST_BEAT
  ) {
    return SECONDARY_TOPIC_SCENE_5_LAST_BEAT[styleId];
  }

  const info = STYLE_BEATS.find((s) => s.id === styleId);
  if (!info) return 0;
  const count = info.beats[scene] ?? 1;
  return count - 1; // convert count to 0-based index
}

function getTopicSequence(styleId: string): string[] {
  return [
    PRIMARY_TOPIC_BY_STYLE[styleId],
    SECONDARY_TOPIC_BY_STYLE[styleId],
    COORDINATED_TOPIC_BY_STYLE[styleId],
  ].filter((topicId): topicId is string => Boolean(topicId));
}

function getLastTopic(styleId: string): string {
  const topics = getTopicSequence(styleId);
  return topics[topics.length - 1];
}

/** Get the first scene with multiple beats for a given style. */
function getFirstMultiBeatScene(style: StyleBeatInfo): number {
  const entry = Object.entries(style.beats).find(([, count]) => count > 1);
  return entry ? Number(entry[0]) : 1;
}

// ── Tests ──────────────────────────────────────────────────────────────────

// ─── 1 & 2: All registered styles — console errors + overflow (parallel) ───

test.describe.parallel("Style audit — all registered styles", () => {
  for (const style of STYLE_BEATS) {
    test(`style ${style.id} scene 1 beat 0 — no console errors, no overflow`, async ({
      page,
    }) => {
      const errors = attachErrorCollector(page);

      await openLab(page, style.id, 1, 0, { frozen: true });

      // Verify stage is rendered
      await expect(page.locator('[data-testid="stage"]')).toBeVisible();
      await expect(page.locator('[data-testid="spatial-scene-track"]')).toBeVisible();

      // Give lazy-loaded assets a beat to finish
      await page.waitForTimeout(800);

      // Assert no console / page errors
      expect(
        errors,
        `Console errors in style ${style.id}: ${errors.join("; ")}`,
      ).toEqual([]);

      // Assert no horizontal or vertical overflow beyond 2px tolerance
      const { overflowX, overflowY } = await measureOverflow(page);
      expect(
        overflowX,
        `Style ${style.id} scene 1 overflows horizontally by ${overflowX}px`,
      ).toBeLessThanOrEqual(2);
      expect(
        overflowY,
        `Style ${style.id} scene 1 overflows vertically by ${overflowY}px`,
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
        `Style ${style.id} must keep spatial scene panels mounted`,
      ).toBeGreaterThanOrEqual(5);
      expect(
        SCENE_TRANSITION_KINDS,
        `Style ${style.id} must expose a supported scene transition kind`,
      ).toContain(transitionState.transitionKind);
      expect(transitionState.activeScene, `Style ${style.id}`).toBe("1");
      expect(transitionState.activeState, `Style ${style.id}`).toBe("active");
      expect(
        transitionState.cloneCount,
        `Style ${style.id} must not render outgoing transition clones`,
      ).toBe(0);
    });

    test(`style ${style.id} first multi-beat scene declares beat layout mode`, async ({
      page,
    }) => {
      const scene = getFirstMultiBeatScene(style);

      await openLab(page, style.id, scene, 0, { frozen: true });
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

      expect(layoutState.activeScene, `Style ${style.id}`).toBe(String(scene));
      expect(
        layoutState.layoutMode,
        `Style ${style.id} scene ${scene} must declare a beat layout mode`,
      ).toMatch(/^(motion|reserved)$/);
    });
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

    await page.locator('[data-testid="stage"]').click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(2);
    expect(Number(query.beat)).toBe(0);
  });

  test("Space with sidebar focus advances the current slide without activating the focused sidebar item", async ({
    page,
  }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    const bandToggle = page.locator('[data-testid="band-toggle-editorial-print"]');
    if (await bandToggle.isVisible()) {
      const expanded = await bandToggle.getAttribute("aria-expanded");
      if (expanded === "false") await bandToggle.click();
    }

    const sidebarItem = page.locator('[data-testid="sidebar-style-front-page-broadsheet"]');
    await expect(sidebarItem).toBeVisible({ timeout: 5000 });
    await sidebarItem.focus();
    await page.keyboard.press("Space");
    await page.waitForTimeout(200);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("minimal-product-keynote");
    expect(Number(query.scene)).toBe(2);
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
      topic: PRIMARY_TOPIC_BY_STYLE["objective-swiss-grid"],
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

  test("every primary topic frame keeps active content inside the stage", async ({
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
  test("pure=1 hides header and sidebar", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { pure: true, frozen: true });

    // Header and sidebar wrapper divs should have display:none
    await expect(page.locator('[data-testid="header"]')).toBeHidden();
    await expect(page.locator('[data-testid="sidebar"]')).toBeHidden();

    // Stage should still be visible
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
  });

  test("pure=0 shows header and sidebar", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { pure: false, frozen: true });

    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
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
  test("clicking language segments changes selection", async ({ page }) => {
    await openOverview(page);

    const autoSeg = page.locator('[data-testid="lang-segment-auto"]');
    const enSeg = page.locator('[data-testid="lang-segment-en"]');
    const zhSeg = page.locator('[data-testid="lang-segment-zh"]');

    // Segments should be visible
    await expect(autoSeg).toBeVisible();
    await expect(enSeg).toBeVisible();
    await expect(zhSeg).toBeVisible();

    // Initial state: "auto" should be selected
    await expect(autoSeg).toHaveAttribute("aria-pressed", "true");
    await expect(enSeg).toHaveAttribute("aria-pressed", "false");
    await expect(zhSeg).toHaveAttribute("aria-pressed", "false");

    // Click EN
    await enSeg.click();
    await page.waitForTimeout(200);
    await expect(autoSeg).toHaveAttribute("aria-pressed", "false");
    await expect(enSeg).toHaveAttribute("aria-pressed", "true");
    await expect(zhSeg).toHaveAttribute("aria-pressed", "false");

    // Click ZH
    await zhSeg.click();
    await page.waitForTimeout(200);
    await expect(autoSeg).toHaveAttribute("aria-pressed", "false");
    await expect(enSeg).toHaveAttribute("aria-pressed", "false");
    await expect(zhSeg).toHaveAttribute("aria-pressed", "true");

    // Click Auto to go back
    await autoSeg.click();
    await page.waitForTimeout(200);
    await expect(autoSeg).toHaveAttribute("aria-pressed", "true");
    await expect(enSeg).toHaveAttribute("aria-pressed", "false");
    await expect(zhSeg).toHaveAttribute("aria-pressed", "false");
  });

  test("language persists after navigation", async ({ page }) => {
    await openOverview(page);

    const enSegOverview = page.locator('[data-testid="lang-segment-en"]');
    // Switch to EN
    await enSegOverview.click();
    await page.waitForTimeout(200);
    await expect(enSegOverview).toHaveAttribute("aria-pressed", "true");

    // Navigate to a style
    await page.locator('[data-testid="style-card-minimal-product-keynote"]').click();
    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });
    await page.waitForTimeout(300);

    // Language should still be EN
    const enSegLab = page.locator('[data-testid="lang-segment-en"]');
    await expect(enSegLab).toHaveAttribute("aria-pressed", "true");
    const zhSegLab = page.locator('[data-testid="lang-segment-zh"]');
    await expect(zhSegLab).toHaveAttribute("aria-pressed", "false");
  });
});

// ─── 7: URL query persistence ───────────────────────────────────────────────

test.describe("URL query persistence", () => {
  test("query reflects current lab view state", async ({ page }) => {
    await openLab(page, "front-page-broadsheet", 3, 1, { frozen: true });

    const query = parseQueryFromUrl(page.url());
    expect(query.view).toBe("lab");
    expect(query.style).toBe("front-page-broadsheet");
    expect(query.topic).toBe(PRIMARY_TOPIC_BY_STYLE["front-page-broadsheet"]);
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
      topic: PRIMARY_TOPIC_BY_STYLE["liquid-glass"],
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
    expect(parsed.topic).toBe(PRIMARY_TOPIC_BY_STYLE["liquid-glass"]);
    expect(Number(parsed.scene)).toBe(4);
    expect(Number(parsed.beat)).toBe(0);
  });

  test("overview query loads gallery view", async ({ page }) => {
    const query = buildQuery({ view: "overview" });
    await page.goto(`/${query}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="overview-view"]', {
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
  test("ArrowRight from last style primary topic advances to its secondary topic", async ({
    page,
  }) => {
    const lastStyleId = ALL_STYLE_IDS[ALL_STYLE_IDS.length - 1]; // "object-metaphor-hero"
    const primaryTopic = PRIMARY_TOPIC_BY_STYLE[lastStyleId];
    const secondaryTopic = SECONDARY_TOPIC_BY_STYLE[lastStyleId];
    const lastScene = 5;
    const lastBeat = getLastBeat(lastStyleId, lastScene, primaryTopic);

    await openLab(page, lastStyleId, lastScene, lastBeat, {
      topic: primaryTopic,
      frozen: true,
    });

    const queryBefore = parseQueryFromUrl(page.url());
    expect(queryBefore.style).toBe(lastStyleId);
    expect(queryBefore.topic).toBe(primaryTopic);
    expect(Number(queryBefore.scene)).toBe(lastScene);
    expect(Number(queryBefore.beat)).toBe(lastBeat);

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400); // cross-style flash may take a beat

    const queryAfter = parseQueryFromUrl(page.url());
    expect(queryAfter.style).toBe(lastStyleId);
    expect(queryAfter.topic).toBe(secondaryTopic);
    expect(Number(queryAfter.scene)).toBe(1);
    expect(Number(queryAfter.beat)).toBe(0);
  });

  test("ArrowRight from last style final topic wraps to first style primary topic", async ({
    page,
  }) => {
    const lastStyleId = ALL_STYLE_IDS[ALL_STYLE_IDS.length - 1]; // "object-metaphor-hero"
    const lastTopic = getLastTopic(lastStyleId);
    const lastBeat = getLastBeat(lastStyleId, 5, lastTopic);

    await openLab(page, lastStyleId, 5, lastBeat, {
      topic: lastTopic,
      frozen: true,
    });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400);

    const queryAfter = parseQueryFromUrl(page.url());
    expect(queryAfter.style).toBe("minimal-product-keynote");
    expect(queryAfter.topic).toBe(PRIMARY_TOPIC_BY_STYLE["minimal-product-keynote"]);
    expect(Number(queryAfter.scene)).toBe(1);
    expect(Number(queryAfter.beat)).toBe(0);
  });

  test("ArrowLeft from first style primary topic wraps to last style final topic", async ({
    page,
  }) => {
    const firstStyleId = ALL_STYLE_IDS[0]; // "minimal-product-keynote"

    await openLab(page, firstStyleId, 1, 0, {
      topic: PRIMARY_TOPIC_BY_STYLE[firstStyleId],
      frozen: true,
    });

    // Press ArrowLeft — should wrap to last style
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);

    const query = parseQueryFromUrl(page.url());
    const lastStyleId = ALL_STYLE_IDS[ALL_STYLE_IDS.length - 1];
    const lastTopic = getLastTopic(lastStyleId);
    expect(query.style).toBe(lastStyleId);
    expect(query.topic).toBe(lastTopic);

    const expectedLastBeat = getLastBeat(lastStyleId, 5, lastTopic);
    expect(Number(query.scene)).toBe(5);
    expect(Number(query.beat)).toBe(expectedLastBeat);
  });

  test("cycling across band boundaries is topic-aware", async ({ page }) => {
    // Test cross-style cycling at band boundaries (most likely to break).
    // Each transition: openLab to the "from" style's last position, then
    // ArrowRight to advance. openLab does a full page goto + waitForSelector
    // + 300ms settle, which gives React time to initialize from the query.
    const boundaryTransitions = [
      { from: "spotlight-quote-poster", to: "subway-map-of-intent" },  // Minimal Keynote → Balanced Hybrid
      { from: "debug-reaction-board", to: "front-page-broadsheet" },  // Balanced Hybrid → Editorial & Print
      { from: "analog-cutout-collage", to: "woodblock-floating-world" },  // Editorial & Print → Craft & Cultural
      { from: "mechanical-scoring-funnel", to: "liquid-glass" },  // Craft & Cultural → Contemporary Digital
      { from: "arcade-boss-fight", to: "research-memo" },  // Contemporary Digital → Text Report
      { from: "object-metaphor-hero", to: "minimal-product-keynote" },  // Text Report → Minimal Keynote (wrap)
    ];

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
          expect(queryAfter.style).toBe(from);
          expect(queryAfter.topic).toBe(nextTopic);
        } else {
          expect(queryAfter.style).toBe(to);
          expect(queryAfter.topic).toBe(PRIMARY_TOPIC_BY_STYLE[to]);
        }
        expect(Number(queryAfter.scene)).toBe(1);
        expect(Number(queryAfter.beat)).toBe(0);
      }
    }
  });
});

// ─── 9: Gallery view (overview) loads ──────────────────────────────────────

test.describe("Gallery / overview view", () => {
  test("overview view renders all registered style cards", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openOverview(page);

    await expect(page.locator('[data-testid="overview-view"]')).toBeVisible();

    for (const id of ALL_STYLE_IDS) {
      await expect
        .soft(page.locator(`[data-testid="style-card-${id}"]`), `style-card-${id} missing`)
        .toBeVisible({ timeout: 5000 });
    }

    // No console errors
    await page.waitForTimeout(1000);
    expect(errors, `Console errors: ${errors.join("; ")}`).toEqual([]);
  });

  test("clicking a style card navigates to lab view for that style", async ({
    page,
  }) => {
    await openOverview(page);

    const card = page.locator('[data-testid="style-card-front-page-broadsheet"]');
    await expect(card).toBeVisible();
    await card.click();

    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });
    await page.waitForTimeout(300);

    const query = parseQueryFromUrl(page.url());
    expect(query.view).toBe("lab");
    expect(query.style).toBe("front-page-broadsheet");
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);
  });

  test("overview title text is visible", async ({ page }) => {
    await openOverview(page);
    // The heading inside overview-view says "Style Overview" (en) or "风格总览" (zh)
    await expect(page.locator('[data-testid="overview-view"] h1').first()).toBeVisible();
  });
});

// ─── 10: Cinema view (lab) loads ───────────────────────────────────────────

test.describe("Cinema / lab view", () => {
  test("lab view renders stage for style 01", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
    await expect(page.locator('[data-testid="lab-view"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("lab view renders stage for style 48 (last style)", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openLab(page, "object-metaphor-hero", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="stage"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("lab view shows bottom bar with scene dots", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="bottom-bar"]')).toBeVisible();

    // All 5 scene dots should be present
    for (let s = 1; s <= 5; s++) {
      await expect(page.locator(`[data-testid="scene-dot-${s}"]`)).toBeVisible();
    }
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

  test("sidebar style items are visible and clickable", async ({ page }) => {
    await openLab(page, "minimal-product-keynote", 1, 0, { frozen: true });

    // Make sure the editorial-print band is expanded (style 17 lives there)
    const bandToggle = page.locator('[data-testid="band-toggle-editorial-print"]');
    if (await bandToggle.isVisible()) {
      const expanded = await bandToggle.getAttribute("aria-expanded");
      if (expanded === "false") await bandToggle.click();
    }

    const sidebarItem = page.locator('[data-testid="sidebar-style-front-page-broadsheet"]');
    await expect(sidebarItem).toBeVisible({ timeout: 5000 });
    await sidebarItem.click();
    await page.waitForTimeout(300);

    const query = parseQueryFromUrl(page.url());
    expect(query.style).toBe("front-page-broadsheet");
    expect(Number(query.scene)).toBe(1);
    expect(Number(query.beat)).toBe(0);
  });
});
