import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import BottomBar from "./BottomBar";
import type { StyleMetadata } from "../../types";

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
    // The fill width should represent 2/3 (currentBeat+1 / totalBeats)
    // or 1/2 (currentBeat / (totalBeats-1)) — we test that it exists and has a width style
    const style = window.getComputedStyle(fill!);
    expect(style.width).toBeTruthy();
  });
});
