import { test, expect, Page } from "@playwright/test";

// ── Style beat count metadata ──────────────────────────────────────────────

interface StyleBeatInfo {
  id: string;
  beats: Record<number, number>; // sceneId -> beat count
}

const STYLE_BEATS: StyleBeatInfo[] = [
  { id: "01", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "02", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "03", beats: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 1 } },
  { id: "04", beats: { 1: 1, 2: 2, 3: 2, 4: 3, 5: 2 } },
  { id: "05", beats: { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 } },
  { id: "06", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "07", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "08", beats: { 1: 2, 2: 2, 3: 2, 4: 3, 5: 1 } },
  { id: "09", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "10", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "11", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "12", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "13", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "14", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "15", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "16", beats: { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 } },
  { id: "17", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "18", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "19", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "20", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "21", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "22", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 2 } },
  { id: "23", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "24", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "25", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "26", beats: { 1: 1, 2: 3, 3: 2, 4: 3, 5: 1 } },
  { id: "27", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "28", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "29", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "30", beats: { 1: 1, 2: 3, 3: 3, 4: 2, 5: 1 } },
  { id: "31", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "32", beats: { 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 } },
  { id: "33", beats: { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 } },
  { id: "34", beats: { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 } },
  { id: "35", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 } },
  { id: "36", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "37", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "38", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "39", beats: { 1: 1, 2: 2, 3: 2, 4: 1, 5: 3 } },
  { id: "40", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "41", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "42", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "43", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 1 } },
  { id: "44", beats: { 1: 1, 2: 2, 3: 2, 4: 2, 5: 1 } },
  { id: "45", beats: { 1: 1, 2: 2, 3: 3, 4: 2, 5: 3 } },
  { id: "46", beats: { 1: 1, 2: 2, 3: 3, 4: 3, 5: 2 } },
  { id: "47", beats: { 1: 1, 2: 2, 3: 3, 4: 3, 5: 2 } },
  { id: "48", beats: { 1: 1, 2: 3, 3: 2, 4: 2, 5: 2 } },
];

const ALL_STYLE_IDS = STYLE_BEATS.map((s) => s.id);

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build URL hash string from params. Format: #view=lab&style=01&scene=1&beat=0 */
function buildHash(params: {
  view: string;
  style?: string;
  scene?: number;
  beat?: number;
  pure?: boolean;
  frozen?: boolean;
}): string {
  const parts = [`view=${params.view}`];
  if (params.style) parts.push(`style=${params.style}`);
  if (params.scene !== undefined) parts.push(`scene=${params.scene}`);
  if (params.beat !== undefined) parts.push(`beat=${params.beat}`);
  parts.push(`pure=${params.pure ? "1" : "0"}`);
  parts.push(`frozen=${params.frozen ? "1" : "0"}`);
  return `#${parts.join("&")}`;
}

/** Parse current URL hash into a key-value map. */
function parseHashFromUrl(url: string): Record<string, string> {
  const hashIdx = url.indexOf("#");
  if (hashIdx === -1) return {};
  const hash = url.slice(hashIdx + 1);
  const params = new URLSearchParams(hash);
  const result: Record<string, string> = {};
  params.forEach((v, k) => {
    result[k] = v;
  });
  return result;
}

/** Navigate to a lab view with the given style/scene/beat via hash. */
async function openLab(
  page: Page,
  styleId: string,
  scene: number,
  beat: number,
  opts: { pure?: boolean; frozen?: boolean } = {},
) {
  const hash = buildHash({
    view: "lab",
    style: styleId,
    scene,
    beat,
    pure: opts.pure ?? false,
    frozen: opts.frozen ?? false,
  });
  await page.goto(`/${hash}`, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="stage"]', {
    state: "visible",
    timeout: 10000,
  });
  // Give components a beat to settle after mount
  await page.waitForTimeout(300);
}

/** Navigate to overview (gallery) view via hash. */
async function openOverview(page: Page) {
  const hash = buildHash({ view: "overview" });
  await page.goto(`/${hash}`, { waitUntil: "networkidle" });
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

/** Get the last beat index (0-based) for a given style and scene. */
function getLastBeat(styleId: string, scene: number): number {
  const info = STYLE_BEATS.find((s) => s.id === styleId);
  if (!info) return 0;
  const count = info.beats[scene] ?? 1;
  return count - 1; // convert count to 0-based index
}

// ── Tests ──────────────────────────────────────────────────────────────────

// ─── 1 & 2: All 48 styles — console errors + overflow (parallel) ───────────

test.describe.parallel("Style audit — all 48 styles", () => {
  for (const style of STYLE_BEATS) {
    test(`style ${style.id} scene 1 beat 0 — no console errors, no overflow`, async ({
      page,
    }) => {
      const errors = attachErrorCollector(page);

      await openLab(page, style.id, 1, 0, { frozen: true });

      // Verify stage is rendered
      await expect(page.locator('[data-testid="stage"]')).toBeVisible();

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
    });
  }
});

// ─── 3: Navigation — keyboard arrows advance scenes ────────────────────────

test.describe("Navigation", () => {
  test("ArrowRight advances beat within scene", async ({ page }) => {
    // Style 01 scene 2 has 2 beats (ids 0, 1). From beat 0, right should go to beat 1.
    await openLab(page, "01", 2, 0, { frozen: true });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    const hash = parseHashFromUrl(page.url());
    expect(hash.style).toBe("01");
    expect(Number(hash.scene)).toBe(2);
    expect(Number(hash.beat)).toBe(1);
  });

  test("ArrowRight advances to next scene when at last beat", async ({
    page,
  }) => {
    // Style 01 scene 2 has 2 beats (ids 0, 1). Last beat = 1.
    const lastBeat = getLastBeat("01", 2);
    await openLab(page, "01", 2, lastBeat, { frozen: true });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    const hash = parseHashFromUrl(page.url());
    expect(hash.style).toBe("01");
    expect(Number(hash.scene)).toBe(3);
    expect(Number(hash.beat)).toBe(0);
  });

  test("ArrowLeft goes to previous beat", async ({ page }) => {
    // Style 01 scene 3 has 3 beats (ids 0, 1, 2). Start at beat 2.
    await openLab(page, "01", 3, 2, { frozen: true });

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(200);

    const hash = parseHashFromUrl(page.url());
    expect(hash.style).toBe("01");
    expect(Number(hash.scene)).toBe(3);
    expect(Number(hash.beat)).toBe(1);
  });

  test("ArrowLeft at scene 1 beat 0 wraps to previous style", async ({ page }) => {
    // At style 02 scene 1 beat 0, ArrowLeft should go to style 01 last position
    await openLab(page, "02", 1, 0, { frozen: true });

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(300);

    const hash = parseHashFromUrl(page.url());
    expect(hash.style).toBe("01");
    // Should be at the last scene (5) and last beat of style 01
    // Style 01 scene 5 has 1 beat → last beat = 0
    expect(Number(hash.scene)).toBe(5);
    expect(Number(hash.beat)).toBe(getLastBeat("01", 5));
  });

  test("ArrowRight advances through multiple scenes within same style", async ({
    page,
  }) => {
    // Start at style 01 scene 1 beat 0
    await openLab(page, "01", 1, 0, { frozen: true });

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

    const hash = parseHashFromUrl(page.url());
    expect(hash.style).toBe("01");
    expect(Number(hash.scene)).toBe(5);
    expect(Number(hash.beat)).toBe(0);
  });
});

// ─── 4: Pure mode hides chrome ─────────────────────────────────────────────

test.describe("Pure mode", () => {
  test("pure=1 hides header and sidebar", async ({ page }) => {
    await openLab(page, "01", 1, 0, { pure: true, frozen: true });

    // Header and sidebar wrapper divs should have display:none
    await expect(page.locator('[data-testid="header"]')).toBeHidden();
    await expect(page.locator('[data-testid="sidebar"]')).toBeHidden();

    // Stage should still be visible
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
  });

  test("pure=0 shows header and sidebar", async ({ page }) => {
    await openLab(page, "01", 1, 0, { pure: false, frozen: true });

    await expect(page.locator('[data-testid="header"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });
});

// ─── 5: Frozen mode works ──────────────────────────────────────────────────

test.describe("Frozen mode", () => {
  test("frozen=1 sets data-frozen attribute on html element", async ({
    page,
  }) => {
    await openLab(page, "01", 1, 0, { frozen: true });

    const frozenAttr = await page.evaluate(() =>
      document.documentElement.getAttribute("data-frozen"),
    );
    expect(frozenAttr).toBe("true");
  });

  test("frozen=0 removes data-frozen attribute", async ({ page }) => {
    await openLab(page, "01", 1, 0, { frozen: false });

    const frozenAttr = await page.evaluate(() =>
      document.documentElement.getAttribute("data-frozen"),
    );
    expect(frozenAttr).toBeNull();
  });

  test("frozen mode stage is still visible", async ({ page }) => {
    await openLab(page, "17", 1, 0, { frozen: true });
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
    await page.locator('[data-testid="style-card-01"]').click();
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

// ─── 7: URL hash persistence ───────────────────────────────────────────────

test.describe("URL hash persistence", () => {
  test("hash reflects current lab view state", async ({ page }) => {
    await openLab(page, "17", 3, 1, { frozen: true });

    const hash = parseHashFromUrl(page.url());
    expect(hash.view).toBe("lab");
    expect(hash.style).toBe("17");
    expect(Number(hash.scene)).toBe(3);
    expect(Number(hash.beat)).toBe(1);
    expect(hash.frozen).toBe("1");
    expect(hash.pure).toBe("0");
  });

  test("hash updates after keyboard navigation", async ({ page }) => {
    await openLab(page, "01", 2, 0, { frozen: true });

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    const hash = parseHashFromUrl(page.url());
    expect(hash.view).toBe("lab");
    expect(hash.style).toBe("01");
    // Scene 2 has 2 beats (0, 1). From beat 0, right goes to beat 1.
    expect(Number(hash.scene)).toBe(2);
    expect(Number(hash.beat)).toBe(1);
  });

  test("direct hash navigation loads correct style and scene", async ({
    page,
  }) => {
    const hash = buildHash({
      view: "lab",
      style: "33",
      scene: 4,
      beat: 0,
      frozen: true,
    });
    await page.goto(`/${hash}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });
    await page.waitForTimeout(300);

    const parsed = parseHashFromUrl(page.url());
    expect(parsed.view).toBe("lab");
    expect(parsed.style).toBe("33");
    expect(Number(parsed.scene)).toBe(4);
    expect(Number(parsed.beat)).toBe(0);
  });

  test("overview hash loads gallery view", async ({ page }) => {
    const hash = buildHash({ view: "overview" });
    await page.goto(`/${hash}`, { waitUntil: "networkidle" });
    await page.waitForSelector('[data-testid="overview-view"]', {
      state: "visible",
      timeout: 10000,
    });

    const parsed = parseHashFromUrl(page.url());
    expect(parsed.view).toBe("overview");
  });

  test("pure and frozen flags are preserved in hash", async ({ page }) => {
    await openLab(page, "01", 1, 0, { pure: true, frozen: true });

    const hash = parseHashFromUrl(page.url());
    expect(hash.pure).toBe("1");
    expect(hash.frozen).toBe("1");
  });
});

// ─── 8: Cross-style cycling ────────────────────────────────────────────────

test.describe("Cross-style cycling", () => {
  test("ArrowRight from last style last position wraps to first style", async ({
    page,
  }) => {
    // Style 48 is the last. Scene 5 has 2 beats (ids 0, 1). Last beat = 1.
    const lastStyleId = ALL_STYLE_IDS[ALL_STYLE_IDS.length - 1]; // "48"
    const lastScene = 5;
    const lastBeat = getLastBeat(lastStyleId, lastScene);

    await openLab(page, lastStyleId, lastScene, lastBeat, { frozen: true });

    // Verify we're at the last position
    const hashBefore = parseHashFromUrl(page.url());
    expect(hashBefore.style).toBe(lastStyleId);
    expect(Number(hashBefore.scene)).toBe(lastScene);
    expect(Number(hashBefore.beat)).toBe(lastBeat);

    // Press ArrowRight — should cross to first style
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(400); // cross-style flash may take a beat

    const hashAfter = parseHashFromUrl(page.url());
    expect(hashAfter.style).toBe("01");
    expect(Number(hashAfter.scene)).toBe(1);
    expect(Number(hashAfter.beat)).toBe(0);
  });

  test("ArrowLeft from first style scene 1 beat 0 wraps to last style", async ({
    page,
  }) => {
    const firstStyleId = ALL_STYLE_IDS[0]; // "01"

    await openLab(page, firstStyleId, 1, 0, { frozen: true });

    // Press ArrowLeft — should wrap to last style
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);

    const hash = parseHashFromUrl(page.url());
    const lastStyleId = ALL_STYLE_IDS[ALL_STYLE_IDS.length - 1];
    expect(hash.style).toBe(lastStyleId);

    // Should be at the last scene and last beat of the last style
    // Style 48 scene 5 has 2 beats → last beat = 1
    const expectedLastBeat = getLastBeat(lastStyleId, 5);
    expect(Number(hash.scene)).toBe(5);
    expect(Number(hash.beat)).toBe(expectedLastBeat);
  });

  test("cycling through all 48 styles returns to start", async ({ page }) => {
    // Test cross-style cycling at band boundaries (most likely to break).
    // Each transition: openLab to the "from" style's last position, then
    // ArrowRight to advance. openLab does a full page goto + waitForSelector
    // + 300ms settle, which gives React time to initialize from the hash.
    const boundaryTransitions = [
      { from: "08", to: "09" },  // Minimal Keynote → Balanced Hybrid
      { from: "16", to: "17" },  // Balanced Hybrid → Editorial & Print
      { from: "24", to: "25" },  // Editorial & Print → Craft & Cultural
      { from: "32", to: "33" },  // Craft & Cultural → Contemporary Digital
      { from: "40", to: "41" },  // Contemporary Digital → Text Report
      { from: "48", to: "01" },  // Text Report → Minimal Keynote (wrap)
    ];

    for (const { from, to } of boundaryTransitions) {
      const lastBeat = getLastBeat(from, 5);
      await openLab(page, from, 5, lastBeat, { frozen: true });

      // Verify we landed at the right position
      const hashBefore = parseHashFromUrl(page.url());
      expect(hashBefore.style).toBe(from);
      expect(Number(hashBefore.scene)).toBe(5);
      expect(Number(hashBefore.beat)).toBe(lastBeat);

      // ArrowRight should cross to the next style
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(400);

      const hashAfter = parseHashFromUrl(page.url());
      expect(hashAfter.style).toBe(to);
      expect(Number(hashAfter.scene)).toBe(1);
      expect(Number(hashAfter.beat)).toBe(0);
    }
  });
});

// ─── 9: Gallery view (overview) loads ──────────────────────────────────────

test.describe("Gallery / overview view", () => {
  test("overview view renders with all 48 style cards", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openOverview(page);

    await expect(page.locator('[data-testid="overview-view"]')).toBeVisible();

    // All 48 style cards should be present
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

    const card = page.locator('[data-testid="style-card-17"]');
    await expect(card).toBeVisible();
    await card.click();

    await page.waitForSelector('[data-testid="stage"]', {
      state: "visible",
      timeout: 10000,
    });
    await page.waitForTimeout(300);

    const hash = parseHashFromUrl(page.url());
    expect(hash.view).toBe("lab");
    expect(hash.style).toBe("17");
    expect(Number(hash.scene)).toBe(1);
    expect(Number(hash.beat)).toBe(0);
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
    await openLab(page, "01", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
    await expect(page.locator('[data-testid="lab-view"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("lab view renders stage for style 48 (last style)", async ({ page }) => {
    const errors = attachErrorCollector(page);
    await openLab(page, "48", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="stage"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors).toEqual([]);
  });

  test("lab view shows bottom bar with scene dots", async ({ page }) => {
    await openLab(page, "01", 1, 0, { frozen: true });

    await expect(page.locator('[data-testid="bottom-bar"]')).toBeVisible();

    // All 5 scene dots should be present
    for (let s = 1; s <= 5; s++) {
      await expect(page.locator(`[data-testid="scene-dot-${s}"]`)).toBeVisible();
    }
  });

  test("bottom bar next/prev buttons are functional", async ({ page }) => {
    await openLab(page, "01", 1, 0, { frozen: true });

    const nextBtn = page.locator('[data-testid="next-button"]');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForTimeout(200);

    // Style 01 scene 1 has 1 beat, so from beat 0 it advances to scene 2 beat 0
    const hash = parseHashFromUrl(page.url());
    expect(Number(hash.scene)).toBe(2);
    expect(Number(hash.beat)).toBe(0);

    // Prev button should go back
    const prevBtn = page.locator('[data-testid="prev-button"]');
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await page.waitForTimeout(200);

    const hashBack = parseHashFromUrl(page.url());
    expect(Number(hashBack.scene)).toBe(1);
    expect(Number(hashBack.beat)).toBe(0);
  });

  test("clicking scene dot jumps to that scene", async ({ page }) => {
    await openLab(page, "01", 1, 0, { frozen: true });

    const dot4 = page.locator('[data-testid="scene-dot-4"]');
    await expect(dot4).toBeVisible();
    await dot4.click();
    await page.waitForTimeout(200);

    const hash = parseHashFromUrl(page.url());
    expect(Number(hash.scene)).toBe(4);
    expect(Number(hash.beat)).toBe(0);
  });

  test("beat counter reflects current position", async ({ page }) => {
    // Style 01 scene 3 has 3 beats
    await openLab(page, "01", 3, 1, { frozen: true });

    const beatCounter = page.locator('[data-testid="beat-counter"]');
    await expect(beatCounter).toBeVisible();
    const text = await beatCounter.textContent();
    expect(text).toBe("2/3"); // beat index 1 → display "2/3"
  });

  test("sidebar style items are visible and clickable", async ({ page }) => {
    await openLab(page, "01", 1, 0, { frozen: true });

    // Make sure the editorial-print band is expanded (style 17 lives there)
    const bandToggle = page.locator('[data-testid="band-toggle-editorial-print"]');
    if (await bandToggle.isVisible()) {
      const expanded = await bandToggle.getAttribute("aria-expanded");
      if (expanded === "false") await bandToggle.click();
    }

    const sidebarItem = page.locator('[data-testid="sidebar-style-17"]');
    await expect(sidebarItem).toBeVisible({ timeout: 5000 });
    await sidebarItem.click();
    await page.waitForTimeout(300);

    const hash = parseHashFromUrl(page.url());
    expect(hash.style).toBe("17");
    expect(Number(hash.scene)).toBe(1);
    expect(Number(hash.beat)).toBe(0);
  });
});
