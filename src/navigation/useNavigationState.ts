import { useCallback, useState, useSyncExternalStore } from "react";
import type { RuntimeCatalogStyleGroup } from "../catalog/runtime-catalog";
import {
  createBrowserHistoryAdapter,
  createNavigationStore,
  type NavigationIntent,
  type NavigationState,
} from ".";

export interface NavigationStateBinding {
  state: NavigationState;
  dispatch: (intent: NavigationIntent) => NavigationState;
  href: (intent: NavigationIntent) => string;
  reload: () => void;
  catalogScrollTop: number | null;
}

/** React observes one Navigation Store; it does not own routing policy. */
export function useNavigationState(
  registry: readonly RuntimeCatalogStyleGroup[],
): NavigationStateBinding {
  const [store] = useState(() =>
    createNavigationStore({
      registry,
      history: createBrowserHistoryAdapter(window),
    }),
  );
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  return {
    state,
    dispatch: useCallback((intent) => store.dispatch(intent), [store]),
    href: useCallback((intent) => store.href(intent), [store]),
    reload: useCallback(() => store.reload(), [store]),
    catalogScrollTop: store.getCatalogScrollTop(),
  };
}
