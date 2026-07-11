import { describe, expect, it } from "vitest";
import { CATALOG_MANIFEST } from "../styles/catalog-manifest.generated";
import { validateStyleDefinitions } from "./topic-catalog";
import { STYLE_DEFINITIONS } from "./style-definitions";

describe("STYLE_DEFINITIONS", () => {
  it("preserves every current canonical Style identity and Band during migration", () => {
    const currentStyles = Object.fromEntries(
      CATALOG_MANIFEST.map((style) => [
        style.id,
        {
          id: style.id,
          name: style.name,
          band: style.topics[0]?.metadata.en.band,
        },
      ]),
    );

    expect(STYLE_DEFINITIONS).toEqual(currentStyles);
    expect(() => validateStyleDefinitions(STYLE_DEFINITIONS)).not.toThrow();
  });
});
