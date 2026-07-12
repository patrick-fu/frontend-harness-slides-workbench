import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

vi.mock("../hooks/useStageScale", () => ({
  useStageScale: () => ({ scale: 0.5, width: 960, height: 540 }),
}));

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
    registry: sourceRegistry,
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
  return { ...view, props, dispatch, onEnvelopeAction };
}

describe("Player Runtime", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps the Stage fixed at 1920x1080 inside a scaled contain wrapper", () => {
    setup();
    const stage = screen.getByTestId("stage");
    expect(stage).toHaveStyle({ width: "1920px", height: "1080px" });
    expect(stage).toHaveStyle({ transform: "scale(0.5)", transformOrigin: "top left" });
    expect(stage.parentElement).toHaveStyle({ width: "960px", height: "540px" });
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
});
