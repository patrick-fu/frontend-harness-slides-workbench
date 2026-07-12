import { describe, expect, it } from "vitest";
import type { RuntimeCatalogStyleGroup } from "./runtime-catalog";
import { BAND_ORDER, groupByBand } from "./bands";

function makeGroup(
  id: string,
  band: RuntimeCatalogStyleGroup["style"]["band"],
): RuntimeCatalogStyleGroup {
  return {
    style: {
      id,
      name: { en: id, zh: id },
      band,
    },
    topics: [],
  };
}

describe("groupByBand", () => {
  it("groups discovery-only Styles in canonical Band and Registry order", () => {
    const registry = [
      makeGroup("editorial-one", "editorial-print"),
      makeGroup("minimal-one", "minimal-keynote"),
      makeGroup("editorial-two", "editorial-print"),
    ];

    const grouped = groupByBand(registry);

    expect(grouped.map(([band]) => band)).toEqual(BAND_ORDER);
    expect(
      grouped.map(([band, groups]) => [
        band,
        groups.map((group) => group.style.id),
      ]),
    ).toEqual([
      ["minimal-keynote", ["minimal-one"]],
      ["balanced-hybrid", []],
      ["editorial-print", ["editorial-one", "editorial-two"]],
      ["craft-cultural", []],
      ["contemporary-digital", []],
      ["text-report", []],
    ]);
  });
});
