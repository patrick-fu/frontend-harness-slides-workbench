import { describe, expect, it } from "vitest";
import { getShowcaseThumbnail } from "./showcase-thumbnails";

describe("getShowcaseThumbnail", () => {
  it("derives the preview from Topic ID and the application base URL", () => {
    expect(getShowcaseThumbnail("product-keynote", "/")).toBe(
      "/showcase/product-keynote.webp",
    );
    expect(getShowcaseThumbnail("product-keynote", "/workbench/")).toBe(
      "/workbench/showcase/product-keynote.webp",
    );
    expect(getShowcaseThumbnail("product-keynote", "/workbench")).toBe(
      "/workbench/showcase/product-keynote.webp",
    );
  });
});
