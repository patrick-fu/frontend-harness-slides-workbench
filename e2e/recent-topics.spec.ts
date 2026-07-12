import { expect, test } from "@playwright/test";
import { CATALOG_MANIFEST } from "../src/catalog/manifest.generated";

const current = CATALOG_MANIFEST.flatMap((group) => group.topics).find(
  (topic) => topic.id === "product-keynote",
)!;
const targetGroup = CATALOG_MANIFEST.find((group) =>
  group.topics.some(
    (topic) => topic.id !== current.id && topic.modelId !== "GPT 5.5",
  ),
)!;
const target = targetGroup.topics.find(
  (topic) => topic.id !== current.id && topic.modelId !== "GPT 5.5",
)!;

test("migrates and opens a moved Recent Topic without clearing Filters", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.evaluate(
    ({ topicId }) =>
      localStorage.setItem(
        "fhsw:recent-topics",
        JSON.stringify([`retired-style/${topicId}`, "missing-topic"]),
      ),
    { topicId: target.id },
  );
  await page.goto(
    `/?view=lab&style=${current.styleId}&topic=${current.id}&scene=1&beat=0&model=GPT+5.5`,
    { waitUntil: "domcontentloaded" },
  );
  await expect(page.getByTestId("stage")).toHaveAttribute(
    "data-topic-ready",
    "true",
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("fhsw:recent-topics") ?? "[]"),
      ),
    )
    .toEqual([current.id, target.id]);

  await page.getByRole("button", { name: "Search" }).click();
  const palette = page.getByRole("dialog", { name: "Command palette" });
  const recent = palette.getByRole("option", {
    name: new RegExp(
      `${targetGroup.style.name.en}.*${target.title.en}.*Outside filter`,
    ),
  });
  await expect(recent).toBeVisible();
  await recent.click();

  await expect(page).toHaveURL(new RegExp(`topic=${target.id}`));
  const query = new URL(page.url()).searchParams;
  expect(query.getAll("model")).toEqual(["GPT 5.5"]);
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem("fhsw:recent-topics") ?? "[]"),
      ),
    )
    .toEqual([target.id, current.id]);
});
