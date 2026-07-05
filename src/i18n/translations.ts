export const translations = {
  en: {
    appTitle: "FH Slides Workbench",
    overview: "Overview",
    lab: "Lab",
    prev: "Previous",
    next: "Next",
    scene: "Scene",
    beat: "Beat",
    style: "Style",
    pureMode: "Pure Mode",
    exitPure: "Exit Pure Mode",
    bands: "Bands",
    tags: "Tags",
    clearFilters: "Clear All Filters",
    noResults: "No styles match your filters",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
    rotateHint: "For best experience, rotate your device",
    dismiss: "Dismiss",
    loading: "Loading...",
    bandNames: {
      "minimal-keynote": "Minimal Keynote",
      "balanced-hybrid": "Balanced Hybrid",
      "editorial-print": "Editorial & Print",
      "craft-cultural": "Craft & Cultural",
      "contemporary-digital": "Contemporary Digital",
      "text-report": "Text Report",
    },
  },
  zh: {
    appTitle: "FH Slides 工作台",
    overview: "总览",
    lab: "实验室",
    prev: "上一个",
    next: "下一个",
    scene: "场景",
    beat: "节拍",
    style: "风格",
    pureMode: "纯净模式",
    exitPure: "退出纯净模式",
    bands: "风格族",
    tags: "标签",
    clearFilters: "清除所有过滤",
    noResults: "没有匹配的风格",
    language: "语言",
    theme: "主题",
    light: "浅色",
    dark: "深色",
    auto: "自动",
    rotateHint: "建议横屏获得最佳体验",
    dismiss: "关闭",
    loading: "加载中...",
    bandNames: {
      "minimal-keynote": "极简主旨",
      "balanced-hybrid": "平衡混合",
      "editorial-print": "编辑印刷",
      "craft-cultural": "工艺文化",
      "contemporary-digital": "当代数字",
      "text-report": "文本报告",
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export type BandId = keyof (typeof translations.en)["bandNames"];

/**
 * Look up a translation for the given language.
 * If the key is missing in the target language, falls back to English.
 * For bandNames, pass the band id as a second argument.
 */
export function translate(
  key: TranslationKey,
  lang: "en" | "zh",
): string {
  const table = translations[lang] as Record<string, unknown>;
  const enTable = translations.en as Record<string, unknown>;
  const value = table[key] ?? enTable[key];
  return typeof value === "string" ? value : String(key);
}

/**
 * Look up a band display name.
 */
export function translateBand(
  bandId: BandId,
  lang: "en" | "zh",
): string {
  return translations[lang].bandNames[bandId] ?? translations.en.bandNames[bandId];
}

/**
 * Format the error fallback message for a style.
 */
export function errorFallback(id: string, lang: "en" | "zh"): string {
  if (lang === "zh") {
    return `风格 ${id} — 渲染错误`;
  }
  return `Style ${id} — Render Error`;
}
