import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import UrushiCure, {
  getMetadata,
  urushiCureSources,
  urushiCureTopic,
  urushiCureTransitionScore,
} from "./37-urushi-cure";

const BEAT_COUNTS: Record<number, number> = {
  1: 2,
  2: 3,
  3: 3,
  4: 3,
  5: 2,
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
  const renderResult = render(
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
      <UrushiCure {...stageProps} />
    </div>,
  );

  return {
    ...renderResult,
    onNavigate: stageProps.onNavigate as ReturnType<typeof vi.fn>,
    stage: renderResult.getByTestId("stage"),
  };
}

describe("Style 37: urushi cure — render and localization", () => {
  it("renders every English and Chinese scene beat", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ scene, beat, language });
          expect(view.container.querySelector('[data-active="true"]')).not.toBeNull();
          expect(view.container.textContent?.trim().length).toBeGreaterThan(40);
          view.unmount();
        }
      }
    }
  });

  it("keeps metadata structure and beat counts aligned across languages", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("after-hours-luxe");
    expect(en.band).toBe("contemporary-digital");
    expect(en.heroScene).toBe(4);
    expect(en.scenes).toHaveLength(5);
    expect(zh.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual(
      zh.scenes.map((scene) => scene.beats.length),
    );
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([2, 3, 3, 3, 2]);
  });

  it("marks every multi-beat scene as a reserved layout with stable items", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const activePanel = view.container.querySelector<HTMLElement>(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );
      expect(activePanel).toHaveAttribute("data-beat-layout-container", "true");
      expect(activePanel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        activePanel?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(4);
      view.unmount();
    }
  });

  it("reveals the complete three-part material rail on every final beat", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const activePanel = view.container.querySelector(
        '[data-testid="spatial-scene-panel"][data-active="true"]',
      );
      expect(activePanel?.querySelectorAll("ol li[data-visible='true']")).toHaveLength(3);
      view.unmount();
    }
  });
});

describe("Style 37: urushi cure — coordinated topic contract", () => {
  it("exports the exact transition score and applies every edge", () => {
    expect(urushiCureTransitionScore).toEqual({
      "1->2": "focus-swap",
      "2->3": "ink-spread",
      "3->4": "iris-open",
      "4->5": "focus-swap",
    });
    expect(urushiCureTopic.transitionScore).toBe(urushiCureTransitionScore);

    const edges = [
      [1, 2, "focus-swap"],
      [2, 3, "ink-spread"],
      [3, 4, "iris-open"],
      [4, 5, "focus-swap"],
    ] as const;

    for (const [from, to, kind] of edges) {
      const view = renderStage({ scene: from });
      view.rerender(
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
          <UrushiCure
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

  it("uses the urushi-sheen signature only on the scene-4 edge", () => {
    const view = renderStage({ scene: 3, beat: 2 });
    view.rerender(
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
        <UrushiCure
          scene={4}
          beat={2}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
        />
      </div>,
    );

    expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
      "data-scene-transition-modifier",
      "urushi-sheen",
    );
    expect(view.container.querySelectorAll('[data-signature-sheen="true"]')).toHaveLength(1);
  });

  it("carries at least three claim-scoped HTTPS sources", () => {
    expect(urushiCureSources.length).toBeGreaterThanOrEqual(3);
    expect(urushiCureTopic.sources).toBe(urushiCureSources);
    for (const source of urushiCureSources) {
      const traceableSource: TopicSource = source;
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.trim()).not.toHaveLength(0);
      expect(
        Boolean(
          traceableSource.authority ||
            traceableSource.citation ||
            traceableSource.title,
        ),
      ).toBe(true);
    }
  });
});

describe("Style 37: urushi cure — navigation and motion safety", () => {
  it("exposes the prescribed navigation profile and keeps click available without a hold", () => {
    const { container, onNavigate } = renderStage({ scene: 1 });
    const navigation = container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(navigation).toHaveAttribute("data-navigation-geometry", "ambient");
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "lacquer-sheen-loci",
    );
    expect(navigation).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(navigation).toHaveAttribute(
      "data-navigation-feedback",
      "typographic-emphasis",
    );

    const buttons = screen.getAllByRole("button", { name: /scene|场景/ });
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[2]);
    expect(onNavigate).toHaveBeenCalledWith(3, 0);

    fireEvent.pointerDown(navigation!);
    expect(navigation).toHaveAttribute("data-revealed", "true");
    fireEvent.pointerUp(navigation!);
    expect(navigation).toHaveAttribute("data-revealed", "false");
  });

  it("hides navigation in thumbnails and removes transition clones", () => {
    const view = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(view.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
  });

  it("shows deterministic before and after specimens with motion disabled", () => {
    const view = renderStage({ scene: 4, beat: 2, reducedMotion: true });
    expect(view.container.querySelector('[data-motion="off"]')).not.toBeNull();
    expect(view.getByTestId("urushi-before-sample")).toBeVisible();
    expect(view.getByTestId("urushi-after-sample")).toBeVisible();
  });

  it("does not exceed the fixed stage envelope", () => {
    for (let scene = 1; scene <= 5; scene += 1) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      expect(view.stage.scrollWidth).toBeLessThanOrEqual(view.stage.clientWidth + 1);
      expect(view.stage.scrollHeight).toBeLessThanOrEqual(view.stage.clientHeight + 1);
      view.unmount();
    }
  });
});
