import type { StyleMetadata } from "../types";

/**
 * Filter a list of StyleMetadata by band (OR) and tags (AND).
 *
 * - Empty selectedBands → skip band filter.
 * - Non-empty selectedBands → keep styles whose band is in the list (OR).
 * - Empty selectedTags → skip tag filter.
 * - Non-empty selectedTags → keep styles where EVERY selected tag is in style.tags (AND).
 * - Original order is preserved.
 */
export function applyFilters(
  allStyles: StyleMetadata[],
  selectedBands: string[],
  selectedTags: string[],
): StyleMetadata[] {
  return allStyles.filter((style) => {
    if (selectedBands.length > 0 && !selectedBands.includes(style.band)) {
      return false;
    }
    if (
      selectedTags.length > 0 &&
      !selectedTags.every((tag) => style.tags.includes(tag))
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Aggregate all tags across styles, count occurrences, sort alphabetically.
 */
export function aggregateTags(
  allStyles: StyleMetadata[],
): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();

  for (const style of allStyles) {
    for (const tag of style.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}
