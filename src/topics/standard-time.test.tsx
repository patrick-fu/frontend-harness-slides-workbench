import { fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  standardTimeClaims,
  standardTimeSceneClaims,
  standardTimeSources,
  standardTimeTransitionScore,
} from "./standard-time";
import componentSource from "./standard-time.tsx?raw";

runTopicContract(topic);

const BEAT_COUNTS: Record<number, number> = {
  1: 4,
  2: 1,
  3: 2,
  4: 2,
  5: 1,
};

const COMPOSITIONS = [
  "local-clock-pair",
  "conflict-table",
  "synchronization-network",
  "adoption-record",
  "consequence-note",
] as const;

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
  onStageKeyDown,
}: {
  props: TopicStageProps;
  onStageClick?: () => void;
  onStageKeyDown?: () => void;
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
      onKeyDown={onStageKeyDown}
    >
      <topic.Stage {...props} />
    </div>
  );
}

function renderStage(
  overrides: Partial<TopicStageProps> = {},
  onStageClick = vi.fn(),
  onStageKeyDown = vi.fn(),
) {
  let currentProps: TopicStageProps = {
    ...BASE_PROPS,
    onNavigate: vi.fn(),
    ...overrides,
  };
  const result = render(
    <StageFrame
      props={currentProps}
      onStageClick={onStageClick}
      onStageKeyDown={onStageKeyDown}
    />,
  );

  return {
    ...result,
    props: currentProps,
    root: () =>
      result.container.querySelector<HTMLElement>(
        '[data-topic-id="standard-time"]',
      ),
    panel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    rerenderProps(next: Partial<TopicStageProps>) {
      currentProps = { ...currentProps, ...next };
      result.rerender(
        <StageFrame
          props={currentProps}
          onStageClick={onStageClick}
          onStageKeyDown={onStageKeyDown}
        />,
      );
    },
  };
}

function dispatchPointer(
  element: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  clientX: number,
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: 100 },
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
  const activeTouches =
    type === "touchend" || type === "touchcancel" ? [] : [touch];
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

describe("Decision Record / Standard Time — protocol and research packet", () => {
  it("exports the assigned topic, model, navigation profile, and transition score", () => {
    expect(topic.id).toBe("standard-time");
    expect(topic.title).toEqual({
      en: "Standard Time",
      zh: "标准时",
    });
    expect(topic.modelId).toBe("GPT 5.6 Sol");
    expect(topic.navigation).toEqual({
      geometry: "typographic-index",
      carrier: "time-standard-clauses",
      invocation: "drag-scrub",
      feedback: "next-state-preview",
    });
    if (topic.evidence.kind !== "facts") {
      throw new Error("Standard Time must retain factual Evidence.");
    }
    expect(topic.evidence.sources).toBe(standardTimeSources);
    expect(topic.transitionScore).toBe(standardTimeTransitionScore);
    expect(standardTimeTransitionScore).toEqual({
      "1->2": "hard-cut",
      "2->3": "crossfade",
      "3->4": "page-turn",
      "4->5": "crossfade",
    });
  });

  it("keeps English and Chinese metadata aligned to the 4-1-2-2-1 curve", () => {
    const en = topic.metadata.en;
    const zh = topic.metadata.zh;

    expect(topic.styleId).toBe("decision-record");
    expect(en.heroScene).toBe(3);
    expect(en.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      4, 1, 2, 2, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(
      en.scenes.map((scene) => scene.beats.length),
    );

    for (const metadata of [en, zh]) {
      for (const scene of metadata.scenes) {
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action).not.toHaveLength(0);
          expect(beat.title).not.toHaveLength(0);
          expect(beat.body).not.toHaveLength(0);
        });
      }
    }
  });

  it("keeps every source HTTPS and resolves every claim reciprocally", () => {
    const claimsById = new Map(standardTimeClaims.map((claim) => [claim.id, claim]));
    const sourcesById = new Map(standardTimeSources.map((source) => [source.id, source]));
    const rmgLocalTimeSource = standardTimeSources.find(
      (source) => source.id === "S1",
    );

    expect(standardTimeSources.length).toBeGreaterThanOrEqual(3);
    expect(standardTimeClaims).toHaveLength(6);
    expect(rmgLocalTimeSource?.title).toBe(
      "A time before Greenwich Mean Time",
    );
    expect(rmgLocalTimeSource?.citation).toContain(
      "A time before Greenwich Mean Time",
    );

    for (const source of standardTimeSources) {
      const typedSource: Source = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(typedSource.authority?.trim().length).toBeGreaterThan(4);
      expect(typedSource.title?.trim().length).toBeGreaterThan(8);
      expect(typedSource.citation?.trim().length).toBeGreaterThan(16);
      expect(source.accessDate.trim().length).toBeGreaterThan(0);
      expect(source.accessDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(source.supports.trim().length).toBeGreaterThan(100);
      expect(source.boundary.trim().length).toBeGreaterThan(100);
      expect(source.claimIds.length).toBeGreaterThan(0);

      for (const claimId of source.claimIds) {
        const claim = claimsById.get(claimId);
        expect(claim, source.id + " -> " + claimId).toBeDefined();
        expect(claim?.sourceIds).toContain(source.id);
      }
    }

    for (const claim of standardTimeClaims) {
      expect(claim.sceneIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.claim.trim().length).toBeGreaterThan(80);
      expect(claim.boundary.trim().length).toBeGreaterThan(90);

      for (const sourceId of claim.sourceIds) {
        const source = sourcesById.get(sourceId);
        expect(source, claim.id + " -> " + sourceId).toBeDefined();
        expect(source?.claimIds).toContain(claim.id);
      }
      for (const sceneId of claim.sceneIds) {
        expect(standardTimeSceneClaims[sceneId]).toContain(claim.id);
      }
    }

    expect(
      new Set(Object.values(standardTimeSceneClaims).flat()),
    ).toEqual(new Set(standardTimeClaims.map((claim) => claim.id)));
  });
});

describe("Decision Record / Standard Time — bilingual report frames", () => {
  it("renders every English and Chinese frame with a traceable source stamp", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();

      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({
            scene,
            beat,
            language,
            reducedMotion: true,
          });
          const active = view.panel();
          const composition = active?.querySelector<HTMLElement>("[data-composition]");
          const sceneId = scene as keyof typeof standardTimeSceneClaims;
          const claimIds = standardTimeSceneClaims[sceneId];
          const expectedSourceIds = Array.from(
            new Set(
              claimIds.flatMap((claimId) => {
                const claim = standardTimeClaims.find(
                  (candidate) => candidate.id === claimId,
                );
                expect(claim).toBeDefined();
                return [...(claim?.sourceIds ?? [])];
              }),
            ),
          );
          const expectedClaimSourceLinks = claimIds
            .map((claimId) => {
              const claim = standardTimeClaims.find(
                (candidate) => candidate.id === claimId,
              );
              return claimId + ":" + claim?.sourceIds.join(",");
            })
            .join(";");
          const trace = active?.querySelector<HTMLElement>(
            '[data-claim-source-map="true"]',
          );
          const factClaimIds = Array.from(
            composition?.querySelectorAll<HTMLElement>("[data-claim-id]") ?? [],
          ).map((element) => element.dataset.claimId);

          expect(active).toHaveAttribute("data-scene-id", String(scene));
          expect(composition).toHaveAttribute(
            "data-composition",
            COMPOSITIONS[scene - 1],
          );
          expect(composition).toHaveAttribute(
            "data-visible-claim-ids",
            claimIds.join(" "),
          );
          expect(trace).toHaveAttribute("data-scene-id", String(scene));
          expect(trace).toHaveAttribute("data-claim-ids", claimIds.join(" "));
          expect(trace).toHaveAttribute(
            "data-source-ids",
            expectedSourceIds.join(" "),
          );
          expect(trace).toHaveAttribute(
            "data-claim-source-links",
            expectedClaimSourceLinks,
          );
          expect(
            Array.from(
              trace?.querySelectorAll<HTMLElement>("[data-source-id]") ?? [],
            ).map((link) => link.dataset.sourceId),
          ).toEqual(expectedSourceIds);

          for (const claimId of claimIds) {
            const claim = standardTimeClaims.find(
              (candidate) => candidate.id === claimId,
            );
            expect(factClaimIds).toContain(claimId);
            for (const sourceId of claim?.sourceIds ?? []) {
              expect(
                trace?.querySelector('[data-source-id="' + sourceId + '"]'),
              ).not.toBeNull();
            }
          }
          for (const factClaimId of factClaimIds) {
            expect(claimIds).toContain(factClaimId);
          }

          expect(active?.textContent?.trim().length).toBeGreaterThan(80);
          compositions.add(composition?.dataset.composition ?? "");
          view.unmount();
        }
      }

      expect(compositions).toEqual(new Set(COMPOSITIONS));
    }
  });

  it("uses reserved layouts for every multi-beat scene", () => {
    for (const scene of [1, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
        reducedMotion: true,
      });
      const active = view.panel();

      expect(active).toHaveAttribute("data-beat-layout-container", "true");
      expect(active).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        active?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("keeps the documented clock gap, one-time correction, and legal boundary visible", () => {
    const clocks = renderStage({ scene: 1, beat: 3, reducedMotion: true });
    expect(clocks.panel()).toHaveTextContent("12:00");
    expect(clocks.panel()).toHaveTextContent("11:49");
    expect(clocks.panel()).toHaveTextContent("11 MIN");
    expect(clocks.panel()).toHaveTextContent(/route example/i);
    clocks.unmount();

    const network = renderStage({ scene: 3, beat: 1, reducedMotion: true });
    expect(
      network.panel()?.querySelector('[data-clock-corrected="true"]'),
    ).not.toBeNull();
    expect(network.panel()).toHaveTextContent(/one marked correction/i);
    network.unmount();

    const adoption = renderStage({ scene: 4, beat: 1, reducedMotion: true });
    expect(adoption.panel()).toHaveTextContent("2 AUG 1880");
    expect(adoption.panel()).toHaveTextContent(/not a story of every clock/i);
    adoption.unmount();
  });
});

describe("Decision Record / Standard Time — transitions and clause navigation", () => {
  it("applies the exact hard-cut/crossfade/page-turn/crossfade score without clones", () => {
    const view = renderStage({ scene: 1 });
    const edges = [
      [2, "hard-cut"],
      [3, "crossfade"],
      [4, "page-turn"],
      [5, "crossfade"],
    ] as const;

    for (const [scene, transition] of edges) {
      view.rerenderProps({ scene, beat: 0 });
      expect(
        view.container.querySelector('[data-spatial-scene-track="true"]'),
      ).toHaveAttribute("data-scene-transition-kind", transition);
    }

    expect(view.container.querySelector("[data-transition-clone='true']")).toBeNull();
    view.unmount();
  });

  it("provides click, tap, and keyboard absolute jumps without stage or window leakage", () => {
    const onStageClick = vi.fn();
    const onStageKeyDown = vi.fn();
    const leakedWindowKey = vi.fn();
    const view = renderStage({}, onStageClick, onStageKeyDown);
    const onNavigate = view.props.onNavigate as ReturnType<typeof vi.fn>;
    const clauseTwo = view.getByRole("button", { name: "Jump to clause 2" });
    const clauseThree = view.getByRole("button", { name: "Jump to clause 3" });
    const clauseFour = view.getByRole("button", { name: "Jump to clause 4" });
    const clauseFive = view.getByRole("button", { name: "Jump to clause 5" });

    window.addEventListener("keydown", leakedWindowKey);
    try {
      fireEvent.click(clauseFour);
      fireEvent.pointerDown(clauseFive, { clientX: 200, clientY: 80, pointerId: 1 });
      fireEvent.pointerUp(clauseFive, { clientX: 200, clientY: 80, pointerId: 1 });
      fireEvent.click(clauseFive);

      fireEvent.keyDown(clauseTwo, { key: " ", repeat: false });
      fireEvent.keyDown(clauseThree, { key: "ArrowRight", repeat: false });
      fireEvent.keyDown(clauseThree, { key: "Home", repeat: false });
      fireEvent.keyDown(clauseThree, { key: "End", repeat: false });
      fireEvent.keyDown(clauseThree, { key: "Enter", repeat: true });
    } finally {
      window.removeEventListener("keydown", leakedWindowKey);
    }

    expect(onNavigate.mock.calls).toEqual([
      [4, 0],
      [5, 0],
      [2, 0],
      [4, 0],
      [1, 0],
      [5, 0],
    ]);
    expect(onStageClick).not.toHaveBeenCalled();
    expect(onStageKeyDown).not.toHaveBeenCalled();
    expect(leakedWindowKey).not.toHaveBeenCalled();
    view.unmount();
  });

  it("offers drag-scrub with a next-state preview while buttons remain the fallback", () => {
    const onStageClick = vi.fn();
    const view = renderStage({}, onStageClick);
    const onNavigate = view.props.onNavigate as ReturnType<typeof vi.fn>;
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
          right: 500,
          bottom: 100,
          width: 500,
          height: 100,
        }) as DOMRect,
    });

    dispatchPointer(navigation!, "pointerdown", 80);
    dispatchPointer(navigation!, "pointermove", 360);
    expect(navigation).toHaveAttribute("data-scrubbing", "true");
    expect(navigation).toHaveAttribute("data-preview-scene", "4");
    expect(
      navigation?.querySelector('[data-next-state-preview="true"]'),
    ).not.toBeNull();
    dispatchPointer(navigation!, "pointerup", 360);

    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
    view.unmount();
  });

  it("isolates native touch start, move, end, and cancel from stage and window listeners", () => {
    const view = renderStage();
    const stage = view.getByTestId("stage");
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const target = view.getByRole("button", { name: "Jump to clause 3" });
    const onStageTouch = vi.fn();
    const onWindowTouch = vi.fn();
    const touchTypes = [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
    ] as const;

    for (const type of touchTypes) {
      stage.addEventListener(type, onStageTouch);
      window.addEventListener(type, onWindowTouch);
    }

    try {
      for (const element of [navigation!, target]) {
        dispatchNativeTouch(element, "touchstart");
        dispatchNativeTouch(element, "touchmove", 100, 140);
        dispatchNativeTouch(element, "touchend", 100, 140);
        dispatchNativeTouch(element, "touchcancel", 100, 140);
      }
    } finally {
      for (const type of touchTypes) {
        stage.removeEventListener(type, onStageTouch);
        window.removeEventListener(type, onWindowTouch);
      }
    }

    expect(onStageTouch).not.toHaveBeenCalled();
    expect(onWindowTouch).not.toHaveBeenCalled();
    view.unmount();
  });
});

describe("Decision Record / Standard Time — settled and stage-safe contract", () => {
  it("hides navigation in thumbnails and settles thumbnail, reduced-motion, and frozen frames", () => {
    const thumbnail = renderStage({ scene: 4, beat: 1, isThumbnail: true });
    expect(thumbnail.root()).toHaveAttribute("data-settled", "true");
    expect(thumbnail.root()).toHaveAttribute("data-motion", "off");
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

  it("uses a fixed-stage-safe DOM contract and container units without fake overflow assertions", () => {
    const view = renderStage({ scene: 5, reducedMotion: true });
    const persistentChromeClaims = Array.from(
      view.root()?.querySelectorAll<HTMLElement>("[data-claim-id]") ?? [],
    ).filter(
      (element) =>
        element.closest('[data-spatial-scene-panel="true"]') === null,
    );

    expect(view.root()).toHaveAttribute("data-stage-safe", "true");
    expect(persistentChromeClaims).toHaveLength(0);
    expect(
      view.container.querySelector('[data-stage-safe-region="track"]'),
    ).not.toBeNull();
    expect(
      view.container.querySelector('[data-spatial-scene-track="true"]'),
    ).not.toBeNull();
    expect(view.panel()?.querySelector("[data-composition]")).not.toBeNull();
    expect(componentSource).not.toMatch(
      /isTransitionClone|outgoingScene|setInterval|requestAnimationFrame|<img\b/i,
    );
    expect(componentSource).not.toMatch(
      /https?:\/\/[^\s"']+\.(?:png|jpe?g|webp|svg)/i,
    );
    view.unmount();
  });
});
