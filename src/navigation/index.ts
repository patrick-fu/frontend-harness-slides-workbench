import { resolveWorkbenchFilters } from "../domain/filter";
import type { ModelId } from "../domain/model";
import type { Band } from "../domain/style";

export type NavigationView = "overview" | "lab";
export type NavigationLanguage = "en" | "zh";
export type NavigationDirection = "next" | "prev";

export interface NavigationState {
  view: NavigationView;
  styleId: string;
  topicId: string;
  scene: number;
  beat: number;
  bands: string[];
  models: string[];
  lang: NavigationLanguage | null;
  pureMode: boolean;
  frozen: boolean;
}

interface NavigationBeat {
  id: number;
}

interface NavigationScene {
  id: number;
  beats: readonly NavigationBeat[];
}

interface NavigationTopic {
  id: string;
  styleId: string;
  modelId: string;
  metadata: {
    en: { scenes: readonly NavigationScene[] };
    zh: { scenes: readonly NavigationScene[] };
  };
}

export type NavigationRegistry = readonly {
  style: { id: string; band: string };
  topics: readonly NavigationTopic[];
}[];

export type NavigationIntent =
  | { type: "show-overview" }
  | { type: "reset-catalog" }
  | { type: "set-filters"; bands: string[]; models: string[] }
  | {
      type: "open-topic";
      topicId: string;
      styleId?: string;
      catalogScrollTop?: number;
    }
  | { type: "move"; direction: NavigationDirection }
  | { type: "jump-scene"; scene: number }
  | { type: "jump-position"; scene: number; beat: number }
  | { type: "set-language"; language: NavigationLanguage | null }
  | { type: "set-pure"; pureMode: boolean }
  | { type: "set-frozen"; frozen: boolean };

export interface NavigationHistoryLocation {
  pathname: string;
  search: string;
  state: unknown;
}

export interface NavigationHistoryAdapter {
  getLocation(): NavigationHistoryLocation;
  push(href: string, state?: unknown): void;
  replace(href: string, state?: unknown): void;
  reload(): void;
  subscribe(listener: () => void): () => void;
}

interface NavigationHistoryData {
  navigation?: {
    catalog?: {
      scrollTop?: number;
    };
  };
}

export interface NavigationStore {
  getSnapshot(): NavigationState;
  getCatalogScrollTop(): number | null;
  subscribe(listener: () => void): () => void;
  dispatch(intent: NavigationIntent): NavigationState;
  href(intent: NavigationIntent): string;
  reload(): void;
  dispose(): void;
}

function firstRegistryTopic(registry: NavigationRegistry) {
  for (const group of registry) {
    const topic = group.topics[0];
    if (topic) return topic;
  }
  return null;
}

function findTopic(registry: NavigationRegistry, topicId: string) {
  for (const group of registry) {
    const topic = group.topics.find((candidate) => candidate.id === topicId);
    if (topic) return { group, topic };
  }
  return null;
}

function integer(value: string | null, fallback: number) {
  if (value === null || value.trim() === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function clampToIds(value: number, ids: readonly number[], fallback: number) {
  if (ids.length === 0) return fallback;
  if (ids.includes(value)) return value;
  const ordered = [...ids].sort((left, right) => left - right);
  if (value <= ordered[0]!) return ordered[0]!;
  if (value >= ordered[ordered.length - 1]!) return ordered[ordered.length - 1]!;
  return ordered.find((candidate) => candidate >= value) ?? ordered[0]!;
}

function clampPosition(
  topic: NavigationTopic,
  sceneValue: number,
  beatValue: number,
) {
  const scenes = topic.metadata.en.scenes;
  const scene = clampToIds(
    sceneValue,
    scenes.map((candidate) => candidate.id),
    1,
  );
  const sceneDefinition =
    scenes.find((candidate) => candidate.id === scene) ?? scenes[0];
  const beat = clampToIds(
    beatValue,
    sceneDefinition?.beats.map((candidate) => candidate.id) ?? [],
    0,
  );
  return { scene, beat };
}

function defaultState(registry: NavigationRegistry): NavigationState {
  const topic = firstRegistryTopic(registry);
  return {
    view: "overview",
    styleId: topic?.styleId ?? "",
    topicId: topic?.id ?? "",
    scene: 1,
    beat: 0,
    bands: [],
    models: [],
    lang: null,
    pureMode: false,
    frozen: false,
  };
}

export function normalizeNavigationState(
  candidate: NavigationState,
  registry: NavigationRegistry,
): NavigationState {
  const resolved = findTopic(registry, candidate.topicId);
  if (!resolved) {
    return {
      ...candidate,
      scene: Math.max(1, Number.isInteger(candidate.scene) ? candidate.scene : 1),
      beat: Math.max(0, Number.isInteger(candidate.beat) ? candidate.beat : 0),
      bands: [...candidate.bands],
      models: [...candidate.models],
    };
  }

  const position = clampPosition(
    resolved.topic,
    candidate.scene,
    candidate.beat,
  );
  return {
    ...candidate,
    styleId: resolved.topic.styleId,
    ...position,
    bands: [...candidate.bands],
    models: [...candidate.models],
  };
}

export function parseNavigationState(
  search: string,
  registry: NavigationRegistry,
): NavigationState {
  const params = new URLSearchParams(search);
  const defaults = defaultState(registry);
  const view = params.get("view");
  const topicId = params.get("topic") || defaults.topicId;
  const styleId = params.get("style") || defaults.styleId;
  const lang = params.get("lang");
  const pure = params.get("pure");
  const frozen = params.get("frozen");

  return normalizeNavigationState(
    {
      ...defaults,
      view: view === "lab" || view === "overview" ? view : defaults.view,
      styleId,
      topicId,
      scene: integer(params.get("scene"), defaults.scene),
      beat: integer(params.get("beat"), defaults.beat),
      bands: params.getAll("band"),
      models: params.getAll("model"),
      lang: lang === "en" || lang === "zh" ? lang : null,
      pureMode: pure === "1" || pure === "true",
      frozen: frozen === "1" || frozen === "true",
    },
    registry,
  );
}

export function serializeNavigationState(state: NavigationState): string {
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

function flattenTopics(registry: NavigationRegistry) {
  return registry.flatMap((group) =>
    group.topics.map((topic) => ({
      topicId: topic.id,
      band: group.style.band as Band,
      modelId: topic.modelId as ModelId,
      topic,
    })),
  );
}

function lastPosition(topic: NavigationTopic) {
  const scenes = topic.metadata.en.scenes;
  const scene = scenes[scenes.length - 1];
  const beat = scene?.beats[scene.beats.length - 1];
  return { scene: scene?.id ?? 1, beat: beat?.id ?? 0 };
}

function move(
  state: NavigationState,
  registry: NavigationRegistry,
  direction: NavigationDirection,
): NavigationState {
  const resolved = findTopic(registry, state.topicId);
  if (!resolved) return state;
  const scenes = resolved.topic.metadata.en.scenes;
  const sceneIndex = scenes.findIndex((scene) => scene.id === state.scene);
  const scene = scenes[sceneIndex];
  if (!scene) return state;
  const beatIndex = scene.beats.findIndex((beat) => beat.id === state.beat);

  if (direction === "next") {
    const nextBeat = scene.beats[beatIndex + 1];
    if (nextBeat) return { ...state, beat: nextBeat.id };
    const nextScene = scenes[sceneIndex + 1];
    if (nextScene) {
      return {
        ...state,
        scene: nextScene.id,
        beat: nextScene.beats[0]?.id ?? 0,
      };
    }
  } else {
    const previousBeat = scene.beats[beatIndex - 1];
    if (previousBeat) return { ...state, beat: previousBeat.id };
    const previousScene = scenes[sceneIndex - 1];
    if (previousScene) {
      return {
        ...state,
        scene: previousScene.id,
        beat: previousScene.beats[previousScene.beats.length - 1]?.id ?? 0,
      };
    }
  }

  if (state.pureMode) return state;
  const topics = flattenTopics(registry);
  const topicIndex = topics.findIndex(({ topic }) => topic.id === state.topicId);
  if (topicIndex < 0 || topics.length === 0) return state;
  const cycleScope = resolveWorkbenchFilters(
    topics,
    state,
    state.topicId,
  ).matchingTopics;
  if (cycleScope.length === 0) return state;
  const scopeIndex = cycleScope.findIndex(
    (entry) => entry.topicId === state.topicId,
  );
  const nextEntry =
    scopeIndex >= 0
      ? cycleScope[
          (scopeIndex + (direction === "next" ? 1 : -1) + cycleScope.length) %
            cycleScope.length
        ]
      : direction === "next"
        ? cycleScope.find((entry) => topics.indexOf(entry) > topicIndex) ??
          cycleScope[0]
        : cycleScope.findLast((entry) => topics.indexOf(entry) < topicIndex) ??
          cycleScope[cycleScope.length - 1];
  if (!nextEntry) return state;
  const nextTopic = nextEntry.topic;
  const position =
    direction === "next"
      ? {
          scene: nextTopic.metadata.en.scenes[0]?.id ?? 1,
          beat: nextTopic.metadata.en.scenes[0]?.beats[0]?.id ?? 0,
        }
      : lastPosition(nextTopic);
  return {
    ...state,
    styleId: nextTopic.styleId,
    topicId: nextTopic.id,
    ...position,
  };
}

function reduceIntent(
  state: NavigationState,
  intent: NavigationIntent,
  registry: NavigationRegistry,
): NavigationState {
  switch (intent.type) {
    case "show-overview":
      return { ...state, view: "overview", pureMode: false };
    case "reset-catalog":
      return {
        ...state,
        view: "overview",
        bands: [],
        models: [],
        pureMode: false,
      };
    case "set-filters":
      return {
        ...state,
        bands: [...intent.bands],
        models: [...intent.models],
      };
    case "open-topic": {
      const resolved = findTopic(registry, intent.topicId);
      if (!resolved) return state;
      const firstScene = resolved.topic.metadata.en.scenes[0];
      return {
        ...state,
        view: "lab",
        styleId: resolved.topic.styleId,
        topicId: resolved.topic.id,
        scene: firstScene?.id ?? 1,
        beat: firstScene?.beats[0]?.id ?? 0,
        pureMode: false,
      };
    }
    case "move":
      return move(state, registry, intent.direction);
    case "jump-scene": {
      const resolved = findTopic(registry, state.topicId);
      if (!resolved) return state;
      const scene = clampToIds(
        intent.scene,
        resolved.topic.metadata.en.scenes.map((candidate) => candidate.id),
        state.scene,
      );
      const definition = resolved.topic.metadata.en.scenes.find(
        (candidate) => candidate.id === scene,
      );
      return { ...state, scene, beat: definition?.beats[0]?.id ?? 0 };
    }
    case "jump-position": {
      const resolved = findTopic(registry, state.topicId);
      if (!resolved) return state;
      return {
        ...state,
        ...clampPosition(resolved.topic, intent.scene, intent.beat),
      };
    }
    case "set-language":
      return { ...state, lang: intent.language };
    case "set-pure":
      return { ...state, pureMode: intent.pureMode };
    case "set-frozen":
      return { ...state, frozen: intent.frozen };
  }
}

function historyMode(
  previous: NavigationState,
  next: NavigationState,
  intent: NavigationIntent,
): "push" | "replace" {
  if (
    (intent.type === "open-topic" && previous.view === "overview") ||
    (intent.type === "show-overview" && previous.view === "lab")
  ) {
    return "push";
  }
  return next.view !== previous.view ? "push" : "replace";
}

function isSameState(left: NavigationState, right: NavigationState) {
  return serializeNavigationState(left) === serializeNavigationState(right);
}

function mergeHistoryState(state: unknown, scrollTop: number | null) {
  const base =
    state && typeof state === "object" ? { ...(state as Record<string, unknown>) } : {};
  const existingNavigation =
    base.navigation && typeof base.navigation === "object"
      ? { ...(base.navigation as Record<string, unknown>) }
      : {};
  const existingCatalog =
    existingNavigation.catalog && typeof existingNavigation.catalog === "object"
      ? { ...(existingNavigation.catalog as Record<string, unknown>) }
      : {};
  if (scrollTop !== null) existingCatalog.scrollTop = scrollTop;
  existingNavigation.catalog = existingCatalog;
  base.navigation = existingNavigation;
  return base;
}

function readScrollTop(state: unknown): number | null {
  const value = (state as NavigationHistoryData | null)?.navigation?.catalog
    ?.scrollTop;
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

function requiresCanonicalReplace(
  search: string,
  state: NavigationState,
  registry: NavigationRegistry,
) {
  const params = new URLSearchParams(search);
  const topicId = params.get("topic");
  if (!topicId) return false;
  const resolved = findTopic(registry, topicId);
  if (!resolved) return false;
  if (
    params.getAll("style").length !== 1 ||
    params.get("style") !== state.styleId
  ) {
    return true;
  }
  if (params.has("scene") && params.get("scene") !== String(state.scene)) {
    return true;
  }
  if (params.has("beat") && params.get("beat") !== String(state.beat)) {
    return true;
  }
  return false;
}

export function createNavigationStore({
  registry,
  history,
}: {
  registry: NavigationRegistry;
  history: NavigationHistoryAdapter;
}): NavigationStore {
  let location = history.getLocation();
  let state = parseNavigationState(location.search, registry);
  let catalogScrollTop = readScrollTop(location.state);
  const listeners = new Set<() => void>();
  let unsubscribeHistory: (() => void) | null = null;

  const notify = () => {
    for (const listener of listeners) listener();
  };

  const syncFromHistory = () => {
    location = history.getLocation();
    state = parseNavigationState(location.search, registry);
    catalogScrollTop = readScrollTop(location.state);
    if (requiresCanonicalReplace(location.search, state, registry)) {
      history.replace(
        `${location.pathname}${serializeNavigationState(state)}`,
        location.state,
      );
      location = history.getLocation();
    }
    notify();
  };

  const start = () => {
    if (unsubscribeHistory) return;
    unsubscribeHistory = history.subscribe(syncFromHistory);
    if (requiresCanonicalReplace(location.search, state, registry)) {
      history.replace(
        `${location.pathname}${serializeNavigationState(state)}`,
        location.state,
      );
      location = history.getLocation();
    }
  };

  return {
    getSnapshot: () => state,
    getCatalogScrollTop: () => catalogScrollTop,
    subscribe(listener) {
      listeners.add(listener);
      start();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          unsubscribeHistory?.();
          unsubscribeHistory = null;
        }
      };
    },
    dispatch(intent) {
      const previous = state;
      const next = normalizeNavigationState(
        reduceIntent(previous, intent, registry),
        registry,
      );
      const resetsCatalogScroll =
        intent.type === "reset-catalog" && catalogScrollTop !== 0;
      if (isSameState(previous, next) && !resetsCatalogScroll) return state;

      location = history.getLocation();
      if (intent.type === "reset-catalog") catalogScrollTop = 0;
      if (
        intent.type === "open-topic" &&
        previous.view === "overview" &&
        typeof intent.catalogScrollTop === "number"
      ) {
        catalogScrollTop = Math.max(0, intent.catalogScrollTop);
        const currentHistoryState = mergeHistoryState(
          location.state,
          catalogScrollTop,
        );
        history.replace(
          `${location.pathname}${location.search}`,
          currentHistoryState,
        );
        location = history.getLocation();
      }

      const href = `${location.pathname}${serializeNavigationState(next)}`;
      const historyState = mergeHistoryState(location.state, catalogScrollTop);
      history[historyMode(previous, next, intent)](href, historyState);
      state = next;
      location = history.getLocation();
      notify();
      return state;
    },
    href(intent) {
      const next = normalizeNavigationState(
        reduceIntent(state, intent, registry),
        registry,
      );
      return `${history.getLocation().pathname}${serializeNavigationState(next)}`;
    },
    reload() {
      history.reload();
    },
    dispose() {
      unsubscribeHistory?.();
      unsubscribeHistory = null;
      listeners.clear();
    },
  };
}

export function createBrowserHistoryAdapter(
  browserWindow: Window,
): NavigationHistoryAdapter {
  return {
    getLocation: () => ({
      pathname: browserWindow.location.pathname,
      search: browserWindow.location.search,
      state: browserWindow.history.state,
    }),
    push(href, state) {
      browserWindow.history.pushState(state ?? null, "", href);
    },
    replace(href, state) {
      browserWindow.history.replaceState(state ?? null, "", href);
    },
    reload() {
      browserWindow.history.go(0);
    },
    subscribe(listener) {
      browserWindow.addEventListener("popstate", listener);
      return () => browserWindow.removeEventListener("popstate", listener);
    },
  };
}

export interface MemoryHistoryAdapter extends NavigationHistoryAdapter {
  readonly entries: string[];
  readonly index: number;
  back(): void;
  forward(): void;
}

export function createMemoryHistoryAdapter(
  initialHref = "/",
  initialState: unknown = null,
): MemoryHistoryAdapter {
  const entries = [initialHref];
  const states = [initialState];
  let index = 0;
  const listeners = new Set<() => void>();
  const parse = (href: string): NavigationHistoryLocation => {
    const url = new URL(href, "https://navigation.local");
    return { pathname: url.pathname, search: url.search, state: states[index] };
  };
  const notify = () => {
    for (const listener of listeners) listener();
  };

  return {
    entries,
    get index() {
      return index;
    },
    getLocation: () => parse(entries[index]!),
    push(href, state) {
      entries.splice(index + 1);
      states.splice(index + 1);
      entries.push(href);
      states.push(state ?? null);
      index = entries.length - 1;
    },
    replace(href, state) {
      entries[index] = href;
      states[index] = state ?? states[index] ?? null;
    },
    reload() {},
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    back() {
      if (index === 0) return;
      index -= 1;
      notify();
    },
    forward() {
      if (index >= entries.length - 1) return;
      index += 1;
      notify();
    },
  };
}
