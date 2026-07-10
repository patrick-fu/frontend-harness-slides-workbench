import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import TidalTime, {
  getMetadata,
  TIDAL_TIME_SOURCES,
  TIDAL_TIME_TRANSITION_SCORE,
  tidalTimeTopic,
} from "./studio-mixing-console-tidal-time";
import componentSource from "./studio-mixing-console-tidal-time.tsx?raw";
import styleSource from "./studio-mixing-console-tidal-time.module.css?inline";

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 1,
  3: 2,
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
      <TidalTime {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);

  return {
    ...result,
    props,
    root: () =>
      result.container.querySelector<HTMLElement>('[data-topic-id="tidal-time"]'),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
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

describe("Tidal Time topic protocol", () => {
  it("exports the locked topic, facts packet, navigation profile, and score", () => {
    expect(tidalTimeTopic.id).toBe("tidal-time");
    expect(tidalTimeTopic.topic).toEqual({
      en: "Tidal Time",
      zh: "潮汐时差",
    });
    expect(tidalTimeTopic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "tidal-fader-bank",
      invocation: "proximity-reveal",
      feedback: "material-color-change",
    });
    expect(tidalTimeTopic.sources).toBe(TIDAL_TIME_SOURCES);
    expect(tidalTimeTopic.transitionScore).toBe(TIDAL_TIME_TRANSITION_SCORE);
    expect(TIDAL_TIME_TRANSITION_SCORE).toEqual({
      "1->2": "push-y",
      "2->3": "push-x",
      "3->4": "afterimage",
      "4->5": "focus-swap",
    });

    expect(TIDAL_TIME_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of TIDAL_TIME_SOURCES) {
      expect(source.authority.trim()).not.toHaveLength(0);
      expect(source.title.trim()).not.toHaveLength(0);
      expect(source.citation.trim()).not.toHaveLength(0);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
    }
  });

  it("anchors ocean dissipation to an accessible primary study without overstating mechanisms", () => {
    const dissipationSource = TIDAL_TIME_SOURCES.find(
      (source) =>
        source.url === "https://www.nature.com/articles/35015531",
    );

    expect(dissipationSource).toEqual(
      expect.objectContaining({
        authority: "Nature / Oregon State University / NASA Goddard",
        title:
          "Significant dissipation of tidal energy in the deep ocean inferred from satellite altimeter data",
        citation:
          "Egbert, G. D. & Ray, R. D. (2000), Nature 405, 775–778. doi:10.1038/35015531",
      }),
    );
    expect(dissipationSource?.supports).toContain(
      "rough ocean-bottom topography",
    );
    expect(dissipationSource?.supports).toContain("internal waves");
    expect(dissipationSource?.supports).not.toMatch(
      /wave breaking|internal-wave scattering/i,
    );
    expect(componentSource).not.toContain("core2.gsfc.nasa.gov");
    expect(componentSource).not.toMatch(
      /wave breaking|internal-wave scattering/i,
    );
  });

  it("keeps five localized scenes aligned to beats 4/1/2/2/1", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("studio-mixing-console");
    expect(english.band).toBe("balanced-hybrid");
    expect(english.heroScene).toBe(4);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      4, 1, 2, 2, 1,
    ]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([
      4, 1, 2, 2, 1,
    ]);

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => {
        expect(beat.id).toBe(index);
        expect(beat.title.trim()).not.toHaveLength(0);
        expect(beat.body.trim()).not.toHaveLength(0);
      });
    }
  });

  it("renders every bilingual beat as a settled instrument frame", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          expect(view.activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          expect(
            view.activePanel()?.querySelectorAll('[data-beat-layout-item="true"]')
              .length,
          ).toBeGreaterThanOrEqual(3);
          expect(view.activePanel()?.textContent?.trim().length).toBeGreaterThan(
            24,
          );
          view.unmount();
        }
      }
    }
  });

  it("applies the authored transition score to all four forward edges", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "push-y"],
      [3, "push-x"],
      [4, "afterimage"],
      [5, "focus-swap"],
    ] as const) {
      view.rerenderProps({ scene });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });
});

describe("Tidal Time scientific story", () => {
  it("opens on opposing Earth-spin and Moon-orbit faders with an exaggeration label", () => {
    const view = renderStage({ scene: 1, beat: 3 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-mixing-console="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-fader-direction="down"]')).not.toBeNull();
    expect(panel?.querySelector('[data-fader-direction="up"]')).not.toBeNull();
    expect(panel?.querySelector('[data-ratio-warning="true"]')).toHaveTextContent(
      "EXTREMELY EXAGGERATED",
    );
  });

  it("uses an orbital diagram to connect the offset bulge to torque", () => {
    const view = renderStage({ scene: 3, beat: 1 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-orbit-diagram="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-tidal-phase="ahead"]')).not.toBeNull();
    expect(panel?.querySelector('[data-torque-direction="forward"]')).not.toBeNull();
    expect(panel).toHaveTextContent("bulge leads the Earth–Moon line");
  });

  it("keeps dissipated energy and transferred angular momentum on separate ledgers", () => {
    const view = renderStage({ scene: 4, beat: 1 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-energy-ledger="true"]')).toHaveTextContent(
      "HEAT",
    );
    expect(
      panel?.querySelector('[data-angular-momentum-ledger="true"]'),
    ).toHaveTextContent("LUNAR ORBIT");
    expect(panel).toHaveTextContent("Different ledgers");
  });

  it("ends on laser-ranging evidence and rejects linear deep-time extrapolation", () => {
    const view = renderStage({ scene: 5, beat: 0 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-laser-ranging="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-retroreflector="true"]')).not.toBeNull();
    expect(panel).toHaveTextContent("3.8 cm / year");
    expect(panel?.querySelector('[data-deep-time-warning="true"]')).toHaveTextContent(
      "not a linear ruler for deep time",
    );
  });
});

describe("Tidal Time navigation and deterministic modes", () => {
  it("renders a five-fader navigator with complete audit attributes", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute(
      "data-navigation-geometry",
      "object-controller",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "tidal-fader-bank",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-invocation",
      "proximity-reveal",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "material-color-change",
    );
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(navigation!).getByRole("button", { name: "Scene 3: phase & torque" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("supports click/tap and Arrow-key fallback without leaking to the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 3, onNavigate }, onStageClick);
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(navigation!).getByRole("button", {
      name: "Scene 5: laser ranging",
    });

    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(navigation!).getByRole("button", {
      name: "Scene 3: phase & torque",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles reduced/frozen frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 5,
        beat: 0,
        ...props,
        onNavigate: undefined,
      });
      expect(view.root()).toHaveAttribute("data-motion", "off");
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      if (props.isThumbnail) {
        expect(
          view.root()?.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      expect(view.activePanel()).toHaveTextContent("3.8 cm / year");
      view.unmount();
    }
  });
});

describe("Tidal Time stage and source hygiene", () => {
  it("uses the shared lifecycle without clones, loops, hotlinks, or unsafe units", () => {
    const source = `${componentSource}\n${styleSource}`;
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(source).not.toMatch(/animation[^;{]*infinite/);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(source).not.toMatch(
      /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i,
    );
  });

  it("keeps every final bilingual frame clipped to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
        });
        const stage = view.getByTestId("stage");
        expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
        expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
        view.unmount();
      }
    }
  });
});
