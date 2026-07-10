import { fireEvent, render, within } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import { useTouchNav } from "../hooks/useTouchNav";
import Freedive, {
  FREEDIVE_CLAIMS,
  FREEDIVE_SOURCES,
  FREEDIVE_TRANSITION_SCORE,
  freediveTopic,
  getMetadata,
} from "./spotlight-quote-poster-freedive";
import componentSource from "./spotlight-quote-poster-freedive.tsx?raw";
import cssSource from "./spotlight-quote-poster-freedive.module.css?inline";

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
  onStageTouchStart,
}: {
  props: BespokeStyleProps;
  onStageClick?: () => void;
  onStageTouchStart?: () => void;
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
      onTouchStart={onStageTouchStart}
    >
      <Freedive {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<BespokeStyleProps> = {},
  onStageClick = vi.fn(),
  onStageTouchStart = vi.fn(),
) {
  let props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <StageFrame
      props={props}
      onStageClick={onStageClick}
      onStageTouchStart={onStageTouchStart}
    />,
  );
  const root = () =>
    result.container.querySelector<HTMLElement>('[data-topic-id="freedive"]');
  const activePanel = () =>
    result.container.querySelector<HTMLElement>(
      '[data-spatial-scene-panel="true"][data-active="true"]',
    );

  return {
    ...result,
    get props() {
      return props;
    },
    root,
    activePanel,
    rerenderProps(next: Partial<BespokeStyleProps>) {
      props = { ...props, ...next };
      result.rerender(
        <StageFrame
          props={props}
          onStageClick={onStageClick}
          onStageTouchStart={onStageTouchStart}
        />,
      );
    },
  };
}

function NativeTouchStage({
  props,
  onNext,
  onPrev,
}: {
  props: BespokeStyleProps;
  onNext: () => void;
  onPrev: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  useTouchNav({ elementRef: stageRef, onNext, onPrev, enabled: true });

  return (
    <div
      ref={stageRef}
      data-testid="native-touch-stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Freedive {...props} />
    </div>
  );
}

function renderNativeTouchStage(overrides: Partial<BespokeStyleProps> = {}) {
  const onNext = vi.fn();
  const onPrev = vi.fn();
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
  const result = render(
    <NativeTouchStage props={props} onNext={onNext} onPrev={onPrev} />,
  );

  return {
    ...result,
    onNext,
    onPrev,
    root: () =>
      result.container.querySelector<HTMLElement>('[data-topic-id="freedive"]'),
    stage: () => result.getByTestId("native-touch-stage"),
  };
}

function dispatchNativeTouch(
  element: HTMLElement,
  type: "touchstart" | "touchmove" | "touchend" | "touchcancel",
  x = 240,
  y = 180,
) {
  const touch = { clientX: x, clientY: y };
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  Object.defineProperties(event, {
    touches: { value: type === "touchend" || type === "touchcancel" ? [] : [touch] },
    changedTouches: { value: [touch] },
    targetTouches: { value: type === "touchend" || type === "touchcancel" ? [] : [touch] },
  });
  element.dispatchEvent(event);
}

describe("Spotlight Quote Poster / Freedive — coordinated topic contract", () => {
  it("exports the planned topic, ambient footlight navigation, research packet, and score", () => {
    expect(freediveTopic.id).toBe("freedive");
    expect(freediveTopic.topic).toEqual({ en: "Freedive", zh: "自由潜水" });
    expect(freediveTopic.model).toBe("GPT 5.6 Sol");
    expect(freediveTopic.navigation).toEqual({
      geometry: "ambient",
      carrier: "footlight-notches",
      invocation: "auto-hide",
      feedback: "history-trail",
    });
    expect(freediveTopic.sources).toBe(FREEDIVE_SOURCES);
    expect(freediveTopic.transitionScore).toBe(FREEDIVE_TRANSITION_SCORE);
    expect(FREEDIVE_TRANSITION_SCORE).toEqual({
      "1->2": "iris-open",
      "2->3": "linear-wipe",
      "3->4": "focus-swap",
      "4->5": "dip-to-color",
    });
  });

  it("keeps the planned EN/ZH scene contract, including Scene 5 beat 0", () => {
    const english = getMetadata("en");
    const chinese = getMetadata("zh");

    expect(english.id).toBe("spotlight-quote-poster");
    expect(english.heroScene).toBe(3);
    expect(english.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(chinese.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual(
      chinese.scenes.map((scene) => scene.beats.length),
    );
    expect(english.scenes.map((scene) => scene.beats.length)).toEqual([
      4,
      1,
      2,
      2,
      1,
    ]);
    expect(english.scenes[4]?.beats).toHaveLength(1);
    expect(english.scenes[4]?.beats[0]?.id).toBe(0);

    for (const scene of english.scenes) {
      expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
      scene.beats.forEach((beat, index) => expect(beat.id).toBe(index));
    }
  });

  it("renders every EN/ZH frame as a settled, reserved beat layout", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const { activePanel, root, unmount } = renderStage({
            language,
            scene,
            beat,
          });
          expect(root()).not.toBeNull();
          expect(activePanel()).toHaveAttribute("data-scene-id", String(scene));
          expect(activePanel()).toHaveAttribute(
            "data-beat-layout-mode",
            "reserved",
          );
          expect(activePanel()?.querySelector("[data-beat-layout-item='true']")).not.toBeNull();
          expect(activePanel()?.textContent?.trim().length).toBeGreaterThan(30);
          unmount();
        }
      }
    }
  });

  it("renders the planned body-light and pressure visual states without a training chart", () => {
    const opening = renderStage({ scene: 1, beat: 3 });
    expect(
      opening.activePanel()?.querySelector('[data-scene-composition="breath-hero"]'),
    ).not.toBeNull();
    expect(
      opening.activePanel()?.querySelector('[data-pressure-cue="visible"]'),
    ).not.toBeNull();
    opening.unmount();

    const oxygen = renderStage({ scene: 2, beat: 0 });
    expect(
      oxygen.activePanel()?.querySelectorAll('[data-oxygen-node="true"]'),
    ).toHaveLength(3);
    oxygen.unmount();

    const pressure = renderStage({ scene: 3, beat: 1 });
    expect(
      pressure.activePanel()?.querySelectorAll('[data-pressure-ring="true"]'),
    ).toHaveLength(5);
    expect(pressure.activePanel()).toHaveTextContent("not how to equalize");
    pressure.unmount();

    const dual = renderStage({ scene: 4, beat: 1 });
    expect(
      dual.activePanel()?.querySelector('[data-constraint="oxygen"]'),
    ).not.toBeNull();
    expect(
      dual.activePanel()?.querySelector('[data-constraint="pressure"]'),
    ).not.toBeNull();
    expect(dual.activePanel()).toHaveTextContent("not a safe-zone chart");
    dual.unmount();

    const close = renderStage({ scene: 5, beat: 0 });
    expect(
      close.activePanel()?.querySelector('[data-scene-composition="surface-return"]'),
    ).not.toBeNull();
    expect(
      close.activePanel()?.querySelector('[data-boundary="physiology-not-advice"]'),
    ).not.toBeNull();
  });

  it("uses the exact four-edge transition score", () => {
    const { container, rerenderProps } = renderStage({ scene: 1, beat: 3 });
    const track = () =>
      container.querySelector<HTMLElement>('[data-spatial-scene-track="true"]');

    rerenderProps({ scene: 2, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "iris-open");

    rerenderProps({ scene: 3, beat: 0 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "linear-wipe",
    );

    rerenderProps({ scene: 4, beat: 0 });
    expect(track()).toHaveAttribute("data-scene-transition-kind", "focus-swap");

    rerenderProps({ scene: 5, beat: 0 });
    expect(track()).toHaveAttribute(
      "data-scene-transition-kind",
      "dip-to-color",
    );
  });
});

describe("Freedive navigation and deterministic modes", () => {
  it("renders five ambient footlight notches with a history trail", () => {
    const { root } = renderStage({ scene: 3 });
    const nav = root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');

    expect(nav).toHaveAttribute("data-navigation-geometry", "ambient");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "footlight-notches",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
    expect(nav).toHaveAttribute("data-navigation-feedback", "history-trail");
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);
    expect(nav?.querySelectorAll('[data-history="visited"]')).toHaveLength(2);
    expect(nav?.querySelector('[data-history="active"]')).not.toBeNull();
  });

  it("supports click and touch without leaking into the stage", () => {
    const onNavigate = vi.fn();
    const onStageClick = vi.fn();
    const onStageTouchStart = vi.fn();
    const { root } = renderStage(
      { scene: 2, onNavigate },
      onStageClick,
      onStageTouchStart,
    );
    const target = within(root()!).getByRole("button", {
      name: "Jump to scene 4: two constraints",
    });

    fireEvent.pointerDown(target);
    fireEvent.touchStart(target);
    fireEvent.click(target);

    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
    expect(onStageTouchStart).not.toHaveBeenCalled();
  });

  it("captures carrier and button touch natively before useTouchNav reaches the stage or window", () => {
    const onWindowTouches = {
      touchstart: vi.fn(),
      touchmove: vi.fn(),
      touchend: vi.fn(),
      touchcancel: vi.fn(),
    };
    for (const [phase, listener] of Object.entries(onWindowTouches)) {
      window.addEventListener(phase, listener);
    }
    const { onNext, root, unmount } = renderNativeTouchStage({ scene: 2 });
    const nav = root()?.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const line = nav?.querySelector<HTMLElement>('[data-footlight-line="true"]');
    const button = within(nav!).getByRole("button", {
      name: "Jump to scene 4: two constraints",
    });

    try {
      expect(line).not.toBeNull();

      for (const phase of [
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
      ] as const) {
        dispatchNativeTouch(nav!, phase);
        dispatchNativeTouch(line!, phase);
      }
      dispatchNativeTouch(button, "touchstart");
      dispatchNativeTouch(button, "touchend");

      expect(onNext).not.toHaveBeenCalled();
      for (const listener of Object.values(onWindowTouches)) {
        expect(listener).not.toHaveBeenCalled();
      }
    } finally {
      for (const [phase, listener] of Object.entries(onWindowTouches)) {
        window.removeEventListener(phase, listener);
      }
      unmount();
    }
  });

  it("keeps ordinary native stage touch navigation working", () => {
    const onWindowTouchEnd = vi.fn();
    window.addEventListener("touchend", onWindowTouchEnd);
    const { onNext, stage, unmount } = renderNativeTouchStage();

    try {
      dispatchNativeTouch(stage(), "touchstart", 960, 540);
      dispatchNativeTouch(stage(), "touchend", 960, 540);

      expect(onNext).toHaveBeenCalledTimes(1);
      expect(onWindowTouchEnd).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener("touchend", onWindowTouchEnd);
      unmount();
    }
  });

  it("handles Arrow, Space, and Enter once while isolating keyboard navigation and ignoring repeats", () => {
    const onNavigate = vi.fn();
    const onWindowKey = vi.fn();
    window.addEventListener("keydown", onWindowKey);
    const { root } = renderStage({ scene: 3, onNavigate });
    const active = within(root()!).getByRole("button", {
      name: "Jump to scene 3: pressure",
    });

    try {
      fireEvent.keyDown(active, { key: "ArrowRight" });
      fireEvent.keyDown(active, { key: "Enter" });
      fireEvent.keyDown(active, { key: " " });
      fireEvent.keyDown(active, { key: "Enter", repeat: true });

      expect(onNavigate).toHaveBeenNthCalledWith(1, 4, 0);
      expect(onNavigate).toHaveBeenNthCalledWith(2, 3, 0);
      expect(onNavigate).toHaveBeenNthCalledWith(3, 3, 0);
      expect(onNavigate).toHaveBeenCalledTimes(3);
      expect(onWindowKey).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener("keydown", onWindowKey);
    }
  });

  it("hides navigation in thumbnail mode and settles thumbnail/reduced frames", () => {
    const thumbnail = renderStage({
      scene: 1,
      beat: 0,
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
    expect(thumbnail.root()).toHaveAttribute("data-rendered-beat", "3");
    expect(
      thumbnail.root()?.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    thumbnail.unmount();

    const reduced = renderStage({
      scene: 3,
      beat: 1,
      reducedMotion: true,
    });
    expect(reduced.root()).toHaveAttribute("data-motion", "off");
    expect(reduced.root()).toHaveAttribute("data-rendered-beat", "1");
    expect(
      reduced.activePanel()?.querySelector('[data-scene-content="3"]'),
    ).toHaveAttribute("data-beat", "1");
  });
});

describe("Freedive research boundary and stage-safe implementation", () => {
  it("ships four complete, claim-scoped authoritative sources", () => {
    type ClaimScopedSource = TopicSource & {
      id: string;
      claimIds: readonly string[];
    };
    const sources = FREEDIVE_SOURCES as readonly ClaimScopedSource[];

    expect(sources).toHaveLength(4);
    expect(sources.map((source) => source.id)).toEqual([
      "dan-dive-reflex-2018",
      "foster-sheel-2005",
      "msd-barotrauma-2025",
      "dan-hypoxia-breath-hold-2016",
    ]);
    expect(new Set(sources.flatMap((source) => source.claimIds))).toEqual(
      new Set(FREEDIVE_CLAIMS.map((claim) => claim.id)),
    );

    for (const source of sources) {
      expect(source.authority?.trim().length).toBeGreaterThan(8);
      expect(source.title?.trim().length).toBeGreaterThan(8);
      expect(source.citation?.trim().length).toBeGreaterThan(40);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(60);
      expect(source.claimIds.length).toBeGreaterThan(0);
    }
  });

  it("keeps claims and sources reciprocal and marks every visible factual node by scene", () => {
    type ClaimScopedSource = TopicSource & {
      id: string;
      claimIds: readonly string[];
    };
    const sources = FREEDIVE_SOURCES as readonly ClaimScopedSource[];
    const claimsById = new Map<string, { sourceIds: readonly string[] }>(
      FREEDIVE_CLAIMS.map((claim) => [claim.id, claim] as const),
    );
    const sourcesById = new Map(sources.map((source) => [source.id, source]));
    const seenClaimIds = new Set<string>();

    for (const claim of FREEDIVE_CLAIMS) {
      expect(claim.id).toMatch(/^[a-z][a-z0-9-]*$/);
      expect(claim.statement.trim().length).toBeGreaterThan(30);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourcesById.get(sourceId)?.claimIds).toContain(claim.id);
      }
    }

    for (const source of sources) {
      for (const claimId of source.claimIds) {
        expect(claimsById.get(claimId)?.sourceIds).toContain(source.id);
      }
    }

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const { activePanel, unmount } = renderStage({ language, scene, beat });
          const panel = activePanel();
          const factNodes = Array.from(
            panel?.querySelectorAll<HTMLElement>("[data-claim-id]") ?? [],
          );

          if (scene === 5) {
            expect(factNodes).toHaveLength(0);
          } else {
            expect(factNodes.length).toBeGreaterThan(0);
          }

          for (const node of factNodes) {
            const claimIds = node.dataset.claimId?.split(" ").filter(Boolean) ?? [];
            const sourceRefs = node.dataset.sourceRef?.split(" ").filter(Boolean) ?? [];
            const expectedSourceRefs = [
              ...new Set(
                claimIds.flatMap((claimId) =>
                  claimsById.get(claimId)?.sourceIds ?? [],
                ),
              ),
            ].sort();

            expect(claimIds.length).toBeGreaterThan(0);
            expect(sourceRefs.sort()).toEqual(expectedSourceRefs);
            for (const claimId of claimIds) {
              expect(claimsById.has(claimId)).toBe(true);
              seenClaimIds.add(claimId);
            }
          }

          unmount();
        }
      }
    }

    expect(seenClaimIds).toEqual(new Set(FREEDIVE_CLAIMS.map((claim) => claim.id)));
  });

  it("localizes every Scene 1 visual label in Chinese", () => {
    const { activePanel } = renderStage({ language: "zh", scene: 1, beat: 3 });
    const panel = activePanel();

    expect(panel?.querySelector('[data-no-fresh-air="visible"]')).toHaveTextContent(
      "没有新的呼吸",
    );
    expect(panel?.querySelector('[data-oxygen-cue="visible"]')).toHaveTextContent(
      "氧气 / 有限",
    );
    expect(panel?.querySelector('[data-pressure-cue="visible"]')).toHaveTextContent(
      "压力 / 变化",
    );
    expect(panel).not.toHaveTextContent("no new breath");
    expect(panel).not.toHaveTextContent("pressure / changes");
  });

  it("keeps physiology explanation separate from training, medical instruction, record worship, and fake quotes", () => {
    const english = getMetadata("en");
    const visibleCopy = english.scenes
      .flatMap((scene) => [
        scene.title,
        ...scene.beats.flatMap((beat) => [beat.title, beat.body]),
      ])
      .join(" ");

    expect(visibleCopy).toMatch(/not a training plan/i);
    expect(visibleCopy).not.toMatch(/world record|record-breaking|beat a record/i);
    expect(visibleCopy).not.toMatch(/how to equalize|hyperventilat|hold for \d/i);
    expect(visibleCopy).not.toMatch(/[“”][^“”]{8,}[“”]/);
  });

  it("uses only original DOM/SVG visuals, no loops or transition clones, and stage-safe units", () => {
    const forbiddenUnit = /(?:\d|\.)\s*(?:px|vw|vh|rem|em)\b/i;

    expect(componentSource).not.toMatch(/<img[^>]+https?:\/\//i);
    expect(cssSource).not.toMatch(/url\(\s*["']?https?:/i);
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(cssSource).not.toMatch(/animation-iteration-count\s*:\s*infinite/i);
    expect(componentSource).not.toMatch(
      /isTransitionClone|outgoingScene|data-transition-clone/,
    );
    expect(componentSource).not.toMatch(forbiddenUnit);
    expect(cssSource).not.toMatch(forbiddenUnit);
  });
});
