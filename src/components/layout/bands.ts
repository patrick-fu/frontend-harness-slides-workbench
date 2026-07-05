import type { StyleRegistryEntry } from "../../types";

// ─── Band definitions ───────────────────────────────────────────────────────

export const BAND_ORDER = [
  "minimal-keynote",
  "balanced-hybrid",
  "editorial-print",
  "craft-cultural",
  "contemporary-digital",
  "text-report",
] as const;

export type BandId = (typeof BAND_ORDER)[number];

export const BAND_LABELS: Record<BandId, { en: string; zh: string }> = {
  "minimal-keynote": { en: "Minimal Keynote", zh: "极简主旨" },
  "balanced-hybrid": { en: "Balanced Hybrid", zh: "平衡混合" },
  "editorial-print": { en: "Editorial & Print", zh: "编辑印刷" },
  "craft-cultural": { en: "Craft & Cultural", zh: "工艺文化" },
  "contemporary-digital": { en: "Contemporary Digital", zh: "当代数字" },
  "text-report": { en: "Text Report", zh: "文本报告" },
};

/**
 * Group registry entries by their band, preserving band order.
 * Uses the first version's metadata to determine the band (all versions
 * of a style share the same band).
 *
 * Returns an array of [bandId, entries] tuples in BAND_ORDER sequence.
 */
export function groupByBand(
  registry: StyleRegistryEntry[],
): Array<[BandId, StyleRegistryEntry[]]> {
  const map = new Map<BandId, StyleRegistryEntry[]>();
  for (const band of BAND_ORDER) {
    map.set(band, []);
  }
  for (const entry of registry) {
    if (entry.versions.length === 0) continue;
    const meta = entry.versions[0].getMetadata("en");
    const band = meta.band as BandId;
    if (map.has(band)) {
      map.get(band)!.push(entry);
    }
  }
  return BAND_ORDER.map((band) => [band, map.get(band)!]);
}
