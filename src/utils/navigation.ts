import type { StyleRegistryEntry } from "../types";

export interface NavTarget {
  styleId: string;
  topicId: string;
  scene: number;
  beat: number;
  flashStyle?: boolean;
}

export type PlayerNavigationDirection = "next" | "prev";

export interface NavigationPoint {
  x: number;
  y: number;
}

export interface StageTapPosition {
  clientX: number;
  stageLeft: number;
  stageWidth: number;
}

export const STAGE_PREVIOUS_ZONE_RATIO = 0.2;
export const SWIPE_NAVIGATION_THRESHOLD = 50;

/**
 * Resolve an edge click or tap to a player direction.
 * The leftmost 20% goes back; the remaining 80% advances.
 */
export function getStageTapNavigationDirection({
  clientX,
  stageLeft,
  stageWidth,
}: StageTapPosition): PlayerNavigationDirection {
  return clientX - stageLeft < stageWidth * STAGE_PREVIOUS_ZONE_RATIO
    ? "prev"
    : "next";
}

/**
 * Resolve a touch swipe to a player direction.
 * Left/up advances and right/down goes back. Equal-axis diagonals are ignored.
 */
export function getSwipeNavigationDirection(
  start: NavigationPoint,
  end: NavigationPoint,
): PlayerNavigationDirection | null {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (Math.max(absX, absY) < SWIPE_NAVIGATION_THRESHOLD || absX === absY) {
    return null;
  }

  if (absX > absY) return deltaX < 0 ? "next" : "prev";
  return deltaY < 0 ? "next" : "prev";
}

function findStyle(
  registry: StyleRegistryEntry[],
  styleId: string,
): StyleRegistryEntry | undefined {
  return registry.find((s) => s.id === styleId);
}

/**
 * Get the last beat ID for a given scene in a topic.
 */
function getLastBeat(
  entry: StyleRegistryEntry,
  topicIndex: number,
  scene: number,
): number {
  const topic = entry.topics[topicIndex];
  if (!topic) return 0;
  const meta = topic.getMetadata("en");
  const sceneDef = meta.scenes.find((s) => s.id === scene);
  if (!sceneDef || sceneDef.beats.length === 0) return 0;
  return sceneDef.beats[sceneDef.beats.length - 1].id;
}

/**
 * Find the topic index within a style's topics array.
 * Returns 0 if not found (fallback to first topic).
 */
function getTopicIndex(entry: StyleRegistryEntry, topicId: string): number {
  const idx = entry.topics.findIndex((topic) => topic.id === topicId);
  return idx >= 0 ? idx : 0;
}

/**
 * Compute the next navigation target.
 *
 * Topic-aware cycling (D81):
 * - If beat < last beat of current scene: advance beat.
 * - Else if scene < 5: advance scene, beat = 0.
 * - Else (scene 5, last beat):
 *   - If pure mode: return null.
 *   - If more topics in this style: next topic, scene 1, beat 0, flashStyle.
 *   - Else: next style's first topic, scene 1, beat 0, flashStyle.
 */
export function computeNext(
  registry: StyleRegistryEntry[],
  currentStyleId: string,
  currentTopicId: string,
  scene: number,
  beat: number,
  isPureMode: boolean,
): NavTarget | null {
  const entry = findStyle(registry, currentStyleId);
  if (!entry) return null;

  const topicIndex = getTopicIndex(entry, currentTopicId);
  const lastBeat = getLastBeat(entry, topicIndex, scene);

  // Within current scene: advance beat
  if (beat < lastBeat) {
    return {
      styleId: currentStyleId,
      topicId: currentTopicId,
      scene,
      beat: beat + 1,
      flashStyle: false,
    };
  }

  // Within current topic: advance scene
  if (scene < 5) {
    return {
      styleId: currentStyleId,
      topicId: currentTopicId,
      scene: scene + 1,
      beat: 0,
      flashStyle: false,
    };
  }

  // At scene 5, last beat
  if (isPureMode) return null;

  // Check if there's a next topic in this style
  if (topicIndex < entry.topics.length - 1) {
    const nextTopic = entry.topics[topicIndex + 1];
    return {
      styleId: currentStyleId,
      topicId: nextTopic.id,
      scene: 1,
      beat: 0,
      flashStyle: true,
    };
  }

  // Wrap to next style's first topic
  const currentStyleIndex = registry.findIndex((s) => s.id === currentStyleId);
  const nextStyleIndex = (currentStyleIndex + 1) % registry.length;
  const nextStyle = registry[nextStyleIndex];
  const nextTopic = nextStyle.topics[0];

  return {
    styleId: nextStyle.id,
    topicId: nextTopic.id,
    scene: 1,
    beat: 0,
    flashStyle: true,
  };
}

/**
 * Compute the previous navigation target.
 *
 * Topic-aware cycling (D81):
 * - If beat > 0: go to beat - 1.
 * - Else if scene > 1: go to scene - 1, last beat of that scene.
 * - Else (scene 1, beat 0):
 *   - If pure mode: return null.
 *   - If previous topic in this style: previous topic's last scene, last beat, flashStyle.
 *   - Else: previous style's last topic's last scene, last beat, flashStyle.
 */
export function computePrev(
  registry: StyleRegistryEntry[],
  currentStyleId: string,
  currentTopicId: string,
  scene: number,
  beat: number,
  isPureMode: boolean,
): NavTarget | null {
  const entry = findStyle(registry, currentStyleId);
  if (!entry) return null;

  const topicIndex = getTopicIndex(entry, currentTopicId);

  // Within current scene: go back beat
  if (beat > 0) {
    return {
      styleId: currentStyleId,
      topicId: currentTopicId,
      scene,
      beat: beat - 1,
      flashStyle: false,
    };
  }

  // Within current topic: go back scene
  if (scene > 1) {
    const prevScene = scene - 1;
    const lastBeat = getLastBeat(entry, topicIndex, prevScene);
    return {
      styleId: currentStyleId,
      topicId: currentTopicId,
      scene: prevScene,
      beat: lastBeat,
      flashStyle: false,
    };
  }

  // At scene 1, beat 0
  if (isPureMode) return null;

  // Check if there's a previous topic in this style
  if (topicIndex > 0) {
    const prevTopic = entry.topics[topicIndex - 1];
    const prevMeta = prevTopic.getMetadata("en");
    const lastSceneId = prevMeta.scenes[prevMeta.scenes.length - 1].id;
    const lastScene = prevMeta.scenes[prevMeta.scenes.length - 1];
    const lastBeat = lastScene.beats[lastScene.beats.length - 1]?.id ?? 0;
    return {
      styleId: currentStyleId,
      topicId: prevTopic.id,
      scene: lastSceneId,
      beat: lastBeat,
      flashStyle: true,
    };
  }

  // Wrap to previous style's last topic
  const currentStyleIndex = registry.findIndex((s) => s.id === currentStyleId);
  const prevStyleIndex =
    (currentStyleIndex - 1 + registry.length) % registry.length;
  const prevStyle = registry[prevStyleIndex];
  const prevTopic = prevStyle.topics[prevStyle.topics.length - 1];
  const prevMeta = prevTopic.getMetadata("en");
  const lastSceneId = prevMeta.scenes[prevMeta.scenes.length - 1].id;
  const lastScene = prevMeta.scenes[prevMeta.scenes.length - 1];
  const lastBeat = lastScene.beats[lastScene.beats.length - 1]?.id ?? 0;

  return {
    styleId: prevStyle.id,
    topicId: prevTopic.id,
    scene: lastSceneId,
    beat: lastBeat,
    flashStyle: true,
  };
}

/**
 * Jump to a specific scene within the current style/topic.
 * Clamps targetScene to 1-5.
 */
export function jumpScene(
  _registry: StyleRegistryEntry[],
  styleId: string,
  topicId: string,
  targetScene: number,
): NavTarget {
  const clamped = Math.max(1, Math.min(5, targetScene));
  return { styleId, topicId, scene: clamped, beat: 0 };
}

/**
 * Jump to a specific style (first topic) at scene 1, beat 0.
 * Returns null if the style id does not exist in the registry.
 */
export function jumpStyle(
  registry: StyleRegistryEntry[],
  targetStyleId: string,
): NavTarget | null {
  const entry = findStyle(registry, targetStyleId);
  if (!entry || entry.topics.length === 0) return null;
  return {
    styleId: targetStyleId,
    topicId: entry.topics[0].id,
    scene: 1,
    beat: 0,
  };
}

/**
 * Jump to a specific style + topic at scene 1, beat 0.
 * Returns null if not found.
 */
export function jumpTopic(
  registry: StyleRegistryEntry[],
  targetStyleId: string,
  targetTopicId: string,
): NavTarget | null {
  const entry = findStyle(registry, targetStyleId);
  if (!entry) return null;
  const topic = entry.topics.find((candidate) => candidate.id === targetTopicId);
  if (!topic) return null;
  return {
    styleId: targetStyleId,
    topicId: targetTopicId,
    scene: 1,
    beat: 0,
  };
}
