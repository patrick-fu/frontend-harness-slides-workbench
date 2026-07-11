export const BANDS = [
  "minimal-keynote",
  "balanced-hybrid",
  "editorial-print",
  "craft-cultural",
  "contemporary-digital",
  "text-report",
] as const;

export type Band = (typeof BANDS)[number];

export interface StyleDefinition {
  id: string;
  name: { en: string; zh: string };
  band: Band;
}

export type StyleDefinitions = Readonly<Record<string, StyleDefinition>>;
