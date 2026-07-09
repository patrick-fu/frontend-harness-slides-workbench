import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import PresolarGrain, {
  getMetadata,
  PRESOLAR_GRAIN_SOURCES,
  PRESOLAR_GRAIN_TRANSITION_SCORE,
  presolarGrainTopic,
} from "./01-presolar-grain";
import componentSource from "./01-presolar-grain.tsx?raw";
import styleSource from "./01-presolar-grain.module.css?inline";

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 2,
  3: 3,
  4: 3,
  5: 2,
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
      <PresolarGrain {...props} />
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
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="presolar-grain"]',
      ),
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

describe("Presolar Grain topic protocol", () => {
  it("exports the planned topic, facts packet, navigation, and exact transition score", () => {
    expect(presolarGrainTopic.id).toBe("presolar-grain");
    expect(presolarGrainTopic.topic).toEqual({
      en: "Presolar Grain",
      zh: "太阳前尘",
    });
    expect(presolarGrainTopic.navigation).toEqual({
      geometry: "ambient",
      carrier: "corner-grain-field",
      invocation: "persistent",
      feedback: "active-glow",
    });
    expect(presolarGrainTopic.sources).toBe(PRESOLAR_GRAIN_SOURCES);
    expect(presolarGrainTopic.transitionScore).toBe(
      PRESOLAR_GRAIN_TRANSITION_SCORE,
    );
    expect(PRESOLAR_GRAIN_TRANSITION_SCORE).toEqual({
      "1->2": "crossfade",
      "2->3": "iris-open",
      "3->4": "zoom-through",
      "4->5": "dip-to-color",
    });

    expect(PRESOLAR_GRAIN_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of PRESOLAR_GRAIN_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(
        ("authority" in source ? source.authority : undefined) ||
          ("citation" in source ? source.citation : undefined) ||
          source.title,
      ).toBeTruthy();
    }
  });

  it("keeps five localized scenes and beat structures aligned", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("minimal-product-keynote");
    expect(english.band).toBe("minimal-keynote");
    expect(english.heroScene).toBe(1);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => {
        expect(beat.id).toBe(index);
        expect(beat.title.trim().length).toBeGreaterThan(0);
      });
    }
  });

  it("renders every bilingual beat in a stable reserved layout", () => {
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
            18,
          );
          view.unmount();
        }
      }
    }
  });

  it("applies the authored score to all four forward edges", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "crossfade"],
      [3, "iris-open"],
      [4, "zoom-through"],
      [5, "dip-to-color"],
    ] as const) {
      view.rerenderProps({ scene });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });
});

describe("Presolar Grain visual narrative", () => {
  it("keeps one faceted grain as the sole hero in every active scene", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      expect(
        view.activePanel()?.querySelectorAll('[data-grain-hero="true"]'),
      ).toHaveLength(1);
      expect(
        view.activePanel()?.querySelector('[data-particle-wall="true"]'),
      ).toBeNull();
      view.unmount();
    }
  });

  it("moves from thin section to isotope map, cosmic scale, and quiet return", () => {
    const thinSection = renderStage({ scene: 2, beat: 1 });
    expect(thinSection.activePanel()).toHaveTextContent("meteorite thin section");
    expect(
      thinSection.activePanel()?.querySelector('[data-thin-section="true"]'),
    ).not.toBeNull();
    thinSection.unmount();

    const isotopeMap = renderStage({ scene: 3, beat: 2 });
    expect(
      isotopeMap.activePanel()?.querySelectorAll('[data-isotope-rail="true"]'),
    ).toHaveLength(3);
    expect(isotopeMap.activePanel()).toHaveTextContent("not the Solar baseline");
    isotopeMap.unmount();

    const scale = renderStage({ scene: 4, beat: 2 });
    expect(scale.activePanel()).toHaveTextContent("PARENT STAR");
    expect(scale.activePanel()).toHaveTextContent("SOLAR NEBULA");
    scale.unmount();

    const closing = renderStage({ scene: 5, beat: 1 });
    expect(closing.activePanel()).toHaveTextContent(
      "One grain. A stellar signature.",
    );
  });
});

describe("Presolar Grain navigation and deterministic modes", () => {
  it("renders the five-grain ambient navigator with complete audit attributes", () => {
    const { root } = renderStage({ scene: 3 });
    const navigation = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "ambient");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "corner-grain-field",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-invocation",
      "persistent",
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "active-glow",
    );
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(navigation!).getByRole("button", { name: "Scene 3: isotope map" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("supports click/tap and Arrow-key fallback without leaking to the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ scene: 3, onNavigate }, onStageClick);
    const navigation = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(navigation!).getByRole("button", {
      name: "Scene 5: return to grain",
    });

    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(5, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const current = within(navigation!).getByRole("button", {
      name: "Scene 3: isotope map",
    });
    fireEvent.keyDown(current, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnails and settles reduced/frozen states", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 5,
        beat: 1,
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
      expect(view.activePanel()).toHaveTextContent(
        props.isThumbnail ? "One grain" : "One grain. A stellar signature.",
      );
      view.unmount();
    }
  });
});

describe("Presolar Grain stage and source hygiene", () => {
  it("uses the shared lifecycle without clones, loops, remote images, or unsafe units", () => {
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
