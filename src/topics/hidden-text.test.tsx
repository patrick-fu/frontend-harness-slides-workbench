import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "../domain/evidence";
import type { TopicStageProps } from "../domain/topic";
import definition, {
  hiddenTextClaims,
  hiddenTextSources,
  hiddenTextTransitionScore,
} from "./hidden-text";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(definition);

const TopicStage = definition.Stage;
const getMetadata = (language: "en" | "zh") => definition.metadata[language];

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 2,
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

describe("Scholars' Vellum: hidden text — editorial reading", () => {
  it("renders every English and Chinese scene beat with aligned structure", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const active = view.container.querySelector<HTMLElement>(
            '[data-testid="spatial-scene-panel"][data-active="true"]',
          );
          expect(active).not.toBeNull();
          expect(active?.textContent?.trim().length).toBeGreaterThan(55);
          expect(active?.querySelector('[data-source-ref="true"]')).not.toBeNull();
          view.unmount();
        }
      }
    }
  });

  it("keeps metadata and the 1-2-4-2-1 beat curve aligned", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(definition.id).toBe("hidden-text");
    expect(definition.styleId).toBe("scholars-vellum");
    expect(en.heroScene).toBe(3);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([1, 2, 4, 2, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(
      en.scenes.map((scene) => scene.beats.length),
    );
    expect(en.scenes.flatMap((scene) => scene.beats).map((item) => item.id)).toEqual(
      zh.scenes.flatMap((scene) => scene.beats).map((item) => item.id),
    );
  });

  it("reserves every multi-beat manuscript layout", () => {
    for (const scene of [2, 3, 4]) {
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

  it("keeps all spectral evidence in fixed coordinates and only changes focus", () => {
    const view = renderStage({ scene: 3, beat: 0 });
    const getActivePanel = () =>
      view.container.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );

    expect(getActivePanel()?.querySelectorAll('[data-spectral-panel="true"]')).toHaveLength(4);
    expect(getActivePanel()?.querySelectorAll('[data-focused="true"]')).toHaveLength(1);

    view.rerender(
      <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
        <TopicStage
          scene={3}
          beat={3}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
        />
      </div>,
    );

    expect(getActivePanel()?.querySelectorAll('[data-spectral-panel="true"]')).toHaveLength(4);
    expect(getActivePanel()?.querySelector('[data-method="xrf"]')).toHaveAttribute(
      "data-focused",
      "true",
    );
  });

  it("states that image production and scholarly interpretation are separate steps", () => {
    const view = renderStage({ scene: 4, beat: 1 });
    const active = view.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );

    expect(active?.querySelector('[data-evidence-role="image"]')).toBeVisible();
    expect(active?.querySelector('[data-evidence-role="interpretation"]')).toBeVisible();
    expect(active?.querySelector('[data-interpretation-boundary="true"]')).toBeVisible();
  });
});

describe("Scholars' Vellum: hidden text — evidence contracts", () => {
  it("exports and applies the exact low-motion transition score", () => {
    expect(hiddenTextTransitionScore).toEqual({
      "1->2": "hard-cut",
      "2->3": "page-turn",
      "3->4": "crossfade",
      "4->5": "hard-cut",
    });
    expect(definition.transitionScore).toBe(hiddenTextTransitionScore);

    const edges = [
      [1, 2, "hard-cut"],
      [2, 3, "page-turn"],
      [3, 4, "crossfade"],
      [4, 5, "hard-cut"],
    ] as const;

    for (const [from, to, kind] of edges) {
      const view = renderStage({ scene: from });
      view.rerender(
        <div data-testid="stage" style={{ width: 1920, height: 1080, containerType: "size" }}>
          <TopicStage
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

  it("carries authoritative HTTPS sources and bounded claim links", () => {
    expect(hiddenTextSources.length).toBeGreaterThanOrEqual(5);
    expect(definition.evidence).toEqual({
      kind: "facts",
      sources: hiddenTextSources,
    });
    const sourceIds = new Set(hiddenTextSources.map((source) => source.id));

    for (const source of hiddenTextSources) {
      const typedSource: Source = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.trim().length).toBeGreaterThan(5);
      expect(source.title.trim().length).toBeGreaterThan(5);
      expect(source.citation.trim().length).toBeGreaterThan(8);
      expect(source.supports.trim().length).toBeGreaterThan(30);
      expect(typedSource.url).toBe(source.url);
    }

    for (const claim of hiddenTextClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.boundary.trim().length).toBeGreaterThan(20);
      for (const sourceId of claim.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
      }
    }
  });
});

describe("Scholars' Vellum: hidden text — folio-tab navigation", () => {
  it("exposes the prescribed profile, expands by click, and navigates by tab", () => {
    const view = renderStage({ scene: 2 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "edge-scale");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "palimpsest-folio-tabs",
    );
    expect(navigation).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(navigation).toHaveAttribute("data-navigation-feedback", "geometry-reflow");
    expect(navigation).toHaveAttribute("data-expanded", "false");

    fireEvent.click(screen.getByRole("button", { name: "Expand folio index" }));
    expect(navigation).toHaveAttribute("data-expanded", "true");
    expect(navigation?.querySelectorAll('[data-folio-tab="true"]')).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "Open folio layer 4" }));
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
  });

  it("supports focused keyboard fallback and one-step bounds", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    fireEvent.keyDown(navigation!, { key: "ArrowDown" });
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    fireEvent.keyDown(navigation!, { key: "ArrowUp" });
    expect(view.onNavigate).toHaveBeenCalledWith(2, 0);
  });

  it("hides in thumbnails and settles reduced-motion output", () => {
    const view = renderStage({ scene: 3, beat: 3, isThumbnail: true, reducedMotion: true });
    expect(view.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(view.getByTestId("hidden-text-root")).toHaveAttribute("data-motion", "off");
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
