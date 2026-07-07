import { useState, useEffect, useCallback } from "react";

export interface UrlState {
  view: "overview" | "lab";
  styleId: string;
  topicId: string;
  scene: number;
  beat: number;
  pureMode: boolean;
  frozen: boolean;
}

const DEFAULT_STATE: UrlState = {
  view: "overview",
  styleId: "minimal-product-keynote",
  topicId: "product-keynote",
  scene: 1,
  beat: 0,
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
  if (state.pureMode) params.set("pure", "1");
  if (state.frozen) params.set("frozen", "1");
  return `?${params.toString()}`;
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
 *   pureMode: boolean
 *   frozen: boolean
 *
 * URL format: ?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=3&beat=2&pure=1&frozen=1
 */
export function useUrlState(): [
  UrlState,
  (updater: Partial<UrlState> | ((prev: UrlState) => Partial<UrlState>)) => void,
] {
  const [state, setState] = useState<UrlState>(() => parseSearch());

  // Listen for browser back/forward navigation.
  useEffect(() => {
    function handlePopState() {
      setState(parseSearch());
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateState = useCallback(
    (
      updater: Partial<UrlState> | ((prev: UrlState) => Partial<UrlState>),
    ) => {
      setState((prev) => {
        const patch =
          typeof updater === "function" ? updater(prev) : updater;
        const next = { ...prev, ...patch };

        // Update URL search via replaceState (does NOT fire popstate)
        if (typeof window !== "undefined") {
          const search = buildSearch(next);
          const newUrl = `${window.location.pathname}${search}`;
          window.history.replaceState(null, "", newUrl);
        }

        return next;
      });
    },
    [],
  );

  return [state, updateState];
}
