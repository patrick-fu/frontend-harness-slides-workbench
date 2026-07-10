import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import PneumaticPost, {
  getMetadata,
  pneumaticPostTopic,
  PNEUMATIC_POST_SOURCES,
  PNEUMATIC_POST_TRANSITION_SCORE,
} from "./red-wedge-agitprop-pneumatic-post";
import componentSource from "./red-wedge-agitprop-pneumatic-post.tsx?raw";

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 4,
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
      <PneumaticPost {...props} />
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
        '[data-topic-id="pneumatic-post"]',
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

describe("Pneumatic Post topic protocol", () => {
  it("exports the planned Topic contract, source packet, and exact score", () => {
    expect(pneumaticPostTopic.id).toBe("pneumatic-post");
    expect(pneumaticPostTopic.topic).toEqual({
      en: "Pneumatic Post",
      zh: "气动邮政",
    });
    expect(pneumaticPostTopic.navigation).toEqual({
      geometry: "path",
      carrier: "pneumatic-tube",
      invocation: "drag-scrub",
      feedback: "typographic-emphasis",
    });
    expect(pneumaticPostTopic.sources).toBe(PNEUMATIC_POST_SOURCES);
    expect(pneumaticPostTopic.transitionScore).toBe(
      PNEUMATIC_POST_TRANSITION_SCORE,
    );
    expect(PNEUMATIC_POST_TRANSITION_SCORE).toEqual({
      "1->2": "diagonal-pan",
      "2->3": "split-merge",
      "3->4": "dip-to-color",
      "4->5": "diagonal-pan",
    });

    expect(PNEUMATIC_POST_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of PNEUMATIC_POST_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim()).not.toHaveLength(0);
      expect(source.boundary.trim()).not.toHaveLength(0);
      expect(source.authority).toBeTruthy();
    }
  });

  it("keeps five localized scenes aligned to the 1-3-2-4-1 curve", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("red-wedge-agitprop");
    expect(english.heroScene).toBe(4);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => expect(beat.id).toBe(index));
    }
  });

  it("renders every English and Chinese beat in stable reserved layouts", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const stage = renderStage({ language, scene, beat });
          expect(stage.root()).not.toBeNull();
          expect(stage.activePanel()).toHaveAttribute(
            "data-scene-id",
            String(scene),
          );
          expect(stage.activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          expect(stage.activePanel()?.textContent?.trim().length).toBeGreaterThan(
            24,
          );
          expect(
            stage.activePanel()?.querySelectorAll(
              '[data-beat-layout-item="true"]',
            ).length,
          ).toBeGreaterThan(0);
          stage.unmount();
        }
      }
    }
  });

  it("renders every authored edge and limits the signature modifier to scene 4", () => {
    const { container, rerenderProps } = renderStage({ scene: 1 });
    const track = () =>
      container.querySelector<HTMLElement>('[data-spatial-scene-track="true"]');

    rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "diagonal-pan",
    );

    rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "split-merge");

    rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "dip-to-color");
    expect(track()).toHaveAttribute(
      "data-scene-transition-modifier",
      "pneumatic-burst",
    );

    rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "diagonal-pan",
    );
    expect(track()).not.toHaveAttribute(
      "data-scene-transition-modifier",
      "pneumatic-burst",
    );
  });
});

describe("Pneumatic Post evidence-led narrative", () => {
  it("locks the story to Paris and distinguishes testing from public service", () => {
    const { activePanel } = renderStage({ scene: 1 });

    expect(activePanel()).toHaveTextContent("PARIS · 1866—1984");
    expect(activePanel()).toHaveTextContent(/public service · 1879/i);
    expect(activePanel()).toHaveTextContent("MAIL");
    expect(activePanel()).toHaveTextContent("PRESSURE");
  });

  it("builds pressure, seal, and motion as three distinct section beats", () => {
    const pressure = renderStage({ scene: 2, beat: 0 });
    expect(pressure.activePanel()).toHaveTextContent("PRESSURE DIFFERENCE");
    pressure.unmount();

    const seal = renderStage({ scene: 2, beat: 1 });
    expect(seal.activePanel()).toHaveTextContent("LEATHER SEAL");
    seal.unmount();

    const motion = renderStage({ scene: 2, beat: 2 });
    expect(motion.activePanel()).toHaveTextContent("800 m/min");
    expect(motion.activePanel()).toHaveTextContent("reported operating speed");
  });

  it("marks the city map as schematic and keeps route dates traceable", () => {
    const firstLine = renderStage({ scene: 3, beat: 0 });
    expect(firstLine.activePanel()).toHaveTextContent("BOURSE");
    expect(firstLine.activePanel()).toHaveTextContent("GRAND-HÔTEL");
    expect(firstLine.activePanel()).toHaveTextContent("1866 TEST");
    firstLine.unmount();

    const mature = renderStage({ scene: 3, beat: 1 });
    expect(mature.activePanel()).toHaveTextContent("ABOUT 400 KM");
    expect(mature.activePanel()).toHaveTextContent("SCHEMATIC · NOT TO SCALE");
  });

  it("shows one capsule sprint and one station rebound, then settles", () => {
    const { activePanel } = renderStage({ scene: 4, beat: 3 });
    const capsule = activePanel()?.querySelector<HTMLElement>(
      '[data-signature-capsule="once"]',
    );

    expect(capsule).not.toBeNull();
    expect(capsule).toHaveAttribute("data-rebound-count", "1");
    expect(window.getComputedStyle(capsule!).animationIterationCount).not.toBe(
      "infinite",
    );
    expect(activePanel()).toHaveTextContent("RECEIVE · SORT · RE-SEND");
    expect(activePanel()).toHaveTextContent(/not one continuous citywide shot/i);
  });

  it("ends on a reconstructed note plus capacity, blockage, and replacement limits", () => {
    const { activePanel } = renderStage({ scene: 5 });

    expect(activePanel()).toHaveTextContent("RECONSTRUCTED TEACHING FORM");
    expect(activePanel()).toHaveTextContent("BUNDLED, NOT INFINITE");
    expect(activePanel()).toHaveTextContent("BLOCKAGES NEEDED ACCESS");
    expect(activePanel()).toHaveTextContent("TELEPHONE · TELEX · FAX");
  });
});

describe("Pneumatic Post navigation and deterministic modes", () => {
  it("renders a five-stop draggable tube with complete audit attributes", () => {
    const { root } = renderStage({ scene: 3 });
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "path");
    expect(nav).toHaveAttribute("data-navigation-carrier", "pneumatic-tube");
    expect(nav).toHaveAttribute("data-navigation-invocation", "drag-scrub");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "typographic-emphasis",
    );
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(nav!).getByRole("button", { name: "Scene 3 · Paris tube map" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("supports click/tap and keyboard fallbacks without stage leakage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ scene: 2, onNavigate }, onStageClick);
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const station = within(nav!).getByRole("button", {
      name: "Scene 4 · Switching station",
    });

    fireEvent.pointerDown(station);
    fireEvent.click(station);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    onNavigate.mockClear();
    const active = within(nav!).getByRole("button", {
      name: "Scene 2 · Pressure section",
    });
    fireEvent.keyDown(active, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenCalledWith(3, 0);
  });

  it("scrubs the capsule along the tube with pointer input", () => {
    const onNavigate = vi.fn();
    const { root } = renderStage({ scene: 1, onNavigate });
    const scrubSurface = root()?.querySelector<HTMLElement>(
      '[data-navigation-scrub-surface="true"]',
    );
    vi.spyOn(scrubSurface!, "getBoundingClientRect").mockReturnValue({
      x: 100,
      y: 0,
      width: 1000,
      height: 100,
      top: 0,
      right: 1100,
      bottom: 100,
      left: 100,
      toJSON: () => ({}),
    });

    const dispatchPointer = (type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true });
      Object.defineProperties(event, {
        clientX: { value: clientX },
        pointerId: { value: 3 },
      });
      fireEvent(scrubSurface!, event);
    };

    dispatchPointer("pointerdown", 880);
    dispatchPointer("pointermove", 1090);
    dispatchPointer("pointerup", 1090);

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("turns the signature into a static path and endpoint in reduced motion", () => {
    const { root, activePanel } = renderStage({
      scene: 4,
      beat: 3,
      reducedMotion: true,
    });

    expect(root()).toHaveAttribute("data-motion", "off");
    expect(
      activePanel()?.querySelector('[data-signature-capsule="once"]'),
    ).toBeNull();
    expect(
      activePanel()?.querySelector('[data-reduced-route="settled"]'),
    ).not.toBeNull();
    expect(
      activePanel()?.querySelector('[data-reduced-endpoint="emphasized"]'),
    ).not.toBeNull();
  });

  it("hides navigation and freezes local motion in thumbnail mode", () => {
    const { root, activePanel } = renderStage({
      scene: 4,
      beat: 3,
      isThumbnail: true,
      onNavigate: undefined,
    });

    expect(root()).toHaveAttribute("data-motion", "off");
    expect(root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(
      activePanel()?.querySelector('[data-signature-capsule="once"]'),
    ).toBeNull();
  });
});

describe("Pneumatic Post lifecycle and layout hygiene", () => {
  it("uses shared scene lifecycle without clones, loops, or local timers", () => {
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(componentSource).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|setTimeout|requestAnimationFrame/,
    );
    const { activePanel } = renderStage({ scene: 4, beat: 3 });
    activePanel()?.querySelectorAll<HTMLElement>("*").forEach((element) => {
      expect(window.getComputedStyle(element).animationIterationCount).not.toBe(
        "infinite",
      );
    });
  });

  it("uses only stage-relative authored dimensions and clips the root", () => {
    const { root } = renderStage();
    expect(root()).not.toBeNull();
    expect(
      root()?.querySelector<HTMLElement>('[data-spatial-scene-track="true"]')
        ?.style.overflow,
    ).toBe("hidden");
    expect(componentSource).not.toMatch(
      /\b\d+(?:\.\d+)?(?:px|rem|em|vw|vh)\b/,
    );
  });
});
