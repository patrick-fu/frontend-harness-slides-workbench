import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  within,
} from "@testing-library/react";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  LEAF_STOMATA_SOURCES,
  LEAF_STOMATA_TRANSITION_SCORE,
} from "./leaf-stomata";

runTopicContract(topic);

const { Stage } = topic;
const metadataFor = (language: "en" | "zh") => topic.metadata[language];

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 2,
  5: 1,
};

function renderStage(props: Partial<TopicStageProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const componentProps: TopicStageProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    ...props,
    onNavigate,
  };
  const result = render(
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
      <Stage {...componentProps} />
    </div>,
  );
  return {
    ...result,
    stage: result.container.firstElementChild as HTMLElement,
    onNavigate,
  };
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>(
    '[data-spatial-scene-panel="true"][data-active="true"]',
  );
  if (!panel) throw new Error("Active leaf-stomata scene was not rendered");
  return panel;
}

function dispatchPointer(
  element: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: 250 },
    pointerId: { value: 1 },
  });
  fireEvent(element, event);
}

afterEach(() => cleanup());

describe("Leaf Stomata — coordinated topic contract", () => {
  it("exports the planned topic, navigation profile, and exact transition score", () => {
    expect(topic.id).toBe("leaf-stomata");
    expect(topic.title).toEqual({
      en: "Leaf Stomata",
      zh: "叶片气孔",
    });
    expect(topic.styleId).toBe("botanical-specimen-plate");
    expect(topic.navigation).toEqual({
      geometry: "ambient",
      carrier: "specimen-registration-marks",
      invocation: "drag-scrub",
      feedback: "geometry-reflow",
    });
    expect(topic.evidence).toEqual({
      kind: "facts",
      sources: LEAF_STOMATA_SOURCES,
    });
    expect(topic.transitionScore).toBe(
      LEAF_STOMATA_TRANSITION_SCORE,
    );
    expect(LEAF_STOMATA_TRANSITION_SCORE).toEqual({
      "1->2": "iris-open",
      "2->3": "crossfade",
      "3->4": "hard-cut",
      "4->5": "focus-swap",
    });
  });

  it("ships at least three claim-scoped HTTPS sources with evidence boundaries", () => {
    expect(LEAF_STOMATA_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of LEAF_STOMATA_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.length).toBeGreaterThan(3);
      expect(source.title.length).toBeGreaterThan(8);
      expect(source.citation.length).toBeGreaterThan(8);
      expect(source.supports.length).toBeGreaterThan(50);
      expect(source.boundary.length).toBeGreaterThan(40);
    }
  });

  it("keeps EN/ZH metadata aligned to the 1/2/4/2/1 beat curve", () => {
    const en = metadataFor("en");
    const zh = metadataFor("zh");
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
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
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

describe("Leaf Stomata — render and scientific narrative", () => {
  it("renders every scene beat in both languages with five distinct compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          const sceneRoot = panel.querySelector<HTMLElement>("[data-composition]");
          expect(sceneRoot?.dataset.composition).toBeTruthy();
          expect(panel.textContent?.trim().length).toBeGreaterThan(0);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(sceneRoot!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("marks each multi-beat scene as a stable reserved reading layout", () => {
    for (const scene of [2, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const panel = activePanel(view.container);
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThan(2);
      view.unmount();
    }
  });

  it("states opposing gas fluxes and rejects a one-factor stomatal switch", () => {
    const exchange = renderStage({ scene: 3, beat: 3 });
    expect(activePanel(exchange.container)).toHaveTextContent("CO₂ enters");
    expect(activePanel(exchange.container)).toHaveTextContent("H₂O vapor leaves");
    expect(activePanel(exchange.container)).toHaveTextContent(/both fluxes/i);
    exchange.unmount();

    const conditions = renderStage({ scene: 4, beat: 1 });
    expect(activePanel(conditions.container)).toHaveTextContent(/light/i);
    expect(activePanel(conditions.container)).toHaveTextContent(/leaf water status/i);
    expect(activePanel(conditions.container)).toHaveTextContent(/internal CO₂/i);
    expect(activePanel(conditions.container)).toHaveTextContent(/not a universal switch/i);
    conditions.unmount();
  });
});

describe("Leaf Stomata — transitions and specimen registration", () => {
  it("renders all four planned transition edges", () => {
    const baseProps: TopicStageProps = {
      scene: 1,
      beat: 0,
      language: "en",
      isThumbnail: false,
      reducedMotion: false,
      onNavigate: vi.fn(),
    };
    const view = render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Stage {...baseProps} />
      </div>,
    );
    const expected = ["iris-open", "crossfade", "hard-cut", "focus-swap"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <Stage {...baseProps} scene={scene} />
        </div>,
      );
      expect(
        view.container.querySelector('[data-testid="spatial-scene-track"]'),
      ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
    }
  });

  it("exposes five ambient registration marks and click/tap navigation", () => {
    const onNavigate = vi.fn();
    const stageClick = vi.fn();
    const view = render(
      <div
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <Stage
          scene={2}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(nav).toHaveAttribute("data-navigation-geometry", "ambient");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "specimen-registration-marks",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "drag-scrub");
    expect(nav).toHaveAttribute("data-navigation-feedback", "geometry-reflow");
    expect(nav).toHaveAttribute("data-magnifier-scene", "2");
    const buttons = within(nav!).getAllByRole("button");
    expect(buttons).toHaveLength(5);

    const target = within(nav!).getByRole("button", {
      name: "Inspect specimen position 4: regulating conditions",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
  });

  it("supports drag-scrub plus Arrow and Home/End equivalents", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    Object.defineProperty(nav, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 1000,
        height: 500,
        right: 1000,
        bottom: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    dispatchPointer(nav!, "pointerdown", 120);
    dispatchPointer(nav!, "pointermove", 850);
    dispatchPointer(nav!, "pointerup", 850);
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);

    const current = within(nav!).getByRole("button", {
      name: "Inspect specimen position 2: epidermis window",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
    fireEvent.keyDown(current, { key: "Home" });
    expect(view.onNavigate).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(current, { key: "End" });
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("hides navigation in thumbnails and settles reduced/thumbnail frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 3,
        beat: 3,
        ...props,
        onNavigate: undefined,
      });
      expect(
        view.container.querySelector('[data-testid="spatial-scene-strip"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
      if (props.isThumbnail) {
        expect(
          view.container.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      view.unmount();
    }
  });
});

describe("Leaf Stomata — fixed-stage safety", () => {
  it("clips every final beat in both languages to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(view.stage.clientWidth + 1);
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(view.stage.clientHeight + 1);
        view.unmount();
      }
    }
  });
});
