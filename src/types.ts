import type { SceneTransitionKind } from "./styles/SpatialSceneTrack";

/**
 * Props interface for every Style component.
 *
 * A Style is a self-contained slide deck built in isolation by a sub-agent
 * who does not know the Workbench exists. The Envelope passes these props;
 * the Style renders inside the 1920×1080 Stage using cqw/cqh units.
 */
export interface BespokeStyleProps {
  /** Current scene index (1 to 5). */
  scene: number;
  /** Current beat index within the scene (0-based, dynamic length). */
  beat: number;
  /** UI language. */
  language: "en" | "zh";
  /** True when rendered in an Overview thumbnail card. */
  isThumbnail: boolean;
  /** True when the user has requested reduced motion. */
  reducedMotion: boolean;
  /** Called by the Style's internal navigation to request a jump. */
  onNavigate?: (scene: number, beat: number) => void;
  /**
   * @deprecated Legacy outgoing-clone transition hook. New style topics should
   * use framework-owned scene lifecycle helpers such as SpatialSceneTrack instead.
   */
  isTransitionClone?: boolean;
}

/** A concrete Topic Stage implementation, loaded only by the Player. */
export type TopicComponent = React.ComponentType<BespokeStyleProps>;

/** A rendered Topic may be concrete (authoring) or React.lazy (runtime). */
export type StyleComponent =
  | TopicComponent
  | React.LazyExoticComponent<TopicComponent>;

/** Imports one concrete Topic Stage implementation on demand. */
export type TopicComponentLoader = () => Promise<TopicComponent>;

/**
 * Metadata returned by each Style's getMetadata(lang) function.
 *
 * Used by the Envelope for: Overview cards, sidebar listing, filtering,
 * font preloading, and the bottom progress bar.
 */
export interface StyleMetadata {
  /** Stable style slug, e.g. "minimal-product-keynote". */
  id: string;
  /** Visual family band. */
  band:
    | "minimal-keynote"
    | "balanced-hybrid"
    | "editorial-print"
    | "craft-cultural"
    | "contemporary-digital"
    | "text-report";
  /** Localized Style name. */
  name: string;
  /** Localized narrative theme description. */
  theme: string;
  /** Localized density label (e.g. "Sparse", "Reading-First"). */
  densityLabel: string;
  /** Which scene (1-5) to show in the Overview thumbnail. */
  heroScene: number;
  /** Color tokens for card backgrounds and Envelope accents. */
  colors: {
    bg: string;
    ink: string;
    panel: string;
  };
  /** Typography hints for metadata display. */
  typography: {
    header: string;
    body: string;
  };
  /** Filter tags (mood, tone, formality, density, scheme, motion, aliases). */
  tags: string[];
  /**
   * Font families used by this Style.
   * Prefix CJK fonts with "cjk:" for lazy loading, e.g. "cjk:Noto Serif SC".
   */
  fonts: string[];
  /** Scene definitions with beats. */
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

/** Three independent axes that keep coordinated topic navigation diverse. */
export interface TopicNavigationProfile {
  geometry: (typeof TOPIC_NAVIGATION_GEOMETRIES)[number];
  /** Stable, topic-specific carrier slug; unique inside a coordinated Topic Set. */
  carrier: string;
  invocation: (typeof TOPIC_NAVIGATION_INVOCATIONS)[number];
  feedback: (typeof TOPIC_NAVIGATION_FEEDBACK)[number];
}

/** An intentional absence of internal navigation, not an omitted contract. */
export interface TopicNavigationNone {
  mode: "none";
}

export type TopicNavigation = TopicNavigationProfile | TopicNavigationNone;

export function hasVisibleTopicNavigation(
  navigation: TopicNavigation | undefined,
): navigation is TopicNavigationProfile {
  return Boolean(navigation && !("mode" in navigation));
}

/** One claim-scoped, traceable source in a coordinated Topic facts packet. */
export interface TopicSource {
  authority?: string;
  title?: string;
  citation?: string;
  url: string;
  supports: string;
}

/** Sources remain the single fact record; evidence classifies their interpretation. */
export type TopicEvidence =
  | {
      kind: "facts";
    }
  | {
      kind: "illustrative";
      boundary: { en: string; zh: string };
      /** The Envelope displays the boundary unless the Topic owns it in-Stage. */
      display?: "envelope" | "stage";
    };

export interface TopicTransitionScore {
  "1->2": SceneTransitionKind;
  "2->3": SceneTransitionKind;
  "3->4": SceneTransitionKind;
  "4->5": SceneTransitionKind;
}

/** A single topic implementation of a Style, produced by one Agent/model. */
export interface StyleTopic {
  /** Stable topic ID, e.g. "product-keynote" or "quiet-launch". */
  id: string;
  /** Localized topic name shown in topic navigation. */
  topic: { en: string; zh: string };
  /** Model that produced this topic, e.g. "Doubao-Seed-Evolving". */
  model: string;
  /** The React component that renders this topic. Runtime entries use React.lazy. */
  component: StyleComponent;
  /** Resolves the concrete Stage component without loading unrelated Topics. */
  loadComponent?: TopicComponentLoader;
  /** Returns localized metadata for this topic. */
  getMetadata: (lang: "en" | "zh") => StyleMetadata;
  /** Optional for legacy topics; required by coordinated Topic Set protocols. */
  navigation?: TopicNavigation;
  /** Identifies a coordinated Topic Set without introducing version aliases. */
  topicSet?: string;
  /** Source-backed claims cite traceable records; illustrative Topics may omit them. */
  sources?: readonly TopicSource[];
  /** Distinguishes source-backed facts from intentionally illustrative content. */
  evidence?: TopicEvidence;
  /** Four authored scene edges; optional for legacy topics. */
  transitionScore?: Readonly<TopicTransitionScore>;
}

/** Static Catalog data, generated from the authoring source and safe at startup. */
export interface CatalogTopicManifest {
  id: string;
  topic: StyleTopic["topic"];
  model: string;
  metadata: Record<"en" | "zh", StyleMetadata>;
  /** Vite-relative path to the Topic module's default component export. */
  modulePath: string;
  navigation?: TopicNavigation;
  topicSet?: string;
  sources?: readonly TopicSource[];
  evidence?: TopicEvidence;
  transitionScore?: Readonly<TopicTransitionScore>;
}

export interface CatalogStyleManifest {
  id: string;
  name: StyleRegistryEntry["name"];
  topics: CatalogTopicManifest[];
}

/** Runtime Player entry: Catalog metadata plus a guaranteed component loader. */
export interface LoadableStyleTopic extends StyleTopic {
  loadComponent: TopicComponentLoader;
}

export interface LoadableStyleRegistryEntry
  extends Omit<StyleRegistryEntry, "topics"> {
  topics: LoadableStyleTopic[];
}

/** A single entry in the Style registry — one Style with one or more Topics. */
export interface StyleRegistryEntry {
  /** Stable style slug. Registry array order, not this ID, controls sequencing. */
  id: string;
  /** Localized Style name (both languages for quick access without metadata lookup). */
  name: { en: string; zh: string };
  /** All topics of this Style, ordered by registry position. */
  topics: StyleTopic[];
}

/** Metadata for a single scene, used by layout controls. */
export interface SceneMetadata {
  id: number;
  title: string;
  beats: Array<{
    id: number;
    action: string;
    title: string;
    body: string;
  }>;
}
