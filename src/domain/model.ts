export const MODEL_IDS = [
  "Doubao-Seed-Evolving",
  "GPT 5.5",
  "GPT 5.6 Sol",
  "Claude Opus 4.8",
] as const;

export type ModelId = (typeof MODEL_IDS)[number];

export function isModelId(value: string): value is ModelId {
  return (MODEL_IDS as readonly string[]).includes(value);
}
