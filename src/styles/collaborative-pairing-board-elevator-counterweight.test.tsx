import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import ElevatorCounterweight, {
  ELEVATOR_COUNTERWEIGHT_SCENE_SOURCES,
  ELEVATOR_COUNTERWEIGHT_SOURCES,
  ELEVATOR_COUNTERWEIGHT_TRANSITION_SCORE,
  elevatorCounterweightTopic,
  getMetadata,
} from "./collaborative-pairing-board-elevator-counterweight";
import componentSource from "./collaborative-pairing-board-elevator-counterweight.tsx?raw";
import styleSource from "./collaborative-pairing-board-elevator-counterweight.module.css?inline";

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
      <ElevatorCounterweight {...props} />
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
        '[data-topic-id="elevator-counterweight"]',
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

describe("Elevator Counterweight topic protocol", () => {
  it("exports the locked topic, sources, navigation profile, and transition score", () => {
    expect(elevatorCounterweightTopic.id).toBe("elevator-counterweight");
    expect(elevatorCounterweightTopic.topic).toEqual({
      en: "Counterweight",
      zh: "电梯配重",
    });
    expect(elevatorCounterweightTopic.model).toBe("GPT-5.6 Terra");
    expect(elevatorCounterweightTopic.navigation).toEqual({
      geometry: "path",
      carrier: "counterweight-cable",
      invocation: "proximity-reveal",
      feedback: "geometry-reflow",
    });
    expect(elevatorCounterweightTopic.sources).toBe(ELEVATOR_COUNTERWEIGHT_SOURCES);
    expect(elevatorCounterweightTopic.transitionScore).toBe(
      ELEVATOR_COUNTERWEIGHT_TRANSITION_SCORE,
    );
    expect(ELEVATOR_COUNTERWEIGHT_TRANSITION_SCORE).toEqual({
      "1->2": "split-merge",
      "2->3": "focus-swap",
      "3->4": "push-y",
      "4->5": "split-merge",
    });

    expect(ELEVATOR_COUNTERWEIGHT_SOURCES.length).toBeGreaterThanOrEqual(3);
    expect(ELEVATOR_COUNTERWEIGHT_SOURCES.some((source) => source.authority === "ASME")).toBe(true);
    const sourceIds = new Set<string>(
      ELEVATOR_COUNTERWEIGHT_SOURCES.map((source) => source.id),
    );
    for (const source of ELEVATOR_COUNTERWEIGHT_SOURCES) {
      expect(source.id.trim()).not.toHaveLength(0);
      expect(source.authority.trim()).not.toHaveLength(0);
      expect(source.title.trim()).not.toHaveLength(0);
      expect(source.citation.trim()).not.toHaveLength(0);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(48);
      expect(source.claimIds.length).toBeGreaterThan(0);
    }

    expect(ELEVATOR_COUNTERWEIGHT_SCENE_SOURCES).toEqual({
      1: ["otis-basic-lift-workings"],
      2: ["kone-elevator-glossary"],
      3: ["tke-traction-elevators", "kone-elevator-glossary"],
      4: ["otis-high-rise-safety-systems", "asme-a17"],
      5: [
        "kone-elevator-glossary",
        "tke-traction-elevators",
        "otis-basic-lift-workings",
        "otis-high-rise-safety-systems",
        "asme-a17",
      ],
    });

    for (const [scene, mappedIds] of Object.entries(ELEVATOR_COUNTERWEIGHT_SCENE_SOURCES)) {
      expect(mappedIds.length).toBeGreaterThan(0);
      expect(mappedIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(
        mappedIds.some((id) =>
          ELEVATOR_COUNTERWEIGHT_SOURCES.find((source) => source.id === id)?.claimIds.some(
            (claimId) => claimId.startsWith(`scene-${scene}:`),
          ),
        ),
      ).toBe(true);
    }

    expect(componentSource).not.toContain("https://www.wbdg.org/dod/ufc/ufc-3-490-06");
    expect(componentSource).not.toMatch(/\bUFC\b|Whole Building Design Guide/);
  });

  it("renders each factual lens from its claim-scoped source mapping", () => {
    for (const scene of [1, 2, 3, 4, 5] as const) {
      const view = renderStage({ scene });
      const stamp = view.activePanel()?.querySelector<HTMLElement>("[data-source-ids]");

      expect(stamp).toHaveAttribute(
        "data-source-ids",
        ELEVATOR_COUNTERWEIGHT_SCENE_SOURCES[scene].join(" "),
      );
      expect(stamp?.textContent).not.toMatch(/KEEP THE JOBS DISTINCT|职责保持分开/);
      view.unmount();
    }
  });

  it("keeps five bilingual scenes structurally aligned with 4-1-2-2-1 beats", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("collaborative-pairing-board");
    expect(english.band).toBe("balanced-hybrid");
    expect(english.heroScene).toBe(3);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([4, 1, 2, 2, 1]);
    expect(chinese.scenes.map((scene) => scene.beats.length)).toEqual([4, 1, 2, 2, 1]);

    for (const metadata of [english, chinese]) {
      for (const scene of metadata.scenes) {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        for (const [index, beat] of scene.beats.entries()) {
          expect(beat.id).toBe(index);
          expect(beat.action.trim()).not.toHaveLength(0);
          expect(beat.title.trim()).not.toHaveLength(0);
          expect(beat.body.trim()).not.toHaveLength(0);
        }
      }
    }
  });

  it("renders every bilingual beat as a reserved, settled stage frame", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          expect(view.root()).not.toBeNull();
          expect(view.activePanel()).toHaveAttribute("data-scene-id", String(scene));
          expect(view.activePanel()).toHaveAttribute("data-beat-layout-mode", "reserved");
          expect(
            view.activePanel()?.querySelectorAll('[data-beat-layout-item="true"]').length,
          ).toBeGreaterThanOrEqual(3);
          expect(view.activePanel()?.textContent?.trim().length).toBeGreaterThan(28);
          view.unmount();
        }
      }
    }
  });

  it("routes all four authored scene edges through its exact score", () => {
    const view = renderStage({ scene: 1, beat: 0 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    for (const [scene, kind] of [
      [2, "split-merge"],
      [3, "focus-swap"],
      [4, "push-y"],
      [5, "split-merge"],
    ] as const) {
      view.rerenderProps({ scene, beat: 0 });
      expect(track()).toHaveAttribute("data-scene-transition-kind", kind);
    }
  });
});

describe("Elevator Counterweight factual boundaries", () => {
  it("shows the paired cable system without treating the two masses as cancellation", () => {
    const view = renderStage({ scene: 1, beat: 3 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-traction-system="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-elevator-cable="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-elevator-car="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-counterweight="true"]')).not.toBeNull();
    expect(panel).toHaveTextContent("Reduces imbalance. Does not cancel gravity.");
  });

  it("uses a design reference rather than a fixed balance percentage", () => {
    const view = renderStage({ scene: 2, beat: 0 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-design-basis="true"]')).not.toBeNull();
    expect(panel).toHaveTextContent("NO UNIVERSAL PERCENTAGE");
    expect(panel).toHaveTextContent("SELECTED PART OF RATED LOAD");
    expect(componentSource).not.toMatch(/50\s*\/\s*50/);
  });

  it("keeps remaining difference and losses with the drive, not the counterweight", () => {
    const view = renderStage({ scene: 3, beat: 1 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-difference-meter="true"]')).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(panel).toHaveTextContent("SYSTEM LOSSES");
    expect(panel).toHaveTextContent("DRIVE MACHINE");
    expect(panel).toHaveTextContent("NOT A POWER CALCULATION");
  });

  it("makes brake, governor, and safety gear a separate safety chain", () => {
    const view = renderStage({ scene: 4, beat: 1 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-safety-chain="true"]')).not.toBeNull();
    expect(panel).toHaveTextContent("MACHINE BRAKE");
    expect(panel).toHaveTextContent("OVERSPEED GOVERNOR");
    expect(panel).toHaveTextContent("CAR SAFETY GEAR");
    expect(panel).toHaveTextContent("COUNTERWEIGHT IS NOT A SAFETY DEVICE");

    view.rerenderProps({ language: "zh" });
    expect(view.activePanel()).toHaveTextContent("配重不是安全装置");
  });

  it("ends quietly with distinct responsibilities instead of a fake equilibrium", () => {
    const view = renderStage({ scene: 5, beat: 0 });
    const panel = view.activePanel();

    expect(panel?.querySelector('[data-quiet-system="true"]')).not.toBeNull();
    expect(panel?.querySelector('[data-traction-system="true"]')).toHaveAttribute(
      "data-settled",
      "true",
    );
    expect(panel).toHaveTextContent("A partner reduces work. It does not erase it.");
    expect(panel).toHaveTextContent("Safety chain handles abnormal speed.");
  });
});

describe("Elevator Counterweight navigation and deterministic modes", () => {
  it("renders the reflowing counterweight cable navigator with full audit attributes", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "path");
    expect(navigation).toHaveAttribute("data-navigation-carrier", "counterweight-cable");
    expect(navigation).toHaveAttribute("data-navigation-invocation", "proximity-reveal");
    expect(navigation).toHaveAttribute("data-navigation-feedback", "geometry-reflow");
    expect(navigation).toHaveAttribute("data-geometry-reflow", "true");
    expect(navigation?.querySelector('[data-navigation-path="true"]')).not.toBeNull();
    expect(within(navigation!).getAllByRole("button")).toHaveLength(5);
    expect(
      within(navigation!).getByRole("button", { name: "Open scene 3: difference + losses" }),
    ).toHaveAttribute("aria-current", "step");
  });

  it("supports click, tap, keyboard fallback, repeat protection, and container isolation", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const view = renderStage({ scene: 3, onNavigate }, onStageClick);
    const navigation = view.root()?.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = within(navigation!).getByRole("button", {
      name: "Open scene 4: safety chain",
    });
    const stage = view.container.querySelector<HTMLElement>("[data-testid=\"stage\"]")!;
    const windowKeyDown = vi.fn();
    const stageTouchEnd = vi.fn();
    const windowTouchEnd = vi.fn();

    window.addEventListener("keydown", windowKeyDown);
    stage.addEventListener("touchend", stageTouchEnd);
    window.addEventListener("touchend", windowTouchEnd);

    try {
      fireEvent.pointerDown(target);
      fireEvent.click(target);
      expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
      expect(onStageClick).not.toHaveBeenCalled();

      fireEvent.touchStart(target);
      fireEvent.touchEnd(target);
      expect(stageTouchEnd).not.toHaveBeenCalled();
      expect(windowTouchEnd).not.toHaveBeenCalled();
      fireEvent.click(target);
      expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
      expect(onStageClick).not.toHaveBeenCalled();

      fireEvent.touchEnd(navigation!);
      expect(stageTouchEnd).not.toHaveBeenCalled();
      expect(windowTouchEnd).not.toHaveBeenCalled();

      const current = within(navigation!).getByRole("button", {
        name: "Open scene 3: difference + losses",
      });
      fireEvent.keyDown(current, { key: "ArrowRight" });
      expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
      expect(windowKeyDown).not.toHaveBeenCalled();

      fireEvent.keyDown(current, { key: " " });
      expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
      expect(windowKeyDown).not.toHaveBeenCalled();

      fireEvent.keyDown(current, { key: "Enter" });
      expect(onNavigate).toHaveBeenLastCalledWith(3, 0);
      expect(windowKeyDown).not.toHaveBeenCalled();

      const callsBeforeRepeat = onNavigate.mock.calls.length;
      fireEvent.keyDown(current, { key: "ArrowRight", repeat: true });
      expect(onNavigate).toHaveBeenCalledTimes(callsBeforeRepeat);
      expect(windowKeyDown).not.toHaveBeenCalled();
      expect(onStageClick).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("keydown", windowKeyDown);
      stage.removeEventListener("touchend", stageTouchEnd);
      window.removeEventListener("touchend", windowTouchEnd);
    }
  });

  it("hides navigation in thumbnails and settles thumbnail and reduced-motion frames", () => {
    const thumbnail = renderStage({
      scene: 1,
      beat: 0,
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(thumbnail.root()?.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    expect(thumbnail.activePanel()).toHaveTextContent("Reduces imbalance. Does not cancel gravity.");
    thumbnail.unmount();

    const reduced = renderStage({
      scene: 5,
      beat: 0,
      reducedMotion: true,
      onNavigate: undefined,
    });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(reduced.activePanel()).toHaveTextContent("A partner reduces work. It does not erase it.");
    expect(reduced.activePanel()?.querySelector('[data-quiet-system="true"]')).not.toBeNull();
  });
});

describe("Elevator Counterweight stage and source hygiene", () => {
  it("uses the shared lifecycle without clones, remote imagery, loops, or unsafe units", () => {
    const source = `${componentSource}\n${styleSource}`;

    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(source).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(source).not.toMatch(/animation[^;{]*infinite/);
    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//);
    expect(source).not.toMatch(/(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i);
    expect(componentSource).not.toMatch(/handshake|org chart|people|repair instructions/i);
  });
});
