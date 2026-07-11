import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import piecingIdeaTogether from "./piecing-idea-together";

runTopicContract(piecingIdeaTogether);

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
      <piecingIdeaTogether.Stage {...props} />
    </div>,
  );
  return { ...view, onNavigate };
}

describe("Piecing the Idea Together — protocol", () => {
  it("declares its canonical provenance, pin-prick navigation, transitions, and evidence", () => {
    expect(piecingIdeaTogether.id).toBe("piecing-idea-together");
    expect(piecingIdeaTogether.styleId).toBe("analog-cutout-collage");
    expect(piecingIdeaTogether.title).toEqual({ en: "Piecing the Idea Together", zh: "拼出想法" });
    expect(piecingIdeaTogether.modelId).toBe("Claude Opus 4.8");
    expect(piecingIdeaTogether.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "collage-pin-pricks",
      invocation: "click-expand",
      feedback: "active-glow",
    });
    expect(piecingIdeaTogether.transitionScore).toEqual({
      "1->2": "slide-x",
      "2->3": "scale-fade",
      "3->4": "slide-x",
      "4->5": "scale-fade",
    });
    expect(piecingIdeaTogether.evidence).toMatchObject({
      kind: "illustrative",
      display: "envelope",
    });
  });

  it("uses absolute pin navigation and removes the pins in thumbnail mode", () => {
    const view = renderStage();
    const navigation = view.container.querySelector<HTMLElement>(
      '[data-topic-navigation="true"]',
    );
    const buttons = navigation?.querySelectorAll<HTMLButtonElement>("button");
    expect(buttons).toHaveLength(5);
    fireEvent.click(buttons![4]);
    expect(view.onNavigate).toHaveBeenCalledWith(5, 0);
    view.unmount();

    const thumbnail = renderStage({ isThumbnail: true, onNavigate: undefined });
    expect(
      thumbnail.container.querySelector('[data-topic-navigation="true"]'),
    ).toBeNull();
  });
});
