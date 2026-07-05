import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MeetingMinutes, { getMetadata } from "./44-meeting-minutes";
import type { BespokeStyleProps } from "../types";

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const defaultProps: BespokeStyleProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    onNavigate: vi.fn(),
    ...props,
  };

  const { container, ...rest } = render(
    <div
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <MeetingMinutes {...defaultProps} />
    </div>,
  );

  return {
    stage: container.firstChild as HTMLElement,
    onNavigate: defaultProps.onNavigate as ReturnType<typeof vi.fn>,
    ...rest,
  };
}

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 2,
  4: 2,
  5: 1,
};

describe("Style 44: Meeting Minutes — render coverage", () => {
  it("renders all 5 scenes × all beats without throwing", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beats = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beats; beat++) {
        expect(() => renderStage({ scene, beat })).not.toThrow();
      }
    }
  });
});

describe("Style 44: Meeting Minutes — thumbnail mode", () => {
  it("renders no nav buttons when isThumbnail=true", () => {
    renderStage({ isThumbnail: true, onNavigate: undefined });
    const navBtns = screen
      .queryAllByRole("button")
      .filter((el) => el.getAttribute("aria-label")?.startsWith("Jump to scene"));
    expect(navBtns).toHaveLength(0);
  });

  it("does not crash when onNavigate is undefined in thumbnail mode", () => {
    expect(() =>
      renderStage({ isThumbnail: true, onNavigate: undefined }),
    ).not.toThrow();
  });
});

describe("Style 44: Meeting Minutes — navigation presence", () => {
  it("renders 5 nav buttons when not in thumbnail mode", () => {
    renderStage({ isThumbnail: false });
    const navBtns = screen
      .getAllByRole("button")
      .filter((el) =>
        el.getAttribute("aria-label")?.startsWith("Jump to scene"),
      );
    expect(navBtns).toHaveLength(5);
  });
});

describe("Style 44: Meeting Minutes — navigation behavior", () => {
  it("clicking nav calls onNavigate with (sceneId, 0)", () => {
    const { onNavigate } = renderStage({ scene: 1, beat: 0 });
    const btn = screen
      .getAllByRole("button")
      .find((el) => el.getAttribute("aria-label") === "Jump to scene 5");
    expect(btn).toBeDefined();
    fireEvent.click(btn!);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
  });
});

describe("Style 44: Meeting Minutes — overflow check", () => {
  it("does not overflow the Stage", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beats = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beats; beat++) {
        const { stage, unmount } = renderStage({ scene, beat });
        expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
        expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
        unmount();
      }
    }
  });
});

describe("Style 44: Meeting Minutes — metadata structure", () => {
  it("returns complete metadata", () => {
    const meta = getMetadata("en");
    expect(meta.id).toBe("44");
    expect(meta.band).toBe("text-report");
    expect(meta.name.length).toBeGreaterThan(0);
    expect(meta.heroScene).toBeGreaterThanOrEqual(1);
    expect(meta.heroScene).toBeLessThanOrEqual(5);
    expect(meta.colors.bg).toBeDefined();
    expect(meta.scenes).toHaveLength(5);
    meta.scenes.forEach((scene) => {
      expect(scene.beats.length).toBe(BEAT_COUNTS[scene.id]);
    });
  });
});
