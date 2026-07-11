import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import definition, {
  SAFETY_GLASS_SOURCES,
  SAFETY_GLASS_TRANSITION_SCORE,
} from "./safety-glass";
import componentSource from "./safety-glass.tsx?raw";
import cssSource from "./safety-glass.module.css?inline";

runTopicContract(definition);

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 2,
  5: 1,
};

const BASE_PROPS: TopicStageProps = {
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
  props: TopicStageProps;
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
      <definition.Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);
  const root = () =>
    result.container.querySelector<HTMLElement>('[data-topic-id="safety-glass"]');
  const activePanel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    props,
    root,
    activePanel,
    rerenderProps(next: Partial<TopicStageProps>) {
      result.rerender(
        <StageFrame
          props={{ ...props, ...next }}
          onStageClick={onStageClick}
        />,
      );
    },
  };
}

function dispatchPointer(
  element: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: 500 },
    pointerId: { value: 1 },
  });
  fireEvent(element, event);
}

describe("Safety Glass — canonical Topic contract", () => {
  it("exports the planned topic, navigation profile, facts packet, and exact score", () => {
    expect(definition.id).toBe("safety-glass");
    expect(definition.title).toEqual({
      en: "Safety Glass",
      zh: "夹层玻璃",
    });
    expect(definition.styleId).toBe("liquid-glass");
    expect(definition.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "glass-lamina-stack",
      invocation: "drag-scrub",
      feedback: "history-trail",
    });
    expect(definition.evidence).toMatchObject({
      kind: "facts",
      sources: SAFETY_GLASS_SOURCES,
    });
    expect(definition.transitionScore).toBe(
      SAFETY_GLASS_TRANSITION_SCORE,
    );
    expect(SAFETY_GLASS_TRANSITION_SCORE).toEqual({
      "1->2": "focus-swap",
      "2->3": "zoom-through",
      "3->4": "split-merge",
      "4->5": "focus-swap",
    });
  });

  it("ships at least three authoritative, claim-scoped HTTPS sources with boundaries", () => {
    expect(SAFETY_GLASS_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of SAFETY_GLASS_SOURCES) {
      const traceable: Source = source;
      expect(traceable.url).toMatch(/^https:\/\//);
      expect(traceable.supports.length).toBeGreaterThan(50);
      expect(
        Boolean(traceable.authority || traceable.title || traceable.citation),
      ).toBe(true);
      expect(source.boundary.length).toBeGreaterThan(45);
    }
  });

  it("keeps five bilingual scenes aligned to the 1-2-4-2-1 beat curve", () => {
    const english = definition.metadata.en;
    const chinese = definition.metadata.zh;

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

describe("Safety Glass — material narrative", () => {
  it("renders every English and Chinese beat with five distinct compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();
          const composition = panel?.querySelector<HTMLElement>(
            "[data-composition]",
          );

          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(composition?.dataset.composition).toBeTruthy();
          expect(panel?.textContent?.trim().length).toBeGreaterThan(35);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("keeps multi-beat material states in reserved, inspectable geometry", () => {
    for (const scene of [2, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const panel = view.activePanel();

      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("builds impact from contact to retained fracture across four beats", () => {
    const expected = ["contact", "radial", "branch", "retained"];

    expected.forEach((phase, beat) => {
      const view = renderStage({ scene: 3, beat, reducedMotion: true });
      const field = view.activePanel()?.querySelector<HTMLElement>(
        '[data-impact-field="true"]',
      );

      expect(field).toHaveAttribute("data-impact-phase", phase);
      expect(field?.querySelectorAll('[data-fracture-ray="true"]')).toHaveLength(
        12,
      );
      expect(field?.querySelectorAll('[data-fracture-ring="true"]')).toHaveLength(
        3,
      );
      view.unmount();
    });
  });

  it("distinguishes laminated retention from tempered breakage without claiming repair", () => {
    const closeup = renderStage({ scene: 4, beat: 1 });
    expect(closeup.activePanel()).toHaveTextContent(/stays bonded/i);
    expect(closeup.activePanel()).toHaveTextContent(/does not heal/i);
    expect(
      closeup.activePanel()?.querySelector('[data-interlayer-deflection="true"]'),
    ).not.toBeNull();
    closeup.unmount();

    const held = renderStage({ scene: 5, beat: 0 });
    expect(held.activePanel()).toHaveTextContent("LAMINATED ≠ TEMPERED");
    expect(held.activePanel()).toHaveTextContent(/bonded interlayer/i);
    expect(held.activePanel()).toHaveTextContent(/small pieces/i);
    expect(held.root()).toHaveTextContent("NOT TO SCALE");
    held.unmount();
  });

  it("applies the exact four-edge transition score without clone lifecycle hooks", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "zoom-through");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "split-merge");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");
    expect(
      view.container.querySelector('[data-transition-clone="true"]'),
    ).toBeNull();
  });
});

describe("Safety Glass — lamina-stack navigation", () => {
  it("renders five physical miniatures with the complete navigation audit contract", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "glass-lamina-stack",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "drag-scrub");
    expect(nav).toHaveAttribute("data-navigation-feedback", "history-trail");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(within(nav!).getByRole("button", { name: /scene 3/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("supports click/tap, drag-scrub, and keyboard fallback without input leaks", () => {
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
    expect(target).toHaveAttribute("data-visited", "true");
    expect(onStageClick).not.toHaveBeenCalled();

    Object.defineProperty(nav, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 1000,
        height: 200,
        right: 1000,
        bottom: 200,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    dispatchPointer(nav!, "pointerdown", 80);
    dispatchPointer(nav!, "pointermove", 930);
    dispatchPointer(nav!, "pointerup", 930);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);

    const active = within(nav!).getByRole("button", { name: /scene 2/i });
    fireEvent.keyDown(active, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
    fireEvent.keyDown(active, { key: "Home" });
    expect(onNavigate).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(active, { key: "End" });
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
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
      thumbnail.activePanel()?.querySelector('[data-impact-field="true"]'),
    ).toHaveAttribute("data-impact-phase", "retained");

    const reduced = renderStage({ scene: 4, beat: 1, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.activePanel()?.querySelector('[data-interlayer-deflection="true"]'),
    ).not.toBeNull();
  });
});

describe("Safety Glass — motion and stage safety", () => {
  it("uses finite material motion with no decorative blur or forbidden stage units", () => {
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/<img\b|stock\s+(?:photo|video)/i);
    expect(cssSource).not.toMatch(/animation-iteration-count\s*:\s*infinite/i);
    expect(cssSource).not.toMatch(/\binfinite\b/i);
    expect(cssSource).not.toMatch(/backdrop-filter|blur\s*\(/i);
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
