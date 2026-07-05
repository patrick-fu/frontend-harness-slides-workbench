import type { StyleRegistryEntry } from "../types";

export interface NavTarget {
  styleId: string;
  versionId: string;
  scene: number;
  beat: number;
  flashStyle?: boolean;
}

function findStyle(
  registry: StyleRegistryEntry[],
  styleId: string,
): StyleRegistryEntry | undefined {
  return registry.find((s) => s.id === styleId);
}

/**
 * Get the last beat ID for a given scene in a version.
 * Uses the first version's metadata for scene structure (all versions of a
 * style share the same 5-scene structure; beat counts may differ).
 */
function getLastBeat(
  entry: StyleRegistryEntry,
  versionIndex: number,
  scene: number,
): number {
  const version = entry.versions[versionIndex];
  if (!version) return 0;
  const meta = version.getMetadata("en");
  const sceneDef = meta.scenes.find((s) => s.id === scene);
  if (!sceneDef || sceneDef.beats.length === 0) return 0;
  return sceneDef.beats[sceneDef.beats.length - 1].id;
}

/**
 * Find the version index within a style's versions array.
 * Returns 0 if not found (fallback to first version).
 */
function getVersionIndex(entry: StyleRegistryEntry, versionId: string): number {
  const idx = entry.versions.findIndex((v) => v.id === versionId);
  return idx >= 0 ? idx : 0;
}

/**
 * Compute the next navigation target.
 *
 * Version-aware cycling (D81):
 * - If beat < last beat of current scene: advance beat.
 * - Else if scene < 5: advance scene, beat = 0.
 * - Else (scene 5, last beat):
 *   - If pure mode: return null.
 *   - If more versions in this style: next version, scene 1, beat 0, flashStyle.
 *   - Else: next style's first version, scene 1, beat 0, flashStyle.
 */
export function computeNext(
  registry: StyleRegistryEntry[],
  currentStyleId: string,
  currentVersionId: string,
  scene: number,
  beat: number,
  isPureMode: boolean,
): NavTarget | null {
  const entry = findStyle(registry, currentStyleId);
  if (!entry) return null;

  const versionIndex = getVersionIndex(entry, currentVersionId);
  const lastBeat = getLastBeat(entry, versionIndex, scene);

  // Within current scene: advance beat
  if (beat < lastBeat) {
    return {
      styleId: currentStyleId,
      versionId: currentVersionId,
      scene,
      beat: beat + 1,
      flashStyle: false,
    };
  }

  // Within current version: advance scene
  if (scene < 5) {
    return {
      styleId: currentStyleId,
      versionId: currentVersionId,
      scene: scene + 1,
      beat: 0,
      flashStyle: false,
    };
  }

  // At scene 5, last beat
  if (isPureMode) return null;

  // Check if there's a next version in this style
  if (versionIndex < entry.versions.length - 1) {
    const nextVersion = entry.versions[versionIndex + 1];
    return {
      styleId: currentStyleId,
      versionId: nextVersion.id,
      scene: 1,
      beat: 0,
      flashStyle: true,
    };
  }

  // Wrap to next style's first version
  const currentStyleIndex = registry.findIndex((s) => s.id === currentStyleId);
  const nextStyleIndex = (currentStyleIndex + 1) % registry.length;
  const nextStyle = registry[nextStyleIndex];
  const nextVersion = nextStyle.versions[0];

  return {
    styleId: nextStyle.id,
    versionId: nextVersion.id,
    scene: 1,
    beat: 0,
    flashStyle: true,
  };
}

/**
 * Compute the previous navigation target.
 *
 * Version-aware cycling (D81):
 * - If beat > 0: go to beat - 1.
 * - Else if scene > 1: go to scene - 1, last beat of that scene.
 * - Else (scene 1, beat 0):
 *   - If pure mode: return null.
 *   - If previous version in this style: prev version's last scene, last beat, flashStyle.
 *   - Else: prev style's last version's last scene, last beat, flashStyle.
 */
export function computePrev(
  registry: StyleRegistryEntry[],
  currentStyleId: string,
  currentVersionId: string,
  scene: number,
  beat: number,
  isPureMode: boolean,
): NavTarget | null {
  const entry = findStyle(registry, currentStyleId);
  if (!entry) return null;

  const versionIndex = getVersionIndex(entry, currentVersionId);

  // Within current scene: go back beat
  if (beat > 0) {
    return {
      styleId: currentStyleId,
      versionId: currentVersionId,
      scene,
      beat: beat - 1,
      flashStyle: false,
    };
  }

  // Within current version: go back scene
  if (scene > 1) {
    const prevScene = scene - 1;
    const lastBeat = getLastBeat(entry, versionIndex, prevScene);
    return {
      styleId: currentStyleId,
      versionId: currentVersionId,
      scene: prevScene,
      beat: lastBeat,
      flashStyle: false,
    };
  }

  // At scene 1, beat 0
  if (isPureMode) return null;

  // Check if there's a previous version in this style
  if (versionIndex > 0) {
    const prevVersion = entry.versions[versionIndex - 1];
    const prevMeta = prevVersion.getMetadata("en");
    const lastSceneId = prevMeta.scenes[prevMeta.scenes.length - 1].id;
    const lastBeatIdx = prevMeta.scenes[prevMeta.scenes.length - 1].beats.length - 1;
    return {
      styleId: currentStyleId,
      versionId: prevVersion.id,
      scene: lastSceneId,
      beat: lastBeatIdx,
      flashStyle: true,
    };
  }

  // Wrap to previous style's last version
  const currentStyleIndex = registry.findIndex((s) => s.id === currentStyleId);
  const prevStyleIndex =
    (currentStyleIndex - 1 + registry.length) % registry.length;
  const prevStyle = registry[prevStyleIndex];
  const prevVersion = prevStyle.versions[prevStyle.versions.length - 1];
  const prevMeta = prevVersion.getMetadata("en");
  const lastSceneId = prevMeta.scenes[prevMeta.scenes.length - 1].id;
  const lastBeatIdx = prevMeta.scenes[prevMeta.scenes.length - 1].beats.length - 1;

  return {
    styleId: prevStyle.id,
    versionId: prevVersion.id,
    scene: lastSceneId,
    beat: lastBeatIdx,
    flashStyle: true,
  };
}

/**
 * Jump to a specific scene within the current style/version.
 * Clamps targetScene to 1-5.
 */
export function jumpScene(
  _registry: StyleRegistryEntry[],
  styleId: string,
  versionId: string,
  targetScene: number,
): NavTarget {
  const clamped = Math.max(1, Math.min(5, targetScene));
  return { styleId, versionId, scene: clamped, beat: 0 };
}

/**
 * Jump to a specific style (first version) at scene 1, beat 0.
 * Returns null if the style id does not exist in the registry.
 */
export function jumpStyle(
  registry: StyleRegistryEntry[],
  targetStyleId: string,
): NavTarget | null {
  const entry = findStyle(registry, targetStyleId);
  if (!entry || entry.versions.length === 0) return null;
  return {
    styleId: targetStyleId,
    versionId: entry.versions[0].id,
    scene: 1,
    beat: 0,
  };
}

/**
 * Jump to a specific style + version at scene 1, beat 0.
 * Returns null if not found.
 */
export function jumpVersion(
  registry: StyleRegistryEntry[],
  targetStyleId: string,
  targetVersionId: string,
): NavTarget | null {
  const entry = findStyle(registry, targetStyleId);
  if (!entry) return null;
  const version = entry.versions.find((v) => v.id === targetVersionId);
  if (!version) return null;
  return {
    styleId: targetStyleId,
    versionId: targetVersionId,
    scene: 1,
    beat: 0,
  };
}
