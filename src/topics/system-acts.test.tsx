import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./system-acts";

runTopicContract(topic);

function renderStage(overrides: Partial<TopicStageProps> = {}) {
  const props: TopicStageProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    onNavigate: vi.fn(),
    ...overrides,
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
      <topic.Stage {...props} />
    </div>,
  );
  return { ...result, props };
}

describe("System Acts protocol", () => {
  it("retains the authored identity, letterbox cues, and transition score", () => {
    expect(topic).toMatchObject({
      id: "system-acts",
      styleId: "widescreen-title-card",
      title: { en: "System Acts", zh: "系统五幕" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "typographic-index",
        carrier: "letterbox-cue-marks",
        invocation: "persistent",
        feedback: "typographic-emphasis",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "slide-x",
        "3->4": "scale-fade",
        "4->5": "hard-cut",
      },
      evidence: { kind: "illustrative", display: "stage" },
    });
  });

  it("keeps all five scenes on their authored three-beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        3, 3, 3, 3, 3,
      ]);
    }
  });

  it("uses five persistent letterbox cues and hides them in thumbnails", () => {
    const view = renderStage({ scene: 3 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(navigation).toHaveAttribute("data-navigation-carrier", "letterbox-cue-marks");
    const buttons = within(navigation!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[4]);
    expect(view.props.onNavigate).toHaveBeenCalledWith(5, 0);
    view.unmount();

    const thumbnail = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
  });

  it("renders the authored transition edges", () => {
    const view = renderStage({ scene: 1 });
    const renderFrame = (scene: number) =>
      view.rerender(
        <div style={{ width: 1920, height: 1080, containerType: "size" }}>
          <topic.Stage {...view.props} scene={scene} />
        </div>,
      );

    renderFrame(2);
    expect(view.container.querySelector('[data-spatial-scene-track="true"]')).toHaveAttribute(
      "data-scene-transition-kind",
      "fade",
    );
    renderFrame(3);
    expect(view.container.querySelector('[data-spatial-scene-track="true"]')).toHaveAttribute(
      "data-scene-transition-kind",
      "slide-x",
    );
  });
});
