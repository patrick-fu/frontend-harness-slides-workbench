const MODEL_COLORS = [
  "#0f766e",
  "#2563eb",
  "#b45309",
  "#9333ea",
  "#be123c",
  "#047857",
] as const;

export function modelColor(modelId: string): string {
  let hash = 0;
  for (const char of modelId) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return MODEL_COLORS[hash % MODEL_COLORS.length];
}
