import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import definition, {
  VOYAGER_BOUNDARY_SOURCES,
  VOYAGER_BOUNDARY_TRANSITION_SCORE,
} from "./voyager-boundary";
import componentSource from "./voyager-boundary.tsx?raw";

runTopicContract(definition);

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 4,
  5: 1,
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
      <definition.Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(<StageFrame props={props} onStageClick={onStageClick} />);

  return {
    ...result,
    props,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="voyager-boundary"]',
      ),
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<TopicStageProps>) {
      const nextProps = { ...props, ...next };
      result.rerender(
        <StageFrame props={nextProps} onStageClick={onStageClick} />,
      );
    },
  };
}

describe("Voyager Boundary topic protocol", () => {
  it("exports the planned topic, navigation, sources, and exact transition score", () => {
    expect(definition.id).toBe("voyager-boundary");
    expect(definition.title).toEqual({
      en: "Voyager Boundary",
      zh: "日球层边界",
    });
    expect(definition.styleId).toBe("retro-windows");
    expect(definition.navigation).toEqual({
      geometry: "path",
      carrier: "telemetry-trail",
      invocation: "keyboard-focus",
      feedback: "active-glow",
    });
    expect(definition.evidence).toMatchObject({
      kind: "facts",
      sources: VOYAGER_BOUNDARY_SOURCES,
    });
    expect(definition.transitionScore).toBe(
      VOYAGER_BOUNDARY_TRANSITION_SCORE,
    );
    expect(VOYAGER_BOUNDARY_TRANSITION_SCORE).toEqual({
      "1->2": "hard-cut",
      "2->3": "scanline",
      "3->4": "glitch",
      "4->5": "push-x",
    });

    expect(VOYAGER_BOUNDARY_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of VOYAGER_BOUNDARY_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim()).not.toHaveLength(0);
      expect(source.authority || source.title).toBeTruthy();
    }
  });

  it("keeps five localized scenes and claims structurally aligned", () => {
    const english = definition.metadata.en;
    const chinese = definition.metadata.zh;

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

  it("renders every English and Chinese beat in a stable reserved layout", () => {
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
            32,
          );
          stage.unmount();
        }
      }
    }
  });

  it("renders the four authored edges and the Voyager signature modifier", () => {
    const { container, rerenderProps } = renderStage({ scene: 1 });
    const track = () =>
      container.querySelector<HTMLElement>('[data-spatial-scene-track="true"]');

    rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "hard-cut");

    rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "scanline");

    rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "glitch");
    expect(track()).toHaveAttribute(
      "data-scene-transition-modifier",
      "voyager-boundary",
    );

    rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "push-x");
  });
});

describe("Voyager Boundary scientific narrative", () => {
  it("separates the two crossing evidence paths and marks missing instruments", () => {
    const first = renderStage({ scene: 3, beat: 0 });
    expect(first.activePanel()).toHaveTextContent("Voyager 1");
    expect(within(first.activePanel()!).getByText("NO DIRECT PLASMA")).toBeVisible();
    expect(within(first.activePanel()!).getByText("DENSITY INFERENCE")).toBeVisible();
    first.unmount();

    const second = renderStage({ scene: 3, beat: 1 });
    expect(second.activePanel()).toHaveTextContent("Voyager 2");
    expect(within(second.activePanel()!).getByText("DIRECT PLASMA")).toBeVisible();
    expect(second.activePanel()).toHaveTextContent("2018-11-05");
    second.unmount();
  });

  it("scans the CRT once in motion mode and settles on interstellar telemetry", () => {
    const { activePanel } = renderStage({ scene: 4, beat: 3 });
    const scan = activePanel()?.querySelector<HTMLElement>('[data-crt-scan="once"]');

    expect(scan).not.toBeNull();
    expect(window.getComputedStyle(scan!).animationIterationCount).not.toBe(
      "infinite",
    );
    expect(activePanel()).toHaveTextContent("INTERSTELLAR MEDIUM");
    expect(activePanel()).toHaveTextContent("heliospheric particles ↓");
    expect(activePanel()).toHaveTextContent("galactic cosmic rays ↑");
  });

  it("uses two settled boundary frames when motion is reduced", () => {
    const { root, activePanel } = renderStage({
      scene: 4,
      beat: 3,
      reducedMotion: true,
    });

    expect(root()).toHaveAttribute("data-motion", "off");
    expect(activePanel()?.querySelector('[data-crt-scan="once"]')).toBeNull();
    expect(
      activePanel()?.querySelectorAll('[data-reduced-boundary-frame="true"]'),
    ).toHaveLength(2);
    expect(
      activePanel()?.querySelector('[data-boundary-highlight="true"]'),
    ).not.toBeNull();
  });

  it("ends with a dated mission roster and distinguishes heliopause from the Solar System's distant reservoir", () => {
    const { activePanel } = renderStage({ scene: 5, beat: 0 });

    expect(activePanel()).toHaveTextContent("STATUS SNAPSHOT · 2026-04-17");
    expect(activePanel()).toHaveTextContent(
      "Interstellar space ≠ beyond the Sun’s gravity",
    );
    expect(activePanel()).toHaveTextContent("Oort Cloud");
    expect(activePanel()).toHaveTextContent("V1 · MAG + PWS ON");
    expect(activePanel()).toHaveTextContent("V2 · CRS + MAG + PWS ON");
  });
});

describe("Voyager Boundary navigation and deterministic modes", () => {
  it("renders a five-stop telemetry trail with complete audit attributes", () => {
    const { root } = renderStage({ scene: 3 });
    const nav = root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "path");
    expect(nav).toHaveAttribute("data-navigation-carrier", "telemetry-trail");
    expect(nav).toHaveAttribute(
      "data-navigation-invocation",
      "keyboard-focus",
    );
    expect(nav).toHaveAttribute("data-navigation-feedback", "active-glow");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
  });

  it("supports click/tap without leaking into stage navigation", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const { root } = renderStage({ onNavigate }, onStageClick);
    const target = within(root()!).getByRole("button", {
      name: "Jump to scene 4: heliopause",
    });

    fireEvent.pointerDown(target);
    fireEvent.click(target);

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("uses Arrow keys as an isolated keyboard-focus fallback", () => {
    const onNavigate = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const { root } = renderStage({ scene: 3, onNavigate });
    const active = within(root()!).getByRole("button", {
      name: "Jump to scene 3: evidence",
    });

    fireEvent.keyDown(active, { key: "ArrowRight" });

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onWindowKey).not.toHaveBeenCalled();
    window.removeEventListener("keydown", onWindowKey);
  });

  it("hides navigation and disables local motion in thumbnail mode", () => {
    const { root, activePanel } = renderStage({
      scene: 4,
      beat: 3,
      isThumbnail: true,
      onNavigate: undefined,
    });

    expect(root()).toHaveAttribute("data-motion", "off");
    expect(root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(activePanel()?.querySelector('[data-crt-scan="once"]')).toBeNull();
  });
});

describe("Voyager Boundary source and layout hygiene", () => {
  it("uses the shared scene lifecycle and avoids outgoing clones or timers", () => {
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(componentSource).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    const { activePanel } = renderStage({ scene: 4, beat: 3 });
    activePanel()?.querySelectorAll<HTMLElement>("*").forEach((element) => {
      expect(window.getComputedStyle(element).animationIterationCount).not.toBe(
        "infinite",
      );
    });
  });

  it("keeps authored dimensions stage-relative and the root clipped", () => {
    const { root } = renderStage();
    expect(root()?.className).not.toHaveLength(0);
    expect(
      root()?.querySelector<HTMLElement>('[data-spatial-scene-track="true"]')
        ?.style.overflow,
    ).toBe("hidden");
    expect(componentSource).not.toMatch(
      /["']\d+(?:\.\d+)?(?:px|rem|em|vw|vh)["']/,
    );
  });
});
