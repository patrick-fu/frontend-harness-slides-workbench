import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import VocalFolds, {
  VOCAL_FOLDS_SOURCES,
  VOCAL_FOLDS_TRANSITION_SCORE,
  getMetadata,
  vocalFoldsTopic,
} from "./04-vocal-folds";
import componentSource from "./04-vocal-folds.tsx?raw";
import cssSource from "./04-vocal-folds.module.css?inline";

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
      <VocalFolds {...props} />
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
    result.container.querySelector<HTMLElement>('[data-topic-id="vocal-folds"]');
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

describe("Style 04 / Vocal Folds — coordinated topic contract", () => {
  it("exports the planned topic, stage-plan navigation, facts packet, and score", () => {
    expect(vocalFoldsTopic.id).toBe("vocal-folds");
    expect(vocalFoldsTopic.topic).toEqual({
      en: "Vocal Folds",
      zh: "声带",
    });
    expect(vocalFoldsTopic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "vocal-fold-stage-plan",
      invocation: "persistent",
      feedback: "typographic-emphasis",
    });
    expect(vocalFoldsTopic.sources).toBe(VOCAL_FOLDS_SOURCES);
    expect(vocalFoldsTopic.transitionScore).toBe(
      VOCAL_FOLDS_TRANSITION_SCORE,
    );
    expect(VOCAL_FOLDS_TRANSITION_SCORE).toEqual({
      "1->2": "split-merge",
      "2->3": "focus-swap",
      "3->4": "grid-reveal",
      "4->5": "split-merge",
    });
  });

  it("ships four authoritative, citation-complete, claim-scoped HTTPS sources", () => {
    expect(VOCAL_FOLDS_SOURCES).toHaveLength(4);
    for (const source of VOCAL_FOLDS_SOURCES) {
      const traceable: TopicSource = source;
      expect(traceable.authority?.length).toBeGreaterThan(3);
      expect(traceable.title?.length).toBeGreaterThan(8);
      expect(traceable.citation?.length).toBeGreaterThan(12);
      expect(traceable.url).toMatch(/^https:\/\//);
      expect(traceable.supports.length).toBeGreaterThan(55);
    }
  });

  it("keeps five bilingual scenes aligned to the 1-2-4-2-1 intensity curve", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("interactive-dialogue-stage");
    expect(english.band).toBe("minimal-keynote");
    expect(english.heroScene).toBe(3);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 4, 2, 1,
    ]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 4, 2, 1,
    ]);

    for (const metadata of [english, chinese]) {
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

describe("Style 04 / Vocal Folds — stage mechanism and evidence", () => {
  it("renders every English and Chinese beat with a stable multi-beat layout", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();
          const composition = panel?.querySelector<HTMLElement>("[data-composition]");

          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(composition?.dataset.composition).toBeTruthy();
          expect(panel?.textContent?.trim().length).toBeGreaterThan(24);
          if (BEAT_COUNTS[scene] > 1) {
            expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
            expect(
              panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
            ).toBeGreaterThanOrEqual(3);
          }
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("opens with AIR stopped below a paired FOLD—not a chatbot exchange", () => {
    const view = renderStage({ scene: 1 });
    const stage = view.activePanel()?.querySelector<HTMLElement>(
      '[data-role-stage="air-fold"]',
    );

    expect(stage).toHaveAttribute("data-air-stopped", "true");
    expect(stage).toHaveTextContent("AIR");
    expect(stage).toHaveTextContent("FOLD");
    expect(stage?.querySelectorAll('[data-vocal-fold="true"]')).toHaveLength(2);
    expect(stage?.querySelector('[data-chat-bubble="true"]')).toBeNull();
    expect(stage?.querySelector('[data-avatar="true"]')).toBeNull();
  });

  it("aligns paired top and side views without treating a fold as a single string", () => {
    const view = renderStage({ scene: 2, beat: 1 });
    const anatomy = view.activePanel()?.querySelector<HTMLElement>(
      '[data-anatomy-view="paired"]',
    );

    expect(anatomy?.querySelector('[data-view="superior"]')).not.toBeNull();
    expect(anatomy?.querySelector('[data-view="coronal"]')).not.toBeNull();
    expect(anatomy?.querySelectorAll('[data-vocal-fold="true"]')).toHaveLength(4);
    expect(anatomy).toHaveTextContent(/two soft-tissue folds/i);
    expect(anatomy?.querySelector('[data-single-string="true"]')).toBeNull();
  });

  it("sequences pressure, opening, elastic return, and pulsating source", () => {
    const expected = ["pressure", "opening", "recoil", "pulse"];

    expected.forEach((step, beat) => {
      const view = renderStage({ scene: 3, beat, reducedMotion: true });
      const cutaway = view.activePanel()?.querySelector<HTMLElement>(
        '[data-phonation-cycle="true"]',
      );
      expect(cutaway).toHaveAttribute("data-phonation-step", step);
      expect(cutaway).toHaveAttribute("data-spring", "controlled");
      expect(cutaway?.querySelectorAll('[data-vocal-fold="true"]')).toHaveLength(2);
      view.unmount();
    });
  });

  it("hands the glottal source to a vocal-tract filter without merging their jobs", () => {
    const source = renderStage({ scene: 4, beat: 0 });
    expect(
      source.activePanel()?.querySelector('[data-source-filter="source"]'),
    ).not.toBeNull();
    expect(source.activePanel()).toHaveTextContent(/glottal pulses/i);
    source.unmount();

    const filter = renderStage({ scene: 4, beat: 1 });
    expect(
      filter.activePanel()?.querySelector('[data-source-filter="filter"]'),
    ).not.toBeNull();
    expect(filter.activePanel()).toHaveTextContent(/vocal tract/i);
    expect(filter.activePanel()).toHaveTextContent(/resonances shape/i);
  });

  it("ends on one voice line and labels the cutaway as explanatory, not diagnostic", () => {
    const view = renderStage({ scene: 5, language: "en" });
    expect(view.activePanel()?.querySelector('[data-voice-line="true"]')).not.toBeNull();
    expect(view.activePanel()).toHaveTextContent("Air drives. Tissue oscillates. Space shapes.");
    expect(view.activePanel()).toHaveTextContent(/simplified explanatory diagram/i);
    expect(view.activePanel()).toHaveTextContent(/not a diagnostic image/i);
  });

  it("applies the exact four-edge transition score without clone lifecycle hooks", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "split-merge");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "grid-reveal");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "split-merge");
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
  });
});

describe("Style 04 / Vocal Folds — vocal-fold stage-plan navigation", () => {
  it("renders the planned carrier and emphasizes the current light-position label", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "spatial-node");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "vocal-fold-stage-plan",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "persistent");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "typographic-emphasis",
    );
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    const current = within(nav!).getByRole("button", { name: /scene 3/i });
    expect(current).toHaveAttribute("aria-current", "step");
    expect(current).toHaveAttribute("data-label-weight", "emphasis");
  });

  it("supports click/tap and arrow/Home/End keyboard fallback without stage leaks", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 2, onNavigate }, onStageClick);
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(nav!).getByRole("button", { name: /scene 4/i });

    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(nav!).getByRole("button", { name: /scene 2/i });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
    fireEvent.keyDown(current, { key: "Home" });
    expect(onNavigate).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(current, { key: "End" });
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("hides navigation in thumbnails and settles thumbnail/reduced frames", () => {
    const thumbnail = renderStage({
      scene: 3,
      beat: 3,
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");

    const reduced = renderStage({ scene: 3, beat: 3, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.activePanel()?.querySelector('[data-phonation-cycle="true"]'),
    ).toHaveAttribute("data-phonation-step", "pulse");
  });
});

describe("Style 04 / Vocal Folds — motion and fixed-stage safety", () => {
  it("uses only finite controlled motion and fixed-stage units", () => {
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/isTransitionClone|outgoingScene/);
    expect(cssSource).not.toMatch(/\binfinite\b/i);
    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
  });

  it("keeps every final beat clipped inside the 1920 by 1080 stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        const stage = view.getByTestId("stage");
        const root = view.root();
        expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
        expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
        expect(root?.scrollWidth ?? 0).toBeLessThanOrEqual(
          (root?.clientWidth ?? 0) + 1,
        );
        expect(root?.scrollHeight ?? 0).toBeLessThanOrEqual(
          (root?.clientHeight ?? 0) + 1,
        );
        view.unmount();
      }
    }
  });
});
