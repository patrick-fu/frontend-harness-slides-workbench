import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import blueprint from "./blueprint";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";

const { Stage } = blueprint;

runTopicContract(blueprint);

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
      <Stage {...defaultProps} />
    </div>,
  );

  return {
    stage: container.firstChild as HTMLElement,
    onNavigate: defaultProps.onNavigate as ReturnType<typeof vi.fn>,
    ...rest,
  };
}

function getActivePanel() {
  const activePanel = document.querySelector(
    '[data-testid="spatial-scene-panel"][data-active="true"]',
  );
  expect(activePanel).toBeInstanceOf(HTMLElement);
  return activePanel as HTMLElement;
}

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 3,
  5: 1,
};

describe("Blueprint — render coverage", () => {
  it("renders all 5 scenes × all beats without throwing", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beats = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beats; beat++) {
        expect(() => renderStage({ scene, beat })).not.toThrow();
      }
    }
  });
});

describe("Blueprint — thumbnail mode", () => {
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

describe("Blueprint — navigation presence", () => {
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

describe("Blueprint — navigation behavior", () => {
  it("clicking a scene dot calls onNavigate with (sceneId, 0)", () => {
    const { onNavigate } = renderStage({ scene: 1, beat: 0 });
    const dot3 = screen
      .getAllByRole("button")
      .find((el) => el.getAttribute("aria-label") === "Jump to scene 3");
    expect(dot3).toBeDefined();
    fireEvent.click(dot3!);
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
  });
});

describe("Blueprint — Chinese language", () => {
  it("renders Chinese title on scene 1", () => {
    renderStage({ scene: 1, beat: 0, language: "zh" });
    const activePanel = within(getActivePanel());
    expect(activePanel.getByText(/系统/)).toBeInTheDocument();
    expect(activePanel.getByText(/架构/)).toBeInTheDocument();
  });
});

describe("Blueprint — English language", () => {
  it("renders English title on scene 1", () => {
    renderStage({ scene: 1, beat: 0, language: "en" });
    const activePanel = within(getActivePanel());
    expect(activePanel.getByText(/System/)).toBeInTheDocument();
    expect(activePanel.getByText(/Architecture/)).toBeInTheDocument();
  });
});

describe("Blueprint — overflow check", () => {
  it("does not overflow the Stage in any scene/beat combination", () => {
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

describe("Blueprint — metadata structure", () => {
  it("returns complete metadata for English", () => {
    const meta = blueprint.metadata.en;
    expect(blueprint.styleId).toBe("cyanotype-drafting-table");
    expect(blueprint.title).toEqual({ en: "Blueprint", zh: "蓝图" });
    expect(meta.theme.length).toBeGreaterThan(0);
    expect(meta.heroScene).toBeGreaterThanOrEqual(1);
    expect(meta.heroScene).toBeLessThanOrEqual(5);
    expect(meta.colors.bg).toBeDefined();
    expect(meta.colors.ink).toBeDefined();
    expect(meta.colors.panel).toBeDefined();
    expect(meta.tags.length).toBeGreaterThan(0);
    expect(meta.fonts.length).toBeGreaterThan(0);
    expect(meta.scenes).toHaveLength(5);
  });

  it("each scene has correct beat count", () => {
    const meta = blueprint.metadata.en;
    meta.scenes.forEach((scene) => {
      expect(scene.beats.length).toBe(BEAT_COUNTS[scene.id]);
    });
  });

  it("each beat has required fields", () => {
    const meta = blueprint.metadata.en;
    meta.scenes.forEach((scene) => {
      scene.beats.forEach((beat) => {
        expect(typeof beat.id).toBe("number");
        expect(typeof beat.action).toBe("string");
        expect(typeof beat.title).toBe("string");
        expect(typeof beat.body).toBe("string");
      });
    });
  });
});

describe("Blueprint — hero scene", () => {
  it("heroScene is between 1 and 5 and has non-empty beats", () => {
    const meta = blueprint.metadata.en;
    expect(meta.heroScene).toBeGreaterThanOrEqual(1);
    expect(meta.heroScene).toBeLessThanOrEqual(5);
    const hero = meta.scenes.find((s) => s.id === meta.heroScene);
    expect(hero).toBeDefined();
    expect(hero!.beats.length).toBeGreaterThan(0);
  });
});
