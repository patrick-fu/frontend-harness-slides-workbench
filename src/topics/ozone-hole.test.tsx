import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import ozoneHole, {
  ozoneHoleClaims,
  ozoneHoleSources,
  ozoneHoleTransitionScore,
} from "./ozone-hole";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(ozoneHole);

const TopicStage = ozoneHole.Stage;

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
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
      <TopicStage {...stageProps} />
    </div>,
  );

  return {
    ...result,
    stage: result.getByTestId("stage"),
    onNavigate: stageProps.onNavigate as ReturnType<typeof vi.fn>,
  };
}

describe("Maintainer Issue Brief / Ozone Hole — evidence report", () => {
  it("renders every English and Chinese scene beat as a sourced, settled report", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const active = view.container.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-panel"][data-active="true"]',
          );

          expect(active).not.toBeNull();
          expect(active?.textContent?.trim().length).toBeGreaterThan(90);
          expect(active?.querySelector("[data-claim-id]")).not.toBeNull();
          expect(active?.querySelector('[data-reading-state="settled"]')).not.toBeNull();
          view.unmount();
        }
      }
    }
  });

  it("keeps the five-scene 2/4/1/3/1 metadata contract aligned in both languages", () => {
    const en = ozoneHole.metadata.en;
    const zh = ozoneHole.metadata.zh;

    expect(ozoneHole.styleId).toBe("maintainer-issue-brief");
    expect(en.heroScene).toBe(2);
    expect(en.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 4, 1, 3, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(
      en.scenes.map((scene) => scene.beats.length),
    );
    expect(zh.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id)).toEqual(
      en.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id),
    );
  });

  it("defines the ozone hole as a seasonal low-ozone region rather than a physical opening", () => {
    const en = renderStage({ scene: 1, beat: 1 });
    expect(en.getByText(/not an opening in the sky/i)).toBeVisible();
    expect(en.getByText(/220 Dobson units/i)).toBeVisible();
    expect(en.container.querySelector('[data-atmospheric-section="true"]')).not.toBeNull();
    en.unmount();

    const zh = renderStage({ language: "zh", scene: 1, beat: 1 });
    expect(zh.getByText(/不是天空中的物理孔洞/)).toBeVisible();
    expect(zh.getByText(/220 多布森单位/)).toBeVisible();
  });

  it("keeps the complete Halley evidence record and quality controls in place while focus advances", () => {
    const first = renderStage({ scene: 2, beat: 0 });
    const firstActive = first.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );

    expect(firstActive?.querySelectorAll("[data-evidence-state]")).toHaveLength(4);
    expect(firstActive?.querySelectorAll('[data-focused="true"]')).toHaveLength(1);
    expect(first.getAllByText(/1956–1985 monthly means/i).length).toBeGreaterThanOrEqual(1);
    expect(first.getByText(/sun-angle limits/i)).toBeVisible();

    first.rerender(
      <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
        <TopicStage
          scene={2}
          beat={3}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
        />
      </div>,
    );
    const finalActive = first.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );
    expect(finalActive?.querySelectorAll("[data-evidence-state]")).toHaveLength(4);
    expect(finalActive?.querySelector('[data-evidence-state="publish"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
  });

  it("shows satellite reprocessing as a ground-and-orbit cross-check, not a blind-machine myth", () => {
    const view = renderStage({ scene: 3 });

    expect(view.getByText(/original 200–650 DU profile set/i)).toBeVisible();
    expect(view.getByText(/flagged for reliability review/i)).toBeVisible();
    expect(view.getByText(/regional-scale Antarctic phenomenon/i)).toBeVisible();
    expect(view.container.querySelector('[data-satellite-recheck="true"]')).not.toBeNull();
  });

  it("reserves final geometry for all multi-beat report pages", () => {
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

  it("keeps the polar-cloud chemistry chain present while each mechanism step is reviewed", () => {
    const view = renderStage({ scene: 4, beat: 2 });
    const active = view.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );

    expect(active?.querySelectorAll('[data-mechanism-step="true"]')).toHaveLength(3);
    expect(active?.querySelectorAll('[data-focused="true"]')).toHaveLength(1);
    expect(view.getAllByText(/polar stratospheric clouds/i).length).toBeGreaterThanOrEqual(1);
    expect(view.getAllByText(/2 O₃ → 3 O₂/).length).toBeGreaterThanOrEqual(1);
    expect(view.getByText(/diagrammatic · not to scale/i)).toBeVisible();
  });

  it("states recovery conditionally and separates a completed season from the long-term trend", () => {
    const view = renderStage({ scene: 5 });

    expect(view.getAllByText(/latest completed assessment: 2022/i).length).toBeGreaterThanOrEqual(1);
    expect(view.getByText(/2026 assessment is due by year-end/i)).toBeVisible();
    expect(view.getByText(/late 2060s/i)).toBeVisible();
    expect(view.getByText(/one season is not the trend/i)).toBeVisible();
  });
});

describe("Maintainer Issue Brief / Ozone Hole — source and transition contracts", () => {
  it("keeps the exact transition score after every edge settles in one continuous sequence", () => {
    expect(ozoneHoleTransitionScore).toEqual({
      "1->2": "linear-wipe",
      "2->3": "hard-cut",
      "3->4": "crossfade",
      "4->5": "linear-wipe",
    });
    expect(ozoneHole.transitionScore).toBe(ozoneHoleTransitionScore);

    const edges = [
      [1, 2, "linear-wipe"],
      [2, 3, "hard-cut"],
      [3, 4, "crossfade"],
      [4, 5, "linear-wipe"],
    ] as const;

    vi.useFakeTimers();
    const view = renderStage({ scene: 1 });
    const frame = (scene: number) => (
      <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
        <TopicStage
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

        act(() => vi.advanceTimersByTime(700));
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
    expect(ozoneHoleSources.length).toBeGreaterThanOrEqual(6);
    expect(ozoneHole.evidence.kind).toBe("mixed");
    if (ozoneHole.evidence.kind === "mixed") {
      expect(ozoneHole.evidence.sources).toBe(ozoneHoleSources);
    }
    const sourceIds = new Set(ozoneHoleSources.map((source) => source.id));

    for (const source of ozoneHoleSources) {
      const typedSource: Source = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(typedSource.authority?.trim().length).toBeGreaterThan(4);
      expect(typedSource.title?.trim().length).toBeGreaterThan(4);
      expect(typedSource.citation?.trim().length).toBeGreaterThan(8);
    }

    expect(ozoneHoleClaims.length).toBeGreaterThanOrEqual(7);
    for (const claim of ozoneHoleClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.boundary.trim().length).toBeGreaterThan(20);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });
});

describe("Maintainer Issue Brief / Ozone Hole — issue-state navigation", () => {
  it("exposes the prescribed profile, click path, keyboard fallback, and mechanical displacement", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "typographic-index");
    expect(navigation).toHaveAttribute("data-navigation-carrier", "ozone-issue-states");
    expect(navigation).toHaveAttribute("data-navigation-invocation", "keyboard-focus");
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "mechanical-displacement",
    );
    expect(navigation?.querySelectorAll('[data-active="true"]')).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Open issue state 5" }));
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);

    fireEvent.keyDown(navigation!, { key: "ArrowLeft" });
    expect(view.onNavigate).toHaveBeenCalledWith(2, 0);

    fireEvent.keyDown(navigation!, { key: "End" });
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("hides navigation in thumbnails and settles reduced-motion frames", () => {
    const view = renderStage({
      scene: 4,
      beat: 2,
      isThumbnail: true,
      reducedMotion: true,
    });

    expect(view.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(view.getByTestId("ozone-hole-root")).toHaveAttribute("data-motion", "off");
    expect(view.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
  });

  it("stays inside the fixed stage envelope", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      expect(view.stage.scrollWidth).toBeLessThanOrEqual(view.stage.clientWidth + 1);
      expect(view.stage.scrollHeight).toBeLessThanOrEqual(view.stage.clientHeight + 1);
      view.unmount();
    }
  });
});
