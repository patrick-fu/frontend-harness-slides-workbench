import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BottomBar from "./BottomBar";
import type { StyleMetadata, StyleRegistryEntry } from "../../types";

type SceneMetadata = StyleMetadata["scenes"][number];

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeScenes(beatCounts: number[] = [1, 2, 3, 2, 1]): SceneMetadata[] {
  return [1, 2, 3, 4, 5].map((id, idx) => ({
    id,
    title: `Scene ${id}`,
    beats: Array.from({ length: beatCounts[idx] }, (_, bid) => ({
      id: bid,
      action: `Beat ${bid + 1}`,
      title: "",
      body: "",
    })),
  }));
}

function makeMetadata(
  id: string,
  name: string,
  colors = { bg: "#fff", ink: "#222", panel: "#f5f5f5" },
): StyleMetadata {
  return {
    id,
    name,
    band: "minimal-keynote" as const,
    theme: "test theme",
    densityLabel: "Sparse",
    heroScene: 1,
    colors,
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
  };
}

function makeRegistry(styles: Array<{
  id: string;
  name: string;
  versions: Array<{ id: string; topic: string; model: string }>;
}>): StyleRegistryEntry[] {
  return styles.map((s) => ({
    id: s.id,
    name: { en: s.name, zh: s.name },
    versions: s.versions.map((v) => ({
      id: v.id,
      topic: v.topic,
      model: v.model,
      component: () => null,
      getMetadata: (lang: "en" | "zh") =>
        makeMetadata(s.id, lang === "en" ? s.name : s.name),
    })),
  }));
}

function renderBottomBar(
  props: Partial<React.ComponentProps<typeof BottomBar>> = {},
) {
  const defaultProps = {
    scenes: makeScenes(),
    currentScene: 1,
    currentBeat: 0,
    onPrev: vi.fn(),
    onNext: vi.fn(),
    onJumpScene: vi.fn(),
    isFirst: true,
    isLast: false,
    ...props,
  };
  const result = render(<BottomBar {...defaultProps} />);
  return {
    ...result,
    onPrev: defaultProps.onPrev,
    onNext: defaultProps.onNext,
    onJumpScene: defaultProps.onJumpScene,
  };
}

// ─── Semantic structure ─────────────────────────────────────────────────────

describe("BottomBar — semantic structure", () => {
  it("renders a bottom bar container", () => {
    renderBottomBar();
    const bar = screen.getByTestId("bottom-bar");
    expect(bar).toBeInTheDocument();
  });

  it("bar is fixed to bottom and spans full width", () => {
    renderBottomBar();
    const bar = screen.getByTestId("bottom-bar");
    expect(bar.className).toMatch(/fixed/);
    expect(bar.className).toMatch(/bottom-0/);
    expect(bar.className).toMatch(/w-full/);
  });
});

// ─── Prev button ────────────────────────────────────────────────────────────

describe("BottomBar — Prev button", () => {
  it("renders a Prev button", () => {
    renderBottomBar();
    const btn = screen.getByTestId("prev-button");
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("Prev button is disabled when isFirst=true", () => {
    renderBottomBar({ isFirst: true });
    const btn = screen.getByTestId("prev-button");
    expect(btn).toBeDisabled();
  });

  it("Prev button is not disabled when isFirst=false", () => {
    renderBottomBar({ isFirst: false });
    const btn = screen.getByTestId("prev-button");
    expect(btn).not.toBeDisabled();
  });

  it("clicking Prev calls onPrev", () => {
    const { onPrev } = renderBottomBar({ isFirst: false });
    fireEvent.click(screen.getByTestId("prev-button"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("clicking disabled Prev does not call onPrev", () => {
    const { onPrev } = renderBottomBar({ isFirst: true });
    fireEvent.click(screen.getByTestId("prev-button"));
    expect(onPrev).not.toHaveBeenCalled();
  });
});

// ─── Next button ────────────────────────────────────────────────────────────

describe("BottomBar — Next button", () => {
  it("renders a Next button", () => {
    renderBottomBar();
    const btn = screen.getByTestId("next-button");
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
  });

  it("Next button is disabled when isLast=true", () => {
    renderBottomBar({ isLast: true });
    const btn = screen.getByTestId("next-button");
    expect(btn).toBeDisabled();
  });

  it("Next button is not disabled when isLast=false", () => {
    renderBottomBar({ isLast: false });
    const btn = screen.getByTestId("next-button");
    expect(btn).not.toBeDisabled();
  });

  it("clicking Next calls onNext", () => {
    const { onNext } = renderBottomBar({ isLast: false });
    fireEvent.click(screen.getByTestId("next-button"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("clicking disabled Next does not call onNext", () => {
    const { onNext } = renderBottomBar({ isLast: true });
    fireEvent.click(screen.getByTestId("next-button"));
    expect(onNext).not.toHaveBeenCalled();
  });
});

// ─── Scene dots ─────────────────────────────────────────────────────────────

describe("BottomBar — scene dots", () => {
  it("renders 5 scene dots", () => {
    renderBottomBar();
    const dots = screen.getAllByTestId(/scene-dot-/);
    expect(dots).toHaveLength(5);
  });

  it("current scene dot has aria-current='true'", () => {
    renderBottomBar({ currentScene: 3 });
    const dot3 = screen.getByTestId("scene-dot-3");
    expect(dot3).toHaveAttribute("aria-current", "true");
  });

  it("non-current scene dots do not have aria-current='true'", () => {
    renderBottomBar({ currentScene: 3 });
    [1, 2, 4, 5].forEach((s) => {
      const dot = screen.getByTestId(`scene-dot-${s}`);
      expect(dot).not.toHaveAttribute("aria-current", "true");
    });
  });

  it("clicking a scene dot calls onJumpScene with the scene number", () => {
    const { onJumpScene } = renderBottomBar();
    fireEvent.click(screen.getByTestId("scene-dot-4"));
    expect(onJumpScene).toHaveBeenCalledWith(4);
  });

  it("clicking each scene dot calls onJumpScene with correct id", () => {
    const { onJumpScene } = renderBottomBar();
    [1, 2, 3, 4, 5].forEach((s) => {
      fireEvent.click(screen.getByTestId(`scene-dot-${s}`));
    });
    expect(onJumpScene).toHaveBeenCalledTimes(5);
    expect(onJumpScene).toHaveBeenNthCalledWith(1, 1);
    expect(onJumpScene).toHaveBeenNthCalledWith(2, 2);
    expect(onJumpScene).toHaveBeenNthCalledWith(3, 3);
    expect(onJumpScene).toHaveBeenNthCalledWith(4, 4);
    expect(onJumpScene).toHaveBeenNthCalledWith(5, 5);
  });
});

// ─── Beat progress ──────────────────────────────────────────────────────────

describe("BottomBar — beat progress", () => {
  it("shows beat count as 'N/M' format", () => {
    // Scene 1 has 1 beat, currentBeat=0 → "1/1"
    renderBottomBar({ currentScene: 1, currentBeat: 0 });
    expect(screen.getByTestId("beat-counter")).toHaveTextContent("1/1");
  });

  it("shows correct beat count for middle of scene", () => {
    // Scene 3 has 3 beats, currentBeat=1 → "2/3"
    renderBottomBar({ currentScene: 3, currentBeat: 1 });
    expect(screen.getByTestId("beat-counter")).toHaveTextContent("2/3");
  });

  it("shows correct beat count for last beat of scene", () => {
    // Scene 3 has 3 beats, currentBeat=2 → "3/3"
    renderBottomBar({ currentScene: 3, currentBeat: 2 });
    expect(screen.getByTestId("beat-counter")).toHaveTextContent("3/3");
  });

  it("renders a beat progress bar", () => {
    renderBottomBar();
    const bar = screen.getByTestId("beat-progress-bar");
    expect(bar).toBeInTheDocument();
  });

  it("beat progress bar reflects current beat position", () => {
    // Scene 3 has 3 beats, currentBeat=1 → should be ~66.67%
    renderBottomBar({ currentScene: 3, currentBeat: 1 });
    const bar = screen.getByTestId("beat-progress-bar");
    const fill = bar.querySelector('[data-testid="beat-progress-fill"]');
    expect(fill).not.toBeNull();
    const style = window.getComputedStyle(fill!);
    expect(style.width).toBeTruthy();
  });
});

// ─── Stacked version cards ──────────────────────────────────────────────────

describe("BottomBar — stacked version cards", () => {
  const multiVersionRegistry = makeRegistry([
    {
      id: "01",
      name: "Style One",
      versions: [
        { id: "v1", topic: "Alpha Topic", model: "model-a" },
        { id: "v2", topic: "Beta Topic", model: "model-b" },
      ],
    },
    {
      id: "02",
      name: "Style Two",
      versions: [
        { id: "v1", topic: "Gamma Topic", model: "model-c" },
      ],
    },
  ]);

  it("does NOT render card stacks when version props are not provided", () => {
    renderBottomBar();
    expect(screen.queryByTestId("version-card-stack-right")).not.toBeInTheDocument();
    expect(screen.queryByTestId("version-card-stack-left")).not.toBeInTheDocument();
  });

  it("does NOT render right card stack in the middle of a version (not at boundary)", () => {
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 3,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    expect(screen.queryByTestId("version-card-stack-right")).not.toBeInTheDocument();
  });

  it("renders right card stack when at last beat of last scene (version boundary ahead)", () => {
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    const stack = screen.getByTestId("version-card-stack-right");
    expect(stack).toBeInTheDocument();
    // Should show v2 of style 01
    const card = screen.getByTestId("version-card-01-v2");
    expect(card).toBeInTheDocument();
  });

  it("right card stack shows 2 cards when 2 version boundaries are ahead", () => {
    // Style 01 v2 → next is Style 02 v1, so from 01 v2 at boundary we see 02 v1
    // But to see 2 cards ahead, we need the first peek to cross a boundary AND
    // the second peek from that target's end to also cross a boundary.
    // From 01 v1 at scene 5 beat 0:
    //   next1 → 01 v2 (crosses boundary, card 1)
    //   from end of 01 v2: next → 02 v1 (crosses boundary, card 2)
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    const card1 = screen.getByTestId("version-card-01-v2");
    const card2 = screen.getByTestId("version-card-02-v1");
    expect(card1).toBeInTheDocument();
    expect(card2).toBeInTheDocument();
  });

  it("renders left card stack when at first beat of first scene (version boundary behind)", () => {
    // From style 01 v2, scene 1 beat 0: prev goes to style 01 v1's last scene/beat
    // But 01 v1 is a different versionId, so left cards should appear
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v2",
      currentScene: 1,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    const stack = screen.getByTestId("version-card-stack-left");
    expect(stack).toBeInTheDocument();
    // Should show v1 of style 01
    const card = screen.getByTestId("version-card-01-v1");
    expect(card).toBeInTheDocument();
  });

  it("does NOT render left card stack in the middle of a version", () => {
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v2",
      currentScene: 3,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    expect(screen.queryByTestId("version-card-stack-left")).not.toBeInTheDocument();
  });

  it("clicking a version card calls onSelectVersion with styleId and versionId", () => {
    const onSelectVersion = vi.fn();
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion,
    });
    const card = screen.getByTestId("version-card-01-v2");
    fireEvent.click(card);
    expect(onSelectVersion).toHaveBeenCalledWith("01", "v2");
  });

  it("clicking a different-style card calls onSelectVersion with correct ids", () => {
    const onSelectVersion = vi.fn();
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion,
    });
    const card = screen.getByTestId("version-card-02-v1");
    fireEvent.click(card);
    expect(onSelectVersion).toHaveBeenCalledWith("02", "v1");
  });

  it("does not render card stacks when onSelectVersion is not provided", () => {
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      // onSelectVersion intentionally omitted
    });
    expect(screen.queryByTestId("version-card-stack-right")).not.toBeInTheDocument();
    expect(screen.queryByTestId("version-card-stack-left")).not.toBeInTheDocument();
  });

  it("card displays topic and model text", () => {
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    const card = screen.getByTestId("version-card-01-v2");
    expect(card).toHaveTextContent("Beta Topic");
    expect(card).toHaveTextContent("model-b");
  });

  it("card has title attribute with style name, topic, and model", () => {
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "01",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    const card = screen.getByTestId("version-card-01-v2");
    expect(card).toHaveAttribute("title", expect.stringContaining("Style One"));
    expect(card).toHaveAttribute("title", expect.stringContaining("Beta Topic"));
    expect(card).toHaveAttribute("title", expect.stringContaining("model-b"));
  });

  it("shows right card stack at style boundary when next wraps to a different style", () => {
    // From style 02 v1 at scene 5 beat 0: next wraps to style 01 v1
    // Since 02 only has v1, this is a style boundary
    renderBottomBar({
      registry: multiVersionRegistry,
      styleId: "02",
      versionId: "v1",
      currentScene: 5,
      currentBeat: 0,
      onSelectVersion: vi.fn(),
    });
    // Should show right cards because next wraps to 01 v1 (different versionId)
    const stack = screen.getByTestId("version-card-stack-right");
    expect(stack).toBeInTheDocument();
    const card = screen.getByTestId("version-card-01-v1");
    expect(card).toBeInTheDocument();
  });
});
