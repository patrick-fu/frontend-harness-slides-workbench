import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./growth-signals";

runTopicContract(topic);

describe("Growth Signals protocol", () => {
  it("retains the authored identity, pressed-leaf navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "growth-signals",
      styleId: "botanical-specimen-plate",
      title: { en: "Growth Signals", zh: "增长信号" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "edge-scale",
        carrier: "growth-signals-pressed-leaf-index",
        invocation: "persistent",
        feedback: "material-color-change",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "wipe",
        "3->4": "scale-fade",
        "4->5": "page-flip",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps three beats in every bilingual scene", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        3, 3, 3, 3, 3,
      ]);
    }
  });
});
