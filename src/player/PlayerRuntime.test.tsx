import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { lazy } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
  RuntimeTopicEntry,
} from "../catalog/runtime-registry";
import type {
  TopicMetadata,
  TopicStage,
  TopicStageProps,
} from "../domain/topic";
import type { NavigationState } from "../navigation";
import PlayerRuntime, {
  type PlayerCatalogAccess,
  type PlayerRuntimeProps,
} from "./PlayerRuntime";
import { MOBILE_TOUCH_QUERY } from "./input";
import { calculateStageFit } from "./stage-fit";

const Slide = vi.fn((_props: TopicStageProps) => <div>Slide content</div>);
const metadata: TopicMetadata = {
  theme: "",
  densityLabel: "Sparse",
  heroScene: 1,
  colors: { bg: "#fff", ink: "#111", panel: "#eee" },
  typography: { header: "serif", body: "sans" },
  tags: [],
  fonts: [],
  scenes: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    beats: [{ id: 0, action: "", title: "Beat 1", body: "" }],
  })),
};

function makeTopic(
  evidence: RuntimeTopic["evidence"] = { kind: "none" },
): RuntimeTopic {
  return {
    id: "quiet-launch",
    styleId: "quiet-grid",
    title: { en: "Quiet launch", zh: "静默发布" },
    modelId: "GPT 5.6 Sol",
    metadata: { en: metadata, zh: metadata },
    navigation: { mode: "none" },
    transitionScore: {
      "1->2": "hard-cut",
      "2->3": "hard-cut",
      "3->4": "hard-cut",
      "4->5": "hard-cut",
    },
    evidence,
    modulePath: "../topics/quiet-launch.tsx",
    Stage: lazy(async () => ({ default: Slide })),
    loadStage: async () => Slide,
  };
}

const registry: readonly RuntimeStyleGroup[] = [
  {
    style: {
      id: "quiet-grid",
      name: { en: "Quiet Grid", zh: "静默网格" },
      band: "minimal-keynote",
    },
    topics: [makeTopic()],
  },
];

const illustrativeRegistry: readonly RuntimeStyleGroup[] = [
  {
    ...registry[0],
    topics: [
      makeTopic({
        kind: "illustrative",
        display: "envelope",
        boundary: {
          en: "Illustrative English boundary.",
          zh: "中文示例边界。",
        },
      }),
    ],
  },
];

const secondTopic: RuntimeTopic = {
  ...makeTopic(),
  id: "second-topic",
  title: { en: "Second topic", zh: "第二题材" },
  modulePath: "../topics/second-topic.tsx",
};

const twoTopicRegistry: readonly RuntimeStyleGroup[] = [
  { ...registry[0]!, topics: [registry[0]!.topics[0]!, secondTopic] },
];

const defaultState: NavigationState = {
  view: "lab",
  styleId: "quiet-grid",
  topicId: "quiet-launch",
  scene: 2,
  beat: 0,
  bands: [],
  models: [],
  lang: null,
  pureMode: false,
  frozen: false,
};

function makeCatalog(
  sourceRegistry: readonly RuntimeStyleGroup[] = registry,
  loadStage: PlayerCatalogAccess["loadStage"] = () =>
    new Promise<TopicStage>(() => undefined),
  prefetchAdjacent: PlayerCatalogAccess["prefetchAdjacent"] = vi
    .fn()
    .mockResolvedValue(undefined),
): PlayerCatalogAccess {
  return {
    findTopic(topicId) {
      for (const [styleIndex, group] of sourceRegistry.entries()) {
        const topicIndex = group.topics.findIndex((topic) => topic.id === topicId);
        if (topicIndex >= 0) {
          return {
            style: group.style,
            styleIndex,
            topicIndex,
            topic: group.topics[topicIndex]!,
          } satisfies RuntimeTopicEntry;
        }
      }
      return null;
    },
    loadStage,
    prefetchAdjacent,
  };
}

interface SetupOverrides {
  state?: Partial<NavigationState>;
  catalog?: PlayerCatalogAccess;
  language?: PlayerRuntimeProps["language"];
  reducedMotion?: boolean;
}

function setup(overrides: SetupOverrides = {}) {
  const state = { ...defaultState, ...overrides.state };
  const dispatch = vi.fn(() => state);
  const onEnvelopeAction = vi.fn();
  const props: PlayerRuntimeProps = {
    catalog: overrides.catalog ?? makeCatalog(),
    navigation: { state, dispatch },
    language: overrides.language ?? "en",
    reducedMotion: overrides.reducedMotion ?? false,
    onEnvelopeAction,
  };
  const view = render(<PlayerRuntime {...props} />);
  return {
    ...view,
    props,
    dispatch,
    onEnvelopeAction,
    rerenderState(next: Partial<NavigationState>) {
      view.rerender(
        <PlayerRuntime
          {...props}
          navigation={{ state: { ...state, ...next }, dispatch }}
        />,
      );
    },
  };
}

function dispatchTouch(
  element: HTMLElement,
  type: "touchstart" | "touchend" | "touchcancel",
  x: number,
  y: number,
  options: { prevented?: boolean; identifier?: number } = {},
) {
  const touch = {
    identifier: options.identifier ?? 1,
    target: element,
    clientX: x,
    clientY: y,
  };
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as TouchEvent;
  Object.defineProperties(event, {
    touches: { value: type === "touchstart" ? [touch] : [] },
    changedTouches: { value: [touch] },
  });
  if (options.prevented) event.preventDefault();
  element.dispatchEvent(event);
}

describe("Player Runtime", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps the Stage fixed at 1920x1080 inside a scaled contain wrapper", () => {
    setup();
    const stage = screen.getByTestId("stage");
    expect(stage).toHaveStyle({ width: "1920px", height: "1080px" });
    expect(stage).toHaveStyle({ transform: "scale(1)", transformOrigin: "top left" });
    expect(stage.parentElement).toHaveStyle({ width: "1920px", height: "1080px" });
    expect(calculateStageFit(1000, 1000)).toEqual({
      scale: 1000 / 1920,
      width: 1000,
      height: 562.5,
    });
    expect(calculateStageFit(2000, 500)).toEqual({
      scale: 500 / 1080,
      width: (1920 * 500) / 1080,
      height: 500,
    });
  });

  it("uses left 20% and remaining 80% click zones for sequential navigation", () => {
    const { dispatch } = setup();
    const stage = screen.getByTestId("stage");
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 1000,
      top: 0,
      bottom: 562.5,
      width: 1000,
      height: 562.5,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.click(stage, { clientX: 100 });
    fireEvent.click(stage, { clientX: 900 });

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      { type: "move", direction: "prev" },
    );
    expect(dispatch).toHaveBeenNthCalledWith(
      2,
      { type: "move", direction: "next" },
    );
  });

  it("ignores prevented, modified, non-primary, and interactive Stage clicks", () => {
    const { dispatch } = setup();
    const stage = screen.getByTestId("stage");
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 1000,
      top: 0,
      bottom: 562.5,
      width: 1000,
      height: 562.5,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    const prevented = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 900,
    });
    prevented.preventDefault();
    fireEvent(stage, prevented);
    fireEvent.click(stage, { clientX: 900, ctrlKey: true });
    fireEvent.click(stage, { clientX: 900, button: 1 });
    const button = document.createElement("button");
    stage.appendChild(button);
    fireEvent.click(button, { clientX: 900 });

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("arbitrates Player keyboard shortcuts while native controls retain focus", () => {
    const { dispatch, onEnvelopeAction } = setup();
    fireEvent.keyDown(window, { key: "ArrowRight" });
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    fireEvent.keyDown(window, { key: " " });
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.keyDown(window, { key: "?" });
    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: "move",
      direction: "next",
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: "move",
      direction: "prev",
    });
    expect(dispatch).toHaveBeenNthCalledWith(3, {
      type: "move",
      direction: "next",
    });
    expect(onEnvelopeAction).toHaveBeenCalledWith("search");
    expect(onEnvelopeAction).toHaveBeenCalledWith("controls");

    const button = document.createElement("button");
    document.body.appendChild(button);
    button.focus();
    fireEvent.keyDown(button, { key: "ArrowRight" });
    fireEvent.keyDown(button, { key: " " });
    expect(dispatch).toHaveBeenCalledTimes(3);
    button.remove();
  });

  it("uses coarse mobile screen swipes once and ignores prevented touch and wheel input", async () => {
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === MOBILE_TOUCH_QUERY,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );
    const { dispatch } = setup();
    const stage = screen.getByTestId("stage");
    vi.spyOn(stage, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 1000,
      top: 0,
      bottom: 562.5,
      width: 1000,
      height: 562.5,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    await waitFor(() => expect(matchMedia).toHaveBeenCalledWith(MOBILE_TOUCH_QUERY));

    dispatchTouch(stage, "touchstart", 800, 300);
    dispatchTouch(stage, "touchend", 700, 300);
    fireEvent.click(stage, { clientX: 700 });
    dispatchTouch(stage, "touchstart", 500, 400);
    dispatchTouch(stage, "touchend", 500, 300);
    dispatchTouch(stage, "touchstart", 500, 400, { prevented: true });
    dispatchTouch(stage, "touchend", 500, 300);
    fireEvent.wheel(stage, { deltaY: 120 });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: "move", direction: "next" });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: "move", direction: "next" });
    matchMedia.mockRestore();
  });

  it("does not install swipe gestures without a coarse mobile screen", () => {
    const matchMedia = vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
      media: MOBILE_TOUCH_QUERY,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList);
    const { dispatch } = setup();
    const stage = screen.getByTestId("stage");
    dispatchTouch(stage, "touchstart", 800, 300);
    dispatchTouch(stage, "touchend", 700, 300);
    expect(dispatch).not.toHaveBeenCalled();
    matchMedia.mockRestore();
  });

  it("does not silently fall back when the Topic identity is unavailable", () => {
    setup({ state: { topicId: "missing-topic" } });
    expect(screen.getByText("This slide deck is unavailable")).toBeVisible();
    expect(screen.queryByText("Slide content")).not.toBeInTheDocument();
    expect(screen.getByTestId("lab-view")).toHaveAttribute(
      "data-player-state",
      "unavailable",
    );
  });

  it("keeps Player transport out of Pure Mode", () => {
    const { onEnvelopeAction } = setup({ state: { pureMode: true } });
    expect(screen.queryByTestId("bottom-bar")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(onEnvelopeAction).not.toHaveBeenCalled();
  });

  it("keeps the localized illustrative evidence boundary visible in Pure Mode", async () => {
    setup({
      catalog: makeCatalog(
        illustrativeRegistry,
        vi.fn().mockResolvedValue(Slide),
      ),
      state: { pureMode: true },
      language: "zh",
    });

    expect(await screen.findByRole("note")).toHaveTextContent("中文示例边界。");
  });

  it("translates Topic-internal absolute navigation without leaking a Stage click", async () => {
    const InternalNavigationStage: TopicStage = ({ onNavigate }) => (
      <button type="button" onClick={() => onNavigate?.(4, 0)}>
        Jump inside Topic
      </button>
    );
    const { dispatch } = setup({
      catalog: makeCatalog(
        registry,
        vi.fn().mockResolvedValue(InternalNavigationStage),
      ),
    });
    fireEvent.click(await screen.findByRole("button", { name: "Jump inside Topic" }));
    expect(dispatch).toHaveBeenCalledOnce();
    expect(dispatch).toHaveBeenCalledWith({
      type: "jump-position",
      scene: 4,
      beat: 0,
    });
  });

  it("keeps the fixed Stage visible while a Topic Stage loads, then prefetches neighbors", async () => {
    let resolveTopic: ((stage: typeof Slide) => void) | undefined;
    const loadTopicStage = vi.fn(
      () =>
        new Promise<typeof Slide>((resolve) => {
          resolveTopic = resolve;
        }),
    );
    const prefetchAdjacentTopics = vi.fn().mockResolvedValue(undefined);

    setup({
      catalog: makeCatalog(registry, loadTopicStage, prefetchAdjacentTopics),
    });

    expect(screen.getByTestId("stage")).toHaveAttribute("data-topic-ready", "false");
    expect(screen.getByTestId("lab-view")).toHaveAttribute(
      "data-player-state",
      "loading",
    );
    expect(screen.getByRole("status", { name: "Loading slides" })).toBeVisible();
    resolveTopic?.(Slide);

    await waitFor(() =>
      expect(screen.getByTestId("stage")).toHaveAttribute("data-topic-ready", "true"),
    );
    expect(screen.getByText("Slide content")).toBeVisible();
    expect(prefetchAdjacentTopics).toHaveBeenCalledWith("quiet-launch");
    expect(screen.getByTestId("lab-view")).toHaveAttribute(
      "data-player-state",
      "ready",
    );
  });

  it("offers an in-Stage retry after a Topic Stage fails to load", async () => {
    const loadTopicStage = vi
      .fn()
      .mockRejectedValueOnce(new Error("chunk unavailable"))
      .mockResolvedValueOnce(Slide);

    setup({ catalog: makeCatalog(registry, loadTopicStage) });

    expect(await screen.findByText("Slides failed to load")).toBeVisible();
    expect(screen.getByTestId("lab-view")).toHaveAttribute(
      "data-player-state",
      "error",
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(loadTopicStage).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("Slide content")).toBeVisible();
    expect(screen.getByTestId("stage")).toHaveAttribute("data-topic-ready", "true");
  });

  it("ignores a stale Stage completion after switching Topics", async () => {
    let resolveFirst: ((stage: TopicStage) => void) | undefined;
    const loadStage = vi.fn((topicId: string) => {
      if (topicId === "quiet-launch") {
        return new Promise<TopicStage>((resolve) => {
          resolveFirst = resolve;
        });
      }
      return Promise.resolve(
        vi.fn(() => <div>Second content</div>) as TopicStage,
      );
    });
    const { rerenderState } = setup({
      catalog: makeCatalog(twoTopicRegistry, loadStage),
    });

    rerenderState({ topicId: "second-topic" });
    expect(await screen.findByText("Second content")).toBeVisible();
    await act(async () => resolveFirst?.(Slide));

    expect(screen.getByText("Second content")).toBeVisible();
    expect(screen.queryByText("Slide content")).not.toBeInTheDocument();
    expect(screen.getByTestId("lab-view")).toHaveAttribute(
      "data-player-topic",
      "second-topic",
    );
  });

  it("announces a changed Topic without dispatching another Navigation intent", async () => {
    const { rerenderState, dispatch } = setup({
      catalog: makeCatalog(twoTopicRegistry, vi.fn().mockResolvedValue(Slide)),
    });
    rerenderState({ topicId: "second-topic" });

    expect(await screen.findByRole("status")).toHaveTextContent("Second topic");
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("keeps Topic composition stable while Pure and Frozen change display state", async () => {
    const propsSeen: TopicStageProps[] = [];
    const TrackingStage: TopicStage = (props) => {
      propsSeen.push(props);
      return <div>Tracked Stage</div>;
    };
    const view = setup({
      catalog: makeCatalog(registry, vi.fn().mockResolvedValue(TrackingStage)),
    });
    expect(await screen.findByText("Tracked Stage")).toBeVisible();
    view.rerenderState({ pureMode: true, frozen: true });
    await waitFor(() => expect(propsSeen.at(-1)?.reducedMotion).toBe(true));
    expect(propsSeen.at(-1)).toMatchObject({ scene: 2, beat: 0, language: "en" });
    expect(screen.getByTestId("lab-view")).toHaveAttribute(
      "data-player-topic",
      "quiet-launch",
    );
    expect(document.documentElement).toHaveAttribute("data-pure-mode", "true");
    expect(document.documentElement).toHaveAttribute("data-frozen", "true");
  });

  it("owns the portrait rotate hint and removes it after three seconds", () => {
    vi.useFakeTimers();
    sessionStorage.clear();
    Object.defineProperty(window, "innerWidth", { value: 390, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 844, configurable: true });
    setup();
    expect(screen.getByTestId("portrait-hint")).toBeVisible();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByTestId("portrait-hint")).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
