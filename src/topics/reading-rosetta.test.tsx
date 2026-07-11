import { useRef } from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import { useTouchNav } from "../hooks/useTouchNav";
import { runTopicContract } from "../testing/topic-contract";
import topic, {
  readingRosettaClaims,
  readingRosettaSources,
  readingRosettaTransitionScore,
} from "./reading-rosetta";

runTopicContract(topic);

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};

type TraceableSource = Source & {
  id: string;
  ref: string;
  claimIds: readonly string[];
};

function renderStage(props: Partial<TopicStageProps> = {}) {
  const stageProps: TopicStageProps = {
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
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <topic.Stage {...stageProps} />
    </div>,
  );

  return {
    ...result,
    stage: result.getByTestId("stage"),
    onNavigate: stageProps.onNavigate as ReturnType<typeof vi.fn>,
  };
}

function activePanel(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '[data-testid="spatial-scene-panel"][data-active="true"]',
  );
}

function TouchNavigationHarness({
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
    <div ref={stageRef} data-testid="touch-stage">
      <topic.Stage
        scene={1}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={false}
        onNavigate={onNavigate}
      />
    </div>
  );
}

describe("Annotated Source & Diff / Reading Rosetta — evidence report", () => {
  it("keeps the bilingual five-scene 2/4/1/3/1 contract", () => {
    const en = topic.metadata.en;
    const zh = topic.metadata.zh;

    expect(topic.id).toBe("reading-rosetta");
    expect(topic.styleId).toBe("annotated-source-diff");
    expect(en.heroScene).toBe(4);
    expect(en.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 4, 1, 3, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([2, 4, 1, 3, 1]);
    expect(zh.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id)).toEqual(
      en.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id),
    );
    expect(topic.title).toEqual({
      en: "Reading Rosetta",
      zh: "破译罗塞塔",
    });
  });

  it("renders every English and Chinese beat as a settled, claim-scoped frame", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat, reducedMotion: true });
          const active = activePanel(view.container);

          expect(active).not.toBeNull();
          expect(active?.textContent?.trim().length).toBeGreaterThan(100);
          expect(active?.querySelector("[data-claim-id]")).not.toBeNull();
          expect(view.container.querySelector('[data-reading-state="settled"]')).not.toBeNull();
          view.unmount();
        }
      }
    }
  });

  it("says two languages and three scripts, never three languages", () => {
    const en = renderStage({ scene: 1, beat: 0 });
    expect(en.getByText(/two languages/i)).toBeVisible();
    expect(en.getByText(/three scripts/i)).toBeVisible();
    expect(en.container.textContent).not.toMatch(/three languages/i);
    expect(en.container.querySelectorAll("[data-script-register]")).toHaveLength(3);
    en.unmount();

    const zh = renderStage({ language: "zh", scene: 1, beat: 0 });
    expect(zh.getAllByText(/两种语言/).length).toBeGreaterThan(0);
    expect(zh.getAllByText(/三种书写体/).length).toBeGreaterThan(0);
    expect(zh.container.textContent).toMatch(/不是三种语言/);
  });

  it("states the acquisition account and unresolved ownership dispute without flattening them", () => {
    const en = renderStage({ scene: 1, beat: 1 });

    expect(en.getByText(/British Museum describes/i)).toBeVisible();
    expect(en.getByText(/1801 Capitulation of Alexandria/i)).toBeVisible();
    expect(en.getByText(/in London since 1802/i)).toBeVisible();
    expect(en.getByText(/ownership claim remains unresolved/i)).toBeVisible();
    expect(en.container.querySelector('[data-provenance-context="contested"]')).not.toBeNull();
  });

  it("aligns semantic sections without pretending the scripts match character for character", () => {
    const view = renderStage({ scene: 2, beat: 3 });

    expect(view.container.querySelectorAll("[data-parallel-register]")).toHaveLength(3);
    expect(view.container.querySelectorAll("[data-alignment-row]")).toHaveLength(4);
    expect(view.getByText(/semantic sections, not character-for-character/i)).toBeVisible();
    expect(view.getByText(/Greek gives readable decree structure/i)).toBeVisible();
    expect(view.getByText(/damaged and differently phrased/i)).toBeVisible();
  });

  it("uses cartouches and names as bounded anchors rather than a complete key", () => {
    const view = renderStage({ scene: 3 });

    expect(view.getByText(/A name is an anchor, not a dictionary/i)).toBeVisible();
    expect(view.getAllByText("ΠΤΟΛΕΜΑΙΟΣ").length).toBeGreaterThan(0);
    expect(view.getAllByText(/schematic redraw/i).length).toBeGreaterThan(0);
    expect(view.container.querySelector('[data-cartouche-evidence="true"]')).not.toBeNull();
    expect(view.container.querySelectorAll("[data-phonetic-anchor]").length).toBeGreaterThanOrEqual(6);
  });

  it("shows a multi-scholar hypothesis, revision, and validation chain", () => {
    const view = renderStage({ scene: 4, beat: 2 });

    expect(view.getAllByText(/Åkerblad/i).length).toBeGreaterThan(0);
    expect(view.getAllByText(/Thomas Young/i).length).toBeGreaterThan(0);
    expect(view.getAllByText(/Champollion/i).length).toBeGreaterThan(0);
    expect(view.getAllByText(/Coptic/i).length).toBeGreaterThan(0);
    expect(view.getAllByText(/other inscriptions/i).length).toBeGreaterThan(0);
    expect(view.getByText(/simplified contribution chain/i)).toBeVisible();
    expect(view.container.querySelectorAll("[data-contribution-step]")).toHaveLength(3);
  });

  it("ends on tested readings plus explicit limits at scene five beat zero", () => {
    const metadata = topic.metadata.en;
    const view = renderStage({ scene: 5, beat: 0 });

    expect(metadata.scenes[4].beats).toHaveLength(1);
    expect(metadata.scenes[4].beats[0].id).toBe(0);
    expect(view.getByText(/1822 was a milestone, not an instant total solution/i)).toBeVisible();
    expect(view.getByText(/readable with converging evidence/i)).toBeVisible();
    expect(view.getByText(/still needs context/i)).toBeVisible();
  });

  it("reserves final geometry for every multi-beat report page", () => {
    for (const scene of [1, 2, 4]) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const active = activePanel(view.container);

      expect(active).toHaveAttribute("data-beat-layout-container", "true");
      expect(active).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(active?.querySelectorAll('[data-beat-layout-item="true"]').length).toBeGreaterThan(2);
      view.unmount();
    }
  });
});

describe("Annotated Source & Diff / Reading Rosetta — navigation and motion", () => {
  it("reveals the index only after a 360ms hold and cancels early release or cancellation", () => {
    vi.useFakeTimers();
    const view = renderStage();
    const nav = view.container.querySelector<HTMLElement>('[data-topic-navigation="true"]');

    try {
      fireEvent.pointerDown(nav as HTMLElement, { pointerId: 1 });
      expect(nav).toHaveAttribute("data-minimap-revealed", "false");
      act(() => vi.advanceTimersByTime(359));
      expect(nav).toHaveAttribute("data-minimap-revealed", "false");

      fireEvent.pointerUp(nav as HTMLElement, { pointerId: 1 });
      act(() => vi.runOnlyPendingTimers());
      expect(nav).toHaveAttribute("data-minimap-revealed", "false");

      fireEvent.pointerDown(nav as HTMLElement, { pointerId: 2 });
      act(() => vi.advanceTimersByTime(360));
      expect(nav).toHaveAttribute("data-minimap-revealed", "true");
      fireEvent.pointerUp(nav as HTMLElement, { pointerId: 2 });
      expect(nav).toHaveAttribute("data-minimap-revealed", "false");

      fireEvent.pointerDown(nav as HTMLElement, { pointerId: 3 });
      act(() => vi.advanceTimersByTime(200));
      fireEvent.pointerCancel(nav as HTMLElement, { pointerId: 3 });
      act(() => vi.runOnlyPendingTimers());
      expect(nav).toHaveAttribute("data-minimap-revealed", "false");
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });

  it("isolates native touchstart/move/end/cancel from real stage and window navigation", () => {
    const onStageNext = vi.fn();
    const onStagePrev = vi.fn();
    const onNavigate = vi.fn();
    const leakedWindowTouch = vi.fn();
    const handleWindowTouch = () => leakedWindowTouch();
    const touchTypes = ["touchstart", "touchmove", "touchend", "touchcancel"] as const;
    for (const type of touchTypes) {
      window.addEventListener(type, handleWindowTouch);
    }

    const view = render(
      <TouchNavigationHarness
        onStageNext={onStageNext}
        onStagePrev={onStagePrev}
        onNavigate={onNavigate}
      />,
    );
    const nav = view.container.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const target = view.getByRole("button", { name: /04 hypothesis/i });
    const symbol = target.querySelector<HTMLElement>('[aria-hidden="true"]');

    try {
      fireEvent.touchStart(nav as HTMLElement, {
        touches: [{ clientX: 120, clientY: 120 }],
      });
      fireEvent.touchMove(nav as HTMLElement, {
        touches: [{ clientX: 121, clientY: 121 }],
      });
      fireEvent.touchEnd(nav as HTMLElement, {
        touches: [],
        changedTouches: [{ clientX: 121, clientY: 121 }],
      });
      fireEvent.touchCancel(nav as HTMLElement, {
        touches: [],
        changedTouches: [{ clientX: 121, clientY: 121 }],
      });

      fireEvent.touchStart(symbol as HTMLElement, {
        touches: [{ clientX: 180, clientY: 180 }],
      });
      fireEvent.touchEnd(symbol as HTMLElement, {
        touches: [],
        changedTouches: [{ clientX: 180, clientY: 180 }],
      });

      expect(onStageNext).not.toHaveBeenCalled();
      expect(onStagePrev).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();
      expect(leakedWindowTouch).not.toHaveBeenCalled();
    } finally {
      view.unmount();
      for (const type of touchTypes) {
        window.removeEventListener(type, handleWindowTouch);
      }
    }
  });

  it("exposes the exact navigation profile and isolates click, Space, Enter, and repeats", () => {
    expect(topic.navigation).toEqual({
      geometry: "typographic-index",
      carrier: "rosetta-symbol-minimap",
      invocation: "gesture-hold",
      feedback: "geometry-reflow",
    });

    const leakedClick = vi.fn();
    const leakedKey = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div onClick={leakedClick} onKeyDown={leakedKey}>
        <topic.Stage
          scene={1}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );
    const nav = view.container.querySelector<HTMLElement>('[data-topic-navigation="true"]');
    const target = view.getByRole("button", { name: /04 hypothesis/i });

    expect(nav).toHaveAttribute("data-navigation-geometry", "typographic-index");
    expect(nav).toHaveAttribute("data-navigation-carrier", "rosetta-symbol-minimap");
    expect(nav).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(nav).toHaveAttribute("data-navigation-feedback", "geometry-reflow");

    fireEvent.click(target);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(leakedClick).not.toHaveBeenCalled();

    target.focus();
    fireEvent.keyDown(target, { key: " ", code: "Space", repeat: false });
    expect(onNavigate).toHaveBeenCalledTimes(2);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(leakedKey).not.toHaveBeenCalled();

    fireEvent.keyDown(target, { key: " ", code: "Space", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(target, { key: "Enter", code: "Enter", repeat: false });
    expect(onNavigate).toHaveBeenCalledTimes(3);
    expect(onNavigate).toHaveBeenLastCalledWith(4, 0);
    expect(leakedKey).not.toHaveBeenCalled();

    fireEvent.keyDown(target, { key: "Enter", code: "Enter", repeat: true });
    expect(onNavigate).toHaveBeenCalledTimes(3);
  });

  it("hides navigation in thumbnails and settles thumbnail/reduced-motion frames", () => {
    const thumbnail = renderStage({ isThumbnail: true, scene: 4, beat: 2 });
    expect(thumbnail.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(thumbnail.container.querySelector('[data-reading-state="settled"]')).not.toBeNull();
    expect(thumbnail.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    thumbnail.unmount();

    const reduced = renderStage({ reducedMotion: true, scene: 2, beat: 3 });
    expect(reduced.container.querySelector('[data-reading-state="settled"]')).not.toBeNull();
    expect(reduced.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });

  it("keeps the exact hard-cut/focus-swap/crossfade/hard-cut edge score", () => {
    expect(readingRosettaTransitionScore).toEqual({
      "1->2": "hard-cut",
      "2->3": "focus-swap",
      "3->4": "crossfade",
      "4->5": "hard-cut",
    });
    expect(topic.transitionScore).toBe(readingRosettaTransitionScore);

    const edges = [
      [1, 2, "hard-cut"],
      [2, 3, "focus-swap"],
      [3, 4, "crossfade"],
      [4, 5, "hard-cut"],
    ] as const;
    const frame = (scene: number) => (
      <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
        <topic.Stage
          scene={scene}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
        />
      </div>
    );

    vi.useFakeTimers();
    const view = render(frame(1));
    try {
      for (const [, to, kind] of edges) {
        view.rerender(frame(to));
        expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
          "data-scene-transition-kind",
          kind,
        );
        act(() => vi.advanceTimersByTime(700));
        view.rerender(frame(to));
        expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
          "data-active-scene",
          String(to),
        );
      }
    } finally {
      view.unmount();
      vi.useRealTimers();
    }
  });
});

describe("Annotated Source & Diff / Reading Rosetta — sources and boundaries", () => {
  it("resolves every visible scene claim and source reference in both languages", () => {
    const sources = readingRosettaSources as readonly TraceableSource[];
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    const claimById = new Map(readingRosettaClaims.map((claim) => [claim.id, claim]));
    const unresolvedSceneClaims: string[] = [];

    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({ language, scene, beat: 0, reducedMotion: true });
        const sceneRoot = view.container.querySelector<HTMLElement>("[data-scene-claim-id]");
        const sourceStamp = view.container.querySelector<HTMLElement>("[data-source-ref]");
        const claimId = sceneRoot?.dataset.sceneClaimId;
        const sourceIds = sourceStamp?.dataset.sourceRef?.split(" ").filter(Boolean) ?? [];

        if (!claimId || !claimById.has(claimId)) {
          unresolvedSceneClaims.push(`${language}:${scene}:${claimId ?? "missing"}`);
        } else {
          const claim = claimById.get(claimId);
          expect(sourceIds.length).toBeGreaterThan(0);
          for (const sourceId of sourceIds) {
            const source = sourceById.get(sourceId);
            expect(source).toBeDefined();
            expect(claim?.sourceIds).toContain(sourceId);
            expect(source?.claimIds).toContain(claimId);
            expect(sourceStamp).toHaveTextContent(source?.ref ?? "missing-source-ref");
          }
        }
        view.unmount();
      }
    }

    expect(unresolvedSceneClaims).toEqual([]);
  });

  it("keeps source claimIds and claim sourceIds as exact inverse mappings", () => {
    const sources = readingRosettaSources as readonly TraceableSource[];
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    const claimById = new Map(readingRosettaClaims.map((claim) => [claim.id, claim]));
    const expectedClaimsBySource = new Map<string, Set<string>>();

    for (const claim of readingRosettaClaims) {
      for (const sourceId of claim.sourceIds) {
        const expected = expectedClaimsBySource.get(sourceId) ?? new Set<string>();
        expected.add(claim.id);
        expectedClaimsBySource.set(sourceId, expected);
        expect(sourceById.get(sourceId)?.claimIds).toContain(claim.id);
      }
    }

    for (const source of sources) {
      expect(source.ref.trim().length).toBeGreaterThan(3);
      expect(source.claimIds.length).toBeGreaterThan(0);
      expect(new Set(source.claimIds)).toEqual(expectedClaimsBySource.get(source.id));
      for (const claimId of source.claimIds) {
        expect(claimById.has(claimId)).toBe(true);
        expect(claimById.get(claimId)?.sourceIds).toContain(source.id);
      }
    }
  });

  it("carries authoritative HTTPS sources and a closed claim graph", () => {
    expect(readingRosettaSources.length).toBeGreaterThanOrEqual(6);
    expect(topic.evidence).toEqual({
      kind: "facts",
      sources: readingRosettaSources,
    });
    const sourceIds = new Set<string>(readingRosettaSources.map((source) => source.id));

    for (const source of readingRosettaSources) {
      const typedSource: Source = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(typedSource.authority?.trim().length).toBeGreaterThan(4);
      expect(typedSource.title?.trim().length).toBeGreaterThan(4);
      expect(typedSource.citation?.trim().length).toBeGreaterThan(8);
    }

    expect(readingRosettaClaims.length).toBeGreaterThanOrEqual(8);
    for (const claim of readingRosettaClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.boundary.trim().length).toBeGreaterThan(20);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });

  it("includes museum, primary decipherment, academic alignment, and provenance sources", () => {
    const authorities = readingRosettaSources.map((source) => source.authority).join(" ");
    const titles = readingRosettaSources.map((source) => source.title).join(" ");

    expect(authorities).toMatch(/British Museum/);
    expect(authorities).toMatch(/Bibliothèque nationale de France/);
    expect(authorities).toMatch(/Leipzig University/);
    expect(authorities).toMatch(/Claremont Graduate University/);
    expect(titles).toMatch(/Thomas Young/i);
    expect(titles).toMatch(/Lettre à M\. Dacier/i);
    expect(titles).toMatch(/Digital Rosetta Stone/i);
  });

  it("rejects the retired TLS-failing Rosetta Online endpoint", () => {
    const urls = readingRosettaSources.map((source) => source.url);

    expect(urls).not.toContain("https://rosettastone.hieroglyphic-texts.net/");
    expect(urls).toContain("https://www.digital-rosetta-stone.org/");
  });

  it("renders only self-drawn evidence without remote image hotlinks", () => {
    const view = renderStage({ scene: 3 });

    expect(view.container.querySelectorAll("svg").length).toBeGreaterThan(0);
    expect(view.container.querySelector("img")).toBeNull();
    expect(view.container.innerHTML).not.toMatch(/https?:\/\//);
    expect(view.container.innerHTML).not.toMatch(/animation-iteration-count:\s*infinite/i);
  });
});
