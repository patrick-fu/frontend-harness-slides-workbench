import { fireEvent, render, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import RogueWave, {
  getMetadata,
  rogueWaveTopic,
  ROGUE_WAVE_SOURCES,
  ROGUE_WAVE_TRANSITION_SCORE,
} from "./18-rogue-wave";
import componentSource from "./18-rogue-wave.tsx?raw";

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 2,
  5: 1,
};

const BASE_PROPS: BespokeStyleProps = {
  scene: 1,
  beat: 0,
  language: "en",
  isThumbnail: false,
  reducedMotion: false,
  onNavigate: vi.fn(),
};

function StageFrame({
  props,
  onStageClick,
}: {
  props: BespokeStyleProps;
  onStageClick?: () => void;
}) {
  return (
    <div
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
      onClick={onStageClick}
    >
      <RogueWave {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);
  const root = () =>
    result.container.querySelector<HTMLElement>('[data-topic-id="rogue-wave"]');
  const activePanel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    props,
    root,
    activePanel,
    rerenderProps(next: Partial<BespokeStyleProps>) {
      result.rerender(
        <StageFrame
          props={{ ...props, ...next }}
          onStageClick={onStageClick}
        />,
      );
    },
  };
}

describe("Rogue Wave topic contract", () => {
  it("exports the coordinated topic metadata and exact transition score", () => {
    expect(rogueWaveTopic.id).toBe("rogue-wave");
    expect(rogueWaveTopic.topic).toEqual({ en: "Rogue Wave", zh: "怪浪" });
    expect(rogueWaveTopic.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "wavefront-clipping-deck",
      invocation: "persistent",
      feedback: "geometry-reflow",
    });
    expect(rogueWaveTopic.sources).toBe(ROGUE_WAVE_SOURCES);
    expect(rogueWaveTopic.transitionScore).toBe(
      ROGUE_WAVE_TRANSITION_SCORE,
    );
    expect(ROGUE_WAVE_TRANSITION_SCORE).toEqual({
      "1->2": "page-turn",
      "2->3": "hard-cut",
      "3->4": "crossfade",
      "4->5": "page-turn",
    });
  });

  it("ships a traceable, bounded facts packet", () => {
    expect(ROGUE_WAVE_SOURCES.length).toBeGreaterThanOrEqual(4);
    for (const source of ROGUE_WAVE_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.citation.length).toBeGreaterThan(30);
      expect(source.supports.length).toBeGreaterThan(50);
      expect(source.boundary.length).toBeGreaterThan(45);
    }
  });

  it("keeps EN and ZH metadata aligned to 1/2/4/2/1 beats", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("front-page-broadsheet");
    expect(en.band).toBe("editorial-print");
    expect(en.heroScene).toBe(3);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 4, 2, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 4, 2, 1,
    ]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      for (const scene of metadata.scenes) {
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.length).toBeGreaterThan(0);
          expect(beat.title.length).toBeGreaterThan(0);
          expect(beat.body.length).toBeGreaterThan(0);
        });
      }
    }
  });
});

describe("Rogue Wave reading scenes", () => {
  it("renders every beat in both languages with five distinct editorial compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          expect(view.activePanel()?.textContent?.trim().length).toBeGreaterThan(
            80,
          );
          const composition = view.activePanel()?.querySelector<HTMLElement>(
            "[data-composition]",
          )?.dataset.composition;
          expect(composition).toBeDefined();
          compositions.add(composition!);
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("places the Draupner measurements beside their sea-state denominator", () => {
    const { activePanel } = renderStage({ scene: 1, language: "en" });
    expect(activePanel()).toHaveTextContent("25.6 m");
    expect(activePanel()).toHaveTextContent("11.9 m");
    expect(activePanel()).toHaveTextContent("H / Hs = 2.15");
    expect(activePanel()).toHaveTextContent(/instrument record/i);
  });

  it("uses reserved slots for all multi-beat reading pages", () => {
    for (const scene of [2, 3, 4]) {
      const { activePanel, unmount } = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
      });
      expect(activePanel()).toHaveAttribute(
        "data-beat-layout-container",
        "true",
      );
      expect(activePanel()).toHaveAttribute(
        "data-beat-layout-mode",
        "reserved",
      );
      expect(
        activePanel()?.querySelectorAll('[data-beat-layout-item="true"]')
          .length,
      ).toBeGreaterThanOrEqual(3);
      unmount();
    }
  });

  it("reveals mechanisms in place and closes with known / not unified", () => {
    const mechanisms = renderStage({ scene: 3, beat: 3, language: "en" });
    expect(
      mechanisms.activePanel()?.querySelectorAll('[data-revealed="true"]')
        .length,
    ).toBeGreaterThanOrEqual(4);
    expect(mechanisms.activePanel()).toHaveTextContent(
      "No single recipe fits every record",
    );
    mechanisms.unmount();

    const correction = renderStage({ scene: 5, language: "en" });
    expect(correction.activePanel()).toHaveTextContent("WHAT THE RECORD SHOWS");
    expect(correction.activePanel()).toHaveTextContent("NOT YET UNIFIED");
    expect(correction.activePanel()).toHaveTextContent(
      "A measurement problem before it is a myth",
    );
  });
});

describe("Rogue Wave transitions and clipping-deck navigation", () => {
  it("renders the exact authored transition on every forward edge", async () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "page-turn"],
      [3, "hard-cut"],
      [4, "crossfade"],
      [5, "page-turn"],
    ] as const) {
      view.rerenderProps({ scene });
      await waitFor(() => {
        expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
      });
    }
  });

  it("exposes the card-miniature navigation contract and five paper clippings", () => {
    const { root } = renderStage({ scene: 3 });
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "wavefront-clipping-deck",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "persistent");
    expect(nav).toHaveAttribute("data-navigation-feedback", "geometry-reflow");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(nav!).getByRole("button", { name: "Open clipping 3: mechanisms" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("supports click/tap and Arrow-key navigation without leaking to the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ scene: 3, onNavigate }, onStageClick);
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(nav!).getByRole("button", {
      name: "Open clipping 5: correction",
    });

    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(nav!).getByRole("button", {
      name: "Open clipping 3: mechanisms",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
  });

  it("hides the clipping deck in thumbnails and settles deterministic modes", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const { root, container, unmount } = renderStage({
        scene: 3,
        beat: 3,
        ...props,
        onNavigate: undefined,
      });
      expect(root()).toHaveAttribute("data-motion", "off");
      expect(
        container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      if (props.isThumbnail) {
        expect(
          root()?.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      unmount();
    }
  });
});

describe("Rogue Wave motion and stage safety", () => {
  it("contains no loops, remote visual assets, legacy clones, or unsafe stage units", () => {
    const source = componentSource;
    expect(source).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(source).not.toMatch(/animation[^;{]*infinite/);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(componentSource).not.toMatch(/outgoingScene|isTransitionClone/);
    expect(source).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
  });

  it("keeps every final bilingual reading frame clipped to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const { root, unmount } = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        expect(root()?.scrollWidth ?? 0).toBeLessThanOrEqual(
          (root()?.clientWidth ?? 0) + 1,
        );
        expect(root()?.scrollHeight ?? 0).toBeLessThanOrEqual(
          (root()?.clientHeight ?? 0) + 1,
        );
        unmount();
      }
    }
  });
});
