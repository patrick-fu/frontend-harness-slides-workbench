import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import definition, {
  CHRYSALIS_REBUILD_SOURCES,
  CHRYSALIS_REBUILD_TRANSITION_SCORE,
} from "./chrysalis-rebuild";

runTopicContract(definition);

const Stage = definition.Stage;
const getMetadata = (language: "en" | "zh") => definition.metadata[language];

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 3,
  3: 3,
  4: 3,
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
  const view = render(
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

  return { ...view, onNavigate };
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>(
    '[data-spatial-scene-panel="true"][data-active="true"]',
  );
  if (!panel) throw new Error("Active chrysalis scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Soft Pastel Friendly / Chrysalis Rebuild — topic contract", () => {
  it("exports the fixed monarch scope, prescribed navigation, and score", () => {
    expect(definition.id).toBe("chrysalis-rebuild");
    expect(definition.title).toEqual({
      en: "Inside a Chrysalis",
      zh: "蛹中重建",
    });
    expect(definition.navigation).toEqual({
      geometry: "ambient",
      carrier: "cocoon-pollen-marks",
      invocation: "proximity-reveal",
      feedback: "next-state-preview",
    });
    if (definition.evidence.kind !== "facts") {
      throw new Error("Chrysalis Rebuild must retain factual Evidence.");
    }
    expect(definition.evidence.sources).toBe(CHRYSALIS_REBUILD_SOURCES);
    expect(definition.transitionScore).toBe(
      CHRYSALIS_REBUILD_TRANSITION_SCORE,
    );
    expect(CHRYSALIS_REBUILD_TRANSITION_SCORE).toEqual({
      "1->2": "iris-open",
      "2->3": "split-merge",
      "3->4": "iris-open",
      "4->5": "split-merge",
    });
  });

  it("ships claim-scoped monarch and lepidopteran sources with explicit boundaries", () => {
    expect(CHRYSALIS_REBUILD_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(
      CHRYSALIS_REBUILD_SOURCES.map((source) => source.authority).join(" "),
    ).toMatch(/Royal Society/i);
    expect(
      CHRYSALIS_REBUILD_SOURCES.map((source) => source.authority).join(" "),
    ).toMatch(/Monarch Joint Venture/i);

    for (const source of CHRYSALIS_REBUILD_SOURCES) {
      const typedSource: Source = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.title.length).toBeGreaterThan(10);
      expect(source.citation.length).toBeGreaterThan(14);
      expect(source.supports.length).toBeGreaterThan(40);
      expect(source.boundary.length).toBeGreaterThan(35);
      expect(typedSource.url).toBe(source.url);
    }
  });

  it("keeps bilingual metadata aligned to the 2-3-3-3-1 curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(definition.styleId).toBe("soft-pastel-friendly");
    expect(en.heroScene).toBe(3);
    expect(en.theme).toMatch(/Danaus plexippus/);
    expect(zh.theme).toMatch(/帝王蝶/);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 3, 3, 3, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([2, 3, 3, 3, 1]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      metadata.scenes.forEach((scene) => {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        scene.beats.forEach((beat, beatId) => {
          expect(beat.id).toBe(beatId);
          expect(beat.action.length).toBeGreaterThan(0);
          expect(beat.title.length).toBeGreaterThan(0);
          expect(beat.body.length).toBeGreaterThan(0);
        });
      });
    }
  });
});

describe("Soft Pastel Friendly / Chrysalis Rebuild — biology narrative", () => {
  it("renders every scene beat in English and Chinese with five compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          const composition = panel.querySelector<HTMLElement>("[data-composition]");
          expect(composition?.dataset.composition).toBeTruthy();
          expect(panel.textContent?.trim().length).toBeGreaterThan(35);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("reserves stable geometry for every multi-beat scene", () => {
    for (const scene of [1, 2, 3, 4]) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const panel = activePanel(view.container);
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("shows breakdown, persistence, and rebuilding together instead of soup", () => {
    const view = renderStage({ scene: 3, beat: 2 });
    const panel = activePanel(view.container);

    expect(panel.querySelectorAll('[data-tissue-fate="break-down"]')).toHaveLength(1);
    expect(panel.querySelectorAll('[data-tissue-fate="persist-remodel"]')).toHaveLength(1);
    expect(panel.querySelectorAll('[data-tissue-fate="grow-differentiate"]')).toHaveLength(1);
    expect(panel).toHaveTextContent(/not a uniform soup/i);
    expect(panel.textContent).not.toMatch(/everything dissolves|whole larva liquefies/i);
  });

  it("maps adult structures without pretending every cell has a monarch-specific lineage", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const panel = activePanel(view.container);

    expect(panel.querySelectorAll('[data-adult-structure="true"]')).toHaveLength(4);
    expect(panel).toHaveTextContent(/wings/i);
    expect(panel).toHaveTextContent(/compound eyes/i);
    expect(panel).toHaveTextContent(/legs/i);
    expect(panel).toHaveTextContent(/simplified lepidopteran map/i);
  });

  it("ends on a still monarch with an explicit species and evidence boundary", () => {
    const view = renderStage({ scene: 5, beat: 0 });
    const panel = activePanel(view.container);

    expect(panel.querySelector('[data-monarch-adult="true"]')).not.toBeNull();
    expect(panel).toHaveTextContent(/Danaus plexippus/i);
    expect(panel).toHaveTextContent(/species differ/i);
    expect(panel).toHaveTextContent(/not a cell-by-cell atlas/i);
  });
});

describe("Soft Pastel Friendly / Chrysalis Rebuild — motion and navigation", () => {
  it("applies all four authored scene edges", () => {
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
    const expected = ["iris-open", "split-merge", "iris-open", "split-merge"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <Stage {...baseProps} scene={scene} />
        </div>,
      );
      expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
        "data-scene-transition-kind",
        expected[scene - 2],
      );
    }
  });

  it("reveals pollen marks by proximity, previews next state, and isolates clicks", () => {
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
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "ambient");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "cocoon-pollen-marks",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-invocation",
      "proximity-reveal",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "next-state-preview",
    );
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);

    fireEvent.pointerEnter(navigation!);
    expect(navigation).toHaveAttribute("data-revealed", "true");
    const target = within(navigation!).getByRole("button", {
      name: /Open stage 4/i,
    });
    fireEvent.focus(target);
    expect(target).toHaveAttribute("data-preview", "body map");
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
  });

  it("supports keyboard fallback and hides navigation in thumbnails", () => {
    const view = renderStage({ scene: 1 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(navigation!).getByRole("button", {
      name: /Open stage 3/i,
    });
    fireEvent.focus(target);
    fireEvent.keyDown(target, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    view.unmount();

    const thumbnail = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.getByTestId("spatial-scene-strip"),
    ).toHaveAttribute("data-reduced-motion", "true");
  });

  it("keeps Space inside navigation while preserving the button click", () => {
    const windowKeydown = vi.fn();
    window.addEventListener("keydown", windowKeydown);

    try {
      const view = renderStage({ scene: 1 });
      const navigation = view.container.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );
      const target = within(navigation!).getByRole("button", {
        name: /Open stage 3/i,
      });

      for (const repeat of [false, true]) {
        expect(
          fireEvent.keyDown(target, {
            key: " ",
            code: "Space",
            repeat,
          }),
        ).toBe(true);
      }

      expect(windowKeydown).not.toHaveBeenCalled();
      expect(view.onNavigate).not.toHaveBeenCalled();

      fireEvent.click(target);
      expect(view.onNavigate).toHaveBeenCalledWith(3, 0);
    } finally {
      window.removeEventListener("keydown", windowKeydown);
    }
  });

  it("settles the requested frame when reduced motion is enabled", () => {
    const view = renderStage({ scene: 4, beat: 2, reducedMotion: true });
    expect(view.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(activePanel(view.container)).toHaveAttribute("data-active", "true");
    expect(activePanel(view.container).querySelectorAll('[data-revealed="true"]')).not.toHaveLength(0);
  });
});
