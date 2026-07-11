import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./cocoon-to-cloth";

runTopicContract(topic);

const BEAT_COUNTS = [2, 2, 3, 4, 2] as const;

function renderStage(props: Partial<TopicStageProps> = {}) {
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
      <topic.Stage
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

  return { ...view, onNavigate };
}

describe("Cocoon to Cloth topic", () => {
  it("renders every English and Chinese scene beat", () => {
    for (const language of ["en", "zh"] as const) {
      for (let scene = 1; scene <= 5; scene += 1) {
        for (let beat = 0; beat < BEAT_COUNTS[scene - 1]; beat += 1) {
          const { container, unmount } = renderStage({
            language,
            scene,
            beat,
          });
          expect(
            container.querySelector(
              `[data-cocoon-scene="${scene}"][data-active="true"]`,
            ),
          ).not.toBeNull();
          unmount();
        }
      }
    }
  });

  it("publishes the exact transition score and reserved beat layouts", () => {
    const { container } = renderStage({ scene: 4, beat: 3 });
    expect(topic.transitionScore).toEqual({
      "1->2": "iris-open",
      "2->3": "split-merge",
      "3->4": "zoom-through",
      "4->5": "iris-open",
    });
    expect(
      container.querySelector(
        '[data-spatial-scene-panel="true"][data-active="true"]',
      ),
    ).toHaveAttribute("data-beat-layout-mode", "reserved");
  });

  it("uses a clickable spindle navigator with hold-only preview enhancement", () => {
    const { container, onNavigate } = renderStage({ scene: 2 });
    const nav = container.querySelector('[data-topic-navigation="true"]');
    expect(nav).toHaveAttribute("data-navigation-geometry", "object-controller");
    expect(nav).toHaveAttribute("data-navigation-carrier", "silk-spindle");
    expect(nav).toHaveAttribute("data-navigation-invocation", "gesture-hold");
    expect(nav).toHaveAttribute("data-navigation-feedback", "next-state-preview");

    const buttons = screen.getAllByRole("button", { name: /scene|场景/i });
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[3]);
    expect(onNavigate).toHaveBeenCalledWith(4, 0);

    fireEvent.pointerDown(buttons[4]);
    expect(container.querySelector('[data-spindle-preview="5"]')).not.toBeNull();
    fireEvent.pointerUp(buttons[4]);
    expect(container.querySelector('[data-spindle-preview="5"]')).toBeNull();
  });

  it("hides navigation in thumbnails and freezes the track", () => {
    const { container } = renderStage({
      isThumbnail: true,
      reducedMotion: false,
      onNavigate: undefined,
    });
    expect(container.querySelector('[data-topic-navigation="true"]')).toBeNull();
    expect(container.querySelector('[data-spatial-scene-strip="true"]')).toHaveAttribute(
      "data-reduced-motion",
      "true",
    );
  });

  it("keeps bilingual metadata structurally aligned and claim sources traceable", () => {
    const en = topic.metadata.en;
    const zh = topic.metadata.zh;
    expect(topic.styleId).toBe("object-metaphor-hero");
    expect(en.scenes).toHaveLength(5);
    expect(en.scenes.map((scene) => scene.beats.length)).toEqual(BEAT_COUNTS);
    expect(zh.scenes.map((scene) => scene.beats.length)).toEqual(BEAT_COUNTS);
    expect(en.scenes.map((scene) => scene.id)).toEqual(
      zh.scenes.map((scene) => scene.id),
    );

    expect(topic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "silk-spindle",
      invocation: "gesture-hold",
      feedback: "next-state-preview",
    });
    expect(topic.evidence.kind).toBe("facts");
    if (topic.evidence.kind !== "facts") {
      throw new Error("Cocoon to Cloth must retain factual Evidence.");
    }
    expect(topic.evidence.sources.length).toBeGreaterThanOrEqual(3);
    expect(
      topic.evidence.sources.every(
        (source) => source.url.startsWith("https://") && source.supports.length > 0,
      ),
    ).toBe(true);
  });
});
