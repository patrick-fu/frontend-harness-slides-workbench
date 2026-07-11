import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./anatomy-of-an-idea";

runTopicContract(topic);

describe("Anatomy of an Idea protocol", () => {
  it("retains the authored identity, plate spine, and scene score", () => {
    expect(topic).toMatchObject({
      id: "anatomy-of-an-idea",
      styleId: "botanical-specimen-plate",
      title: { en: "Anatomy of an Idea", zh: "想法解剖" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "typographic-index",
        carrier: "idea-plate-numerals",
        invocation: "click-expand",
        feedback: "next-state-preview",
      },
      transitionScore: {
        "1->2": "page-flip",
        "2->3": "fade",
        "3->4": "fade",
        "4->5": "page-flip",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps the bilingual one-three-two-three-one beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        1, 3, 2, 3, 1,
      ]);
    }
  });
});
