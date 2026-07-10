import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import type { BespokeStyleProps } from "../types";
import BeforeA, {
  BEFORE_A_SOURCES,
  BEFORE_A_TRANSITION_MODIFIER_MAP,
  BEFORE_A_TRANSITION_SCORE,
  beforeATopic,
  getMetadata,
} from "./06-before-a";

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
};

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const componentProps: BespokeStyleProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    ...props,
    onNavigate,
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
      <BeforeA {...componentProps} />
    </div>,
  );

  return {
    ...result,
    stage: result.container.firstElementChild as HTMLElement,
    onNavigate,
    props: componentProps,
  };
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>(
    '[data-spatial-scene-panel="true"][data-active="true"]',
  );
  if (!panel) throw new Error("Active scene panel was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Style 06 / Before A — topic contract", () => {
  it("exports the stable topic, navigation profile, sources, and exact transition score", () => {
    expect(beforeATopic.id).toBe("before-a");
    expect(beforeATopic.topic).toEqual({ en: "Before A", zh: "A之前" });
    expect(beforeATopic.navigation).toEqual({
      geometry: "typographic-index",
      carrier: "letterform-lineage-index",
      invocation: "persistent",
      feedback: "material-color-change",
    });
    expect(beforeATopic.sources).toBe(BEFORE_A_SOURCES);
    expect(beforeATopic.transitionScore).toEqual(BEFORE_A_TRANSITION_SCORE);
    expect(BEFORE_A_TRANSITION_SCORE).toEqual({
      "1->2": "afterimage",
      "2->3": "zoom-through",
      "3->4": "multi-blind",
      "4->5": "afterimage",
    });
    expect(BEFORE_A_TRANSITION_MODIFIER_MAP).toEqual({
      "3->4": "letterform-lineage",
    });
  });

  it("ships a claim-scoped facts packet with authority, https URLs, support, and boundaries", () => {
    expect(BEFORE_A_SOURCES.length).toBeGreaterThanOrEqual(3);

    for (const source of BEFORE_A_SOURCES) {
      const descriptor =
        "citation" in source
          ? source.citation
          : `${source.authority} ${source.title}`;
      expect(descriptor.length).toBeGreaterThan(0);
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.supports.length).toBeGreaterThan(40);
      expect(source.boundary.length).toBeGreaterThan(40);
    }
  });

  it("keeps EN and ZH metadata aligned to five scenes and 1/1/2/3/4 beats", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("kinetic-type-punchline");
    expect(en.band).toBe("minimal-keynote");
    expect(en.heroScene).toBe(4);
    expect(en.scenes).toHaveLength(5);
    expect(zh.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(zh.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([1, 1, 2, 3, 4]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([1, 1, 2, 3, 4]);

    for (const languageMeta of [en, zh]) {
      for (const scene of languageMeta.scenes) {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.length).toBeGreaterThan(0);
          expect(beat.title.length).toBeGreaterThan(0);
          expect(beat.body.length).toBeGreaterThan(0);
        });
      }
    }
  });
});

describe("Style 06 / Before A — render and beat states", () => {
  it("renders every EN and ZH scene beat with a visible active panel", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const { container, unmount } = renderStage({ scene, beat, language });
          const panel = activePanel(container);
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel.querySelector(`[data-scene="${scene}"]`)).not.toBeNull();
          expect(panel.textContent?.trim().length).toBeGreaterThan(0);
          unmount();
        }
      }
    }
  });

  it("uses real reserved beat states for the lineage, signature morph, and final punch", () => {
    const lineageStart = renderStage({ scene: 3, beat: 0 });
    expect(
      activePanel(lineageStart.container).querySelector(
        'article[data-revealed="false"]',
      ),
    ).not.toBeNull();
    lineageStart.unmount();

    const lineageComplete = renderStage({ scene: 3, beat: 1 });
    expect(
      activePanel(lineageComplete.container).querySelector(
        'article[data-revealed="true"][aria-hidden]',
      ),
    ).toBeNull();
    expect(
      activePanel(lineageComplete.container).querySelectorAll(
        'article[data-revealed="true"]',
      ),
    ).toHaveLength(2);
    lineageComplete.unmount();

    for (let beat = 0; beat < 3; beat += 1) {
      const morph = renderStage({ scene: 4, beat });
      const layout = activePanel(morph.container).querySelector<HTMLElement>(
        '[data-composition="full-field-glyph-archaeology"]',
      );
      expect(layout).toHaveAttribute("data-current-phase", String(beat));
      expect(
        layout?.querySelector(`[data-phase="${beat}"][data-phase-state="current"]`),
      ).not.toBeNull();
      morph.unmount();
    }

    const beforePunch = renderStage({ scene: 5, beat: 2 });
    expect(
      activePanel(beforePunch.container).querySelector('[data-final-punch="true"]'),
    ).toHaveAttribute("data-revealed", "false");
    beforePunch.unmount();

    const finalPunch = renderStage({ scene: 5, beat: 3, language: "zh" });
    const punch = activePanel(finalPunch.container).querySelector(
      '[data-final-punch="true"]',
    );
    expect(punch).toHaveAttribute("data-revealed", "true");
    expect(punch).toHaveTextContent("不是");
    expect(punch).toHaveTextContent("一条直线");
  });

  it("declares reserved layout mode for every multi-beat scene", () => {
    for (const scene of [3, 4, 5]) {
      const { container, unmount } = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
      });
      const panel = activePanel(container);
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(panel.querySelectorAll('[data-beat-layout-item="true"]').length).toBeGreaterThan(2);
      unmount();
    }
  });
});

describe("Style 06 / Before A — transition and navigation behavior", () => {
  it("renders the exact four-edge transition score and the letterform signature modifier", async () => {
    const baseProps: BespokeStyleProps = {
      scene: 1,
      beat: 0,
      language: "en",
      isThumbnail: false,
      reducedMotion: false,
      onNavigate: vi.fn(),
    };
    const view = render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <BeforeA {...baseProps} />
      </div>,
    );
    const expected = ["afterimage", "zoom-through", "multi-blind", "afterimage"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <BeforeA {...baseProps} scene={scene} />
        </div>,
      );
      await waitFor(() => {
        expect(
          view.container.querySelector('[data-testid="spatial-scene-track"]'),
        ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
      });

      const modifier = view.container.querySelector(
        '[data-testid="spatial-scene-track"]',
      )?.getAttribute("data-scene-transition-modifier");
      expect(modifier).toBe(scene === 4 ? "letterform-lineage" : null);
    }
  });

  it("exposes the typographic-index audit contract and isolates navigation clicks", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        data-testid="stage"
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <BeforeA
          scene={1}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );

    expect(nav).toHaveAttribute("data-navigation-geometry", "typographic-index");
    expect(nav).toHaveAttribute(
      "data-navigation-carrier",
      "letterform-lineage-index",
    );
    expect(nav).toHaveAttribute("data-navigation-invocation", "persistent");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "material-color-change",
    );
    expect(within(nav!).getAllByRole("button")).toHaveLength(5);

    const target = within(nav!).getByRole("button", {
      name: "Jump to Sampled turns",
    });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();
  });

  it("hides navigation in thumbnail mode and settles thumbnail/reduced-motion frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const { container, unmount } = renderStage({
        scene: 4,
        beat: 2,
        ...props,
        onNavigate: undefined,
      });
      const strip = container.querySelector('[data-testid="spatial-scene-strip"]');
      expect(strip).toHaveAttribute("data-reduced-motion", "true");
      if (props.isThumbnail) {
        expect(
          container.querySelector('[data-topic-navigation="true"]'),
        ).toBeNull();
      }
      unmount();
    }
  });
});

describe("Style 06 / Before A — layout safety", () => {
  it("keeps the fixed stage clipped for every final beat in both languages", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const { stage, unmount } = renderStage({
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          language,
          reducedMotion: true,
        });
        expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
        expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
        unmount();
      }
    }
  });

  it("uses five distinct composition signatures instead of cloning an old topic layout", () => {
    const compositions = new Set<string>();

    for (let scene = 1; scene <= 5; scene += 1) {
      const { container, unmount } = renderStage({
        scene,
        beat: BEAT_COUNTS[scene] - 1,
      });
      const composition = activePanel(container).querySelector<HTMLElement>(
        "[data-composition]",
      )?.dataset.composition;
      expect(composition).toBeDefined();
      compositions.add(composition!);
      unmount();
    }

    expect(compositions.size).toBe(5);
  });
});
