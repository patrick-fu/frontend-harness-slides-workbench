import { expect, test } from "@playwright/test";

test("restarts the visible announcement when Topics change again within three seconds", async ({
  page,
}) => {
  await page.goto(
    "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0",
  );

  await page
    .getByRole("button", {
      name: /Minimal Product Keynote.*Product Keynote/,
    })
    .click();
  await page.getByRole("menuitemradio", { name: /Quiet Launch/ }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Quiet Launch" }),
  ).toBeVisible();

  await page.waitForTimeout(2500);
  await page
    .getByRole("button", {
      name: /Minimal Product Keynote.*Quiet Launch/,
    })
    .click();
  await page.getByRole("menuitemradio", { name: /Product Keynote/ }).click();

  const announcement = page
    .getByRole("status")
    .filter({ hasText: "Product Keynote" });
  await expect(announcement).toBeVisible();
  await page.waitForTimeout(750);
  await expect(announcement).toHaveCSS("opacity", "1");
});
