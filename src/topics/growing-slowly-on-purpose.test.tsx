import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./growing-slowly-on-purpose";

runTopicContract(topic);

describe("Growing Slowly on Purpose protocol", () => {
  it("keeps its authored identity, rust-mark navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "growing-slowly-on-purpose",
      styleId: "mid-century-grove",
      title: { en: "Growing Slowly on Purpose", zh: "慢成长" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "ambient",
        carrier: "grove-rust-mark",
        invocation: "drag-scrub",
        feedback: "geometry-reflow",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "slide-y",
        "3->4": "slide-y",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps its bilingual one-three-two-two-one beat curve aligned", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        1, 3, 2, 2, 1,
      ]);
    }
  });
});
