import type { StyleRegistryEntry } from "../types";

/**
 * Returns true if the font name is prefixed with "cjk:".
 */
export function isCJKFont(fontName: string): boolean {
  return fontName.startsWith("cjk:");
}

/**
 * Collect all font families used across all topics in the registry.
 *
 * - Iterates every style → every topic → calls getMetadata(lang).
 * - Deduplicates (first occurrence wins).
 * - When lang="en": drops fonts prefixed with "cjk:".
 * - When lang="zh": keeps all fonts, stripping the "cjk:" prefix.
 */
export function collectAllFonts(
  registry: StyleRegistryEntry[],
  lang: "en" | "zh",
): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const style of registry) {
    for (const topic of style.topics) {
      const meta = topic.getMetadata(lang);
      for (const font of meta.fonts) {
        if (lang === "en" && isCJKFont(font)) {
          continue;
        }

        const normalized =
          lang === "zh" && isCJKFont(font)
            ? font.slice("cjk:".length)
            : font;

        if (!seen.has(normalized)) {
          seen.add(normalized);
          result.push(normalized);
        }
      }
    }
  }

  return result;
}

/**
 * Build a Google Fonts CSS URL that requests the given families with
 * weights 400 and 700. Returns "" when the input array is empty.
 */
export function buildGoogleFontsUrl(fontFamilies: string[]): string {
  if (fontFamilies.length === 0) {
    return "";
  }

  const familyParams = fontFamilies
    .map((family) => {
      const encoded = family.replace(/ /g, "+");
      return `family=${encoded}:wght@400;700`;
    })
    .join("&");

  return `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
}
