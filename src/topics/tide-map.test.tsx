import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./tide-map";

runTopicContract(topic);

describe("Tide Map protocol", () => {
  it("retains the authored identity, seal navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "tide-map",
      styleId: "woodblock-floating-world",
      title: { en: "Tide Map", zh: "潮汐地图" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "typographic-index",
        carrier: "tide-map-seal-index",
        invocation: "persistent",
        feedback: "material-color-change",
      },
      transitionScore: {
        "1->2": "wipe",
        "2->3": "slide-x",
        "3->4": "fade",
        "4->5": "hard-cut",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps its bilingual three-three-three-three-two beat curve", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        3, 3, 3, 3, 2,
      ]);
    }
  });
});
