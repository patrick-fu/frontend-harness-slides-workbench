import { expect, test } from "@playwright/test";
import { CATALOG_MANIFEST } from "../src/catalog/manifest.generated";

const GPT_55_TOPIC_COUNT = CATALOG_MANIFEST.flatMap((group) => group.topics)
  .filter((topic) => topic.modelId === "GPT 5.5").length;
const MINIMAL_GPT_55_TOPIC_COUNT = CATALOG_MANIFEST
  .filter((group) => group.style.band === "minimal-keynote")
  .flatMap((group) => group.topics)
  .filter((topic) => topic.modelId === "GPT 5.5").length;

test("carries Overview Filters into the Player Cycle Scope", async ({ page }) => {
  await page.goto("/?view=overview", { waitUntil: "networkidle" });

  await page
    .getByRole("group", { name: "Category" })
    .getByRole("button", { name: /Minimal Keynote/ })
    .click();
  await page
    .getByRole("group", { name: "Model ID" })
    .getByRole("button", { name: /GPT 5\.5/ })
    .click();
  await page
    .locator('[data-topic-id="quiet-launch"] a')
    .click();

  await expect(page).toHaveURL(/view=lab/);
  expect(new URL(page.url()).searchParams.getAll("band")).toEqual([
    "minimal-keynote",
  ]);
  expect(new URL(page.url()).searchParams.getAll("model")).toEqual([
    "GPT 5.5",
  ]);
  await expect(
    page.getByRole("button", {
      name: `Filtered: ${MINIMAL_GPT_55_TOPIC_COUNT} Topics`,
    }),
  ).toBeVisible();

  const transport = page.getByTestId("player-transport");
  await page.getByTestId("scene-dot-5").click();
  await transport.getByRole("button", { name: "Beat 2 of 2" }).click();
  await transport.getByRole("button", { name: "Next" }).click();

  await expect(page).toHaveURL(/topic=clean-metrics/);
  expect(new URL(page.url()).searchParams.getAll("model")).toEqual([
    "GPT 5.5",
  ]);
  await expect(
    page.locator('[data-topic-evidence-boundary="true"]'),
  ).toHaveCount(0);
});

test("opens Player Filters as a mobile bottom sheet", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0",
    { waitUntil: "networkidle" },
  );

  await page.getByRole("button", { name: "Filter" }).click();
  const sheet = page.getByRole("dialog", { name: "Filters" });
  await expect(sheet).toBeVisible();
  await sheet
    .getByRole("group", { name: "Model ID" })
    .getByRole("button", { name: /GPT 5\.5/ })
    .click();

  await expect(page).toHaveURL(/model=GPT(?:\+|%20)5\.5/);
  await expect(
    page.getByRole("button", {
      name: `Current Topic outside filtered scope: ${GPT_55_TOPIC_COUNT} Topics`,
    }),
  ).toBeVisible();
});
