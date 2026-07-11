import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TopicStageProps } from "../domain/topic";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./chapter-zero";

runTopicContract(topic);

function renderStage(props: Partial<TopicStageProps> = {}) {
  const stageProps: TopicStageProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    ...props,
  };
  return render(
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
      <topic.Stage {...stageProps} />
    </div>,
  );
}

describe("Chapter Zero protocol", () => {
  it("retains the authored identity, no-navigation mode, and scene score", () => {
    expect(topic).toMatchObject({
      id: "chapter-zero",
      styleId: "widescreen-title-card",
      title: { en: "Chapter Zero", zh: "第零章" },
      modelId: "Claude Opus 4.8",
      navigation: { mode: "none" },
      transitionScore: {
        "1->2": "fade",
        "2->3": "scale-fade",
        "3->4": "fade",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "stage" },
    });
  });

  it("keeps the bilingual 2-1-2-1-1 beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        2, 1, 2, 1, 1,
      ]);
    }
  });

  it("renders the settled bilingual title-card frames without internal navigation", () => {
    for (const [language, text] of [
      ["en", "CHAPTER ZERO"],
      ["zh", "第零章"],
    ] as const) {
      const view = renderStage({
        scene: 2,
        beat: 0,
        language,
        isThumbnail: true,
        reducedMotion: true,
      });
      expect(view.getByTestId("stage")).toHaveTextContent(text);
      expect(
        view.container.querySelector('[data-topic-navigation="true"]'),
      ).toBeNull();
      expect(
        view.container.querySelector('[data-spatial-scene-strip="true"]'),
      ).toHaveAttribute("data-reduced-motion", "true");
      view.unmount();
    }
  });
});
