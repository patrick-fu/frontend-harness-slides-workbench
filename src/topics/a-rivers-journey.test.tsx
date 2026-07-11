import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./a-rivers-journey";

runTopicContract(topic);

describe("A River's Journey protocol", () => {
  it("retains the authored identity, boat path, and scene score", () => {
    expect(topic).toMatchObject({
      id: "a-rivers-journey",
      styleId: "woodblock-floating-world",
      title: { en: "A River's Journey", zh: "一条河" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "path",
        carrier: "river-horizon-boat",
        invocation: "click-expand",
        feedback: "history-trail",
      },
      transitionScore: {
        "1->2": "slide-x",
        "2->3": "slide-x",
        "3->4": "slide-x",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps the bilingual one-three-three-three-one beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        1, 3, 3, 3, 1,
      ]);
    }
  });
});
