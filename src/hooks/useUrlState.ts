import { useState, useEffect, useCallback, useRef } from "react";

export interface UrlState {
  view: "overview" | "lab";
  styleId: string;
  scene: number;
  beat: number;
  pureMode: boolean;
  frozen: boolean;
}

const DEFAULT_STATE: UrlState = {
  view: "overview",
  styleId: "01",
  scene: 1,
  beat: 0,
  pureMode: false,
  frozen: false,
};

function parseHash(): UrlState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };

  const hash = window.location.hash.slice(1); // remove leading #
  if (!hash) return { ...DEFAULT_STATE };

  const params = new URLSearchParams(hash);
  const state: UrlState = { ...DEFAULT_STATE };

  const view = params.get("view");
  if (view === "overview" || view === "lab") state.view = view;

  const styleId = params.get("style");
  if (styleId) state.styleId = styleId;

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

function buildHash(state: UrlState): string {
  const params = new URLSearchParams();
  params.set("view", state.view);
  params.set("style", state.styleId);
  params.set("scene", String(state.scene));
  params.set("beat", String(state.beat));
  if (state.pureMode) params.set("pure", "1");
  if (state.frozen) params.set("frozen", "1");
  return params.toString();
}

/**
 * Hook that syncs application state with the URL hash.
 *
 * State shape:
 *   view: "overview" | "lab"
 *   styleId: string (e.g. "01", "17", "33")
 *   scene: number (1-5)
 *   beat: number (0-based)
 *   pureMode: boolean
 *   frozen: boolean
 *
 * URL format: #view=lab&style=01&scene=3&beat=2&pure=1&frozen=1
 */
export function useUrlState(): [
  UrlState,
  (updater: Partial<UrlState> | ((prev: UrlState) => Partial<UrlState>)) => void,
] {
  const [state, setState] = useState<UrlState>(() => parseHash());
  const isNavigatingRef = useRef(false);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    function handleHashChange() {
      if (isNavigatingRef.current) {
        isNavigatingRef.current = false;
        return;
      }
      setState(parseHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const updateState = useCallback(
    (
      updater: Partial<UrlState> | ((prev: UrlState) => Partial<UrlState>),
    ) => {
      setState((prev) => {
        const patch =
          typeof updater === "function" ? updater(prev) : updater;
        const next = { ...prev, ...patch };

        // Update URL hash
        if (typeof window !== "undefined") {
          isNavigatingRef.current = true;
          const hash = buildHash(next);
          const newUrl = `${window.location.pathname}${window.location.search}#${hash}`;
          window.history.replaceState(null, "", newUrl);
        }

        return next;
      });
    },
    [],
  );

  return [state, updateState];
}
