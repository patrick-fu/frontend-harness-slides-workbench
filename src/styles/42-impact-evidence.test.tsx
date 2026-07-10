import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import ImpactEvidence, {
  getMetadata,
  impactEvidenceClaims,
  impactEvidenceSources,
  impactEvidenceTopic,
  impactEvidenceTransitionScore,
} from "./42-impact-evidence";

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 4,
  3: 1,
  4: 3,
  5: 1,
};

function renderStage(props: Partial<BespokeStyleProps> = {}) {
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
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ImpactEvidence {...stageProps} />
    </div>,
  );

  return {
    ...result,
    stage: result.getByTestId("stage"),
    onNavigate: stageProps.onNavigate as ReturnType<typeof vi.fn>,
  };
}

describe("Style 42: impact evidence — reading-first render", () => {
  it("renders every English and Chinese scene beat with aligned structure", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const active = view.container.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-panel"][data-active="true"]',
          );
          expect(active).not.toBeNull();
          expect(active?.textContent?.trim().length).toBeGreaterThan(80);
          expect(active?.querySelector('[data-claim-id]')).not.toBeNull();
          view.unmount();
        }
      }
    }
  });

  it("keeps metadata, beat counts, and bilingual numeric structure aligned", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("research-memo");
    expect(en.band).toBe("text-report");
    expect(en.heroScene).toBe(2);
    expect(en.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 4, 1, 3, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(
      en.scenes.map((scene) => scene.beats.length),
    );
    expect(en.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id)).toEqual(
      zh.scenes.flatMap((scene) => scene.beats).map((beat) => beat.id),
    );
  });

  it("uses reserved layouts for every multi-beat evidence page", () => {
    for (const scene of [1, 2, 4]) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const active = view.container.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );
      expect(active).toHaveAttribute("data-beat-layout-container", "true");
      expect(active).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        active?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("focuses evidence rows without removing the document body", () => {
    const first = renderStage({ scene: 2, beat: 0 });
    expect(first.getByText("Gubbio, Italy")).toBeVisible();
    expect(first.getByText("Stevns Klint, Denmark")).toBeVisible();
    expect(first.getByText("Woodside Creek, New Zealand")).toBeVisible();
    const firstActive = first.container.querySelector(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );
    expect(firstActive?.querySelectorAll('[data-evidence-row="true"]')).toHaveLength(3);
    expect(firstActive?.querySelectorAll('[data-focused="true"]')).toHaveLength(1);

    first.rerender(
      <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
        <ImpactEvidence
          scene={2}
          beat={3}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
        />
      </div>,
    );
    const finalActive = first.container.querySelector(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );
    expect(finalActive?.querySelectorAll('[data-evidence-row="true"]')).toHaveLength(3);
    expect(finalActive?.querySelector('[data-boundary-reading="true"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
  });
});

describe("Style 42: impact evidence — source and transition contracts", () => {
  it("exports the exact low-motion transition score and applies all four edges", () => {
    expect(impactEvidenceTransitionScore).toEqual({
      "1->2": "hard-cut",
      "2->3": "crossfade",
      "3->4": "focus-swap",
      "4->5": "hard-cut",
    });
    expect(impactEvidenceTopic.transitionScore).toBe(impactEvidenceTransitionScore);

    const edges = [
      [1, 2, "hard-cut"],
      [2, 3, "crossfade"],
      [3, 4, "focus-swap"],
      [4, 5, "hard-cut"],
    ] as const;

    for (const [from, to, kind] of edges) {
      const view = renderStage({ scene: from });
      view.rerender(
        <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
          <ImpactEvidence
            scene={to}
            beat={0}
            language="en"
            isThumbnail={false}
            reducedMotion={false}
          />
        </div>,
      );
      expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
        "data-scene-transition-kind",
        kind,
      );
      view.unmount();
    }
  });

  it("carries authoritative HTTPS sources and a closed claim-to-source graph", () => {
    expect(impactEvidenceSources.length).toBeGreaterThanOrEqual(5);
    expect(impactEvidenceTopic.sources).toBe(impactEvidenceSources);
    const sourceIds = new Set(impactEvidenceSources.map((source) => source.id));

    for (const source of impactEvidenceSources) {
      const typedSource: TopicSource = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim().length).toBeGreaterThan(24);
      expect(Boolean(typedSource.authority || typedSource.citation || typedSource.title)).toBe(true);
    }

    expect(impactEvidenceClaims.length).toBeGreaterThanOrEqual(6);
    for (const claim of impactEvidenceClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
      expect(claim.boundary.trim().length).toBeGreaterThan(12);
    }
  });
});

describe("Style 42: impact evidence — citation-chain navigation", () => {
  it("exposes the prescribed profile, click expansion, history trail, and navigation fallback", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "typographic-index");
    expect(navigation).toHaveAttribute("data-navigation-carrier", "impact-citation-chain");
    expect(navigation).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(navigation).toHaveAttribute("data-navigation-feedback", "history-trail");
    expect(navigation).toHaveAttribute("data-expanded", "false");
    expect(navigation?.querySelectorAll('[data-visited="true"]')).toHaveLength(3);

    fireEvent.click(screen.getByRole("button", { name: "Expand citation chain" }));
    expect(navigation).toHaveAttribute("data-expanded", "true");
    expect(navigation?.querySelectorAll('[data-source-citation="true"]')).toHaveLength(6);
    expect(screen.getByText(/Alvarez et al\. 1980/)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Open evidence section 5" }));
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);

    fireEvent.keyDown(navigation!, { key: "ArrowLeft" });
    expect(view.onNavigate).toHaveBeenCalledWith(2, 0);
  });

  it("hides navigation in thumbnails and settles reduced-motion evidence", () => {
    const view = renderStage({ scene: 4, beat: 2, isThumbnail: true, reducedMotion: true });
    expect(view.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(view.getByTestId("impact-evidence-root")).toHaveAttribute("data-motion", "off");
    expect(view.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
    expect(view.container.querySelector('[data-correlation-line="true"]')).toHaveAttribute(
      "data-settled",
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
