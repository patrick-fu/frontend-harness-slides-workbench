import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./retro-desktop";

runTopicContract(definition);

function renderStage(props: Partial<TopicStageProps> = {}) {
  const defaultProps: TopicStageProps = {
    scene: 1, beat: 0, language: "en", isThumbnail: false,
    reducedMotion: false, onNavigate: vi.fn(), ...props,
  };
  const { container, ...rest } = render(
    <div style={{ width: 1920, height: 1080, containerType: "size",
      overflow: "hidden", position: "relative" }}>
      <definition.Stage {...defaultProps} />
    </div>,
  );
  return { stage: container.firstChild as HTMLElement,
    onNavigate: defaultProps.onNavigate as ReturnType<typeof vi.fn>, ...rest };
}

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 1, 5: 1 };

describe("Retro Desktop — render coverage", () => {
  it("renders all 5 scenes × all beats without throwing", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beats = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beats; beat++) {
        expect(() => renderStage({ scene, beat })).not.toThrow();
      }
    }
  });
});

describe("Retro Desktop — thumbnail mode", () => {
  it("renders no nav buttons when isThumbnail=true", () => {
    renderStage({ isThumbnail: true, onNavigate: undefined });
    const navBtns = screen.queryAllByRole("button")
      .filter(el => el.getAttribute("aria-label")?.startsWith("Jump to scene"));
    expect(navBtns).toHaveLength(0);
  });
  it("does not crash when onNavigate is undefined in thumbnail mode", () => {
    expect(() => renderStage({ isThumbnail: true, onNavigate: undefined })).not.toThrow();
  });
});

describe("Retro Desktop — navigation presence", () => {
  it("renders 5 nav buttons when not in thumbnail mode", () => {
    renderStage({ isThumbnail: false });
    const navBtns = screen.getAllByRole("button")
      .filter(el => el.getAttribute("aria-label")?.startsWith("Jump to scene"));
    expect(navBtns).toHaveLength(5);
  });
});

describe("Retro Desktop — navigation behavior", () => {
  it("clicking nav calls onNavigate with (sceneId, 0)", () => {
    const { onNavigate } = renderStage({ scene: 1, beat: 0 });
    const btn = screen.getAllByRole("button")
      .find(el => el.getAttribute("aria-label") === "Jump to scene 3");
    expect(btn).toBeDefined();
    fireEvent.click(btn!);
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
  });
});

describe("Retro Desktop — overflow check", () => {
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

describe("Retro Desktop — metadata structure", () => {
  it("keeps complete canonical metadata", () => {
    const meta = definition.metadata.en;
    expect(definition.id).toBe("retro-desktop");
    expect(definition.styleId).toBe("retro-windows");
    expect(definition.title.en.length).toBeGreaterThan(0);
    expect(meta.heroScene).toBeGreaterThanOrEqual(1);
    expect(meta.heroScene).toBeLessThanOrEqual(5);
    expect(meta.colors.bg).toBeDefined();
    expect(meta.scenes).toHaveLength(5);
    meta.scenes.forEach((scene) => {
      expect(scene.beats.length).toBe(BEAT_COUNTS[scene.id]);
    });
  });
});
