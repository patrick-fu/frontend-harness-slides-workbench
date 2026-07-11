import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import communityPrint from "./community-print";

runTopicContract(communityPrint);

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
    <div
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <communityPrint.Stage {...props} />
    </div>,
  );
  return { ...view, onNavigate };
}

describe("Community Print — protocol", () => {
  it("declares its canonical identity, exact scene score, and illustrative boundary", () => {
    expect(communityPrint.id).toBe("community-print");
    expect(communityPrint.styleId).toBe("riso-print-zine");
    expect(communityPrint.title).toEqual({ en: "Community Print", zh: "社群印刷" });
    expect(communityPrint.modelId).toBe("GPT 5.5");
    expect(communityPrint.navigation).toEqual({
      geometry: "edge-scale",
      carrier: "staple-scene-index",
      invocation: "persistent",
      feedback: "material-color-change",
    });
    expect(communityPrint.transitionScore).toEqual({
      "1->2": "glitch",
      "2->3": "slide-y",
      "3->4": "wipe",
      "4->5": "hard-cut",
    });
    expect(communityPrint.evidence).toMatchObject({
      kind: "illustrative",
      display: "envelope",
    });
  });

  it("keeps the staple index interactive and removes it from thumbnails", () => {
    const view = renderStage();
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    expect(navigation).toHaveAttribute("data-navigation-carrier", "staple-scene-index");
    const buttons = navigation?.querySelectorAll<HTMLButtonElement>("button");
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons![3]);
    expect(view.onNavigate).toHaveBeenCalledWith(4, 0);
    view.unmount();

    const thumbnail = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
  });
});
