import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import Escapement, {
  ESCAPEMENT_SOURCES,
  ESCAPEMENT_TRANSITION_SCORE,
  escapementTopic,
  getMetadata,
} from "./38-escapement";
import componentSource from "./38-escapement.tsx?raw";
import cssSource from "./38-escapement.module.css?inline";

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
      <Escapement {...props} />
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
    result.container.querySelector<HTMLElement>('[data-topic-id="escapement"]');
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

describe("Style 38 / The Escapement — coordinated topic contract", () => {
  it("exports the planned topic, navigation profile, facts packet, and exact score", () => {
    expect(escapementTopic.id).toBe("escapement");
    expect(escapementTopic.topic).toEqual({
      en: "The Escapement",
      zh: "擒纵器",
    });
    expect(escapementTopic.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "gear-tooth-register",
      invocation: "keyboard-focus",
      feedback: "typographic-emphasis",
    });
    expect(escapementTopic.sources).toBe(ESCAPEMENT_SOURCES);
    expect(escapementTopic.transitionScore).toBe(
      ESCAPEMENT_TRANSITION_SCORE,
    );
    expect(ESCAPEMENT_TRANSITION_SCORE).toEqual({
      "1->2": "hard-cut",
      "2->3": "linear-wipe",
      "3->4": "iris-open",
      "4->5": "focus-swap",
    });
  });

  it("ships at least three authoritative, claim-scoped HTTPS sources", () => {
    expect(ESCAPEMENT_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of ESCAPEMENT_SOURCES) {
      const traceable: TopicSource = source;
      expect(traceable.url).toMatch(/^https:\/\//);
      expect(traceable.supports.length).toBeGreaterThan(40);
      expect(
        Boolean(traceable.authority || traceable.title || traceable.citation),
      ).toBe(true);
    }
  });

  it("keeps five bilingual scenes aligned to the 1-2-4-2-1 beat curve", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("operating-manual");
    expect(english.band).toBe("contemporary-digital");
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

describe("Style 38 / The Escapement — render and mechanism", () => {
  it("renders every English and Chinese beat with reserved scene geometry", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();

          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
          expect(panel?.textContent?.trim().length).toBeGreaterThan(30);
          expect(
            panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
          ).toBeGreaterThanOrEqual(3);
          view.unmount();
        }
      }
    }
  });

  it("uses one anchor-escapement model from the exploded train through assembly", () => {
    const exploded = renderStage({ scene: 2, beat: 1 });
    expect(
      exploded.activePanel()?.querySelectorAll('[data-mechanism-part="true"]'),
    ).toHaveLength(5);
    expect(exploded.activePanel()).toHaveTextContent("ANCHOR ESCAPEMENT");
    exploded.unmount();

    const assembled = renderStage({ scene: 5, beat: 0 });
    expect(
      assembled.activePanel()?.querySelector('[data-clock-state="settled"]'),
    ).not.toBeNull();
    expect(assembled.activePanel()).toHaveTextContent("One measured step");
    assembled.unmount();
  });

  it("advances lock, impulse, release, and relock across four inspectable beats", () => {
    const expected = ["lock", "impulse", "release", "relock"];

    expected.forEach((phase, beat) => {
      const view = renderStage({ scene: 3, beat, reducedMotion: true });
      const cycle = view.activePanel()?.querySelector<HTMLElement>(
        '[data-escapement-cycle="true"]',
      );

      expect(cycle).toHaveAttribute("data-phase", phase);
      expect(
        cycle?.querySelectorAll('[data-contact-point="true"]'),
      ).toHaveLength(2);
      expect(
        cycle?.querySelectorAll('[data-contact-state="engaged"]'),
      ).toHaveLength(phase === "release" ? 0 : 1);
      expect(cycle).toHaveAttribute("data-motion", "off");
      view.unmount();
    });
  });

  it("applies the exact four-edge transition score without clone lifecycle hooks", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "hard-cut");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "linear-wipe");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "iris-open");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");
    expect(
      view.container.querySelector('[data-transition-clone="true"]'),
    ).toBeNull();
  });
});

describe("Style 38 / The Escapement — navigation and deterministic modes", () => {
  it("renders the five-tooth edge register with the complete audit contract", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "edge-scale");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "gear-tooth-register",
    );
    expect(nav).toHaveAttribute(
      "data-navigation-invocation",
      "keyboard-focus",
    );
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "typographic-emphasis",
    );
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(within(nav!).getByRole("button", { name: /scene 3/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("supports click/tap and keyboard fallback without leaking to stage navigation", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const view = renderStage({ scene: 2, onNavigate }, onStageClick);
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(nav!).getByRole("button", { name: /scene 4/i });

    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const active = within(nav!).getByRole("button", { name: /scene 2/i });
    fireEvent.keyDown(active, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onWindowKey);
  });

  it("hides navigation in thumbnails and settles thumbnail/reduced-motion frames", () => {
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
    expect(
      thumbnail.activePanel()?.querySelector('[data-escapement-cycle="true"]'),
    ).toHaveAttribute("data-phase", "relock");

    const reduced = renderStage({ scene: 5, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.activePanel()?.querySelector('[data-clock-state="settled"]'),
    ).not.toBeNull();
  });
});

describe("Style 38 / The Escapement — motion and stage safety", () => {
  it("uses discrete mechanics and contains no autonomous rotation loop or terminal grammar", () => {
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/terminal|checklist|\$\s/iu);
    expect(cssSource).not.toMatch(/animation-iteration-count\s*:\s*infinite/i);
    expect(cssSource).not.toMatch(/\binfinite\b/i);
    expect(componentSource).not.toMatch(forbiddenStageUnit);
    expect(cssSource).not.toMatch(forbiddenStageUnit);
  });

  it("keeps every final beat clipped inside the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
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
