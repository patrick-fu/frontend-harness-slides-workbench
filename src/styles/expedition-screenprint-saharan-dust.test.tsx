import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { BespokeStyleProps, TopicSource } from "../types";
import SaharanDust, {
  SAHARAN_DUST_SOURCES,
  SAHARAN_DUST_TRANSITION_SCORE,
  getMetadata,
  saharanDustTopic,
} from "./expedition-screenprint-saharan-dust";
import componentSource from "./expedition-screenprint-saharan-dust.tsx?raw";
import cssSource from "./expedition-screenprint-saharan-dust.module.css?inline";

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 2,
  4: 4,
  5: 1,
};

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const stageProps: BespokeStyleProps = {
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
      <SaharanDust {...stageProps} />
    </div>,
  );

  return {
    ...result,
    stage: result.getByTestId("stage"),
    onNavigate,
    activePanel: () =>
      result.container.querySelector<HTMLElement>(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
  };
}

afterEach(() => cleanup());

describe("Style 29 / Saharan Dust — topic contract", () => {
  it("exports the coordinated topic, exact score, and prescribed navigation", () => {
    expect(saharanDustTopic.id).toBe("saharan-dust");
    expect(saharanDustTopic.topic).toEqual({
      en: "Saharan Dust",
      zh: "撒哈拉尘",
    });
    expect(saharanDustTopic.navigation).toEqual({
      geometry: "path",
      carrier: "dust-arc",
      invocation: "click-expand",
      feedback: "material-color-change",
    });
    expect(saharanDustTopic.sources).toBe(SAHARAN_DUST_SOURCES);
    expect(saharanDustTopic.transitionScore).toBe(
      SAHARAN_DUST_TRANSITION_SCORE,
    );
    expect(SAHARAN_DUST_TRANSITION_SCORE).toEqual({
      "1->2": "diagonal-pan",
      "2->3": "ink-spread",
      "3->4": "push-x",
      "4->5": "ink-spread",
    });
  });

  it("ships at least three claim-scoped HTTPS sources", () => {
    expect(SAHARAN_DUST_SOURCES.length).toBeGreaterThanOrEqual(3);
    for (const source of SAHARAN_DUST_SOURCES) {
      const typed: TopicSource = source;
      expect(typed.url).toMatch(/^https:\/\//);
      expect(typed.supports.trim().length).toBeGreaterThan(40);
      expect(Boolean(typed.authority || typed.title || typed.citation)).toBe(
        true,
      );
    }
  });

  it("keeps EN/ZH metadata aligned to the 1-3-2-4-1 intensity curve", () => {
    const en = getMetadata("en");
    const zh = getMetadata("zh");

    expect(en.id).toBe("expedition-screenprint");
    expect(en.band).toBe("craft-cultural");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 3, 2, 4, 1,
    ]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 3, 2, 4, 1,
    ]);

    for (const metadata of [en, zh]) {
      expect(metadata.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      for (const scene of metadata.scenes) {
        expect(scene.beats).toHaveLength(BEAT_COUNTS[scene.id]);
        scene.beats.forEach((beat, index) => {
          expect(beat.id).toBe(index);
          expect(beat.action.trim()).not.toHaveLength(0);
          expect(beat.title.trim()).not.toHaveLength(0);
          expect(beat.body.trim()).not.toHaveLength(0);
        });
      }
    }
  });
});

describe("Style 29 / Saharan Dust — evidence-aware visual narrative", () => {
  it("renders every English and Chinese beat as a stable SVG/DOM scene", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = view.activePanel();
          expect(panel).toHaveAttribute("data-scene-id", String(scene));
          expect(panel?.querySelector(`[data-scene="${scene}"]`)).not.toBeNull();
          expect(panel?.textContent?.trim().length).toBeGreaterThan(40);
          expect(panel?.querySelector("svg")).not.toBeNull();
          view.unmount();
        }
      }
    }
  });

  it("reserves geometry for every multi-beat scene", () => {
    for (const scene of [2, 3, 4]) {
      const view = renderStage({ scene, beat: BEAT_COUNTS[scene] - 1 });
      const panel = view.activePanel();
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel?.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThanOrEqual(3);
      view.unmount();
    }
  });

  it("separates observed evidence from schematic explanation", () => {
    const view = renderStage({ scene: 3, beat: 1 });
    const panel = view.activePanel();
    expect(panel?.querySelector('[data-evidence-layer="observed"]')).not.toBeNull();
    expect(panel?.querySelector('[data-evidence-layer="schematic"]')).not.toBeNull();
    expect(panel).toHaveTextContent("OBSERVED");
    expect(panel).toHaveTextContent("SCHEMATIC");
  });

  it("states source and yearly-variation boundaries without fixed tonnage", () => {
    const source = renderStage({ scene: 1 });
    expect(source.activePanel()).toHaveTextContent("one active source region");
    expect(source.activePanel()).toHaveTextContent("not the whole Sahara");
    source.unmount();

    const variation = renderStage({ scene: 5 });
    expect(variation.activePanel()).toHaveTextContent("not a fixed annual shipment");
    expect(
      variation.activePanel()?.querySelector('[data-quantitative="false"]'),
    ).not.toBeNull();
    expect(variation.activePanel()).toHaveTextContent(/schematic thickness/i);
    variation.unmount();

    expect(componentSource).not.toMatch(/182 million|27\.7 million|28 Tg/i);
  });

  it("makes deposition the sole peak and frames dust as one nutrient input", () => {
    for (let beat = 0; beat < 4; beat += 1) {
      const view = renderStage({ scene: 4, beat });
      const field = view.activePanel()?.querySelector<HTMLElement>(
        '[data-deposition-field="true"]',
      );
      expect(field).toHaveAttribute("data-peak", beat === 3 ? "true" : "false");
      if (beat === 3) {
        expect(view.activePanel()).toHaveTextContent("one input");
      }
      view.unmount();
    }
  });
});

describe("Style 29 / Saharan Dust — transitions and dust-arc navigation", () => {
  it("applies all four authored transition edges", () => {
    const view = renderStage({ scene: 1 });
    const expected = ["diagonal-pan", "ink-spread", "push-x", "ink-spread"];

    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div
          data-testid="stage"
          style={{ width: 1920, height: 1080, containerType: "size" }}
        >
          <SaharanDust
            scene={scene}
            beat={0}
            language="en"
            isThumbnail={false}
            reducedMotion={false}
          />
        </div>,
      );
      expect(view.getByTestId("spatial-scene-track")).toHaveAttribute(
        "data-scene-transition-kind",
        expected[scene - 2],
      );
    }
  });

  it("click-expands a path carrier, recolors it, and jumps by click/tap", () => {
    const onStageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        data-testid="stage"
        onClick={onStageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <SaharanDust
          scene={2}
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
    expect(nav).toHaveAttribute("data-navigation-geometry", "path");
    expect(nav).toHaveAttribute("data-navigation-carrier", "dust-arc");
    expect(nav).toHaveAttribute("data-navigation-invocation", "click-expand");
    expect(nav).toHaveAttribute(
      "data-navigation-feedback",
      "material-color-change",
    );
    expect(nav).toHaveAttribute("data-expanded", "false");
    expect(nav).toHaveAttribute("data-ink-state", "ochre");

    const toggle = within(nav!).getByRole("button", { name: /expand dust arc/i });
    fireEvent.pointerDown(toggle);
    fireEvent.click(toggle);
    expect(nav).toHaveAttribute("data-expanded", "true");
    expect(nav).toHaveAttribute("data-ink-state", "forest");

    const destination = within(nav!).getByRole("button", {
      name: /scene 4/i,
    });
    fireEvent.pointerDown(destination);
    fireEvent.click(destination);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(onStageClick).not.toHaveBeenCalled();
  });

  it("supports Arrow-key fallback and hides navigation in thumbnails", () => {
    const view = renderStage({ scene: 3 });
    const nav = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    fireEvent.keyDown(nav!, { key: "ArrowRight" });
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    fireEvent.keyDown(nav!, { key: "ArrowLeft" });
    expect(view.onNavigate).toHaveBeenCalledWith(2, 0);
    view.unmount();

    const thumbnail = renderStage({
      scene: 4,
      beat: 3,
      isThumbnail: true,
      onNavigate: undefined,
    });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(thumbnail.getByTestId("spatial-scene-strip")).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });
});

describe("Style 29 / Saharan Dust — motion and stage safety", () => {
  it("uses flat spot inks, no continuous loops, and only stage-safe units", () => {
    const forbiddenUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;
    expect(componentSource).not.toMatch(/setInterval|requestAnimationFrame/);
    expect(cssSource).not.toMatch(/\binfinite\b/i);
    expect(cssSource).not.toMatch(/(?:linear|radial|conic)-gradient/i);
    expect(componentSource).not.toMatch(forbiddenUnit);
    expect(cssSource).not.toMatch(forbiddenUnit);
  });

  it("settles reduced-motion frames and contains every final beat in the stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene] - 1,
          reducedMotion: true,
        });
        expect(view.getByTestId("saharan-dust-root")).toHaveAttribute(
          "data-motion",
          "off",
        );
        expect(view.getByTestId("spatial-scene-strip")).toHaveAttribute(
          "data-reduced-motion",
          "true",
        );
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(
          view.stage.clientWidth + 1,
        );
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(
          view.stage.clientHeight + 1,
        );
        expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
        view.unmount();
      }
    }
  });
});
