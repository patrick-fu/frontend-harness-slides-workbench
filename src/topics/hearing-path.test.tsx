import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  HEARING_PATH_SOURCES,
  HEARING_PATH_TRANSITION_SCORE,
} from "./hearing-path";
import componentSource from "./hearing-path.tsx?raw";
import cssSource from "./hearing-path.module.css?inline";

runTopicContract(topic);

const { Stage } = topic;
const metadataFor = (language: "en" | "zh") => topic.metadata[language];

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
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
      <Stage {...props} />
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
    result.container.querySelector<HTMLElement>('[data-topic-id="hearing-path"]');
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

describe("How Hearing Begins — Topic contract", () => {
  it("exports the planned topic, navigation profile, facts packet, and score", () => {
    expect(topic.id).toBe("hearing-path");
    expect(topic.title).toEqual({
      en: "How Hearing Begins",
      zh: "听觉起点",
    });
    expect(topic.navigation).toEqual({
      geometry: "path",
      carrier: "auditory-pathway",
      invocation: "gesture-hold",
      feedback: "history-trail",
    });
    expect(topic.evidence).toEqual({ kind: "facts", sources: HEARING_PATH_SOURCES });
    expect(topic.transitionScore).toBe(
      HEARING_PATH_TRANSITION_SCORE,
    );
    expect(HEARING_PATH_TRANSITION_SCORE).toEqual({
      "1->2": "linear-wipe",
      "2->3": "push-x",
      "3->4": "dip-to-color",
      "4->5": "linear-wipe",
    });
  });

  it("ships four authoritative, citation-complete, claim-scoped HTTPS sources", () => {
    expect(HEARING_PATH_SOURCES).toHaveLength(4);
    for (const source of HEARING_PATH_SOURCES) {
      const traceable: Source = source;
      expect(traceable.authority?.length).toBeGreaterThan(2);
      expect(traceable.title?.length).toBeGreaterThan(5);
      expect(traceable.citation?.length).toBeGreaterThan(8);
      expect(traceable.url).toMatch(/^https:\/\//);
      expect(traceable.supports.length).toBeGreaterThan(45);
    }
  });

  it("keeps five bilingual scenes aligned to the 1-1-2-3-4 curve", () => {
    const english = metadataFor("en");
    const chinese = metadataFor("zh");

    expect(topic.styleId).toBe("blackboard-chalk-talk");
    expect(english.heroScene).toBe(5);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 1, 2, 3, 4,
    ]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 1, 2, 3, 4,
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

describe("How Hearing Begins — derivation and factual states", () => {
  it("renders every English and Chinese beat and marks every multi-beat scene", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();

          expect(view.root()).not.toBeNull();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          if (BEAT_COUNTS[scene] > 1) {
            expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
          }
          expect(panel?.textContent?.trim().length).toBeGreaterThan(28);
          expect(
            panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
          ).toBeGreaterThanOrEqual(3);
          view.unmount();
        }
      }
    }
  });

  it("starts with compression and rarefaction rather than a traveling sine glyph", () => {
    const view = renderStage({ scene: 1 });
    const pressureField = view.activePanel()?.querySelector<HTMLElement>(
      '[data-pressure-field="compression-rarefaction"]',
    );

    expect(pressureField).not.toBeNull();
    expect(
      pressureField?.querySelectorAll('[data-air-particle="true"]').length,
    ).toBeGreaterThan(35);
    expect(pressureField).toHaveTextContent(/compression/i);
    expect(pressureField).toHaveTextContent(/rarefaction/i);
    expect(view.activePanel()?.querySelector('[data-sine-trajectory="true"]')).toBeNull();
  });

  it("derives three medium changes without drawing a complete ear at once", () => {
    const outer = renderStage({ scene: 2 });
    expect(
      outer.activePanel()?.querySelector('[data-anatomy-scope="outer-eardrum"]'),
    ).not.toBeNull();
    expect(outer.activePanel()).toHaveTextContent("Air pressure → membrane motion");
    expect(outer.activePanel()?.querySelector('[data-complete-ear="true"]')).toBeNull();
    outer.unmount();

    const middle = renderStage({ scene: 3, beat: 1 });
    expect(middle.activePanel()?.querySelector('[data-ossicle-chain="true"]')).not.toBeNull();
    expect(middle.activePanel()).toHaveTextContent("NOT TO SCALE");
    expect(middle.activePanel()).toHaveTextContent("Area concentrates force");
    middle.unmount();
  });

  it("builds a place-dependent traveling-wave map, then marks active amplification", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const map = view.activePanel()?.querySelector<HTMLElement>(
      '[data-cochlear-map="traveling-wave"]',
    );

    expect(map).not.toBeNull();
    expect(map?.querySelector('[data-frequency-place="base-high"]')).not.toBeNull();
    expect(map?.querySelector('[data-frequency-place="apex-low"]')).not.toBeNull();
    expect(map).toHaveAttribute("data-active-amplification", "true");
    expect(view.activePanel()).toHaveTextContent("a passive tube");
  });

  it("ends with four inspectable conversion states and neural coding—not a copied waveform", () => {
    const expected = ["bend", "gate", "synapse", "chain"];

    expected.forEach((state, beat) => {
      const view = renderStage({ scene: 5, beat, reducedMotion: true });
      const transduction = view.activePanel()?.querySelector<HTMLElement>(
        '[data-transduction-sequence="true"]',
      );
      expect(transduction).toHaveAttribute("data-transduction-state", state);
      expect(transduction).toHaveAttribute("data-motion", "off");
      expect(transduction?.querySelector('[data-waveform-through-brain="true"]')).toBeNull();
      view.unmount();
    });

    const final = renderStage({ scene: 5, beat: 3, language: "zh" });
    expect(final.activePanel()).toHaveTextContent("信号被转换，不是被照搬");
    expect(final.activePanel()).toHaveTextContent("空气压力");
    expect(final.activePanel()).toHaveTextContent("神经编码");
  });

  it("applies the exact four-edge transition score without clone lifecycle hooks", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "linear-wipe");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "push-x");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "dip-to-color");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "linear-wipe");
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
  });
});

describe("How Hearing Begins — auditory-pathway navigation", () => {
  it("renders the planned path carrier and five accessible nodes", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "path");
    expect(nav).toHaveAttribute("data-navigation-carrier", "auditory-pathway");
    expect(nav).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(nav).toHaveAttribute("data-navigation-feedback", "history-trail");
    expect(within(nav!).getAllByRole("button")).toHaveLength(6);
    expect(within(nav!).getByRole("button", { name: /scene 3/i })).toHaveAttribute(
      "aria-current",
      "step",
    );
  });

  it("reveals the whole path while held with pointer or keyboard", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const hold = within(nav!).getByRole("button", { name: /hold/i });

    fireEvent.pointerDown(hold);
    expect(nav).toHaveAttribute("data-holding", "true");
    fireEvent.pointerUp(hold);
    expect(nav).toHaveAttribute("data-holding", "false");

    fireEvent.keyDown(hold, { key: " " });
    expect(nav).toHaveAttribute("data-holding", "true");
    fireEvent.keyUp(hold, { key: " " });
    expect(nav).toHaveAttribute("data-holding", "false");
  });

  it("supports click/tap and arrow-key fallback without leaking to the stage", () => {
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

  it("hides navigation in thumbnails and settles thumbnail/reduced frames", () => {
    const thumbnail = renderStage({
      scene: 5,
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
      thumbnail.activePanel()?.querySelector('[data-transduction-sequence="true"]'),
    ).toHaveAttribute("data-transduction-state", "chain");

    const reduced = renderStage({ scene: 4, beat: 2, reducedMotion: true });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(
      reduced.activePanel()?.querySelector('[data-cochlear-map="traveling-wave"]'),
    ).toHaveAttribute("data-active-amplification", "true");
  });
});

describe("How Hearing Begins — motion and stage safety", () => {
  it("uses finite chalk drawing without decorative loops or forbidden stage units", () => {
    const forbiddenStageUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(componentSource).not.toMatch(/isTransitionClone|outgoingScene/);
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
