import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./calm-growth";

runTopicContract(topic);

describe("Calm Growth protocol", () => {
  it("keeps its authored identity, bead navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "calm-growth",
      styleId: "mid-century-grove",
      title: { en: "Calm Growth", zh: "冷静增长" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "object-controller",
        carrier: "calm-growth-wooden-bead-rail",
        invocation: "persistent",
        feedback: "mechanical-displacement",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "slide-y",
        "3->4": "scale-fade",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps its bilingual five-scene growth curve aligned", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes.map((scene) => scene.beats.length)).toEqual([
        3, 3, 3, 3, 3,
      ]);
    }
  });
});
