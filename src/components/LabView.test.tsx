import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import LabView from "./LabView";
import { STYLE_REGISTRY } from "../styles/registry";
import type {
  BespokeStyleProps,
  StyleRegistryEntry,
  StyleTopic,
} from "../types";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockScale = 0.5;

vi.mock("../hooks/useStageScale", () => ({
  useStageScale: () => ({
    scale: mockScale,
    width: 1920 * mockScale,
    height: 1080 * mockScale,
  }),
}));

vi.mock("../hooks/useKeyboard", () => ({
  useKeyboard: vi.fn(),
}));

vi.mock("../hooks/useTouchNav", () => ({
  useTouchNav: vi.fn(),
}));

// ─── Mock registry with minimal style ────────────────────────────────────────

const MockStyleComponent = vi.fn((_props: BespokeStyleProps) => (
  <div data-testid="mock-style">Style Content</div>
));

const mockRegistry = [
  {
    id: "minimal-product-keynote",
    name: { en: "Test Style", zh: "测试风格" },
    topics: [
      {
        id: "product-keynote",
        topic: { en: "Test Topic", zh: "测试题材" },
        model: "test-model",
        component: MockStyleComponent,
        getMetadata: (lang: "en" | "zh") => ({
          id: "minimal-product-keynote",
          name: lang === "en" ? "Test Style" : "测试风格",
          band: "minimal-keynote" as const,
          theme: "test",
          densityLabel: "Sparse",
          heroScene: 1,
          colors: { bg: "#fff", ink: "#000", panel: "#eee" },
          typography: { header: "Test 700", body: "Test 400" },
          tags: ["test"],
          fonts: [],
          scenes: [
            { id: 1, title: "Scene 1", beats: [{ id: 0, action: "Title", title: "T", body: "B" }] },
            { id: 2, title: "Scene 2", beats: [{ id: 0, action: "A", title: "T", body: "B" }] },
            { id: 3, title: "Scene 3", beats: [{ id: 0, action: "A", title: "T", body: "B" }] },
            { id: 4, title: "Scene 4", beats: [{ id: 0, action: "A", title: "T", body: "B" }] },
            { id: 5, title: "Scene 5", beats: [{ id: 0, action: "A", title: "T", body: "B" }] },
          ],
        }),
      },
    ],
  },
];

function makeTopic(
  id: string,
  topic: { en: string; zh: string },
  beatCounts: number[],
  component: React.ComponentType<BespokeStyleProps> = MockStyleComponent,
): StyleTopic {
  return {
    id,
    topic,
    model: `model-${id}`,
    component,
    getMetadata: (lang: "en" | "zh") => ({
      id: "minimal-product-keynote",
      name: lang === "en" ? "Test Style" : "测试风格",
      band: "minimal-keynote" as const,
      theme: "test",
      densityLabel: "Sparse",
      heroScene: 1,
      colors: { bg: "#fff", ink: "#000", panel: "#eee" },
      typography: { header: "Test 700", body: "Test 400" },
      tags: ["test"],
      fonts: [],
      scenes: [1, 2, 3, 4, 5].map((sceneId, idx) => ({
        id: sceneId,
        title: `Scene ${sceneId}`,
        beats: Array.from({ length: beatCounts[idx] }, (_, beatId) => ({
          id: beatId,
          action: `Beat ${beatId}`,
          title: "T",
          body: "B",
        })),
      })),
    }),
  };
}

const multiTopicRegistry: StyleRegistryEntry[] = [
  {
    id: "minimal-product-keynote",
    name: { en: "Test Style", zh: "测试风格" },
    topics: [
      makeTopic("product-keynote", { en: "Original", zh: "原始" }, [1, 2, 3, 2, 1]),
      makeTopic("decision-art", { en: "Comparable", zh: "对照" }, [1, 2, 2, 2, 1]),
      makeTopic("compact", { en: "Compact", zh: "紧凑版" }, [1, 1, 1, 1, 1]),
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderLabView(props: Partial<React.ComponentProps<typeof LabView>> = {}) {
  const defaultProps = {
    registry: mockRegistry,
    styleId: "minimal-product-keynote",
    topicId: "product-keynote",
    scene: 1,
    beat: 0,
    isPureMode: false,
    reducedMotion: false,
    language: "en" as const,
    frozen: false,
    flashStyle: false,
    onNavigate: vi.fn(),
    onFlashDone: vi.fn(),
    onExitPure: vi.fn(),
    onGoOverview: vi.fn(),
    ...props,
  };
  return render(<LabView {...defaultProps} />);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("LabView — stage centering regression tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stage container has minWidth: 0 to allow shrinking below 1920px", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    // DOM: stage → sized-wrapper → pure-mode-stage → container
    const container = stage.parentElement?.parentElement?.parentElement as HTMLElement;
    expect(container).not.toBeNull();
    // Container has inline style with minWidth: 0 (React sets number 0 as "0px")
    expect(container.style.minWidth).toBe("0");
    expect(container.style.minHeight).toBe("0");
  });

  it("stage has a sized wrapper with scaled visual dimensions", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    const wrapper = stage.parentElement;
    expect(wrapper).not.toBeNull();
    // Wrapper should have the scaled visual dimensions so flex centering works on real size
    expect(wrapper).toHaveStyle({
      width: `${1920 * mockScale}px`,
      height: `${1080 * mockScale}px`,
    });
  });

  it("stage uses transformOrigin 'top left' (not 'center center')", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    expect(stage.style.transformOrigin).toBe("top left");
  });

  it("stage is absolutely positioned inside the wrapper at top-left corner", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    // Position is set via Tailwind class "absolute top-0 left-0"
    expect(stage.className).toMatch(/absolute/);
    expect(stage.className).toMatch(/top-0/);
    expect(stage.className).toMatch(/left-0/);
  });

  it("stage element retains fixed 1920x1080 dimensions for container queries", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    expect(stage.style.width).toBe("1920px");
    expect(stage.style.height).toBe("1080px");
    expect(stage.style.containerType).toBe("size");
  });

  it("stage transform: scale matches the computed scale factor", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    expect(stage.style.transform).toBe(`scale(${mockScale})`);
  });

  it("stage can receive focus programmatically without entering tab order", () => {
    renderLabView();
    const stage = screen.getByTestId("stage");
    expect(stage).toHaveAttribute("tabIndex", "-1");
  });
});

describe("LabView — stage click navigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clicking the stage advances to the next position", () => {
    const onNavigate = vi.fn();
    renderLabView({ onNavigate });

    fireEvent.click(screen.getByTestId("stage"));

    expect(onNavigate).toHaveBeenCalledWith({
      styleId: "minimal-product-keynote",
      topicId: "product-keynote",
      scene: 2,
      beat: 0,
      flashStyle: false,
    });
  });

  it("clicking an interactive element inside the stage does not trigger stage next", () => {
    const onNavigate = vi.fn();
    const InteractiveStyle = () => (
      <button type="button" data-testid="internal-button">
        Internal action
      </button>
    );
    const registry: StyleRegistryEntry[] = [
      {
        ...mockRegistry[0],
        topics: [
          {
            ...mockRegistry[0].topics[0],
            component: InteractiveStyle,
          },
        ],
      },
    ];

    renderLabView({ registry, onNavigate });

    fireEvent.click(screen.getByTestId("internal-button"));

    expect(onNavigate).not.toHaveBeenCalled();
  });
});

describe("LabView — style rendering", () => {
  it("renders the first topic through the normal lab UI", () => {
    renderLabView({
      registry: STYLE_REGISTRY,
      styleId: "minimal-product-keynote",
      topicId: "product-keynote",
      scene: 1,
      beat: 0,
    });

    expect(screen.getByText("Introducing Nova")).toBeInTheDocument();
    expect(screen.getByTestId("spatial-scene-track")).toBeInTheDocument();
  });
});

describe("LabView — topic switching", () => {
  it("top-bar topic switching preserves the current scene and beat for comparison", () => {
    const onNavigate = vi.fn();
    renderLabView({
      registry: multiTopicRegistry,
      topicId: "product-keynote",
      scene: 3,
      beat: 1,
      onNavigate,
    });

    fireEvent.click(screen.getByTestId("topic-switcher"));
    fireEvent.click(screen.getByTestId("topic-option-decision-art"));

    expect(onNavigate).toHaveBeenCalledWith({
      styleId: "minimal-product-keynote",
      topicId: "decision-art",
      scene: 3,
      beat: 1,
    });
  });

  it("top-bar topic switching clamps the beat when the target topic has fewer beats", () => {
    const onNavigate = vi.fn();
    renderLabView({
      registry: multiTopicRegistry,
      topicId: "product-keynote",
      scene: 3,
      beat: 2,
      onNavigate,
    });

    fireEvent.click(screen.getByTestId("topic-switcher"));
    fireEvent.click(screen.getByTestId("topic-option-compact"));

    expect(onNavigate).toHaveBeenCalledWith({
      styleId: "minimal-product-keynote",
      topicId: "compact",
      scene: 3,
      beat: 0,
    });
  });
});
