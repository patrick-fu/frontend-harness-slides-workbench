import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./whale-fall";

runTopicContract(topic);

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
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
      <topic.Stage {...componentProps} />
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
  if (!panel) throw new Error("Active whale-fall scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Whale Fall — topic contract", () => {
  it("exports the planned topic, facts packet, navigation, and exact score", () => {
    expect(topic.id).toBe("whale-fall");
    expect(topic.styleId).toBe("widescreen-title-card");
    expect(topic.title).toEqual({
      en: "Whale Fall",
      zh: "鲸落",
    });
    expect(topic.modelId).toBe("GPT 5.6 Sol");
    expect(topic.navigation).toEqual({
      geometry: "card-miniature",
      carrier: "whale-fall-filmstrip",
      invocation: "keyboard-focus",
      feedback: "next-state-preview",
    });
    expect(topic.evidence).toMatchObject({ kind: "mixed", display: "envelope" });
    expect(topic.transitionScore).toEqual({
      "1->2": "dip-to-color",
      "2->3": "dolly-pull",
      "3->4": "focus-swap",
      "4->5": "crossfade",
    });
  });

  it("ships at least three claim-scoped authoritative sources with boundaries", () => {
    if (topic.evidence.kind !== "mixed") {
      throw new Error("Whale fall must retain mixed evidence.");
    }
    const sources = topic.evidence.sources as readonly (Source & {
      boundary: string;
    })[];
    expect(sources.length).toBeGreaterThanOrEqual(3);
    for (const source of sources) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.length).toBeGreaterThan(50);
      expect(source.boundary.length).toBeGreaterThan(50);
      const authority =
        "authority" in source ? source.authority : source.citation;
      expect(authority).toBeTruthy();
    }
  });

  it("keeps EN/ZH metadata aligned to five scenes and the 1/1/2/3/4 curve", () => {
    const en = topic.metadata.en;
    const zh = topic.metadata.zh;

    expect(topic.styleId).toBe("widescreen-title-card");
    expect(en.heroScene).toBe(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 1, 2, 3, 4,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 1, 2, 3, 4,
    ]);

    for (const meta of [en, zh]) {
      expect(meta.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      for (const scene of meta.scenes) {
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

describe("Whale Fall — render and beat states", () => {
  it("renders every scene beat in both languages with a visible active panel", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel.querySelector(`[data-scene="${scene}"]`)).not.toBeNull();
          expect(panel.textContent?.trim().length).toBeGreaterThan(0);
          view.unmount();
        }
      }
    }
  });

  it("uses reserved, evidence-aware beats for succession and site variation", () => {
    for (const scene of [3, 4, 5]) {
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

    const early = renderStage({ scene: 3, beat: 0 });
    expect(activePanel(early.container)).toHaveTextContent("Days → months");
    early.unmount();

    const overlap = renderStage({ scene: 3, beat: 1 });
    expect(activePanel(overlap.container)).toHaveTextContent("overlap");
    overlap.unmount();

    const final = renderStage({ scene: 5, beat: 3, language: "zh" });
    expect(activePanel(final.container)).toHaveTextContent("阶段会重叠");
    expect(
      activePanel(final.container).querySelector('[data-final-state="settled"]'),
    ).toHaveAttribute(
      "data-final-state",
      "settled",
    );
  });

  it("gives every scene a distinct scale/composition signature", () => {
    const compositions = new Set<string>();
    const scales = new Set<string>();
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const sceneRoot = activePanel(view.container).querySelector<HTMLElement>(
        "[data-composition]",
      );
      expect(sceneRoot?.dataset.composition).toBeTruthy();
      expect(sceneRoot?.dataset.scale).toBeTruthy();
      compositions.add(sceneRoot!.dataset.composition!);
      scales.add(sceneRoot!.dataset.scale!);
      view.unmount();
    }
    expect(compositions.size).toBe(5);
    expect(scales.size).toBe(5);
  });
});

describe("Whale Fall — transitions and filmstrip", () => {
  it("renders all four authored transition edges", async () => {
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
        <topic.Stage {...baseProps} />
      </div>,
    );
    const expected = [
      "dip-to-color",
      "dolly-pull",
      "focus-swap",
      "crossfade",
    ];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <topic.Stage {...baseProps} scene={scene} />
        </div>,
      );
      await waitFor(() => {
        expect(
          view.container.querySelector('[data-testid="spatial-scene-track"]'),
        ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
      });
    }
  });

  it("exposes five scale-specific miniatures and isolates navigation input", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        data-testid="click-stage"
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <topic.Stage
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
    expect(nav).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "whale-fall-filmstrip",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "keyboard-focus");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "next-state-preview",
    );
    const buttons = within(nav!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(new Set(buttons.map((button) => button.dataset.scale)).size).toBe(5);

    const target = within(nav!).getByRole("button", {
      name: "Scene 4: Bone microcosm",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
  });

  it("provides an Arrow-key fallback from the focused film frame", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const current = within(nav!).getByRole("button", {
      name: "Scene 2: Descent",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
  });

  it("hides the filmstrip in thumbnails and settles deterministic frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 5,
        beat: 3,
        ...props,
        onNavigate: undefined,
      });
      expect(
        view.container.querySelector('[data-testid="spatial-scene-strip"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      expect(
        view.container.querySelector('[data-transition-clone="true"]'),
      ).toBeNull();
      if (props.isThumbnail) {
        expect(
          view.container.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      view.unmount();
    }
  });
});

describe("Whale Fall — stage safety", () => {
  it("clips every final beat in both languages to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(
          view.stage.clientWidth + 1,
        );
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(
          view.stage.clientHeight + 1,
        );
        view.unmount();
      }
    }
  });
});
