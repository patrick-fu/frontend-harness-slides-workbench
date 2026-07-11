import { describe, it, expect } from "vitest";
import type { StyleRegistryEntry, StyleMetadata } from "../types";
import { STYLE_CATALOG_SOURCE } from "../styles/catalog-source";
import { collectAllFonts, buildGoogleFontsUrl, isCJKFont } from "./fonts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMetadata(
  id: string,
  fonts: string[],
): StyleMetadata {
  return {
    id,
    band: "minimal-keynote",
    name: `Style ${id}`,
    theme: "",
    densityLabel: "",
    heroScene: 1,
    colors: { bg: "#fff", ink: "#000", panel: "#eee" },
    typography: { header: "", body: "" },
    tags: [],
    fonts,
    scenes: [],
  };
}

function makeEntry(id: string, fonts: string[]): StyleRegistryEntry {
  return {
    id,
    name: { en: `Style ${id}`, zh: `风格 ${id}` },
    topics: [
      {
        id: "default-topic",
        topic: { en: "Test Topic", zh: "测试题材" },
        model: "test-model",
        component: () => null,
        getMetadata: (_lang: "en" | "zh") => makeMetadata(id, fonts),
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// isCJKFont
// ---------------------------------------------------------------------------

describe("isCJKFont", () => {
  it("returns true for fonts prefixed with cjk:", () => {
    expect(isCJKFont("cjk:Noto Serif SC")).toBe(true);
  });

  it("returns false for fonts without cjk: prefix", () => {
    expect(isCJKFont("Inter")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isCJKFont("")).toBe(false);
  });

  it("returns true for bare cjk: prefix with no family name", () => {
    expect(isCJKFont("cjk:")).toBe(true);
  });

  it("returns false when cjk: appears mid-string", () => {
    expect(isCJKFont("Noto cjk:Serif")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// collectAllFonts
// ---------------------------------------------------------------------------

describe("collectAllFonts", () => {
  it("returns empty array for empty registry", () => {
    expect(collectAllFonts([], "en")).toEqual([]);
    expect(collectAllFonts([], "zh")).toEqual([]);
  });

  it("collects fonts from a single style", () => {
    const registry = [makeEntry("style-a", ["Inter", "Roboto"])];
    expect(collectAllFonts(registry, "en")).toEqual(["Inter", "Roboto"]);
  });

  it("deduplicates fonts across multiple styles", () => {
    const registry = [
      makeEntry("style-a", ["Inter", "Roboto"]),
      makeEntry("style-b", ["Roboto", "Montserrat"]),
    ];
    expect(collectAllFonts(registry, "en")).toEqual([
      "Inter",
      "Roboto",
      "Montserrat",
    ]);
  });

  it("filters out cjk: fonts when lang=en", () => {
    const registry = [
      makeEntry("style-a", ["Inter", "cjk:Noto Serif SC", "Roboto"]),
    ];
    expect(collectAllFonts(registry, "en")).toEqual(["Inter", "Roboto"]);
  });

  it("includes all fonts and strips cjk: prefix when lang=zh", () => {
    const registry = [
      makeEntry("style-a", ["Inter", "cjk:Noto Serif SC", "Roboto"]),
    ];
    expect(collectAllFonts(registry, "zh")).toEqual([
      "Inter",
      "Noto Serif SC",
      "Roboto",
    ]);
  });

  it("handles mixed CJK fonts across styles with lang=zh", () => {
    const registry = [
      makeEntry("style-a", ["Inter", "cjk:Noto Sans SC"]),
      makeEntry("style-b", ["cjk:Noto Serif SC", "Montserrat"]),
    ];
    expect(collectAllFonts(registry, "zh")).toEqual([
      "Inter",
      "Noto Sans SC",
      "Noto Serif SC",
      "Montserrat",
    ]);
  });

  it("deduplicates after stripping cjk: prefix in zh mode", () => {
    const registry = [
      makeEntry("style-a", ["cjk:Noto Serif SC"]),
      makeEntry("style-b", ["cjk:Noto Serif SC"]),
    ];
    expect(collectAllFonts(registry, "zh")).toEqual(["Noto Serif SC"]);
  });

  it("preserves first-occurrence order after dedup", () => {
    const registry = [
      makeEntry("style-a", ["Roboto", "Inter"]),
      makeEntry("style-b", ["Inter", "Roboto"]),
    ];
    expect(collectAllFonts(registry, "en")).toEqual(["Roboto", "Inter"]);
  });
});

// ---------------------------------------------------------------------------
// buildGoogleFontsUrl
// ---------------------------------------------------------------------------

describe("buildGoogleFontsUrl", () => {
  it("returns empty string for empty array", () => {
    expect(buildGoogleFontsUrl([])).toBe("");
  });

  it("builds URL for a single font family", () => {
    const url = buildGoogleFontsUrl(["Inter"]);
    expect(url).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
    );
  });

  it("builds URL for multiple font families", () => {
    const url = buildGoogleFontsUrl(["Inter", "Roboto"]);
    expect(url).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;700&display=swap",
    );
  });

  it("replaces spaces with + in font names", () => {
    const url = buildGoogleFontsUrl(["Noto Serif SC"]);
    expect(url).toBe(
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&display=swap",
    );
  });

  it("handles three families with spaces", () => {
    const url = buildGoogleFontsUrl([
      "Inter",
      "Noto Serif SC",
      "Source Han Sans",
    ]);
    expect(url).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Noto+Serif+SC:wght@400;700&family=Source+Han+Sans:wght@400;700&display=swap",
    );
  });

  it("always requests weights 400 and 700", () => {
    const url = buildGoogleFontsUrl(["Montserrat"]);
    expect(url).toContain("wght@400;700");
  });

  it("preserves an explicit variable-font axis descriptor from metadata", () => {
    const url = buildGoogleFontsUrl([
      "Fraunces:opsz,wght@9..144,300..500",
      "Newsreader:opsz,wght@6..72,300..500",
    ]);

    expect(url).toBe(
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..500&family=Newsreader:opsz,wght@6..72,300..500&display=swap",
    );
  });

  it("preserves an explicit static-face weight descriptor", () => {
    expect(buildGoogleFontsUrl(["Archivo Black:wght@400"])).toBe(
      "https://fonts.googleapis.com/css2?family=Archivo+Black:wght@400&display=swap",
    );
  });

  it("merges a legacy family with its explicit descriptor", () => {
    expect(
      buildGoogleFontsUrl(["Inter", "Inter:wght@300;500;600"]),
    ).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    );
  });

  it("falls back to legacy weights for a malformed descriptor", () => {
    expect(buildGoogleFontsUrl(["Inter:wght"])).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
    );
  });

  it("leaves local and system fallback families out of Google Fonts requests", () => {
    expect(buildGoogleFontsUrl(["Inter", "SF Mono", "PingFang SC"])).toBe(
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
    );
    expect(buildGoogleFontsUrl(["system-ui", "Menlo"])).toBe("");
  });

  it("keeps a CJK descriptor after language normalization", () => {
    const registry = [
      makeEntry("style-a", ["cjk:Noto Serif SC:wght@300;400;500"]),
    ];

    expect(collectAllFonts(registry, "zh")).toEqual([
      "Noto Serif SC:wght@300;400;500",
    ]);
    expect(buildGoogleFontsUrl(collectAllFonts(registry, "zh"))).toBe(
      "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500&display=swap",
    );
  });

  it("emits one selector per authored family across the full source catalog", () => {
    const url = buildGoogleFontsUrl(
      collectAllFonts(STYLE_CATALOG_SOURCE, "zh"),
    );
    const families = new URL(url).searchParams
      .getAll("family")
      .map((selector) => selector.split(":")[0].toLowerCase());

    expect(new Set(families).size).toBe(families.length);
    expect(
      new URL(url).searchParams.getAll("family"),
    ).toContain(
      "Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400",
    );
  });

  it("always appends display=swap", () => {
    const url = buildGoogleFontsUrl(["Inter"]);
    expect(url).toContain("&display=swap");
    expect(url.endsWith("display=swap")).toBe(true);
  });
});
