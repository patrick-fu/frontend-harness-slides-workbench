import { expect, test } from "@playwright/test";

const PLAYER_URL =
  "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0";

test("keeps the Player identity in the Stage Matte and opens an anchored desktop switcher", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(PLAYER_URL, { waitUntil: "networkidle" });

  const matte = page.getByTestId("stage-matte");
  const stage = page.getByTestId("stage");
  const badge = page.getByTestId("identity-badge");
  const pill = page.getByTestId("identity-badge-pill");
  const trigger = badge.getByRole("button", {
    name: /Minimal Product Keynote.*Product Keynote.*Doubao-Seed-Evolving.*Open Topic Switcher/,
  });

  await expect(trigger).toBeVisible();
  await expect(pill).toHaveText(/Minimal Product Keynote.*Product Keynote.*Doubao-Seed-Evolving/);
  expect(await matte.evaluate((node, child) => node.contains(child), await badge.elementHandle())).toBe(true);
  expect(await stage.evaluate((node, child) => node.contains(child), await badge.elementHandle())).toBe(false);

  const triggerBox = await trigger.boundingBox();
  const pillBox = await pill.boundingBox();
  expect(triggerBox?.height).toBeGreaterThanOrEqual(44);
  expect(pillBox?.height).toBeCloseTo(28, 0);

  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Topic Switcher" });
  await expect(dialog).toBeVisible();
  const dialogBox = await dialog.boundingBox();
  expect(dialogBox?.y).toBeGreaterThanOrEqual((triggerBox?.y ?? 0) + 40);
  expect((dialogBox?.y ?? 900) + (dialogBox?.height ?? 0)).toBeLessThan(880);
});

test("uses the top matte on narrow screens and opens a mobile bottom sheet", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(PLAYER_URL, { waitUntil: "networkidle" });

  const pill = page.getByTestId("identity-badge-pill");
  const trigger = page.getByTestId("identity-badge").getByRole("button");
  const stage = page.getByTestId("stage");
  const pillBox = await pill.boundingBox();
  const stageBox = await stage.boundingBox();

  await expect(pill).toBeVisible();
  expect(pillBox?.height).toBeCloseTo(28, 0);
  expect((pillBox?.y ?? 844) + (pillBox?.height ?? 0)).toBeLessThanOrEqual(
    stageBox?.y ?? 0,
  );

  await trigger.click();
  const sheet = page.getByRole("dialog", { name: "Topic Switcher" });
  await expect(sheet).toBeVisible();
  const sheetBox = await sheet.boundingBox();
  expect(Math.abs(844 - ((sheetBox?.y ?? 0) + (sheetBox?.height ?? 0)) - 12)).toBeLessThanOrEqual(1);

  await sheet
    .getByRole("button", { name: /Quiet Launch.*GPT 5\.5/ })
    .click();
  await expect(page).toHaveURL(/topic=quiet-launch/);
  await expect(page.getByTestId("identity-badge-pill")).toHaveText(
    /Minimal Product Keynote.*Quiet Launch.*GPT 5\.5/,
  );
  await expect(page.getByTestId("topic-live-region")).toHaveClass(/sr-only/);
});

test("hides the identity badge in Pure mode", async ({ page }) => {
  await page.goto(`${PLAYER_URL}&pure=1`, { waitUntil: "networkidle" });

  await expect(page.getByTestId("stage")).toBeVisible();
  await expect(page.getByTestId("identity-badge")).toHaveCount(0);
});
