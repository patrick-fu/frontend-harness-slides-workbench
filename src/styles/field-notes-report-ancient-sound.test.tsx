import { useRef } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import { useTouchNav } from "../hooks/useTouchNav";
import AncientSoundFieldNotes, {
  ancientSoundClaims,
  ancientSoundSources,
  ancientSoundTopic,
  ancientSoundTransitionScore,
  getMetadata,
} from "./field-notes-report-ancient-sound";
import componentSource from "./field-notes-report-ancient-sound.tsx?raw";

const runtimeProcess = (
  globalThis as typeof globalThis & {
    process: { getBuiltinModule: (name: "node:fs") => unknown };
  }
).process;
const { readFileSync } = runtimeProcess.getBuiltinModule("node:fs") as {
  readFileSync: (path: string, encoding: "utf8") => string;
};
const styleSource = readFileSync(
  "src/styles/field-notes-report-ancient-sound.module.css",
  "utf8",
);

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const globalAdvance = vi.fn();
  const stageProps: BespokeStyleProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    onNavigate: vi.fn(),
    ...props,
  };
  const result = render(
    <div
      data-testid="stage"
      onClick={globalAdvance}
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AncientSoundFieldNotes {...stageProps} />
    </div>,
  );

  return {
    ...result,
    stage: result.getByTestId("stage"),
    globalAdvance,
    onNavigate: stageProps.onNavigate as ReturnType<typeof vi.fn>,
  };
}

type NativeTouchType = "touchstart" | "touchmove" | "touchend" | "touchcancel";

function dispatchNativeTouch(
  target: HTMLElement,
  type: NativeTouchType,
  x = 960,
  y = 540,
) {
  const touch = {
    identifier: 1,
    target,
    clientX: x,
    clientY: y,
    pageX: x,
    pageY: y,
    screenX: x,
    screenY: y,
  };
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  const activeTouches = type === "touchend" || type === "touchcancel" ? [] : [touch];
  Object.defineProperties(event, {
    touches: { value: activeTouches },
    changedTouches: { value: [touch] },
    targetTouches: { value: activeTouches },
  });

  act(() => target.dispatchEvent(event));
  return event;
}

function NativeTouchStage({
  onStageNext,
  onStagePrev,
  onNavigate,
}: {
  onStageNext: () => void;
  onStagePrev: () => void;
  onNavigate: (scene: number, beat: number) => void;
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
      data-testid="native-touch-stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <AncientSoundFieldNotes
        scene={2}
        beat={3}
        language="en"
        isThumbnail={false}
        reducedMotion={false}
        onNavigate={onNavigate}
      />
    </div>
  );
}

describe("Field Notes Report / Ancient Sound — archaeological evidence", () => {
  it("renders every English and Chinese beat as a settled, claim-scoped field page", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const active = view.container.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-panel"][data-active="true"]',
          );

          expect(active).not.toBeNull();
          expect(active?.textContent?.trim().length).toBeGreaterThan(85);
          expect(active?.querySelector('[data-reading-state="settled"]')).not.toBeNull();
          expect(active?.querySelector("[data-claim-id]")).not.toBeNull();
          view.unmount();
        }
      }
    }
  });

  it("keeps the five-scene 2/4/1/3/1 metadata contract aligned in both languages", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("field-notes-report");
    expect(en.band).toBe("text-report");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 4, 1, 3, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(
      en.scenes.map((scene) => scene.beats.length),
    );
    expect(zh.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id)).toEqual(
      en.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id),
    );
  });

  it("separates excavated pututus, documented handling, replica experiments, and interpretation", () => {
    const view = renderStage({ scene: 2, beat: 3 });
    const active = view.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );

    expect(active?.querySelectorAll("[data-instrument-card]")).toHaveLength(4);
    expect(active?.querySelector('[data-artifact-status="excavated"]')).not.toBeNull();
    expect(active?.querySelector('[data-artifact-status="measured-artifact"]')).not.toBeNull();
    expect(active?.querySelector('[data-artifact-status="replica-experiment"]')).not.toBeNull();
    expect(view.getAllByText(/21 intact shell horns/i).length).toBeGreaterThanOrEqual(1);
    expect(view.getByText(/does not recover a single ancient performance/i)).toBeVisible();
  });

  it("documents the source-receiver setup and the published Ofrendas alcove dimensions", () => {
    const view = renderStage({ scene: 3 });

    expect(view.getByText(/10 source and 27 receiver positions/i)).toBeVisible();
    expect(view.getByText(/48 kHz/i)).toBeVisible();
    expect(view.getAllByText(/less than 1 m wide/i).length).toBeGreaterThanOrEqual(1);
    expect(view.getAllByText(/approximately 3.5 m long/i).length).toBeGreaterThanOrEqual(1);
    expect(view.getByText(/diagrammatic · not to scale/i)).toBeVisible();
    expect(view.container.querySelector('[data-measurement-plan="true"]')).not.toBeNull();
  });

  it("keeps measured response patterns and uncertainty together while the map focus advances", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const active = view.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );

    expect(active?.querySelectorAll("[data-gallery-zone]")).toHaveLength(3);
    expect(active?.querySelectorAll('[data-gallery-zone][data-focused="true"]')).toHaveLength(1);
    expect(active).toHaveTextContent(/generally below 0.5 s/i);
    expect(active).toHaveTextContent(/dense early reflections/i);
    expect(active).toHaveTextContent(/preliminary measurements/i);
    expect(active).toHaveTextContent(/not proof of intentional acoustic control/i);
  });

  it("ends with explicit Observation and Inference columns without asserting ritual intent", () => {
    const view = renderStage({ scene: 5 });
    const observations = view.container.querySelectorAll(
      '[data-evidence-kind="observation"]',
    );
    const inferences = view.container.querySelectorAll(
      '[data-evidence-kind="inference"]',
    );

    expect(observations.length).toBeGreaterThanOrEqual(3);
    expect(inferences.length).toBeGreaterThanOrEqual(3);
    expect(view.getByText(/does not establish a specific ritual script or intention/i)).toBeVisible();
    expect(view.getByText(/we can model possibilities; we cannot replay certainty/i)).toBeVisible();
  });

  it("reserves final geometry for every multi-beat notebook page", () => {
    for (const scene of [1, 2, 4]) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const active = view.container.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );

      expect(active).toHaveAttribute("data-beat-layout-container", "true");
      expect(active).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(active?.querySelectorAll('[data-beat-layout-item="true"]').length).toBeGreaterThanOrEqual(
        3,
      );
      view.unmount();
    }
  });
});

describe("Field Notes Report / Ancient Sound — source and transition contracts", () => {
  it("keeps the exact transition score after every edge settles in one continuous sequence", () => {
    expect(ancientSoundTransitionScore).toEqual({
      "1->2": "page-turn",
      "2->3": "crossfade",
      "3->4": "page-turn",
      "4->5": "hard-cut",
    });
    expect(ancientSoundTopic.transitionScore).toBe(ancientSoundTransitionScore);

    const edges = [
      [1, 2, "page-turn"],
      [2, 3, "crossfade"],
      [3, 4, "page-turn"],
      [4, 5, "hard-cut"],
    ] as const;

    vi.useFakeTimers();
    const view = renderStage({ scene: 1 });
    const frame = (scene: number) => (
      <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
        <AncientSoundFieldNotes
          scene={scene}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
        />
      </div>
    );

    try {
      for (const [from, to, kind] of edges) {
        expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
          "data-active-scene",
          String(from),
        );
        view.rerender(frame(to));
        expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
          "data-scene-transition-kind",
          kind,
        );
        act(() => vi.advanceTimersByTime(760));
        view.rerender(frame(to));
        expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
          "data-active-scene",
          String(to),
        );
        expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
          "data-scene-transition-kind",
          kind,
        );
      }
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });

  it("carries authoritative HTTPS sources and a closed claim-to-source graph", () => {
    expect(ancientSoundSources.length).toBeGreaterThanOrEqual(5);
    expect(ancientSoundTopic.sources).toBe(ancientSoundSources);
    const expectedClaimIdsBySource = {
      "stanford-overview": ["site-complex"],
      "stanford-method": [
        "artifact-experiment",
        "measurement-layout",
        "possible-experience",
      ],
      "stanford-pututus": ["pututu-count", "artifact-experiment"],
      "jasa-galleries": [
        "measurement-layout",
        "ofrendas-dimensions",
        "impulse-findings",
      ],
      "time-and-mind": ["possible-experience"],
      "yale-pututus": ["pututu-count", "possible-experience"],
      "unesco-site": ["site-complex"],
    } as const;
    const sourcesById = new Map(
      ancientSoundSources.map((source) => [source.id, source]),
    );

    for (const source of ancientSoundSources) {
      const typedSource: TopicSource = source;
      const reverseClaimIds = (
        source as typeof source & { claimIds?: readonly string[] }
      ).claimIds;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(typedSource.authority?.trim().length).toBeGreaterThan(4);
      expect(typedSource.title?.trim().length).toBeGreaterThan(4);
      expect(typedSource.citation?.trim().length).toBeGreaterThan(8);
      expect(reverseClaimIds).toEqual(expectedClaimIdsBySource[source.id]);
      expect(new Set(reverseClaimIds).size).toBe(reverseClaimIds?.length);
    }
    expect(sourcesById.size).toBe(ancientSoundSources.length);

    expect(ancientSoundClaims.length).toBeGreaterThanOrEqual(7);
    const claimsById = new Map(
      ancientSoundClaims.map((claim) => [claim.id, claim]),
    );
    expect(claimsById.size).toBe(ancientSoundClaims.length);

    for (const claim of ancientSoundClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(new Set(claim.sourceIds).size).toBe(claim.sourceIds.length);
      expect(claim.boundary.trim().length).toBeGreaterThan(20);
      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        const reverseClaimIds = (
          source as (typeof ancientSoundSources)[number] & {
            claimIds?: readonly string[];
          }
        )?.claimIds;
        expect(source).toBeDefined();
        expect(reverseClaimIds).toContain(claim.id);
      }
    }

    for (const source of ancientSoundSources) {
      const reverseClaimIds = (
        source as typeof source & { claimIds?: readonly string[] }
      ).claimIds;
      expect(reverseClaimIds?.length).toBeGreaterThan(0);
      for (const claimId of reverseClaimIds ?? []) {
        const claim = claimsById.get(
          claimId as (typeof ancientSoundClaims)[number]["id"],
        );
        expect(claim).toBeDefined();
        expect(claim?.sourceIds).toContain(source.id);
      }
    }

    const visibleClaimIds = new Set<string>();
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene });
      const activeScene = view.container.querySelector(
        `[data-scene-id="${scene}"][data-active="true"]`,
      );
      activeScene
        ?.querySelectorAll<HTMLElement>("[data-claim-id]")
        .forEach((node) => {
          const claimId = node.dataset.claimId;
          if (claimId) visibleClaimIds.add(claimId);
        });
      view.unmount();
    }
    expect([...visibleClaimIds].sort()).toEqual([...claimsById.keys()].sort());
  });
});

describe("Field Notes Report / Ancient Sound — instrument field-card navigation", () => {
  it("exposes the prescribed profile, click route, Space fallback, and mechanical displacement", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "card-miniature");
    expect(navigation).toHaveAttribute("data-navigation-carrier", "instrument-field-cards");
    expect(navigation).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "mechanical-displacement",
    );
    expect(navigation?.querySelectorAll('[data-active="true"]')).toHaveLength(1);

    fireEvent.click(view.getByRole("button", { name: "Open field card 5" }));
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
    expect(view.globalAdvance).not.toHaveBeenCalled();

    fireEvent.keyDown(navigation!, { key: " ", repeat: false });
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    fireEvent.keyDown(navigation!, { key: " ", repeat: true });
    expect(view.onNavigate).toHaveBeenCalledTimes(2);
  });

  it("reveals the miniature stack on hold without turning hold into the main route", () => {
    vi.useFakeTimers();
    const view = renderStage({ scene: 2 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    try {
      expect(navigation).toHaveAttribute("data-expanded", "false");
      fireEvent.pointerDown(navigation!);
      expect(navigation).toHaveAttribute("data-expanded", "false");
      act(() => vi.advanceTimersByTime(359));
      expect(navigation).toHaveAttribute("data-expanded", "false");
      act(() => vi.advanceTimersByTime(1));
      expect(navigation).toHaveAttribute("data-expanded", "true");
      expect(view.onNavigate).not.toHaveBeenCalled();
      fireEvent.pointerUp(navigation!);
      expect(navigation).toHaveAttribute("data-expanded", "false");
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });

  it("gives touch hold the same delayed reveal without turning a tap into navigation", () => {
    vi.useFakeTimers();
    const view = renderStage({ scene: 2 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    try {
      dispatchNativeTouch(navigation!, "touchstart");
      expect(navigation).toHaveAttribute("data-expanded", "false");
      act(() => vi.advanceTimersByTime(359));
      expect(navigation).toHaveAttribute("data-expanded", "false");
      act(() => vi.advanceTimersByTime(1));
      expect(navigation).toHaveAttribute("data-expanded", "true");
      expect(view.onNavigate).not.toHaveBeenCalled();
      dispatchNativeTouch(navigation!, "touchend");
      expect(navigation).toHaveAttribute("data-expanded", "false");
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });

  it("isolates native touch gestures on nav blank space and cards from stage and window navigation", () => {
    const onStageNext = vi.fn();
    const onStagePrev = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <NativeTouchStage
        onStageNext={onStageNext}
        onStagePrev={onStagePrev}
        onNavigate={onNavigate}
      />,
    );
    const stage = view.getByTestId("native-touch-stage");
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const card = view.getByRole("button", { name: "Open field card 5" });
    const readingPage = view.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"] [data-reading-state="settled"]',
    );
    const stageTouch = vi.fn();
    const windowTouch = vi.fn();
    const onWindowNext = vi.fn();
    const touchTypes: NativeTouchType[] = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ];
    const handleWindowTouchEnd = () => onWindowNext();

    for (const type of touchTypes) {
      stage.addEventListener(type, stageTouch);
      window.addEventListener(type, windowTouch);
    }
    window.addEventListener("touchend", handleWindowTouchEnd);

    try {
      for (const target of [navigation!, card]) {
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchmove", 970, 545);
        dispatchNativeTouch(target, "touchend", 970, 545);
        dispatchNativeTouch(target, "touchstart");
        dispatchNativeTouch(target, "touchcancel");
      }

      expect(stageTouch).not.toHaveBeenCalled();
      expect(windowTouch).not.toHaveBeenCalled();
      expect(onStageNext).not.toHaveBeenCalled();
      expect(onStagePrev).not.toHaveBeenCalled();
      expect(onWindowNext).not.toHaveBeenCalled();

      fireEvent.click(card);
      expect(onNavigate).toHaveBeenCalledWith(5, 0);
      expect(onStageNext).not.toHaveBeenCalled();
      expect(onWindowNext).not.toHaveBeenCalled();

      dispatchNativeTouch(readingPage!, "touchstart", 800, 500);
      dispatchNativeTouch(readingPage!, "touchmove", 805, 502);
      dispatchNativeTouch(readingPage!, "touchend", 805, 502);
      dispatchNativeTouch(readingPage!, "touchcancel", 805, 502);

      expect(onStageNext).toHaveBeenCalledTimes(1);
      expect(stageTouch.mock.calls.map(([event]) => event.type)).toEqual([
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
      ]);
      expect(windowTouch.mock.calls.map(([event]) => event.type)).toEqual([
        "touchstart",
        "touchmove",
        "touchend",
        "touchcancel",
      ]);
      expect(onWindowNext).toHaveBeenCalledTimes(1);
    } finally {
      for (const type of touchTypes) {
        stage.removeEventListener(type, stageTouch);
        window.removeEventListener(type, windowTouch);
      }
      window.removeEventListener("touchend", handleWindowTouchEnd);
      view.unmount();
    }
  });

  it("hides navigation in thumbnails and settles reduced-motion/frozen frames", () => {
    const view = renderStage({
      scene: 4,
      beat: 2,
      isThumbnail: true,
      reducedMotion: true,
    });

    expect(view.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(view.getByTestId("ancient-sound-root")).toHaveAttribute("data-motion", "off");
    expect(view.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
  });

  it("keeps navigation stage-local and declares fixed-stage CSS safety contracts", () => {
    const view = renderStage({ scene: 5 });
    const root = view.getByTestId("ancient-sound-root");
    const track = view.getByTestId("spatial-scene-track");
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const source = `${componentSource}\n${styleSource}`;

    expect(view.stage).toContainElement(root);
    expect(root).toContainElement(track);
    expect(root).toContainElement(navigation);
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(styleSource).toMatch(
      /\.root\s*\{[\s\S]*?width:\s*100%;[\s\S]*?height:\s*100%;[\s\S]*?overflow:\s*hidden;/,
    );
    expect(styleSource).toMatch(
      /\.fieldCardNav\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?right:\s*6cqw;[\s\S]*?bottom:\s*1\.6cqh;/,
    );
    expect(source).not.toMatch(/(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i);
    view.unmount();
  });
});
