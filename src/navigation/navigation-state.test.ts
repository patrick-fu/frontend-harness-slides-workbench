import { describe, expect, it, vi } from "vitest";
import {
  createBrowserHistoryAdapter,
  createMemoryHistoryAdapter,
  createNavigationStore,
  normalizeNavigationState,
  parseNavigationState,
  serializeNavigationState,
  type NavigationIntent,
  type NavigationState,
} from ".";

function makeMetadata(sceneBeats: readonly (readonly number[])[]) {
  return {
    scenes: sceneBeats.map((beats, sceneIndex) => ({
      id: sceneIndex + 1,
      beats: beats.map((id) => ({ id })),
    })),
  };
}

function makeTopic(
  id: string,
  styleId: string,
  sceneBeats: readonly (readonly number[])[],
  modelId: string,
) {
  const metadata = makeMetadata(sceneBeats);
  return { id, styleId, modelId, metadata: { en: metadata, zh: metadata } };
}

const registry = [
  {
    style: { id: "alpha-style", band: "minimal-keynote" },
    topics: [
      makeTopic("alpha-one", "alpha-style", [[0, 1], [0], [0, 1], [0], [0]], "Model A"),
      makeTopic("alpha-two", "alpha-style", [[0], [0], [0], [0], [0]], "Model B"),
    ],
  },
  {
    style: { id: "beta-style", band: "text-report" },
    topics: [
      makeTopic("beta-one", "beta-style", [[0], [0, 1, 2], [0], [0], [0, 1]], "Model A"),
    ],
  },
];

function expectedState(
  patch: Partial<NavigationState> = {},
): NavigationState {
  return {
    view: "overview",
    styleId: "alpha-style",
    topicId: "alpha-one",
    scene: 1,
    beat: 0,
    bands: [],
    models: [],
    lang: null,
    pureMode: false,
    frozen: false,
    ...patch,
  };
}

describe("Navigation State query seam", () => {
  it.each([
    {
      name: "canonicalizes a stale Style from global Topic identity and clamps metadata bounds",
      search:
        "?view=lab&style=stale-style&topic=beta-one&scene=99&beat=99&band=unavailable-band&model=unavailable-model&lang=zh&pure=true&frozen=1",
      expected: expectedState({
        view: "lab",
        styleId: "beta-style",
        topicId: "beta-one",
        scene: 5,
        beat: 1,
        bands: ["unavailable-band"],
        models: ["unavailable-model"],
        lang: "zh",
        pureMode: true,
        frozen: true,
      }),
    },
    {
      name: "retains an unknown Topic and its supplied Style for Not Found",
      search: "?view=lab&style=beta-style&topic=missing-topic&scene=0&beat=-1",
      expected: expectedState({
        view: "lab",
        styleId: "beta-style",
        topicId: "missing-topic",
      }),
    },
    {
      name: "retains an unknown Topic and Style for Not Found",
      search: "?view=lab&style=missing-style&topic=missing-topic&scene=wat&beat=wat",
      expected: expectedState({
        view: "lab",
        styleId: "missing-style",
        topicId: "missing-topic",
      }),
    },
    {
      name: "uses the Registry default only when Topic is absent",
      search: "?view=lab&style=beta-style&scene=3&beat=0",
      expected: expectedState({ view: "lab", scene: 3, beat: 0 }),
    },
  ])("$name", ({ search, expected }) => {
    expect(parseNavigationState(search, registry)).toEqual(expected);
  });

  it("preserves unresolved repeated filter criteria and serializes the public query vocabulary", () => {
    const state = parseNavigationState(
      "?view=overview&band=minimal-keynote&band=unavailable-band&model=GPT%205.5&model=unavailable-model",
      registry,
    );

    expect(state.bands).toEqual(["minimal-keynote", "unavailable-band"]);
    expect(state.models).toEqual(["GPT 5.5", "unavailable-model"]);
    expect(serializeNavigationState(state)).toBe(
      "?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0&band=minimal-keynote&band=unavailable-band&model=GPT+5.5&model=unavailable-model",
    );
  });

  it("keeps empty repeated filter values unresolved instead of broadening discovery", () => {
    const state = parseNavigationState(
      "?view=overview&band=&model=",
      registry,
    );

    expect(state.bands).toEqual([""]);
    expect(state.models).toEqual([""]);
    expect(serializeNavigationState(state)).toContain("band=&model=");
  });

  it.each([
    expectedState(),
    expectedState({
      view: "lab",
      styleId: "beta-style",
      topicId: "beta-one",
      scene: 2,
      beat: 2,
      bands: ["unknown-band"],
      models: ["unknown-model", "GPT 5.5"],
      lang: "en",
      pureMode: true,
      frozen: true,
    }),
  ])("round-trips normalized Navigation State %#", (state) => {
    const normalized = normalizeNavigationState(state, registry);
    expect(parseNavigationState(serializeNavigationState(normalized), registry)).toEqual(
      normalized,
    );
  });
});

describe("Navigation State semantic intent seam", () => {
  interface TransitionCase {
    name: string;
    initialHref: string;
    intent: NavigationIntent;
    expected: Partial<NavigationState>;
    entryCount: number;
  }

  const cases: TransitionCase[] = [
    {
      name: "show-overview crosses Player to Catalog with push",
      initialHref: "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=2&beat=0&pure=1",
      intent: { type: "show-overview" },
      expected: { view: "overview", pureMode: false },
      entryCount: 2,
    },
    {
      name: "reset-catalog replaces discovery criteria in place",
      initialHref: "/workbench?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0&band=old&model=old&pure=1",
      intent: { type: "reset-catalog" },
      expected: { bands: [], models: [], pureMode: false },
      entryCount: 1,
    },
    {
      name: "set-filters preserves unresolved criteria with replace",
      initialHref: "/workbench?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      intent: { type: "set-filters", bands: ["unavailable-band"], models: ["unavailable-model"] },
      expected: { bands: ["unavailable-band"], models: ["unavailable-model"] },
      entryCount: 1,
    },
    {
      name: "open-topic pushes from Catalog and resolves global Topic Style",
      initialHref: "/workbench?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      intent: { type: "open-topic", styleId: "stale-style", topicId: "beta-one" },
      expected: { view: "lab", styleId: "beta-style", topicId: "beta-one", scene: 1, beat: 0 },
      entryCount: 2,
    },
    {
      name: "open-topic replaces inside Player",
      initialHref: "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=3&beat=1",
      intent: { type: "open-topic", topicId: "alpha-two" },
      expected: { view: "lab", styleId: "alpha-style", topicId: "alpha-two", scene: 1, beat: 0 },
      entryCount: 1,
    },
    {
      name: "move replaces sequence destinations",
      initialHref: "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      intent: { type: "move", direction: "next" },
      expected: { scene: 1, beat: 1 },
      entryCount: 1,
    },
    {
      name: "jump-scene starts at its metadata first Beat with replace",
      initialHref: "/workbench?view=lab&style=beta-style&topic=beta-one&scene=1&beat=0",
      intent: { type: "jump-scene", scene: 2 },
      expected: { scene: 2, beat: 0 },
      entryCount: 1,
    },
    {
      name: "jump-position clamps the Beat against the selected Scene metadata",
      initialHref: "/workbench?view=lab&style=beta-style&topic=beta-one&scene=1&beat=0",
      intent: { type: "jump-position", scene: 2, beat: 99 },
      expected: { scene: 2, beat: 2 },
      entryCount: 1,
    },
    {
      name: "set-language replaces the temporary language override",
      initialHref: "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      intent: { type: "set-language", language: "zh" },
      expected: { lang: "zh" },
      entryCount: 1,
    },
    {
      name: "set-pure replaces display state",
      initialHref: "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      intent: { type: "set-pure", pureMode: true },
      expected: { pureMode: true },
      entryCount: 1,
    },
    {
      name: "set-frozen replaces display state",
      initialHref: "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      intent: { type: "set-frozen", frozen: true },
      expected: { frozen: true },
      entryCount: 1,
    },
  ];

  it.each(cases)("$name", ({ initialHref, intent, expected, entryCount }) => {
    const history = createMemoryHistoryAdapter(initialHref);
    const store = createNavigationStore({ registry, history });

    store.dispatch(intent);

    expect(store.getSnapshot()).toMatchObject(expected);
    expect(history.entries).toHaveLength(entryCount);
  });

  it("delegates an exact-entry reload to the History adapter", () => {
    const initialHref =
      "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=2&beat=1";
    const initialState = {
      external: "keep",
      navigation: { catalog: { scrollTop: 420 } },
    };
    const history = createMemoryHistoryAdapter(initialHref, initialState);
    const reload = vi.spyOn(history, "reload");
    const store = createNavigationStore({ registry, history });

    store.reload();

    expect(reload).toHaveBeenCalledTimes(1);
    expect(history.entries).toEqual([initialHref]);
    expect(history.getLocation().state).toEqual(initialState);
  });

  it("derives next and previous movement from Registry position, including cross-Topic wrap", () => {
    const history = createMemoryHistoryAdapter(
      "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=5&beat=0",
    );
    const store = createNavigationStore({ registry, history });

    store.dispatch({ type: "move", direction: "next" });
    expect(store.getSnapshot()).toMatchObject({
      styleId: "alpha-style",
      topicId: "alpha-two",
      scene: 1,
      beat: 0,
    });

    store.dispatch({ type: "jump-position", scene: 5, beat: 0 });
    store.dispatch({ type: "move", direction: "next" });
    expect(store.getSnapshot()).toMatchObject({
      styleId: "beta-style",
      topicId: "beta-one",
      scene: 1,
      beat: 0,
    });

    store.dispatch({ type: "move", direction: "prev" });
    expect(store.getSnapshot()).toMatchObject({
      styleId: "alpha-style",
      topicId: "alpha-two",
      scene: 5,
      beat: 0,
    });

    const reordered = [registry[1]!, registry[0]!];
    const reorderedStore = createNavigationStore({
      registry: reordered,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=beta-style&topic=beta-one&scene=5&beat=1",
      ),
    });
    reorderedStore.dispatch({ type: "move", direction: "next" });
    expect(reorderedStore.getSnapshot()).toMatchObject({
      styleId: "alpha-style",
      topicId: "alpha-one",
      scene: 1,
      beat: 0,
    });
  });

  it("skips non-matching Topics when filtered sequence movement crosses a Topic boundary", () => {
    const store = createNavigationStore({
      registry,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=5&beat=0&model=Model%20A",
      ),
    });

    store.dispatch({ type: "move", direction: "next" });

    expect(store.getSnapshot()).toMatchObject({
      styleId: "beta-style",
      topicId: "beta-one",
      scene: 1,
      beat: 0,
      models: ["Model A"],
    });
  });

  it("enters the nearest filtered Topic from a directly opened out-of-scope Topic", () => {
    const nextStore = createNavigationStore({
      registry,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=alpha-style&topic=alpha-two&scene=5&beat=0&model=Model%20A",
      ),
    });
    nextStore.dispatch({ type: "move", direction: "next" });
    expect(nextStore.getSnapshot()).toMatchObject({
      topicId: "beta-one",
      scene: 1,
      beat: 0,
    });

    const previousStore = createNavigationStore({
      registry,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=alpha-style&topic=alpha-two&scene=1&beat=0&model=Model%20A",
      ),
    });
    previousStore.dispatch({ type: "move", direction: "prev" });
    expect(previousStore.getSnapshot()).toMatchObject({
      topicId: "alpha-one",
      scene: 5,
      beat: 0,
    });
  });

  it("stops at the Topic boundary when active Filters resolve to an empty Cycle Scope", () => {
    const store = createNavigationStore({
      registry,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=5&beat=0&model=Unavailable",
      ),
    });

    const before = store.getSnapshot();
    store.dispatch({ type: "move", direction: "next" });

    expect(store.getSnapshot()).toEqual(before);
  });

  it("keeps the Cycle Scope empty when known and unresolved criteria are mixed", () => {
    const store = createNavigationStore({
      registry,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=5&beat=0&model=Model%20A&model=Unavailable",
      ),
    });

    const before = store.getSnapshot();
    store.dispatch({ type: "move", direction: "next" });

    expect(store.getSnapshot()).toEqual(before);
  });

  it("does not leave a Pure Player when sequence movement reaches a Topic edge", () => {
    const store = createNavigationStore({
      registry,
      history: createMemoryHistoryAdapter(
        "/workbench?view=lab&style=alpha-style&topic=alpha-two&scene=5&beat=0&pure=1",
      ),
    });

    const before = store.getSnapshot();
    store.dispatch({ type: "move", direction: "next" });

    expect(store.getSnapshot()).toEqual(before);
  });

  it("builds a shareable href for an intent without mutating History", () => {
    const history = createMemoryHistoryAdapter(
      "/workbench?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0",
    );
    const store = createNavigationStore({ registry, history });

    expect(store.href({ type: "open-topic", topicId: "beta-one" })).toBe(
      "/workbench?view=lab&style=beta-style&topic=beta-one&scene=1&beat=0",
    );
    expect(history.entries).toHaveLength(1);
  });
});

describe("Navigation State History seam", () => {
  it("reset-catalog clears saved scroll context even when query state is already reset", () => {
    const history = createMemoryHistoryAdapter(
      "/workbench?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0",
      { navigation: { catalog: { scrollTop: 640 } } },
    );
    const store = createNavigationStore({ registry, history });

    store.dispatch({ type: "reset-catalog" });

    expect(store.getCatalogScrollTop()).toBe(0);
    expect(history.getLocation().state).toMatchObject({
      navigation: { catalog: { scrollTop: 0 } },
    });
  });

  it("preserves unrelated History state and Catalog scroll return context", () => {
    const history = createMemoryHistoryAdapter(
      "/workbench?view=overview&band=unknown-band",
      { external: "keep" },
    );
    const store = createNavigationStore({ registry, history });
    const unsubscribe = store.subscribe(() => undefined);

    store.dispatch({
      type: "open-topic",
      topicId: "beta-one",
      catalogScrollTop: 420,
    });

    expect(history.getLocation().state).toMatchObject({
      external: "keep",
      navigation: { catalog: { scrollTop: 420 } },
    });
    history.back();
    expect(store.getSnapshot()).toMatchObject({
      view: "overview",
      bands: ["unknown-band"],
    });
    expect(store.getCatalogScrollTop()).toBe(420);
    expect(history.getLocation().state).toMatchObject({ external: "keep" });

    unsubscribe();
  });

  it("normalizes a stale Style with replaceState, then restores state through Back and Forward", () => {
    const history = createMemoryHistoryAdapter(
      "/workbench?view=overview&style=stale-style&topic=alpha-one&scene=1&beat=0",
    );
    const store = createNavigationStore({ registry, history });
    const observed: NavigationState[] = [];
    const unsubscribe = store.subscribe(() => observed.push(store.getSnapshot()));

    expect(history.entries[0]).toBe(
      "/workbench?view=overview&style=alpha-style&topic=alpha-one&scene=1&beat=0",
    );

    store.dispatch({ type: "open-topic", topicId: "beta-one" });
    store.dispatch({ type: "jump-position", scene: 2, beat: 2 });
    store.dispatch({ type: "show-overview" });

    history.back();
    expect(store.getSnapshot()).toMatchObject({
      view: "lab",
      styleId: "beta-style",
      topicId: "beta-one",
      scene: 2,
      beat: 2,
    });

    history.back();
    expect(store.getSnapshot()).toMatchObject({
      view: "overview",
      styleId: "alpha-style",
      topicId: "alpha-one",
    });

    history.forward();
    expect(store.getSnapshot()).toMatchObject({
      view: "lab",
      topicId: "beta-one",
      scene: 2,
      beat: 2,
    });
    expect(observed).toHaveLength(6);

    unsubscribe();
  });

  it("adapts browser History and popstate without fragments", () => {
    window.history.replaceState(null, "", "/workbench?view=overview");
    const history = createBrowserHistoryAdapter(window);
    const observed: string[] = [];
    const unsubscribe = history.subscribe(() => observed.push(history.getLocation().search));

    history.push("/workbench?view=lab&style=alpha-style&topic=alpha-one&scene=1&beat=0");
    expect(window.location.hash).toBe("");
    expect(window.location.search).toContain("view=lab");

    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(observed).toEqual([window.location.search]);

    unsubscribe();
  });
});
