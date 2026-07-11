import { useState, useEffect, useCallback, useRef } from "react";

export interface UrlState {
  view: "overview" | "lab";
  styleId: string;
  topicId: string;
  scene: number;
  beat: number;
  bands: string[];
  models: string[];
  lang: "en" | "zh" | null;
  pureMode: boolean;
  frozen: boolean;
}

export interface UrlStateUpdateOptions {
  history?: "push" | "replace";
}

export type UrlStateUpdater =
  | Partial<UrlState>
  | ((prev: UrlState) => Partial<UrlState>);

export type SetUrlState = (
  updater: UrlStateUpdater,
  options?: UrlStateUpdateOptions,
) => void;

const DEFAULT_STATE: UrlState = {
  view: "overview",
  styleId: "minimal-product-keynote",
  topicId: "product-keynote",
  scene: 1,
  beat: 0,
  bands: [],
  models: [],
  lang: null,
  pureMode: false,
  frozen: false,
};

function parseSearch(): UrlState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };

  const params = new URLSearchParams(window.location.search);
  const state: UrlState = { ...DEFAULT_STATE };

  const view = params.get("view");
  if (view === "overview" || view === "lab") state.view = view;

  const styleId = params.get("style");
  if (styleId) state.styleId = styleId;

  const topicId = params.get("topic");
  if (topicId) state.topicId = topicId;

  const scene = params.get("scene");
  if (scene) {
    const n = parseInt(scene, 10);
    if (!isNaN(n) && n >= 1 && n <= 5) state.scene = n;
  }

  const beat = params.get("beat");
  if (beat) {
    const n = parseInt(beat, 10);
    if (!isNaN(n) && n >= 0) state.beat = n;
  }

  state.bands = params.getAll("band").filter(Boolean);
  state.models = params.getAll("model").filter(Boolean);

  const lang = params.get("lang");
  if (lang === "en" || lang === "zh") state.lang = lang;

  const pureMode = params.get("pure");
  if (pureMode === "1" || pureMode === "true") state.pureMode = true;

  const frozen = params.get("frozen");
  if (frozen === "1" || frozen === "true") state.frozen = true;

  return state;
}

function buildSearch(state: UrlState): string {
  const params = new URLSearchParams();
  params.set("view", state.view);
  params.set("style", state.styleId);
  params.set("topic", state.topicId);
  params.set("scene", String(state.scene));
  params.set("beat", String(state.beat));
  for (const band of state.bands) params.append("band", band);
  for (const model of state.models) params.append("model", model);
  if (state.lang) params.set("lang", state.lang);
  if (state.pureMode) params.set("pure", "1");
  if (state.frozen) params.set("frozen", "1");
  return `?${params.toString()}`;
}

function getHistoryMode(
  previous: UrlState,
  next: UrlState,
  options: UrlStateUpdateOptions | undefined,
): "push" | "replace" {
  if (options?.history) return options.history;

  return previous.view !== next.view ||
    previous.styleId !== next.styleId ||
    previous.topicId !== next.topicId
    ? "push"
    : "replace";
}

/**
 * Hook that syncs application state with the URL query string.
 *
 * State shape:
 *   view: "overview" | "lab"
 *   styleId: string (e.g. "minimal-product-keynote")
 *   topicId: string (e.g. "product-keynote")
 *   scene: number (1-5)
 *   beat: number (0-based)
 *   bands: repeated Overview Band criteria
 *   models: repeated Overview Model ID criteria
 *   lang: temporary "en" / "zh" override, or null when absent
 *   pureMode: boolean
 *   frozen: boolean
 *
 * URL format: ?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=3&beat=2&band=minimal-keynote&model=GPT+5.5&lang=en&pure=1&frozen=1
 */
export function useUrlState(): [UrlState, SetUrlState] {
  const [state, setState] = useState<UrlState>(() => parseSearch());
  const stateRef = useRef(state);

  // Listen for browser back/forward navigation.
  useEffect(() => {
    function handlePopState() {
      const next = parseSearch();
      stateRef.current = next;
      setState(next);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateState = useCallback(
    (updater: UrlStateUpdater, options?: UrlStateUpdateOptions) => {
      const previous = stateRef.current;
      const patch =
        typeof updater === "function" ? updater(previous) : updater;
      const next = { ...previous, ...patch };

      // History is an external side effect. Keep it outside React's state
      // updater because StrictMode may invoke updater functions more than once.
      if (typeof window !== "undefined") {
        const search = buildSearch(next);
        const newUrl = `${window.location.pathname}${search}`;
        const historyMode = getHistoryMode(previous, next, options);
        window.history[`${historyMode}State`](null, "", newUrl);
      }

      stateRef.current = next;
      setState(next);
    },
    [],
  );

  return [state, updateState];
}
