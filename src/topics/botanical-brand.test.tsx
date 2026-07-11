import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./botanical-brand";

runTopicContract(topic);

function renderStage(props: Partial<TopicStageProps> = {}) {
  const defaultProps: TopicStageProps = {
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
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <topic.Stage {...defaultProps} />
    </div>,
  );
  return {
    stage: container.firstChild as HTMLElement,
    onNavigate: defaultProps.onNavigate as ReturnType<typeof vi.fn>,
    ...rest,
  };
}

const BEAT_COUNTS: Record<number, number> = { 1: 1, 2: 3, 3: 2, 4: 2, 5: 1 };

describe("Botanical Brand render coverage", () => {
  it("renders every scene and beat without throwing", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beats = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beats; beat++) {
        expect(() => renderStage({ scene, beat })).not.toThrow();
      }
    }
  });
});

describe("Botanical Brand thumbnail mode", () => {
  it("renders no navigation buttons", () => {
    renderStage({ isThumbnail: true, onNavigate: undefined });
    const navButtons = screen.queryAllByRole("button")
      .filter((element) => element.getAttribute("aria-label")?.startsWith("Jump to scene"));
    expect(navButtons).toHaveLength(0);
  });

  it("does not crash without a navigation callback", () => {
    expect(() => renderStage({ isThumbnail: true, onNavigate: undefined })).not.toThrow();
  });
});

describe("Botanical Brand navigation", () => {
  it("renders five scene buttons outside thumbnail mode", () => {
    renderStage({ isThumbnail: false });
    const navButtons = screen.getAllByRole("button")
      .filter((element) => element.getAttribute("aria-label")?.startsWith("Jump to scene"));
    expect(navButtons).toHaveLength(5);
  });

  it("navigates to the requested scene", () => {
    const { onNavigate } = renderStage({ scene: 1, beat: 0 });
    const button = screen.getAllByRole("button")
      .find((element) => element.getAttribute("aria-label") === "Jump to scene 3");
    expect(button).toBeDefined();
    fireEvent.click(button!);
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
  });
});

describe("Botanical Brand stage boundary", () => {
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

describe("Botanical Brand metadata", () => {
  it("keeps the authored scene curve and Topic identity", () => {
    const metadata = topic.metadata.en;
    expect(topic.styleId).toBe("mid-century-grove");
    expect(topic.title).toEqual({ en: "Botanical Brand", zh: "植物品牌" });
    expect(metadata.heroScene).toBeGreaterThanOrEqual(1);
    expect(metadata.heroScene).toBeLessThanOrEqual(5);
    expect(metadata.colors.bg).toBeDefined();
    expect(metadata.scenes).toHaveLength(5);
    metadata.scenes.forEach((scene) => {
      expect(scene.beats.length).toBe(BEAT_COUNTS[scene.id]);
    });
  });
});
