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
import cometAnatomy from "./comet-anatomy";

const { Stage } = cometAnatomy;

runTopicContract(cometAnatomy);

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
  if (!panel) throw new Error("Active comet-anatomy scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Comet Anatomy — topic contract", () => {
  it("declares the topic, navigation profile, and exact transition score", () => {
    expect(cometAnatomy.id).toBe("comet-anatomy");
    expect(cometAnatomy.title).toEqual({
      en: "Comet Anatomy",
      zh: "彗星解剖",
    });
    expect(cometAnatomy.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "comet-sectional-scale",
      invocation: "auto-hide",
      feedback: "next-state-preview",
    });
    expect(cometAnatomy.evidence.kind).toBe("mixed");
    expect(cometAnatomy.transitionScore).toEqual({
      "1->2": "linear-wipe",
      "2->3": "push-x",
      "3->4": "iris-open",
      "4->5": "dip-to-color",
    });
  });

  it("ships claim-scoped authoritative sources and explicit evidence boundaries", () => {
    if (cometAnatomy.evidence.kind !== "mixed") {
      throw new Error("Comet Anatomy requires mixed evidence.");
    }
    const sources = cometAnatomy.evidence.sources as readonly (Source & {
      boundary: string;
    })[];
    expect(sources.length).toBeGreaterThanOrEqual(3);
    expect(cometAnatomy.evidence.boundary.en.length).toBeGreaterThan(40);
    expect(cometAnatomy.evidence.boundary.zh.length).toBeGreaterThan(20);
    for (const source of sources) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority?.length).toBeGreaterThan(3);
      expect(source.title?.length).toBeGreaterThan(8);
      expect(source.citation?.length).toBeGreaterThan(8);
      expect(source.supports.length).toBeGreaterThan(50);
      expect(source.boundary.length).toBeGreaterThan(40);
    }
  });

  it("keeps EN/ZH metadata aligned to the 1/2/4/2/1 narrative curve", () => {
    const en = cometAnatomy.metadata.en;
    const zh = cometAnatomy.metadata.zh;
    expect(cometAnatomy.styleId).toBe("cyanotype-drafting-table");
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

describe("Comet Anatomy — render and evidence", () => {
  it("renders every scene beat in both languages with a distinct composition", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          const sceneRoot = panel.querySelector<HTMLElement>("[data-composition]");
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
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

  it("marks all multi-beat scenes as stable reserved layouts", () => {
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

  it("states the specimen scale, schematic cutaway boundary, and anti-solar tail geometry", () => {
    const specimen = renderStage({ scene: 1 });
    expect(activePanel(specimen.container)).toHaveTextContent(
      "4.34 × 2.60 × 2.12 km",
    );
    specimen.unmount();

    const cutaway = renderStage({ scene: 2, beat: 1 });
    expect(activePanel(cutaway.container)).toHaveTextContent(
      /schematic mixture—not literal strata/i,
    );
    cutaway.unmount();

    const tails = renderStage({ scene: 4, beat: 1 });
    expect(activePanel(tails.container)).toHaveTextContent("SUN");
    expect(activePanel(tails.container)).toHaveTextContent("DUST TAIL");
    expect(activePanel(tails.container)).toHaveTextContent("ION TAIL");
    tails.unmount();
  });
});

describe("Comet Anatomy — transitions and sectional scale", () => {
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
        <Stage {...baseProps} />
      </div>,
    );
    const expected = ["linear-wipe", "push-x", "iris-open", "dip-to-color"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <Stage {...baseProps} scene={scene} />
        </div>,
      );
      await waitFor(() => {
        expect(
          view.container.querySelector('[data-testid="spatial-scene-track"]'),
        ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
      });
    }
  });

  it("exposes five scale marks, next-state preview, and isolated pointer/click input", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
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
    expect(nav).toHaveAttribute("data-navigation-geometry", "edge-scale");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "comet-sectional-scale",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "next-state-preview",
    );
    expect(nav).toHaveAttribute("data-auto-hide", "true");
    const buttons = within(nav!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(nav!.querySelectorAll('[data-next-preview="true"]')).toHaveLength(1);

    const target = within(nav!).getByRole("button", {
      name: "Section 4: Twin tails",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
  });

  it("provides Arrow-key and Home/End fallback from a focused scale mark", () => {
    const view = renderStage({ scene: 2 });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const current = within(nav!).getByRole("button", {
      name: "Section 2: Nucleus cutaway",
    });
    fireEvent.keyDown(current, { key: "ArrowDown" });
    expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
    fireEvent.keyDown(current, { key: "End" });
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("hides navigation in thumbnails and settles thumbnail/reduced-motion frames", () => {
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

describe("Comet Anatomy — fixed-stage safety", () => {
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
