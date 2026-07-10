import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import DanceNotation, {
  DANCE_NOTATION_SOURCES,
  DANCE_NOTATION_TRANSITION_SCORE,
  danceNotationTopic,
  getMetadata,
} from "./duotone-session-dance-notation";
import componentSource from "./duotone-session-dance-notation.tsx?raw";
import cssSource from "./duotone-session-dance-notation.module.css?inline";

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 3,
  3: 3,
  4: 3,
  5: 1,
};

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const componentProps: BespokeStyleProps = {
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
      <DanceNotation {...componentProps} />
    </div>,
  );
  return {
    ...view,
    stage: view.getByTestId("stage"),
    onNavigate,
  };
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>(
    '[data-spatial-scene-panel="true"][data-active="true"]',
  );
  if (!panel) throw new Error("Active dance-notation scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Duotone Session / Dance Notation — topic contract", () => {
  it("exports the planned topic, notation-turntable navigation, and exact score", () => {
    expect(danceNotationTopic.id).toBe("dance-notation");
    expect(danceNotationTopic.topic).toEqual({
      en: "Dance Notation",
      zh: "舞谱",
    });
    expect(danceNotationTopic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "notation-turntable",
      invocation: "click-expand",
      feedback: "typographic-emphasis",
    });
    expect(danceNotationTopic.sources).toBe(DANCE_NOTATION_SOURCES);
    expect(danceNotationTopic.transitionScore).toBe(
      DANCE_NOTATION_TRANSITION_SCORE,
    );
    expect(DANCE_NOTATION_TRANSITION_SCORE).toEqual({
      "1->2": "focus-swap",
      "2->3": "afterimage",
      "3->4": "push-x",
      "4->5": "afterimage",
    });
  });

  it("ships a claim-scoped DNB / NYPL / Ohio State facts packet", () => {
    expect(DANCE_NOTATION_SOURCES.length).toBeGreaterThanOrEqual(4);
    const authorities = DANCE_NOTATION_SOURCES.map(
      (source) => source.authority,
    ).join(" ");
    expect(authorities).toMatch(/Dance Notation Bureau/i);
    expect(authorities).toMatch(/New York Public Library/i);
    expect(authorities).toMatch(/Ohio State/i);

    const urls = DANCE_NOTATION_SOURCES.map((source) => source.url);
    expect(urls).toContain(
      "https://www.dancenotation.org/labanotation-fundamentals/",
    );
    expect(urls).toContain(
      "https://www.dancenotation.org/staging-from-score/",
    );
    expect(urls).toContain(
      "https://www.nypl.org/research/research-catalog/bib/b12115887",
    );
    expect(urls).toContain("https://dance.osu.edu/research/dnb/resources");

    for (const source of DANCE_NOTATION_SOURCES) {
      const typedSource: TopicSource = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.title.length).toBeGreaterThan(8);
      expect(source.citation.length).toBeGreaterThan(12);
      expect(source.supports.length).toBeGreaterThan(45);
      expect(source.boundary.length).toBeGreaterThan(35);
      expect(typedSource.url).toBe(source.url);
    }
  });

  it("keeps English and Chinese metadata aligned to 2-3-3-3-1", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("duotone-session");
    expect(en.band).toBe("editorial-print");
    expect(en.heroScene).toBe(3);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 3, 3, 3, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([2, 3, 3, 3, 1]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      metadata.scenes.forEach((scene) => {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.length).toBeGreaterThan(0);
          expect(beat.title.length).toBeGreaterThan(0);
          expect(beat.body.length).toBeGreaterThan(0);
        });
      });
    }
  });
});

describe("Duotone Session / Dance Notation — Labanotation narrative", () => {
  it("renders every bilingual beat in five distinct score-and-body compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          const composition = panel.querySelector<HTMLElement>("[data-composition]");
          expect(composition?.dataset.composition).toBeTruthy();
          expect(panel.textContent?.trim().length).toBeGreaterThan(24);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("opens with one authored pose beside one schematic score", () => {
    const view = renderStage({ scene: 1, beat: 1 });
    const panel = activePanel(view.container);
    expect(panel.querySelectorAll('[data-pose-silhouette="true"]')).toHaveLength(1);
    expect(panel.querySelectorAll('[data-notation-score="true"]')).toHaveLength(1);
    expect(panel).toHaveTextContent(/A Dance.*Written.*Twice/i);
    expect(panel).toHaveTextContent(/one movement/i);
    expect(panel).toHaveTextContent(/schematic score/i);
  });

  it("teaches the four fundamentals through three stable legend dimensions", () => {
    for (let beat = 0; beat < 3; beat += 1) {
      const view = renderStage({ scene: 2, beat });
      const panel = activePanel(view.container);
      expect(
        panel.querySelectorAll(
          '[data-legend-dimension="true"][data-visible="true"]',
        ),
      ).toHaveLength(beat + 1);
      view.unmount();
    }

    const final = renderStage({ scene: 2, beat: 2 });
    expect(activePanel(final.container)).toHaveTextContent(/direction/i);
    expect(activePanel(final.container)).toHaveTextContent(/level/i);
    expect(activePanel(final.container)).toHaveTextContent(/body part/i);
    expect(activePanel(final.container)).toHaveTextContent(/duration/i);
  });

  it("keeps the sampled pose phase synchronized with the score cursor", () => {
    for (let beat = 0; beat < 3; beat += 1) {
      const view = renderStage({ scene: 3, beat });
      const panel = activePanel(view.container);
      expect(
        panel.querySelector(`[data-pose-phase="${beat}"][data-active="true"]`),
      ).not.toBeNull();
      expect(panel.querySelector('[data-score-cursor="true"]')).toHaveAttribute(
        "data-cursor-index",
        String(beat),
      );
      expect(panel.querySelector('[data-composition="split-score"]')).toHaveAttribute(
        "data-visible-beat",
        String(beat),
      );
      view.unmount();
    }
  });

  it("makes the reconstruction boundary visible instead of claiming a single complete performance", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const panel = activePanel(view.container);
    expect(panel.querySelectorAll('[data-reconstruction="true"]')).toHaveLength(2);
    expect(panel.querySelector('[data-evidence-boundary="true"]')).not.toBeNull();
    expect(panel).toHaveTextContent(/same score/i);
    expect(panel).toHaveTextContent(/style coach/i);
    expect(panel).toHaveTextContent(/structure/i);
  });

  it("ends by separating preserved structure from embodied performance", () => {
    const view = renderStage({ scene: 5, beat: 0 });
    const panel = activePanel(view.container);
    expect(panel.querySelector('[data-composition="double-exposure"]')).not.toBeNull();
    expect(panel).toHaveTextContent(/Notation.*preserves.*structure/i);
    expect(panel).toHaveTextContent("Performance still needs a body");
    expect(panel).toHaveTextContent(/DNB · NYPL · OHIO STATE/i);
  });

  it("uses reserved beat layouts with stable marked children", () => {
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
});

describe("Duotone Session / Dance Notation — transitions and notation turntable", () => {
  it("applies all four authored transition edges", () => {
    const baseProps: BespokeStyleProps = {
      scene: 1,
      beat: 0,
      language: "en",
      isThumbnail: false,
      reducedMotion: false,
      onNavigate: vi.fn(),
    };
    const view = render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <DanceNotation {...baseProps} />
      </div>,
    );
    const expected = ["focus-swap", "afterimage", "push-x", "afterimage"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <DanceNotation {...baseProps} scene={scene} />
        </div>,
      );
      expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
        "data-scene-transition-kind",
        expected[scene - 2],
      );
    }
  });

  it("expands a notation take, emphasizes its number, and isolates navigation", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <DanceNotation
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
    expect(nav).toHaveAttribute("data-navigation-geometry", "object-controller");
    expect(nav).toHaveAttribute("data-navigation-carrier", "notation-turntable");
    expect(nav).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(nav).toHaveAttribute("data-navigation-feedback", "typographic-emphasis");
    expect(nav).toHaveAttribute("data-expanded-scene", "none");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);

    const current = within(nav!).getByRole("button", {
      name: "Open take 2: Symbol key",
    });
    expect(current).toHaveAttribute("data-current", "true");

    const target = within(nav!).getByRole("button", {
      name: "Open take 4: Reconstruction",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
    expect(nav).toHaveAttribute("data-expanded-scene", "4");
    expect(target).toHaveAttribute("data-expanded", "true");
    expect(within(target).getByText("Reconstruction")).toBeVisible();
  });

  it("supports one-step arrow and native button keyboard fallback", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    fireEvent.keyDown(nav!, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    fireEvent.keyDown(nav!, { key: "ArrowLeft" });
    expect(view.onNavigate).toHaveBeenCalledWith(2, 0);
    fireEvent.keyDown(nav!, { key: "Home" });
    expect(view.onNavigate).toHaveBeenCalledWith(1, 0);
  });

  it("keeps focused Space inside the navigation while preserving click and arrow behavior", () => {
    const windowKeyDown = vi.fn();
    window.addEventListener("keydown", windowKeyDown);

    try {
      const view = renderStage({ scene: 2 });
      const onNavigate = view.onNavigate as ReturnType<typeof vi.fn>;
      const nav = view.container.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );
      const target = within(nav!).getByRole("button", {
        name: "Open take 4: Reconstruction",
      });

      target.focus();
      fireEvent.keyDown(target, { key: " ", code: "Space" });

      expect(windowKeyDown).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();

      fireEvent.click(target);
      expect(onNavigate).toHaveBeenCalledWith(4, 0);

      onNavigate.mockClear();
      fireEvent.keyDown(nav!, { key: "ArrowRight" });
      expect(onNavigate).toHaveBeenCalledOnce();
      expect(onNavigate).toHaveBeenCalledWith(3, 0);
      expect(windowKeyDown).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("keydown", windowKeyDown);
    }
  });

  it("isolates and ignores repeated navigation keys", () => {
    const windowKeyDown = vi.fn();
    window.addEventListener("keydown", windowKeyDown);

    try {
      const view = renderStage({ scene: 2 });
      const nav = view.container.querySelector<HTMLElement>(
        '[data-topic-navigation="true"]',
      );

      fireEvent.keyDown(nav!, { key: "ArrowRight", repeat: true });

      expect(view.onNavigate).not.toHaveBeenCalled();
      expect(windowKeyDown).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("keydown", windowKeyDown);
    }
  });

  it("hides the controller in thumbnails and settles thumbnail/reduced frames", () => {
    const thumbnail = renderStage({
      scene: 3,
      beat: 0,
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(thumbnail.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(thumbnail.getByTestId("dance-notation-root")).toHaveAttribute(
      "data-motion",
      "off",
    );
    expect(thumbnail.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(
      activePanel(thumbnail.container).querySelector('[data-composition="split-score"]'),
    ).toHaveAttribute("data-visible-beat", "2");
    expect(thumbnail.container.querySelector('[data-transition-clone="true"]')).toBeNull();
    thumbnail.unmount();

    const reduced = renderStage({ scene: 4, beat: 1, reducedMotion: true });
    expect(reduced.getByTestId("dance-notation-root")).toHaveAttribute(
      "data-motion",
      "off",
    );
    expect(reduced.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(
      activePanel(reduced.container).querySelector('[data-composition="reconstruction-stage"]'),
    ).toHaveAttribute("data-visible-beat", "1");
  });
});

describe("Duotone Session / Dance Notation — stage and source hygiene", () => {
  it("uses flat ink, finite motion, safe units, and no playback or remote visual asset", () => {
    const source = `${componentSource}\n${cssSource}`;
    const forbiddenUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(source).not.toMatch(/animation[^;{]*infinite|animation-iteration-count\s*:\s*infinite/i);
    expect(componentSource).not.toMatch(/<(?:img|video|audio)\b/i);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//i);
    expect(cssSource).not.toMatch(/gradient\s*\(|box-shadow|text-shadow|blur\s*\(/i);
    expect(componentSource).not.toMatch(forbiddenUnit);
    expect(cssSource).not.toMatch(forbiddenUnit);
  });

  it("keeps every final bilingual frame clipped to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(view.stage.clientWidth + 1);
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(view.stage.clientHeight + 1);
        view.unmount();
      }
    }
  });
});
