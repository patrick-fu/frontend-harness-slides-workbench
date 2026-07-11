import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./the-midnight-release";

runTopicContract(topic);

describe("The Midnight Release protocol", () => {
  it("keeps its authored identity, hairline navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "the-midnight-release",
      styleId: "after-hours-luxe",
      title: { en: "The Midnight Release", zh: "午夜上线" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "ambient",
        carrier: "midnight-hairline-index",
        invocation: "drag-scrub",
        feedback: "material-color-change",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "scale-fade",
        "3->4": "fade",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps its bilingual two-two-two-two-one beat curve aligned", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        2, 2, 2, 2, 1,
      ]);
    }
  });
});
