import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import makeSomethingWeekly from "./make-something-weekly";

runTopicContract(makeSomethingWeekly);

function renderStage(overrides: Partial<TopicStageProps> = {}) {
  const onNavigate = overrides.onNavigate ?? vi.fn();
  const props: TopicStageProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    ...overrides,
    onNavigate,
  };
  const view = render(
    <div style={{ width: 1920, height: 1080, containerType: "size", overflow: "hidden", position: "relative" }}>
      <makeSomethingWeekly.Stage {...props} />
    </div>,
  );
  return { ...view, onNavigate };
}

describe("Make Something Weekly — protocol", () => {
  it("declares its preserved provenance, navigation, transition curve, and evidence", () => {
    expect(makeSomethingWeekly.id).toBe("make-something-weekly");
    expect(makeSomethingWeekly.styleId).toBe("riso-print-zine");
    expect(makeSomethingWeekly.title).toEqual({ en: "Make Something Weekly", zh: "每周做点" });
    expect(makeSomethingWeekly.modelId).toBe("Claude Opus 4.8");
    expect(makeSomethingWeekly.navigation).toEqual({
      geometry: "typographic-index",
      carrier: "weekly-ink-seal",
      invocation: "proximity-reveal",
      feedback: "typographic-emphasis",
    });
    expect(makeSomethingWeekly.transitionScore).toEqual({
      "1->2": "page-flip",
      "2->3": "hard-cut",
      "3->4": "page-flip",
      "4->5": "hard-cut",
    });
    expect(makeSomethingWeekly.evidence).toMatchObject({
      kind: "illustrative",
      display: "envelope",
    });
  });

  it("uses its page seal for an absolute next-scene request and hides it in thumbnails", () => {
    const view = renderStage({ scene: 3 });
    const seal = view.container.querySelector<HTMLButtonElement>(
      '[data-topic-navigation="true"]',
    );
    expect(seal).toHaveAttribute("data-navigation-carrier", "weekly-ink-seal");
    fireEvent.click(seal!);
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    view.unmount();

    const thumbnail = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
  });
});
