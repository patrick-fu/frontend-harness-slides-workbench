import { describe, it, expect } from "vitest";
import type { StyleRegistryEntry, StyleMetadata } from "../types";
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
    versions: [
      {
        id: "v1",
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
    const registry = [makeEntry("01", ["Inter", "Roboto"])];
    expect(collectAllFonts(registry, "en")).toEqual(["Inter", "Roboto"]);
  });

  it("deduplicates fonts across multiple styles", () => {
    const registry = [
      makeEntry("01", ["Inter", "Roboto"]),
      makeEntry("02", ["Roboto", "Montserrat"]),
    ];
    expect(collectAllFonts(registry, "en")).toEqual([
      "Inter",
      "Roboto",
      "Montserrat",
    ]);
  });

  it("filters out cjk: fonts when lang=en", () => {
    const registry = [
      makeEntry("01", ["Inter", "cjk:Noto Serif SC", "Roboto"]),
    ];
    expect(collectAllFonts(registry, "en")).toEqual(["Inter", "Roboto"]);
  });

  it("includes all fonts and strips cjk: prefix when lang=zh", () => {
    const registry = [
      makeEntry("01", ["Inter", "cjk:Noto Serif SC", "Roboto"]),
    ];
    expect(collectAllFonts(registry, "zh")).toEqual([
      "Inter",
      "Noto Serif SC",
      "Roboto",
    ]);
  });

  it("handles mixed CJK fonts across styles with lang=zh", () => {
    const registry = [
      makeEntry("01", ["Inter", "cjk:Noto Sans SC"]),
      makeEntry("02", ["cjk:Noto Serif SC", "Montserrat"]),
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
      makeEntry("01", ["cjk:Noto Serif SC"]),
      makeEntry("02", ["cjk:Noto Serif SC"]),
    ];
    expect(collectAllFonts(registry, "zh")).toEqual(["Noto Serif SC"]);
  });

  it("preserves first-occurrence order after dedup", () => {
    const registry = [
      makeEntry("01", ["Roboto", "Inter"]),
      makeEntry("02", ["Inter", "Roboto"]),
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

  it("always appends display=swap", () => {
    const url = buildGoogleFontsUrl(["Inter"]);
    expect(url).toContain("&display=swap");
    expect(url.endsWith("display=swap")).toBe(true);
  });
});
