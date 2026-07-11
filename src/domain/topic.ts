import type { ComponentType } from "react";
import type { Evidence } from "./evidence";
import { isModelId, type ModelId } from "./model";

const SEMANTIC_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STRUCTURAL_TOPIC_ID_PATTERN = /^(?:\d+-|v\d+(?:-|$))/;

export interface TopicStageProps {
  scene: number;
  beat: number;
  language: "en" | "zh";
  isThumbnail: boolean;
  reducedMotion: boolean;
  onNavigate?: (scene: number, beat: number) => void;
}

export type TopicStage = ComponentType<TopicStageProps>;

export interface TopicMetadata {
  theme: string;
  densityLabel: string;
  heroScene: number;
  colors: {
    bg: string;
    ink: string;
    panel: string;
  };
  typography: {
    header: string;
    body: string;
  };
  tags: string[];
  fonts: string[];
  scenes: Array<{
    id: number;
    title: string;
    beats: Array<{
      id: number;
      action: string;
      title: string;
      body: string;
    }>;
  }>;
}

export const TOPIC_NAVIGATION_GEOMETRIES = [
  "ambient",
  "edge-scale",
  "path",
  "object-controller",
  "card-miniature",
  "typographic-index",
  "spatial-node",
] as const;

export const TOPIC_NAVIGATION_INVOCATIONS = [
  "persistent",
  "auto-hide",
  "proximity-reveal",
  "click-expand",
  "drag-scrub",
  "keyboard-focus",
  "gesture-hold",
] as const;

export const TOPIC_NAVIGATION_FEEDBACK = [
  "active-glow",
  "history-trail",
  "next-state-preview",
  "mechanical-displacement",
  "geometry-reflow",
  "material-color-change",
  "typographic-emphasis",
] as const;

export type TopicNavigation =
  | { mode: "none" }
  | {
      geometry: (typeof TOPIC_NAVIGATION_GEOMETRIES)[number];
      carrier: string;
      invocation: (typeof TOPIC_NAVIGATION_INVOCATIONS)[number];
      feedback: (typeof TOPIC_NAVIGATION_FEEDBACK)[number];
    };

export const SCENE_TRANSITION_KINDS = [
  "hard-cut",
  "crossfade",
  "dip-to-color",
  "push-x",
  "push-y",
  "diagonal-pan",
  "zoom-through",
  "dolly-pull",
  "focus-swap",
  "linear-wipe",
  "iris-open",
  "multi-blind",
  "page-turn",
  "paper-fold",
  "ink-spread",
  "grid-reveal",
  "split-merge",
  "card-carousel",
  "glitch",
  "scanline",
  "afterimage",
  "slide-x",
  "slide-y",
  "fade",
  "scale-fade",
  "wipe",
  "page-flip",
] as const;

export type SceneTransitionKind = (typeof SCENE_TRANSITION_KINDS)[number];

export interface TopicTransitionScore {
  "1->2": SceneTransitionKind;
  "2->3": SceneTransitionKind;
  "3->4": SceneTransitionKind;
  "4->5": SceneTransitionKind;
}

export interface TopicDefinition {
  id: string;
  styleId: string;
  title: { en: string; zh: string };
  modelId: ModelId;
  Stage: TopicStage;
  metadata: { en: TopicMetadata; zh: TopicMetadata };
  navigation: TopicNavigation;
  transitionScore: Readonly<TopicTransitionScore>;
  evidence: Evidence;
}

const TRANSITION_EDGES = ["1->2", "2->3", "3->4", "4->5"] as const;

function metadataStructure(metadata: TopicMetadata): string {
  return metadata.scenes
    .map((scene) => `${scene.id}:${scene.beats.map((beat) => beat.id).join(",")}`)
    .join("|");
}

export function defineTopic(topic: TopicDefinition): TopicDefinition {
  if (
    !SEMANTIC_ID_PATTERN.test(topic.id) ||
    STRUCTURAL_TOPIC_ID_PATTERN.test(topic.id)
  ) {
    throw new Error(
      `Invalid Topic ID "${topic.id}". Use semantic kebab-case without structural ordinals.`,
    );
  }
  if (!SEMANTIC_ID_PATTERN.test(topic.styleId)) {
    throw new Error(
      `Topic "${topic.id}" uses invalid Style ID "${topic.styleId}".`,
    );
  }
  if (!topic.title.en.trim() || !topic.title.zh.trim()) {
    throw new Error(
      `Topic "${topic.id}" requires non-empty English and Chinese titles.`,
    );
  }
  if (!isModelId(topic.modelId)) {
    throw new Error(
      `Topic "${topic.id}" uses unknown Model ID "${topic.modelId}".`,
    );
  }
  if (
    topic.metadata.en.scenes.length !== 5 ||
    topic.metadata.zh.scenes.length !== 5
  ) {
    throw new Error(
      `Topic "${topic.id}" metadata must define exactly five Scenes.`,
    );
  }
  if (
    metadataStructure(topic.metadata.en) !==
    metadataStructure(topic.metadata.zh)
  ) {
    throw new Error(
      `Topic "${topic.id}" metadata must use identical English and Chinese Scene and Beat IDs.`,
    );
  }
  if (
    !topic.transitionScore ||
    TRANSITION_EDGES.some((edge) => !topic.transitionScore[edge])
  ) {
    throw new Error(
      `Topic "${topic.id}" transitionScore must define all four Scene edges.`,
    );
  }
  if (
    !("mode" in topic.navigation) &&
    !SEMANTIC_ID_PATTERN.test(topic.navigation.carrier)
  ) {
    throw new Error(
      `Topic "${topic.id}" navigation carrier must be semantic kebab-case.`,
    );
  }
  if (
    (topic.evidence.kind === "facts" || topic.evidence.kind === "mixed") &&
    topic.evidence.sources.length === 0
  ) {
    throw new Error(`Topic "${topic.id}" factual Evidence requires a Source.`);
  }
  if (
    (topic.evidence.kind === "illustrative" ||
      topic.evidence.kind === "mixed") &&
    (!topic.evidence.boundary.en.trim() ||
      !topic.evidence.boundary.zh.trim())
  ) {
    throw new Error(
      `Topic "${topic.id}" illustrative Evidence requires a bilingual boundary.`,
    );
  }
  return topic;
}
