import { describe, expect, it } from "vitest";
import { curatedNavigationAttributes } from "./curated-topic-contract";

describe("curatedNavigationAttributes", () => {
  it("looks up visible navigation by its style/topic pair", () => {
    expect(
      curatedNavigationAttributes(
        "minimal-product-keynote",
        "last-feature-cut",
      ),
    ).toEqual({
      "data-topic-navigation": "true",
      "data-navigation-geometry": "typographic-index",
      "data-navigation-carrier": "feature-cut-whisper",
      "data-navigation-invocation": "persistent",
      "data-navigation-feedback": "active-glow",
    });
  });

  it("rejects a mismatched pair even when its topic exists in another Style", () => {
    expect(() =>
      curatedNavigationAttributes("objective-swiss-grid", "last-feature-cut"),
    ).toThrowError(
      'Missing curated Topic contract for "objective-swiss-grid/last-feature-cut".',
    );
  });
});
