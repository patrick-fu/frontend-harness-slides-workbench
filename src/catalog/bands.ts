import type { RuntimeStyleGroup } from "./runtime-registry";
import { BANDS, type Band } from "../domain/style";

// ─── Band definitions ───────────────────────────────────────────────────────

export const BAND_ORDER = BANDS;

export type BandId = Band;

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
 * Reads the Style definition, which owns the Band for its Topic Group.
 *
 * Returns an array of [bandId, entries] tuples in BAND_ORDER sequence.
 */
export function groupByBand(
  registry: readonly RuntimeStyleGroup[],
): Array<[BandId, RuntimeStyleGroup[]]> {
  const map = new Map<BandId, RuntimeStyleGroup[]>();
  for (const band of BAND_ORDER) {
    map.set(band, []);
  }
  for (const entry of registry) {
    const band = entry.style.band;
    if (map.has(band)) {
      map.get(band)!.push(entry);
    }
  }
  return BAND_ORDER.map((band) => [band, map.get(band)!]);
}
