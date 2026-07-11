import type { TopicMetadata } from "../domain/topic";
import type { CatalogTopicEntry } from "./catalog-filter";

/**
 * Filter Catalog Topics by Style Band (OR) and Topic tags (AND).
 *
 * - Empty selectedBands → skip band filter.
 * - Non-empty selectedBands → keep styles whose band is in the list (OR).
 * - Empty selectedTags → skip tag filter.
 * - Non-empty selectedTags → keep styles where EVERY selected tag is in style.tags (AND).
 * - Original order is preserved.
 */
export function applyFilters(
  allTopics: readonly CatalogTopicEntry[],
  selectedBands: string[],
  selectedTags: string[],
): CatalogTopicEntry[] {
  return allTopics.filter((entry) => {
    if (
      selectedBands.length > 0 &&
      !selectedBands.includes(entry.style.band)
    ) {
      return false;
    }
    if (
      selectedTags.length > 0 &&
      !selectedTags.every((tag) => entry.metadata.tags.includes(tag))
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Aggregate all tags across Topic metadata, count occurrences, sort alphabetically.
 */
export function aggregateTags(
  allTopics: readonly TopicMetadata[],
): Array<{ tag: string; count: number }> {
  const counts = new Map<string, number>();

  for (const topic of allTopics) {
    for (const tag of topic.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag));
}
