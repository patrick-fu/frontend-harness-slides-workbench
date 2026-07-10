import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import IronFromStars, {
  IRON_FROM_STARS_SOURCES,
  IRON_FROM_STARS_TRANSITION_SCORE,
  getMetadata,
  ironFromStarsTopic,
} from "./solar-biennale-poster-iron-from-stars";

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
      <IronFromStars {...componentProps} />
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
  if (!panel) throw new Error("Active iron-from-stars scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Solar Biennale Poster / Iron from Stars — topic contract", () => {
  it("exports the planned topic, navigation profile, and exact score", () => {
    expect(ironFromStarsTopic.id).toBe("iron-from-stars");
    expect(ironFromStarsTopic.topic).toEqual({
      en: "Iron from Stars",
      zh: "恒星炼铁",
    });
    expect(ironFromStarsTopic.navigation).toEqual({
      geometry: "ambient",
      carrier: "solar-orbit-points",
      invocation: "click-expand",
      feedback: "mechanical-displacement",
    });
    expect(ironFromStarsTopic.sources).toBe(IRON_FROM_STARS_SOURCES);
    expect(ironFromStarsTopic.transitionScore).toBe(
      IRON_FROM_STARS_TRANSITION_SCORE,
    );
    expect(IRON_FROM_STARS_TRANSITION_SCORE).toEqual({
      "1->2": "iris-open",
      "2->3": "zoom-through",
      "3->4": "dip-to-color",
      "4->5": "iris-open",
    });
  });

  it("ships a bounded NASA / DOE / peer-reviewed facts packet", () => {
    expect(IRON_FROM_STARS_SOURCES.length).toBeGreaterThanOrEqual(4);
    expect(
      IRON_FROM_STARS_SOURCES.map((source) => source.authority).join(" "),
    ).toMatch(/NASA/i);
    expect(
      IRON_FROM_STARS_SOURCES.map((source) => source.authority).join(" "),
    ).toMatch(/Department of Energy/i);

    for (const source of IRON_FROM_STARS_SOURCES) {
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

    expect(en.id).toBe("solar-biennale-poster");
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

describe("Solar Biennale Poster / Iron from Stars — cosmic poster narrative", () => {
  it("renders every beat in both languages with five distinct compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          const panel = activePanel(view.container);
          const composition = panel.querySelector<HTMLElement>("[data-composition]");
          expect(composition?.dataset.composition).toBeTruthy();
          expect(panel.textContent?.trim().length).toBeGreaterThan(30);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("reserves every multi-beat poster composition", () => {
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

  it("draws fusion as geometric stages and an onion-shell cutaway, not flame", () => {
    const rings = renderStage({ scene: 2, beat: 2 });
    expect(activePanel(rings.container).querySelectorAll('[data-element-ring="true"]')).toHaveLength(5);
    expect(activePanel(rings.container)).toHaveTextContent(/temperature rises/i);
    expect(activePanel(rings.container).textContent).not.toMatch(/flame|fire/i);
    rings.unmount();

    const shell = renderStage({ scene: 3, beat: 2 });
    expect(activePanel(shell.container).querySelectorAll('[data-stellar-shell="true"]')).toHaveLength(5);
    expect(activePanel(shell.container)).toHaveTextContent(/onion-shell/i);
    shell.unmount();
  });

  it("marks the iron peak as an energy boundary rather than a heavier-element factory", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const panel = activePanel(view.container);
    const composition = panel.querySelector<HTMLElement>("[data-composition]");
    expect(panel).toHaveTextContent(/iron peak/i);
    expect(panel).toHaveTextContent(/does not release net fusion energy/i);
    expect(composition).toHaveAttribute("data-motion-state", "quiet");
  });

  it("ends with several sites, distinct processes, and an explicit uncertainty boundary", () => {
    const view = renderStage({ scene: 5, beat: 0 });
    const panel = activePanel(view.container);
    expect(panel.querySelectorAll('[data-origin-site="true"]')).toHaveLength(4);
    expect(panel).toHaveTextContent(/stellar winds/i);
    expect(panel).toHaveTextContent(/supernova/i);
    expect(panel).toHaveTextContent(/neutron-star merger/i);
    expect(panel).toHaveTextContent(/No single event makes every heavy element/i);
    expect(panel).toHaveTextContent(/contributions remain under study/i);
  });
});

describe("Solar Biennale Poster / Iron from Stars — transitions and orbit navigation", () => {
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
        <IronFromStars {...baseProps} />
      </div>,
    );
    const expected = ["iris-open", "zoom-through", "dip-to-color", "iris-open"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <IronFromStars {...baseProps} scene={scene} />
        </div>,
      );
      expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
        "data-scene-transition-kind",
        expected[scene - 2],
      );
    }
  });

  it("expands and mechanically displaces a clicked orbit point before navigation", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <IronFromStars
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
    expect(nav).toHaveAttribute("data-navigation-carrier", "solar-orbit-points");
    expect(nav).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(nav).toHaveAttribute("data-navigation-feedback", "mechanical-displacement");
    expect(nav).toHaveAttribute("data-expanded-scene", "none");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);

    const target = within(nav!).getByRole("button", {
      name: "Open orbit 4: iron boundary",
    });
    const initialAngle = target.getAttribute("data-orbit-angle");
    fireEvent.pointerDown(target);
    fireEvent.click(target);

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
    expect(nav).toHaveAttribute("data-expanded-scene", "4");
    expect(target).toHaveAttribute("data-expanded", "true");
    expect(target.getAttribute("data-orbit-angle")).not.toBe(initialAngle);
    expect(within(target).getByText("iron boundary")).toBeVisible();
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
    fireEvent.keyDown(nav!, { key: "End" });
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("keeps native button activation local to an orbit button", () => {
    const onNavigate = vi.fn();
    const onWindowKey = vi.fn();
    const view = renderStage({ scene: 3, onNavigate });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(nav!).getByRole("button", {
      name: "Open orbit 4: iron boundary",
    });

    window.addEventListener("keydown", onWindowKey);
    const allowsNativeActivation = fireEvent.keyDown(target, {
      key: " ",
      code: "Space",
    });
    const allowsNativeRepeat = fireEvent.keyDown(target, {
      key: " ",
      code: "Space",
      repeat: true,
    });
    const allowsNativeEnter = fireEvent.keyDown(target, {
      key: "Enter",
      code: "Enter",
    });
    window.removeEventListener("keydown", onWindowKey);

    expect(allowsNativeActivation).toBe(true);
    expect(allowsNativeRepeat).toBe(true);
    expect(allowsNativeEnter).toBe(true);
    expect(onWindowKey).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();

    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
  });

  it("hides navigation in thumbnails and settles reduced/thumbnail frames", () => {
    const thumbnail = renderStage({
      scene: 3,
      beat: 0,
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(thumbnail.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(thumbnail.getByTestId("iron-from-stars-root")).toHaveAttribute(
      "data-motion",
      "off",
    );
    expect(thumbnail.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(
      activePanel(thumbnail.container).querySelector("[data-composition]"),
    ).toHaveAttribute("data-visible-beat", "2");
    expect(thumbnail.container.querySelector('[data-transition-clone="true"]')).toBeNull();
    thumbnail.unmount();

    const reduced = renderStage({ scene: 4, beat: 2, reducedMotion: true });
    expect(reduced.getByTestId("iron-from-stars-root")).toHaveAttribute(
      "data-motion",
      "off",
    );
    expect(reduced.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });

  it("keeps every final beat inside the fixed stage", () => {
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
