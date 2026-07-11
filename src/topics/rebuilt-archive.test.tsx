import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import rebuiltArchive from "./rebuilt-archive";

runTopicContract(rebuiltArchive);

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
      <rebuiltArchive.Stage {...props} />
    </div>,
  );
  return { ...view, onNavigate };
}

describe("Rebuilt Archive — protocol", () => {
  it("declares its identity, spatial scrap navigation, transition curve, and evidence boundary", () => {
    expect(rebuiltArchive.id).toBe("rebuilt-archive");
    expect(rebuiltArchive.styleId).toBe("analog-cutout-collage");
    expect(rebuiltArchive.title).toEqual({ en: "Rebuilt Archive", zh: "重组档案" });
    expect(rebuiltArchive.modelId).toBe("GPT 5.5");
    expect(rebuiltArchive.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "archive-scrap-wheel",
      invocation: "persistent",
      feedback: "geometry-reflow",
    });
    expect(rebuiltArchive.transitionScore).toEqual({
      "1->2": "scale-fade",
      "2->3": "slide-x",
      "3->4": "wipe",
      "4->5": "fade",
    });
    expect(rebuiltArchive.evidence).toMatchObject({
      kind: "illustrative",
      display: "envelope",
    });
  });

  it("keeps the scrap wheel local to the Stage and disables it for thumbnails", () => {
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
