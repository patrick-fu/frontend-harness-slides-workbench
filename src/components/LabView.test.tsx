import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { lazy } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type {
  RuntimeStyleGroup,
  RuntimeTopic,
} from "../catalog/runtime-registry";
import type {
  TopicMetadata,
  TopicStage,
  TopicStageProps,
} from "../domain/topic";
import { useKeyboard } from "../hooks/useKeyboard";
import { useTouchNav } from "../hooks/useTouchNav";
import LabView from "./LabView";

vi.mock("../hooks/useStageScale", () => ({
  useStageScale: () => ({ scale: 0.5, width: 960, height: 540 }),
}));
vi.mock("../hooks/useKeyboard", () => ({ useKeyboard: vi.fn() }));
vi.mock("../hooks/useTouchNav", () => ({ useTouchNav: vi.fn() }));

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

function setup(overrides: Partial<React.ComponentProps<typeof LabView>> = {}) {
  const props: React.ComponentProps<typeof LabView> = {
    registry,
    styleId: "quiet-grid",
    topicId: "quiet-launch",
    scene: 2,
    beat: 0,
    isPureMode: false,
    reducedMotion: false,
    language: "en",
    frozen: false,
    announceTopic: false,
    onNavigate: vi.fn(),
    onAnnouncementDone: vi.fn(),
    onExitPure: vi.fn(),
    onGoOverview: vi.fn(),
    onOpenLibrary: vi.fn(),
    onOpenPalette: vi.fn(),
    onOpenControls: vi.fn(),
    loadTopicStage: vi.fn(
      () => new Promise<TopicStage>(() => undefined),
    ),
    ...overrides,
  };
  render(<LabView {...props} />);
  return props;
}

describe("LabView Player seam", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps the Stage fixed at 1920x1080 inside a scaled contain wrapper", () => {
    setup();
    const stage = screen.getByTestId("stage");
    expect(stage).toHaveStyle({ width: "1920px", height: "1080px" });
    expect(stage).toHaveStyle({ transform: "scale(0.5)", transformOrigin: "top left" });
    expect(stage.parentElement).toHaveStyle({ width: "960px", height: "540px" });
  });

  it("uses left 20% and remaining 80% click zones for sequential navigation", () => {
    const props = setup();
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

    expect(props.onNavigate).toHaveBeenNthCalledWith(
      1,
      { type: "move", direction: "prev" },
    );
    expect(props.onNavigate).toHaveBeenNthCalledWith(
      2,
      { type: "move", direction: "next" },
    );
  });

  it("does not silently fall back when the Topic identity is unavailable", () => {
    setup({ topicId: "missing-topic" });
    expect(screen.getByText("This slide deck is unavailable")).toBeVisible();
    expect(screen.queryByText("Slide content")).not.toBeInTheDocument();
  });

  it("keeps Player transport out of Pure Mode", () => {
    setup({ isPureMode: true });
    expect(screen.queryByTestId("bottom-bar")).not.toBeInTheDocument();
    expect(vi.mocked(useKeyboard)).toHaveBeenCalledWith(
      expect.objectContaining({ onCommandPalette: undefined, onHelp: undefined }),
    );
  });

  it("keeps the localized illustrative evidence boundary visible in Pure Mode", async () => {
    setup({
      registry: illustrativeRegistry,
      isPureMode: true,
      language: "zh",
      loadTopicStage: vi.fn().mockResolvedValue(Slide),
    });

    expect(await screen.findByRole("note")).toHaveTextContent("中文示例边界。");
  });

  it("enables direct-touch navigation only for coarse mobile screens", async () => {
    const matchMedia = vi.spyOn(window, "matchMedia").mockImplementation(
      (query) =>
        ({
          matches: query === "(max-width: 767px) and (pointer: coarse)",
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList,
    );

    setup();

    await waitFor(() =>
      expect(vi.mocked(useTouchNav)).toHaveBeenLastCalledWith(
        expect.objectContaining({ enabled: true }),
      ),
    );
    matchMedia.mockRestore();
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

    setup({ loadTopicStage, prefetchAdjacentTopics });

    expect(screen.getByTestId("stage")).toHaveAttribute("data-topic-ready", "false");
    expect(screen.getByRole("status", { name: "Loading slides" })).toBeVisible();
    resolveTopic?.(Slide);

    await waitFor(() =>
      expect(screen.getByTestId("stage")).toHaveAttribute("data-topic-ready", "true"),
    );
    expect(screen.getByText("Slide content")).toBeVisible();
    expect(prefetchAdjacentTopics).toHaveBeenCalledWith("quiet-launch");
  });

  it("offers an in-Stage retry after a Topic Stage fails to load", async () => {
    const loadTopicStage = vi
      .fn()
      .mockRejectedValueOnce(new Error("chunk unavailable"))
      .mockResolvedValueOnce(Slide);

    setup({ loadTopicStage });

    expect(await screen.findByText("Slides failed to load")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => expect(loadTopicStage).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("Slide content")).toBeVisible();
    expect(screen.getByTestId("stage")).toHaveAttribute("data-topic-ready", "true");
  });
});
