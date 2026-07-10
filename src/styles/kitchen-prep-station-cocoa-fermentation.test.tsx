import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
  within,
} from "@testing-library/react";
import type { BespokeStyleProps } from "../types";
import {
  COCOA_FERMENTATION_SOURCES,
  COCOA_FERMENTATION_TRANSITION_SCORE,
  default as CocoaFermentation,
  cocoaFermentationTopic,
  getMetadata,
} from "./kitchen-prep-station-cocoa-fermentation";
import componentSource from "./kitchen-prep-station-cocoa-fermentation.tsx?raw";

const BEAT_COUNTS = [1, 3, 2, 4, 1] as const;

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const onNavigate = props.onNavigate ?? vi.fn();
  const view = render(
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
      <CocoaFermentation
        scene={1}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={false}
        onNavigate={onNavigate}
        {...props}
      />
    </div>,
  );
  return {
    ...view,
    stage: view.container.firstElementChild as HTMLElement,
    onNavigate,
  };
}

function activePanel(container: HTMLElement): HTMLElement {
  const panel = container.querySelector<HTMLElement>(
    '[data-spatial-scene-panel="true"][data-active="true"]',
  );
  if (!panel) throw new Error("Active cocoa fermentation scene was not rendered");
  return panel;
}

afterEach(() => cleanup());

describe("Kitchen Prep Station / Cocoa Fermentation", () => {
  it("publishes the coordinated topic identity", () => {
    expect(cocoaFermentationTopic.id).toBe("cocoa-fermentation");
    expect(cocoaFermentationTopic.topic).toEqual({
      en: "Cocoa Fermentation",
      zh: "可可发酵",
    });
  });

  it("declares the exact navigation, transition, source, and bilingual metadata contracts", () => {
    expect(cocoaFermentationTopic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "cocoa-sample-tray",
      invocation: "auto-hide",
      feedback: "geometry-reflow",
    });
    expect(cocoaFermentationTopic.transitionScore).toBe(
      COCOA_FERMENTATION_TRANSITION_SCORE,
    );
    expect(COCOA_FERMENTATION_TRANSITION_SCORE).toEqual({
      "1->2": "paper-fold",
      "2->3": "push-y",
      "3->4": "ink-spread",
      "4->5": "paper-fold",
    });
    expect(cocoaFermentationTopic.sources).toBe(COCOA_FERMENTATION_SOURCES);
    expect(COCOA_FERMENTATION_SOURCES).toHaveLength(6);
    for (const source of COCOA_FERMENTATION_SOURCES) {
      expect(source.url).toMatch(/^https:\/\//);
      expect(source.authority.length).toBeGreaterThan(3);
      expect(source.title.length).toBeGreaterThan(8);
      expect(source.citation.length).toBeGreaterThan(8);
      expect(source.supports.length).toBeGreaterThan(40);
      expect(source.boundary.length).toBeGreaterThan(30);
    }

    const en = getMetadata("en");
    const zh = getMetadata("zh");
    expect(en.id).toBe("kitchen-prep-station");
    expect(en.band).toBe("balanced-hybrid");
    expect(en.heroScene).toBe(4);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual([1, 3, 2, 4, 1]);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual([1, 3, 2, 4, 1]);
    expect(en.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(zh.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
    expect(en.scenes[4].beats[0].id).toBe(0);
    expect(zh.scenes[4].beats[0].id).toBe(0);
  });

  it("renders every bilingual beat as one of five distinct material compositions", () => {
    for (const language of ["en", "zh"] as const) {
      const compositions = new Set<string>();
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene - 1]; beat += 1) {
          const view = renderStage({ language, scene, beat });
          const panel = activePanel(view.container);
          const sceneRoot = panel.querySelector<HTMLElement>("[data-composition]");
          expect(sceneRoot?.dataset.composition).toBeTruthy();
          expect(panel.textContent?.trim().length).toBeGreaterThan(40);
          expect(panel.querySelector("img")).toBeNull();
          if (beat === BEAT_COUNTS[scene - 1] - 1) {
            compositions.add(sceneRoot!.dataset.composition!);
          }
          view.unmount();
        }
      }
      expect(compositions.size).toBe(5);
    }
  });

  it("keeps Scenes 2–4 reserved while the microbial, heat, and cutaway facts accumulate", () => {
    for (const scene of [2, 3, 4]) {
      const view = renderStage({
        scene,
        beat: BEAT_COUNTS[scene - 1] - 1,
        reducedMotion: true,
      });
      const panel = activePanel(view.container);
      expect(panel).toHaveAttribute("data-beat-layout-container", "true");
      expect(panel).toHaveAttribute("data-beat-layout-mode", "reserved");
      expect(
        panel.querySelectorAll('[data-beat-layout-item="true"]').length,
      ).toBeGreaterThan(3);
      view.unmount();
    }

    const relay = renderStage({ scene: 2, beat: 2 });
    expect(activePanel(relay.container)).toHaveTextContent("under typical conditions");
    expect(activePanel(relay.container)).toHaveTextContent(/yeast/i);
    expect(activePanel(relay.container)).toHaveTextContent("LAB");
    expect(activePanel(relay.container)).toHaveTextContent("AAB");
    expect(activePanel(relay.container)).toHaveTextContent("ethanol");
    expect(activePanel(relay.container)).toHaveTextContent("acetic acid");
    relay.unmount();

    const stack = renderStage({ scene: 3, beat: 1 });
    expect(activePanel(stack.container)).toHaveTextContent("45–50 °C");
    expect(activePanel(stack.container)).toHaveTextContent("process-dependent");
    expect(activePanel(stack.container)).toHaveTextContent(/turning/i);
    stack.unmount();

    const cutaway = renderStage({ scene: 4, beat: 3 });
    expect(activePanel(cutaway.container)).toHaveTextContent("Embryo death");
    expect(activePanel(cutaway.container)).toHaveTextContent("Peptides");
    expect(activePanel(cutaway.container)).toHaveTextContent("amino acids");
    expect(activePanel(cutaway.container)).toHaveTextContent("reducing sugars");
    expect(
      activePanel(cutaway.container).querySelector('[data-peak-cutaway="true"]'),
    ).not.toBeNull();
    cutaway.unmount();

    const closing = renderStage({ scene: 5, beat: 0 });
    expect(activePanel(closing.container)).toHaveTextContent("Maillard");
    expect(activePanel(closing.container)).toHaveTextContent("not fermentation alone");
    closing.unmount();
  });

  it("renders the exact four-edge score through SpatialSceneTrack", async () => {
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
        <CocoaFermentation {...baseProps} />
      </div>,
    );
    const expected = ["paper-fold", "push-y", "ink-spread", "paper-fold"];
    for (let scene = 2; scene <= 5; scene += 1) {
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <CocoaFermentation {...baseProps} scene={scene} />
        </div>,
      );
      await waitFor(() => {
        expect(
          view.container.querySelector('[data-spatial-scene-track="true"]'),
        ).toHaveAttribute("data-scene-transition-kind", expected[scene - 2]);
      });
    }
  });

  it("uses a five-cell cocoa sample tray that reflows on hover, focus, and click", () => {
    const stageClick = vi.fn();
    const onNavigate = vi.fn();
    const view = render(
      <div
        onClick={stageClick}
        style={{ width: 1920, height: 1080, containerType: "size" }}
      >
        <CocoaFermentation
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
    expect(nav).toHaveAttribute("data-navigation-geometry", "object-controller");
    expect(nav).toHaveAttribute("data-navigation-carrier", "cocoa-sample-tray");
    expect(nav).toHaveAttribute("data-navigation-invocation", "auto-hide");
    expect(nav).toHaveAttribute("data-navigation-feedback", "geometry-reflow");
    expect(nav).toHaveAttribute("data-expanded", "false");
    expect(nav!.querySelectorAll("[data-sample-scene]")).toHaveLength(5);

    fireEvent.mouseEnter(nav!);
    expect(nav).toHaveAttribute("data-expanded", "true");
    fireEvent.mouseLeave(nav!);
    expect(nav).toHaveAttribute("data-expanded", "false");

    const toggle = within(nav!).getByRole("button", { name: /expand cocoa sample tray/i });
    fireEvent.click(toggle);
    expect(nav).toHaveAttribute("data-expanded", "true");
    expect(onNavigate).not.toHaveBeenCalled();

    const target = within(nav!).getByRole("button", { name: /sample 4/i });
    fireEvent.pointerDown(target);
    fireEvent.click(target);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);
    expect(stageClick).not.toHaveBeenCalled();

    fireEvent.focus(target);
    expect(nav).toHaveAttribute("data-expanded", "true");
    fireEvent.keyDown(target, { key: "ArrowRight" });
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
    fireEvent.keyDown(target, { key: "Home" });
    expect(onNavigate).toHaveBeenCalledWith(1, 0);
    fireEvent.keyDown(target, { key: "Escape" });
    expect(nav).toHaveAttribute("data-expanded", "false");
  });

  it("hides interaction in thumbnails and settles reduced, frozen-equivalent frames", () => {
    for (const props of [
      { isThumbnail: true, reducedMotion: false },
      { isThumbnail: false, reducedMotion: true },
    ]) {
      const view = renderStage({
        scene: 4,
        beat: 3,
        ...props,
        onNavigate: undefined,
      });
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      expect(view.container.querySelector('[data-transition-clone="true"]')).toBeNull();
      if (props.isThumbnail) {
        expect(view.container.querySelector('[data-topic-navigation="true"]')).toBeNull();
      }
      expect(activePanel(view.container)).toHaveTextContent("Precursors emerge");
      view.unmount();
    }
  });

  it("keeps the component lifecycle finite and free of remote visual assets", () => {
    const forbiddenUnit = /(?:^|[^a-z-])\d*\.?\d+(?:px|vw|vh|rem|em)\b/i;
    expect(componentSource).toContain("<SpatialSceneTrack");
    expect(componentSource).not.toMatch(
      /outgoingScene|isTransitionClone|data-transition-clone|setInterval|requestAnimationFrame/,
    );
    expect(componentSource).not.toMatch(
      /animation[^;{]*infinite|animation-iteration-count\s*:\s*infinite/i,
    );
    expect(componentSource).not.toMatch(/<(?:img|video|audio)\b/i);
    expect(componentSource).not.toMatch(forbiddenUnit);
  });

  it("keeps every final bilingual frame clipped to the fixed stage", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        const view = renderStage({
          language,
          scene,
          beat: BEAT_COUNTS[scene - 1] - 1,
          reducedMotion: true,
        });
        expect(view.stage.scrollWidth).toBeLessThanOrEqual(view.stage.clientWidth + 1);
        expect(view.stage.scrollHeight).toBeLessThanOrEqual(view.stage.clientHeight + 1);
        view.unmount();
      }
    }
  });
});
