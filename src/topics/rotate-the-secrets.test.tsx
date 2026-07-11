import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./rotate-the-secrets";

runTopicContract(topic);

const BASE_PROPS: TopicStageProps = {
  scene: 1,
  beat: 0,
  language: "en",
  isThumbnail: false,
  reducedMotion: false,
  onNavigate: vi.fn(),
};

function renderStage(overrides: Partial<TopicStageProps> = {}) {
  const props = { ...BASE_PROPS, onNavigate: vi.fn(), ...overrides };
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

describe("Rotate the Secrets protocol", () => {
  it("retains the authored identity, command navigation, and score", () => {
    expect(topic).toMatchObject({
      id: "rotate-the-secrets",
      styleId: "operating-manual",
      title: { en: "Rotate the Secrets", zh: "轮换密钥" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "typographic-index",
        carrier: "rotation-command-status",
        invocation: "drag-scrub",
        feedback: "typographic-emphasis",
      },
      transitionScore: {
        "1->2": "hard-cut",
        "2->3": "slide-y",
        "3->4": "slide-y",
        "4->5": "hard-cut",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps the bilingual 1-2-3-2-1 beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        1, 2, 3, 2, 1,
      ]);
    }
  });

  it("uses the command status bar for absolute scene navigation", () => {
    const view = renderStage({ scene: 2 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(navigation).toHaveAttribute(
      "data-navigation-carrier",
      "rotation-command-status",
    );
    const buttons = within(navigation!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[4]);
    expect(view.props.onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("keeps the authored transition map and deterministic thumbnails", () => {
    const view = renderStage({ scene: 1 });
    const renderFrame = (scene: number) =>
      view.rerender(
        <div
          data-testid="stage"
          style={{ width: 1920, height: 1080, containerType: "size" }}
        >
          <topic.Stage {...view.props} scene={scene} />
        </div>,
      );

    renderFrame(2);
    expect(
      view.container.querySelector('[data-spatial-scene-track="true"]'),
    ).toHaveAttribute("data-scene-transition-kind", "hard-cut");
    renderFrame(3);
    expect(
      view.container.querySelector('[data-spatial-scene-track="true"]'),
    ).toHaveAttribute("data-scene-transition-kind", "slide-y");

    view.unmount();
    const thumbnail = renderStage({
      scene: 3,
      beat: 2,
      isThumbnail: true,
      onNavigate: undefined,
    });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
    expect(
      thumbnail.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
  });
});
