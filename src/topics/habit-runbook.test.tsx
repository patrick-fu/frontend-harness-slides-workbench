import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./habit-runbook";

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

describe("Habit Runbook protocol", () => {
  it("retains the authored identity, navigation, and transition score", () => {
    expect(topic).toMatchObject({
      id: "habit-runbook",
      styleId: "operating-manual",
      title: { en: "Habit Runbook", zh: "习惯手册" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "typographic-index",
        carrier: "habit-runbook-index",
        invocation: "persistent",
        feedback: "typographic-emphasis",
      },
      transitionScore: {
        "1->2": "hard-cut",
        "2->3": "slide-y",
        "3->4": "glitch",
        "4->5": "hard-cut",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps the bilingual 3-4-3-4-2 beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        3, 4, 3, 4, 2,
      ]);
    }
  });

  it("renders the persistent runbook index and hides it in thumbnails", () => {
    const view = renderStage({ scene: 2 });
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(navigation).toHaveAttribute("data-navigation-carrier", "habit-runbook-index");
    const buttons = within(navigation!).getAllByRole("button");
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons[3]);
    expect(view.props.onNavigate).toHaveBeenCalledWith(4, 0);
    view.unmount();

    const thumbnail = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
  });

  it("settles final frames with reduced motion", () => {
    const view = renderStage({ scene: 5, beat: 1, reducedMotion: true });
    expect(
      view.container.querySelector('[data-spatial-scene-strip="true"]'),
    ).toHaveAttribute("data-reduced-motion", "true");
    expect(view.getByTestId("stage").textContent).toContain("Habit state: installed");
  });
});
