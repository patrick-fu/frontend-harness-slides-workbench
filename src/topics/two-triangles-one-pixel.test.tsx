import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./two-triangles-one-pixel";

runTopicContract(definition);

const STAGE_STYLE = {
  width: 1920,
  height: 1080,
  containerType: "size",
  position: "relative",
  overflow: "hidden",
} as const;

describe("two-triangles-one-pixel authored intent", () => {
  it("keeps Claude provenance and canonical identity", () => {
    expect(definition.id).toBe("two-triangles-one-pixel");
    expect(definition.styleId).toBe("engineering-whiteboard-explainer");
    expect(definition.modelId).toBe("Claude Opus 4.8");
    expect(definition.title).toEqual({
      en: "Two Triangles, One Pixel",
      zh: "双三角，争一像素",
    });
  });

  it("holds an aligned bilingual 1-2-3-3-2 five-Scene structure with Scene 4 as hero", () => {
    for (const language of ["en", "zh"] as const) {
      const meta = definition.metadata[language];
      expect(meta.heroScene).toBe(4);
      expect(meta.scenes.map((scene) => scene.id)).toEqual([1, 2, 3, 4, 5]);
      expect(meta.scenes.map((scene) => scene.beats.length)).toEqual([
        1, 2, 3, 3, 2,
      ]);
      for (const scene of meta.scenes) {
        expect(scene.beats.map((beat) => beat.id)).toEqual(
          scene.beats.map((_, index) => index),
        );
        for (const beat of scene.beats) {
          expect(beat.title.trim().length).toBeGreaterThan(0);
          expect(beat.body.trim().length).toBeGreaterThan(0);
        }
      }
    }
    // Total meaningful beats.
    const totalBeats = definition.metadata.en.scenes.reduce(
      (sum, scene) => sum + scene.beats.length,
      0,
    );
    expect(totalBeats).toBe(11);
  });

  it("declares the exact shared-geometry transition score", () => {
    expect(definition.transitionScore).toEqual({
      "1->2": "zoom-through",
      "2->3": "grid-reveal",
      "3->4": "focus-swap",
      "4->5": "split-merge",
    });
  });

  it("declares mixed Evidence with envelope boundary and claim-specific sources", () => {
    const evidence = definition.evidence;
    expect(evidence.kind).toBe("mixed");
    if (evidence.kind !== "mixed") throw new Error("expected mixed Evidence");
    expect(evidence.display).toBe("envelope");
    expect(evidence.sources.map((source) => source.url)).toEqual([
      "https://gpuweb.github.io/gpuweb/",
      "https://gpuweb.github.io/gpuweb/wgsl/",
      "https://docs.vulkan.org/tutorial/latest/03_Drawing_a_triangle/02_Graphics_pipeline_basics/00_Introduction.html",
    ]);
    for (const source of evidence.sources) {
      expect(source.url.startsWith("https://")).toBe(true);
      expect(source.supports.trim().length).toBeGreaterThan(20);
    }
    // The boundary disowns serial hardware execution and fixed performance.
    expect(evidence.boundary.en).toMatch(/API-neutral/i);
    expect(evidence.boundary.en).toMatch(/0\.28/);
    expect(evidence.boundary.en).toMatch(/0\.72/);
    expect(evidence.boundary.en).toMatch(/not a claim/i);
    expect(evidence.boundary.zh).toMatch(/0\.28/);
    expect(evidence.boundary.zh).toMatch(/API/);
    expect(evidence.boundary.zh.trim().length).toBeGreaterThan(10);
  });

  it("declares the spatial-node Pixel Inspector navigation contract", () => {
    expect(definition.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "pixel-inspector-grid",
      invocation: "click-expand",
      feedback: "geometry-reflow",
    });
  });

  it("routes each semantic control to an absolute destination and isolates Stage transport", () => {
    const onNavigate = vi.fn();
    const stageClick = vi.fn();
    const stageKeyDown = vi.fn();
    const view = render(
      <div
        data-testid="transport"
        style={STAGE_STYLE}
        onClick={stageClick}
        onKeyDown={stageKeyDown}
      >
        <definition.Stage
          scene={1}
          beat={0}
          language="en"
          isThumbnail={false}
          reducedMotion={false}
          onNavigate={onNavigate}
        />
      </div>,
    );

    const inspector = view.getByRole("button", {
      name: /inspect the winning pixel/i,
    });
    const vertex = view.getByRole("button", { name: /jump to vertices/i });
    const depth = view.getByRole("button", { name: /jump to depth gate/i });

    fireEvent.click(inspector);
    expect(onNavigate).toHaveBeenNthCalledWith(1, 4, 0);
    // click-expand reveals the two candidates and their depth result.
    expect(inspector).toHaveAttribute("aria-expanded", "true");
    expect(view.getByText(/coral wins/i)).toBeInTheDocument();

    fireEvent.click(vertex);
    expect(onNavigate).toHaveBeenNthCalledWith(2, 2, 0);

    fireEvent.click(depth);
    expect(onNavigate).toHaveBeenNthCalledWith(3, 4, 1);

    // Every control stops events from leaking to Player transport.
    expect(stageClick).not.toHaveBeenCalled();
    fireEvent.keyDown(depth, { key: "ArrowRight" });
    expect(stageKeyDown).not.toHaveBeenCalled();

    view.unmount();
  });

  it("hides internal navigation in thumbnails", () => {
    const view = render(
      <div style={STAGE_STYLE}>
        <definition.Stage
          scene={1}
          beat={0}
          language="en"
          isThumbnail
          reducedMotion={false}
        />
      </div>,
    );
    expect(
      view.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(view.container.querySelector("[data-motion]")).toHaveAttribute(
      "data-motion",
      "off",
    );
    view.unmount();
  });

  it("settles the hero and reduced-motion frames into stable final state", () => {
    const view = render(
      <div style={STAGE_STYLE}>
        <definition.Stage
          scene={4}
          beat={2}
          language="en"
          isThumbnail={false}
          reducedMotion
        />
      </div>,
    );
    const stage = view.container.querySelector<HTMLElement>("[data-motion]");
    expect(stage).not.toBeNull();
    // Reduced motion disables all timers and animation for deterministic capture.
    expect(stage?.dataset.motion).toBe("off");
    // Hero final beat shows the resolved verdict, not a transitional frame.
    const heroPanel = view.container.querySelector<HTMLElement>(
      '[data-testid="spatial-scene-panel"][data-active="true"]',
    );
    expect(heroPanel?.dataset.sceneId).toBe("4");
    expect(view.getAllByText(/overdraw/i).length).toBeGreaterThan(0);
    view.unmount();
  });
});
