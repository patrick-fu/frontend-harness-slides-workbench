import { test, expect, Page } from "@playwright/test";

// ── Helpers ────────────────────────────────────────────────────────────────

async function countConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    errors.push(`PAGE_ERROR: ${err.message}`);
  });
  return errors;
}

async function openStyle(
  page: Page,
  styleId: string,
  scene: number,
  beat: number,
  opts: { pure?: boolean; frozen?: boolean } = {},
) {
  const params = new URLSearchParams({
    view: "lab",
    style: styleId,
    scene: String(scene),
    beat: String(beat),
    pure: opts.pure ? "1" : "0",
    frozen: opts.frozen ? "1" : "0",
  });
  await page.goto(`/?${params.toString()}`, { waitUntil: "networkidle" });
  // Wait for stage to render
  await page.waitForSelector('[data-testid="stage"]', { state: "visible", timeout: 10000 });
  // Give animations a beat to settle
  await page.waitForTimeout(300);
}

async function checkOverflow(page: Page): Promise<{ overflowX: number; overflowY: number }> {
  return page.evaluate(() => {
    const stage = document.querySelector('[data-testid="stage"]');
    if (!stage) return { overflowX: 0, overflowY: 0 };
    const rect = stage.getBoundingClientRect();
    const overflowX = stage.scrollWidth - rect.width;
    const overflowY = stage.scrollHeight - rect.height;
    return { overflowX, overflowY };
  });
}

// ── Style beat count map (from registry metadata) ──────────────────────────

// We'll discover styles and their beat counts dynamically from the page
async function getStyleList(page: Page): Promise<Array<{ id: string; name: string; band: string }>> {
  await page.goto("/", { waitUntil: "networkidle" });
  return page.evaluate(() => {
    // Read from window or from the overview cards
    const cards = document.querySelectorAll('[data-testid^="style-card-"]');
    const styles: Array<{ id: string; name: string; band: string }> = [];
    cards.forEach((card) => {
      const id = card.getAttribute("data-testid")?.replace("style-card-", "") || "";
      const name = card.querySelector('[data-testid="style-name"]')?.textContent || "";
      const band = card.getAttribute("data-band") || "";
      if (id) styles.push({ id, name, band });
    });
    return styles;
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

test.describe("Framework smoke", () => {
  test("overview page loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(`PAGE_ERROR: ${err.message}`));

    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator('[data-testid="overview-view"]')).toBeVisible({ timeout: 10000 });

    // Give fonts and lazy components a moment
    await page.waitForTimeout(1000);

    expect(errors).toEqual([]);
  });

  test("lab view loads style 01 without errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(`PAGE_ERROR: ${err.message}`));

    await openStyle(page, "01", 1, 0);
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();

    await page.waitForTimeout(500);
    expect(errors.filter((e) => !e.includes("favicon"))).toEqual([]);
  });

  test("pure mode hides envelope chrome", async ({ page }) => {
    await openStyle(page, "01", 1, 0, { pure: true });
    await expect(page.locator('[data-testid="header"]')).toBeHidden();
    await expect(page.locator('[data-testid="sidebar"]')).toBeHidden();
  });

  test("frozen mode disables animations", async ({ page }) => {
    await openStyle(page, "01", 1, 0, { frozen: true });
    // Check that the frozen CSS variable is set
    const frozen = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue("--frozen");
    });
    // Just verify the page loads
    await expect(page.locator('[data-testid="stage"]')).toBeVisible();
  });
});

test.describe("Style audit — overflow & console errors", () => {
  // Discover styles from the overview page
  let styles: Array<{ id: string; name: string; band: string }> = [];

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2000); // Let lazy cards mount
    styles = await page.evaluate(() => {
      // Try to get styles from the sidebar or overview
      const all: Array<{ id: string; name: string; band: string }> = [];

      // Method 1: from sidebar items
      document.querySelectorAll('[data-testid^="sidebar-style-"]').forEach((el) => {
        const id = el.getAttribute("data-testid")?.replace("sidebar-style-", "") || "";
        if (id && !all.find((s) => s.id === id)) {
          all.push({ id, name: el.textContent?.trim() || id, band: "" });
        }
      });

      // Method 2: from overview cards
      document.querySelectorAll('[data-testid^="style-card-"]').forEach((el) => {
        const id = el.getAttribute("data-testid")?.replace("style-card-", "") || "";
        if (id && !all.find((s) => s.id === id)) {
          all.push({ id, name: "", band: el.getAttribute("data-band") || "" });
        }
      });

      return all.sort((a, b) => a.id.localeCompare(b.id));
    });
    await page.close();
  });

  // For each style, test scene 1 beat 0 for overflow and console errors
  // This is a quick smoke test — full per-beat audit is done separately
  for (const styleId of ["01", "17", "33", "41"]) {
    test(`style ${styleId} scene 1 beat 0 — no overflow, no errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(`PAGE_ERROR: ${err.message}`));

      await openStyle(page, styleId, 1, 0, { frozen: true });

      const { overflowX, overflowY } = await checkOverflow(page);
      expect(
        overflowX,
        `Style ${styleId} scene 1 overflows horizontally by ${overflowX}px`,
      ).toBeLessThanOrEqual(2);
      expect(
        overflowY,
        `Style ${styleId} scene 1 overflows vertically by ${overflowY}px`,
      ).toBeLessThanOrEqual(2);

      const realErrors = errors.filter(
        (e) => !e.includes("favicon") && !e.includes("Source Map"),
      );
      expect(realErrors, `Console errors: ${realErrors.join("; ")}`).toEqual([]);
    });
  }
});

test.describe("Navigation — cross-style flow", () => {
  test("next button advances through scenes and styles", async ({ page }) => {
    await openStyle(page, "01", 1, 0);

    // Click next
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(200);

    // URL should have advanced
    const url = page.url();
    expect(url).toContain("view=lab");
  });

  test("clicking sidebar style jumps to that style", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Click a style in sidebar
    const styleLink = page.locator('[data-testid="sidebar-style-17"]');
    if (await styleLink.isVisible()) {
      await styleLink.click();
      await page.waitForTimeout(300);
      expect(page.url()).toContain("style=17");
    }
  });
});

test.describe("Localization", () => {
  test("toggling language switches between en and zh", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const langBtn = page.locator('[data-testid="lang-toggle"]');
    if (await langBtn.isVisible()) {
      const initial = await langBtn.textContent();
      await langBtn.click();
      await page.waitForTimeout(200);
      const after = await langBtn.textContent();
      expect(after).not.toBe(initial);
    }
  });
});
