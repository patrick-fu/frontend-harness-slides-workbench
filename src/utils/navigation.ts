import type { StyleRegistryEntry } from "../types";

export interface NavTarget {
  styleId: string;
  scene: number;
  beat: number;
  flashStyle?: boolean;
}

function findEntry(
  registry: StyleRegistryEntry[],
  styleId: string,
): StyleRegistryEntry | undefined {
  return registry.find((e) => e.id === styleId);
}

function getLastBeat(
  entry: StyleRegistryEntry,
  scene: number,
): number {
  const meta = entry.getMetadata("en");
  const sceneDef = meta.scenes.find((s) => s.id === scene);
  if (!sceneDef || sceneDef.beats.length === 0) return 0;
  return sceneDef.beats[sceneDef.beats.length - 1].id;
}

/**
 * Compute the next navigation target.
 *
 * - If beat < last beat of current scene: advance beat.
 * - Else if scene < 5: advance scene, beat = 0.
 * - Else (scene 5, last beat): if pure mode return null;
 *   else wrap to next style (or first if at end), scene 1, beat 0, flashStyle.
 */
export function computeNext(
  registry: StyleRegistryEntry[],
  currentStyleId: string,
  scene: number,
  beat: number,
  isPureMode: boolean,
): NavTarget | null {
  const entry = findEntry(registry, currentStyleId);
  if (!entry) return null;

  const lastBeat = getLastBeat(entry, scene);

  if (beat < lastBeat) {
    return { styleId: currentStyleId, scene, beat: beat + 1, flashStyle: false };
  }

  if (scene < 5) {
    return { styleId: currentStyleId, scene: scene + 1, beat: 0, flashStyle: false };
  }

  // At scene 5, last beat
  if (isPureMode) return null;

  const currentIndex = registry.findIndex((e) => e.id === currentStyleId);
  const nextIndex = (currentIndex + 1) % registry.length;
  const nextEntry = registry[nextIndex];

  return {
    styleId: nextEntry.id,
    scene: 1,
    beat: 0,
    flashStyle: true,
  };
}

/**
 * Compute the previous navigation target.
 *
 * - If beat > 0: go to beat - 1.
 * - Else if scene > 1: go to scene - 1, last beat of that scene.
 * - Else (scene 1, beat 0): if pure mode return null;
 *   else wrap to previous style (or last if at start), last scene, last beat, flashStyle.
 */
export function computePrev(
  registry: StyleRegistryEntry[],
  currentStyleId: string,
  scene: number,
  beat: number,
  isPureMode: boolean,
): NavTarget | null {
  const entry = findEntry(registry, currentStyleId);
  if (!entry) return null;

  if (beat > 0) {
    return { styleId: currentStyleId, scene, beat: beat - 1, flashStyle: false };
  }

  if (scene > 1) {
    const prevScene = scene - 1;
    const lastBeat = getLastBeat(entry, prevScene);
    return { styleId: currentStyleId, scene: prevScene, beat: lastBeat, flashStyle: false };
  }

  // At scene 1, beat 0
  if (isPureMode) return null;

  const currentIndex = registry.findIndex((e) => e.id === currentStyleId);
  const prevIndex = (currentIndex - 1 + registry.length) % registry.length;
  const prevEntry = registry[prevIndex];
  const prevMeta = prevEntry.getMetadata("en");
  const lastSceneId = prevMeta.scenes[prevMeta.scenes.length - 1].id;
  const lastBeat = getLastBeat(prevEntry, lastSceneId);

  return {
    styleId: prevEntry.id,
    scene: lastSceneId,
    beat: lastBeat,
    flashStyle: true,
  };
}

/**
 * Jump to a specific scene within the current style.
 * Clamps targetScene to 1-5.
 */
export function jumpScene(
  _registry: StyleRegistryEntry[],
  styleId: string,
  targetScene: number,
): NavTarget {
  const clamped = Math.max(1, Math.min(5, targetScene));
  return { styleId, scene: clamped, beat: 0 };
}

/**
 * Jump to a specific style at scene 1, beat 0.
 * Returns null if the style id does not exist in the registry.
 */
export function jumpStyle(
  registry: StyleRegistryEntry[],
  targetStyleId: string,
): NavTarget | null {
  const entry = findEntry(registry, targetStyleId);
  if (!entry) return null;
  return { styleId: targetStyleId, scene: 1, beat: 0 };
}
