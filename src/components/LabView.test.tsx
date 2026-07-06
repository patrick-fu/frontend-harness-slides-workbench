import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import LabView from "./LabView";
import { STYLE_REGISTRY } from "../styles/registry";
import type {
  BespokeStyleProps,
  StyleRegistryEntry,
  StyleVersion,
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
    id: "01",
    name: { en: "Test Style", zh: "测试风格" },
    versions: [
      {
        id: "v1",
        topic: "Test Topic",
        model: "test-model",
        component: MockStyleComponent,
        getMetadata: (lang: "en" | "zh") => ({
          id: "01",
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

function makeVersion(
  id: string,
  topic: string,
  beatCounts: number[],
  component: React.ComponentType<BespokeStyleProps> = MockStyleComponent,
): StyleVersion {
  return {
    id,
    topic,
    model: `model-${id}`,
    component,
    getMetadata: (lang: "en" | "zh") => ({
      id: "01",
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

const multiVersionRegistry: StyleRegistryEntry[] = [
  {
    id: "01",
    name: { en: "Test Style", zh: "测试风格" },
    versions: [
      makeVersion("v1", "Original", [1, 2, 3, 2, 1]),
      makeVersion("v2", "Comparable", [1, 2, 2, 2, 1]),
      makeVersion("compact", "Compact", [1, 1, 1, 1, 1]),
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderLabView(props: Partial<React.ComponentProps<typeof LabView>> = {}) {
  const defaultProps = {
    registry: mockRegistry,
    styleId: "01",
    versionId: "v1",
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
});

describe("LabView — protocol style versions", () => {
  it("renders style 01 spatial-track version through the normal lab UI", () => {
    renderLabView({
      registry: STYLE_REGISTRY,
      styleId: "01",
      versionId: "spatial-track",
      scene: 1,
      beat: 0,
    });

    expect(screen.getByTestId("version-bar")).toHaveTextContent("Quiet Launch");
    expect(screen.getByText("Quiet signals move first.")).toBeInTheDocument();
    expect(screen.getByTestId("spatial-scene-track")).toBeInTheDocument();
  });
});

describe("LabView — version switching", () => {
  it("top-bar version switching preserves the current scene and beat for comparison", () => {
    const onNavigate = vi.fn();
    renderLabView({
      registry: multiVersionRegistry,
      versionId: "v1",
      scene: 3,
      beat: 1,
      onNavigate,
    });

    fireEvent.click(screen.getByTestId("version-switcher"));
    fireEvent.click(screen.getByTestId("version-option-v2"));

    expect(onNavigate).toHaveBeenCalledWith({
      styleId: "01",
      versionId: "v2",
      scene: 3,
      beat: 1,
    });
  });

  it("top-bar version switching clamps the beat when the target version has fewer beats", () => {
    const onNavigate = vi.fn();
    renderLabView({
      registry: multiVersionRegistry,
      versionId: "v1",
      scene: 3,
      beat: 2,
      onNavigate,
    });

    fireEvent.click(screen.getByTestId("version-switcher"));
    fireEvent.click(screen.getByTestId("version-option-compact"));

    expect(onNavigate).toHaveBeenCalledWith({
      styleId: "01",
      versionId: "compact",
      scene: 3,
      beat: 0,
    });
  });
});
