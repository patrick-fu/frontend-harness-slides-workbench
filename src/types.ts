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
  /** True when this is the outgoing scene clone during a framework-level slide transition. Skip enter animations. */
  isTransitionClone?: boolean;
}

/**
 * Metadata returned by each Style's getMetadata(lang) function.
 *
 * Used by the Envelope for: Overview cards, sidebar listing, filtering,
 * font preloading, and the bottom progress bar.
 */
export interface StyleMetadata {
  /** Two-digit string ID, e.g. "01" .. "48". */
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

/** A single version of a Style, produced by one Agent/model. */
export interface StyleVersion {
  /** Version ID, e.g. "v1", "v2" — internal ordering within the Style. */
  id: string;
  /** Topic name (human-readable), e.g. "决策的艺术", "Product Launch". */
  topic: string;
  /** Model that produced this version, e.g. "Doubao-Seed-Evolving". */
  model: string;
  /** The React component that renders this version. */
  component: React.ComponentType<BespokeStyleProps>;
  /** Returns localized metadata for this version. */
  getMetadata: (lang: "en" | "zh") => StyleMetadata;
}

/** A single entry in the Style registry — one Style with one or more Versions. */
export interface StyleRegistryEntry {
  /** Two-digit string ID, e.g. "01" .. "48". */
  id: string;
  /** Localized Style name (both languages for quick access without metadata lookup). */
  name: { en: string; zh: string };
  /** All versions of this Style, ordered by version ID. */
  versions: StyleVersion[];
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
