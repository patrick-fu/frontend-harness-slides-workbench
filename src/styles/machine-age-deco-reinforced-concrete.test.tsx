import { useRef } from "react";
import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps } from "../types";
import { useTouchNav } from "../hooks/useTouchNav";
import ReinforcedConcrete, {
  REINFORCED_CONCRETE_CLAIMS,
  REINFORCED_CONCRETE_SCENE_CLAIMS,
  REINFORCED_CONCRETE_SOURCES,
  REINFORCED_CONCRETE_TRANSITION_SCORE,
  getMetadata,
  reinforcedConcreteTopic,
} from "./machine-age-deco-reinforced-concrete";
import componentSource from "./machine-age-deco-reinforced-concrete.tsx?raw";
import cssSource from "./machine-age-deco-reinforced-concrete.module.css?inline";

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
  onStageNext,
  onStagePrev,
}: {
  props: BespokeStyleProps;
  onStageClick?: () => void;
  onStageNext: () => void;
  onStagePrev: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  useTouchNav({
    elementRef: stageRef,
    onNext: onStageNext,
    onPrev: onStagePrev,
    enabled: true,
  });

  return (
    <div
      ref={stageRef}
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
      <ReinforcedConcrete {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
  onStageNext = vi.fn(),
  onStagePrev = vi.fn(),
) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <StageFrame
      props={props}
      onStageClick={onStageClick}
      onStageNext={onStageNext}
      onStagePrev={onStagePrev}
    />,
  );
  const root = () =>
    result.container.querySelector<HTMLElement>(
      '[data-topic-id="reinforced-concrete"]',
    );
  const panel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    props,
    root,
    panel,
    rerenderProps(next: Partial<BespokeStyleProps>) {
      result.rerender(
        <StageFrame
          props={{ ...props, ...next }}
          onStageClick={onStageClick}
          onStageNext={onStageNext}
          onStagePrev={onStagePrev}
        />,
      );
    },
  };
}

function dispatchPointer(
  element: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientY: number,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: 80 },
    clientY: { value: clientY },
    pointerId: { value: 1 },
  });
  fireEvent(element, event);
}

type NativeTouchType = "touchstart" | "touchmove" | "touchend" | "touchcancel";

function dispatchNativeTouch(
  element: Element,
  type: NativeTouchType,
  clientX = 80,
  clientY = 120,
) {
  const touch = { clientX, clientY, target: element };
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as TouchEvent;
  const activeTouches = type === "touchend" || type === "touchcancel" ? [] : [touch];
  Object.defineProperties(event, {
    touches: { value: activeTouches },
    changedTouches: { value: [touch] },
    targetTouches: { value: activeTouches },
  });
  fireEvent(element, event);
}

afterEach(() => {
  document.documentElement.removeAttribute("data-frozen");
});

describe("Machine-Age Deco / Reinforced Concrete — protocol and sources", () => {
  it("exports the planned topic, navigation profile, claims packet, and exact score", () => {
    expect(reinforcedConcreteTopic.id).toBe("reinforced-concrete");
    expect(reinforcedConcreteTopic.topic).toEqual({
      en: "Reinforced Concrete",
      zh: "钢筋混凝土",
    });
    expect(reinforcedConcreteTopic.model).toBe("GPT 5.6 Sol");
    expect(reinforcedConcreteTopic.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "load-ruler",
      invocation: "drag-scrub",
      feedback: "material-color-change",
    });
    expect(reinforcedConcreteTopic.sources).toBe(REINFORCED_CONCRETE_SOURCES);
    expect(reinforcedConcreteTopic.transitionScore).toBe(
      REINFORCED_CONCRETE_TRANSITION_SCORE,
    );
    expect(REINFORCED_CONCRETE_TRANSITION_SCORE).toEqual({
      "1->2": "split-merge",
      "2->3": "dolly-pull",
      "3->4": "grid-reveal",
      "4->5": "focus-swap",
    });
  });

  it("requires every source field and a non-empty stable claim list", () => {
    expect(REINFORCED_CONCRETE_SOURCES).toHaveLength(4);
    expect(REINFORCED_CONCRETE_SOURCES.map((source) => source.id)).toEqual([
      "nist-composite-beam-strain",
      "aci-e2-reinforcement",
      "fhwa-reinforcing-bar-practices",
      "asce-tension-member-cracks",
    ]);
    expect(REINFORCED_CONCRETE_SOURCES.map((source) => source.authority)).toEqual(
      expect.arrayContaining([
        "National Institute of Standards and Technology",
        "American Concrete Institute",
        "Federal Highway Administration",
        "ASCE Journal of Structural Engineering",
      ]),
    );

    for (const source of REINFORCED_CONCRETE_SOURCES) {
      expect(source.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(source.authority.trim().length).toBeGreaterThan(0);
      expect(source.title.trim().length).toBeGreaterThan(0);
      expect(source.citation.trim().length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.length).toBeGreaterThan(100);
      expect(source.boundary.length).toBeGreaterThan(100);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(new Set(source.claimIds).size).toBe(source.claimIds.length);
    }
  });

  it("resolves every visible claim bidirectionally through scenes and source IDs", () => {
    const expectedClaimIds = [
      "concrete-compression",
      "concrete-tension",
      "steel-concrete-bond",
      "compatible-thermal-movement",
      "crack-control",
      "safety-boundary",
    ];
    const claimsById = new Map(
      REINFORCED_CONCRETE_CLAIMS.map((claim) => [claim.id, claim]),
    );
    const sourcesById = new Map(
      REINFORCED_CONCRETE_SOURCES.map((source) => [source.id, source]),
    );

    expect(REINFORCED_CONCRETE_CLAIMS.map((claim) => claim.id)).toEqual(
      expectedClaimIds,
    );
    expect(claimsById.size).toBe(REINFORCED_CONCRETE_CLAIMS.length);
    expect(sourcesById.size).toBe(REINFORCED_CONCRETE_SOURCES.length);

    for (const claim of REINFORCED_CONCRETE_CLAIMS) {
      expect(claim.visibleClaim.trim().length).toBeGreaterThan(60);
      expect(claim.sceneIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(new Set(claim.sourceIds).size).toBe(claim.sourceIds.length);

      for (const sceneId of claim.sceneIds) {
        expect(REINFORCED_CONCRETE_SCENE_CLAIMS[sceneId]).toContain(claim.id);
      }
      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, `${claim.id} -> ${sourceId}`).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
    }

    for (const source of REINFORCED_CONCRETE_SOURCES) {
      for (const claimId of source.claimIds) {
        const claim = claimsById.get(claimId);
        expect(claim, `${source.id} -> ${claimId}`).toBeDefined();
        expect(claim?.sourceIds).toContain(source.id);
      }
    }

    for (const [sceneId, claimIds] of Object.entries(
      REINFORCED_CONCRETE_SCENE_CLAIMS,
    )) {
      for (const claimId of claimIds) {
        const claim = claimsById.get(claimId);
        expect(claim, `scene ${sceneId} -> ${claimId}`).toBeDefined();
        expect(claim?.sceneIds).toContain(Number(sceneId));
      }
    }

    expect(
      new Set(Object.values(REINFORCED_CONCRETE_SCENE_CLAIMS).flat()),
    ).toEqual(new Set(expectedClaimIds));
  });

  it("keeps both languages aligned to the 4-1-2-2-1 beat curve, ending scene 5 at beat 0", () => {
    for (const language of ["en", "zh"] as const) {
      const metadata = getMetadata(language);
      expect(metadata.id).toBe("machine-age-deco");
      expect(metadata.band).toBe("craft-cultural");
      expect(metadata.heroScene).toBe(4);
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      expect(metadata.scenes.map((scene) => scene.beats.length)).toEqual([
        4, 1, 2, 2, 1,
      ]);
      expect(metadata.scenes[4]?.beats.map((beat) => beat.id)).toEqual([0]);

      for (const scene of metadata.scenes) {
        for (const [index, beat] of scene.beats.entries()) {
          expect(beat.id).toBe(index);
          expect(beat.action.length).toBeGreaterThan(0);
          expect(beat.title.length).toBeGreaterThan(0);
          expect(beat.body.length).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("Machine-Age Deco / Reinforced Concrete — material narrative", () => {
  it("renders every English and Chinese beat with five distinct force compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat, reducedMotion: true });
          const activePanel = view.panel();
          const composition = activePanel?.querySelector<HTMLElement>(
            "[data-composition]",
          );

          expect(view.root()).not.toBeNull();
          expect(activePanel).toHaveAttribute("data-scene-id", String(scene));
          expect(composition).toHaveAttribute(
            "data-claim-ids",
            REINFORCED_CONCRETE_SCENE_CLAIMS[
              scene as keyof typeof REINFORCED_CONCRETE_SCENE_CLAIMS
            ].join(" "),
          );
          expect(composition?.dataset.composition).toBeTruthy();
          expect(activePanel?.textContent?.trim().length).toBeGreaterThan(40);
          if (beat === BEAT_COUNTS[scene] - 1) {
            compositions.add(composition!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("uses reserved beat layouts for every multi-beat scene", () => {
    for (const scene of [1, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const activePanel = view.panel();

      expect(activePanel).toHaveAttribute("data-beat-layout-container", "true");
      expect(activePanel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        activePanel?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("shows one red crack only after the tension beat and keeps structural claims bounded", () => {
    const beforeCrack = renderStage({ scene: 1, beat: 1, reducedMotion: true });
    const crack = beforeCrack.panel()?.querySelector<HTMLElement>(
      '[data-crack-event="once"]',
    );
    expect(crack).toHaveAttribute("data-reveal", "false");
    beforeCrack.unmount();

    const retainedCrack = renderStage({ scene: 1, beat: 3, reducedMotion: true });
    expect(
      retainedCrack.panel()?.querySelectorAll('[data-crack-event="once"]'),
    ).toHaveLength(1);
    expect(
      retainedCrack.panel()?.querySelector('[data-crack-event="once"]'),
    ).toHaveAttribute("data-reveal", "true");
    expect(retainedCrack.panel()).toHaveTextContent(/not a failure prediction/i);
    retainedCrack.unmount();

    const section = renderStage({ scene: 4, beat: 1, reducedMotion: true });
    expect(section.panel()).toHaveTextContent(/Compression zone/i);
    expect(section.panel()).toHaveTextContent(/Neutral axis/i);
    expect(section.panel()).toHaveTextContent(/Tension zone/i);
    expect(section.panel()).toHaveTextContent(/does not erase cracking/i);
    expect(section.panel()).toHaveTextContent(/No bar sizes, spacing, cover/i);
    section.unmount();

    const conclusion = renderStage({ scene: 5, beat: 0, reducedMotion: true });
    expect(conclusion.panel()).toHaveTextContent(/Composite, not additive/i);
    expect(conclusion.panel()).toHaveTextContent(/not a rebar schedule/i);
    expect(conclusion.root()).toHaveTextContent("NOT TO SCALE");
    conclusion.unmount();
  });

  it("applies the exact scene score without clone lifecycle or animated loops", () => {
    const view = renderStage({ scene: 1 });
    const track = () =>
      view.container.querySelector<HTMLElement>(
        '[data-spatial-scene-track="true"]',
      );

    view.rerenderProps({ scene: 2 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "split-merge");
    view.rerenderProps({ scene: 3 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "dolly-pull");
    view.rerenderProps({ scene: 4 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "grid-reveal");
    view.rerenderProps({ scene: 5 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
    expect(componentSource).not.toMatch(
      /isTransitionClone|outgoingScene|setInterval|requestAnimationFrame|<img\b|fonts\.googleapis/i,
    );
    expect(cssSource).not.toMatch(/@keyframes|url\(/i);
    view.unmount();
  });
});

describe("Machine-Age Deco / Reinforced Concrete — load ruler interaction", () => {
  it("exposes the edge-scale, load-ruler contract and keeps direct clicks inside the container", () => {
    const onStageClick = vi.fn();
    const view = renderStage({}, onStageClick);
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneThree = view.getByRole("button", { name: "Jump to scene 3" });

    expect(navigation).toHaveAttribute("data-navigation-geometry", "edge-scale");
    expect(navigation).toHaveAttribute("data-navigation-carrier", "load-ruler");
    expect(navigation).toHaveAttribute("data-navigation-invocation", "drag-scrub");
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "material-color-change",
    );

    fireEvent.click(sceneThree);
    expect(view.props.onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("offers equivalent Space and Enter paths, ignores key repeat, and isolates them from stage navigation", () => {
    const onStageClick = vi.fn();
    const onWindowKeyDown = vi.fn();
    const view = renderStage({}, onStageClick);
    const sceneTwo = view.getByRole("button", { name: "Jump to scene 2" });
    const sceneFour = view.getByRole("button", { name: "Jump to scene 4" });

    window.addEventListener("keydown", onWindowKeyDown);
    try {
      fireEvent.keyDown(sceneTwo, { key: " " });
      fireEvent.keyDown(sceneFour, { key: "Enter" });
      fireEvent.keyDown(sceneFour, { key: " ", repeat: true });
    } finally {
      window.removeEventListener("keydown", onWindowKeyDown);
    }

    expect(view.props.onNavigate).toHaveBeenNthCalledWith(1, 2, 0);
    expect(view.props.onNavigate).toHaveBeenNthCalledWith(2, 4, 0);
    expect(view.props.onNavigate).toHaveBeenCalledTimes(2);
    expect(onWindowKeyDown).not.toHaveBeenCalled();
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("handles every ruler navigation key locally and blocks all focused keydown events from window", () => {
    const onNavigate = vi.fn();
    const onWindowKeyDown = vi.fn();
    const view = renderStage({ onNavigate });
    const sceneThree = view.getByRole("button", { name: "Jump to scene 3" });

    window.addEventListener("keydown", onWindowKeyDown);
    try {
      fireEvent.keyDown(sceneThree, { key: "ArrowLeft" });
      fireEvent.keyDown(sceneThree, { key: "ArrowUp" });
      fireEvent.keyDown(sceneThree, { key: "ArrowRight" });
      fireEvent.keyDown(sceneThree, { key: "ArrowDown" });
      fireEvent.keyDown(sceneThree, { key: "Home" });
      fireEvent.keyDown(sceneThree, { key: "End" });
      fireEvent.keyDown(sceneThree, { key: "ArrowRight", repeat: true });
      fireEvent.keyDown(sceneThree, { key: "a" });
    } finally {
      window.removeEventListener("keydown", onWindowKeyDown);
    }

    expect(onNavigate.mock.calls).toEqual([
      [2, 0],
      [2, 0],
      [4, 0],
      [4, 0],
      [1, 0],
      [5, 0],
    ]);
    expect(onWindowKeyDown).not.toHaveBeenCalled();
    view.unmount();
  });

  it("isolates native ruler touches from stage and window navigation while ordinary stage touch still advances", () => {
    const onStageNext = vi.fn();
    const onGlobalNext = vi.fn();
    const onStageTouch = vi.fn();
    const onWindowTouch = vi.fn();
    const view = renderStage({}, vi.fn(), onStageNext);
    const stage = view.getByTestId("stage");
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const sceneThree = view.getByRole("button", { name: "Jump to scene 3" });
    const touchTypes = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ] as const;
    const handleGlobalTouchEnd = () => onGlobalNext();

    for (const type of touchTypes) {
      stage.addEventListener(type, onStageTouch);
      window.addEventListener(type, onWindowTouch);
    }
    window.addEventListener("touchend", handleGlobalTouchEnd);

    try {
      for (const target of [navigation!, sceneThree]) {
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchmove", 82, 170);
        dispatchNativeTouch(target, "touchcancel", 82, 170);
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchend");
      }

      expect(onStageNext).not.toHaveBeenCalled();
      expect(onGlobalNext).not.toHaveBeenCalled();
      expect(onStageTouch).not.toHaveBeenCalled();
      expect(onWindowTouch).not.toHaveBeenCalled();

      dispatchNativeTouch(stage, "touchstart", 960, 540);
      dispatchNativeTouch(stage, "touchend", 960, 540);

      expect(onStageNext).toHaveBeenCalledTimes(1);
      expect(onGlobalNext).toHaveBeenCalledTimes(1);
      expect(onStageTouch).toHaveBeenCalledTimes(2);
      expect(onWindowTouch).toHaveBeenCalledTimes(2);
    } finally {
      for (const type of touchTypes) {
        stage.removeEventListener(type, onStageTouch);
        window.removeEventListener(type, onWindowTouch);
      }
      window.removeEventListener("touchend", handleGlobalTouchEnd);
      view.unmount();
    }
  });

  it("keeps a ruler-button tap out of pointer capture so click remains the touch fallback", () => {
    const onStageClick = vi.fn();
    const view = renderStage({}, onStageClick);
    const sceneThree = view.getByRole("button", { name: "Jump to scene 3" });

    fireEvent.pointerDown(sceneThree, { clientX: 40, clientY: 120, pointerId: 1 });
    fireEvent.pointerUp(sceneThree, { clientX: 40, clientY: 120, pointerId: 1 });
    fireEvent.click(sceneThree);

    expect(view.props.onNavigate).toHaveBeenCalledTimes(1);
    expect(view.props.onNavigate).toHaveBeenCalledWith(3, 0);
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("supports pointer drag-scrub while click buttons remain the fallback", () => {
    const onStageClick = vi.fn();
    const view = renderStage({}, onStageClick);
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(navigation).not.toBeNull();
    Object.defineProperty(navigation!, "getBoundingClientRect", {
      configurable: true,
      value: () =>
        ({
          top: 0,
          left: 0,
          right: 120,
          bottom: 500,
          width: 120,
          height: 500,
        }) as DOMRect,
    });

    dispatchPointer(navigation!, "pointerdown", 80);
    dispatchPointer(navigation!, "pointermove", 360);
    expect(navigation).toHaveAttribute("data-scrubbing", "true");
    dispatchPointer(navigation!, "pointerup", 360);

    expect(view.props.onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();

    const sceneFive = view.getByRole("button", { name: "Jump to scene 5" });
    fireEvent.click(sceneFive);
    expect(view.props.onNavigate).toHaveBeenLastCalledWith(5, 0);
    view.unmount();
  });
});

describe("Machine-Age Deco / Reinforced Concrete — deterministic states and stage discipline", () => {
  it("hides internal navigation in thumbnails and settles reduced-motion and frozen frames", () => {
    const thumbnail = renderStage({ isThumbnail: true, scene: 4, beat: 1 });
    expect(thumbnail.root()).toHaveAttribute("data-settled", "true");
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    thumbnail.unmount();

    document.documentElement.dataset.frozen = "true";
    const frozen = renderStage({ scene: 3, beat: 1, reducedMotion: false });
    expect(frozen.root()).toHaveAttribute("data-frozen", "true");
    expect(frozen.root()).toHaveAttribute("data-settled", "true");
    expect(
      frozen.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    frozen.unmount();
  });

  it("keeps stage sizing in container units and has no forbidden visual defaults", () => {
    expect(cssSource).not.toMatch(/\d(?:px|vw|vh|rem|em)\b/i);
    expect(componentSource).not.toMatch(/stock|gear|particle|flame/i);
    expect(componentSource).not.toMatch(/https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|svg)/i);
  });
});
