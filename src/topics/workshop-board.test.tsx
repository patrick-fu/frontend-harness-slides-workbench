import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import workshopBoard from "./workshop-board";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(workshopBoard);

const TopicStage = workshopBoard.Stage;

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
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <TopicStage {...defaultProps} />
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

describe("Workshop Board render coverage", () => {
  it("renders all 5 scenes × all beats without throwing", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beats = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beats; beat++) {
        expect(() => renderStage({ scene, beat })).not.toThrow();
      }
    }
  });
});

describe("Workshop Board thumbnail mode", () => {
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

describe("Workshop Board navigation presence", () => {
  it("renders 5 nav indicators when not in thumbnail mode", () => {
    renderStage({ isThumbnail: false });
    const navBtns = screen
      .getAllByRole("button")
      .filter((el) =>
        el.getAttribute("aria-label")?.startsWith("Jump to scene"),
      );
    expect(navBtns).toHaveLength(5);
  });
});

describe("Workshop Board navigation behavior", () => {
  it("clicking nav calls onNavigate with (sceneId, 0)", () => {
    const { onNavigate } = renderStage({ scene: 2, beat: 0 });
    const dot5 = screen
      .getAllByRole("button")
      .find((el) => el.getAttribute("aria-label") === "Jump to scene 5");
    expect(dot5).toBeDefined();
    fireEvent.click(dot5!);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
  });
});

describe("Workshop Board emoji content", () => {
  it("renders real emoji characters instead of escaped unicode labels", () => {
    const { stage, unmount } = renderStage({ scene: 3, beat: 1 });

    expect(stage).toHaveTextContent("✍️");
    expect(stage).toHaveTextContent("🧪");
    expect(stage).toHaveTextContent("🔗");
    expect(stage).toHaveTextContent("👥");
    expect(stage).not.toHaveTextContent(/U000[0-9a-fA-F]{4,}/);

    unmount();

    const { stage: dataStage } = renderStage({ scene: 4, beat: 1 });
    expect(dataStage).toHaveTextContent("💡");
    expect(dataStage).toHaveTextContent("🔗");
    expect(dataStage).toHaveTextContent("✅");
    expect(dataStage).not.toHaveTextContent(/U000[0-9a-fA-F]{4,}/);
  });

  it("keeps metadata beat text free of escaped unicode labels", () => {
    for (const lang of ["en", "zh"] as const) {
      const serialized = JSON.stringify(workshopBoard.metadata[lang].scenes);

      expect(serialized).toContain("🧪");
      expect(serialized).toContain("🔗");
      expect(serialized).toContain("👥");
      expect(serialized).toContain("💡");
      expect(serialized).not.toMatch(/U000[0-9a-fA-F]{4,}/);
    }
  });
});

describe("Workshop Board overflow check", () => {
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

describe("Workshop Board metadata structure", () => {
  it("keeps complete Topic metadata", () => {
    const meta = workshopBoard.metadata.en;
    expect(workshopBoard.styleId).toBe("sketch-board-emoji");
    expect(meta.heroScene).toBeGreaterThanOrEqual(1);
    expect(meta.heroScene).toBeLessThanOrEqual(5);
    expect(meta.colors.bg).toBeDefined();
    expect(meta.scenes).toHaveLength(5);
    meta.scenes.forEach((scene) => {
      expect(scene.beats.length).toBe(BEAT_COUNTS[scene.id]);
    });
  });
});
