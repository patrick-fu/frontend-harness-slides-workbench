import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./beta-salon";

runTopicContract(topic);

describe("Beta Salon protocol", () => {
  it("keeps its authored identity, coaster navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "beta-salon",
      styleId: "after-hours-luxe",
      title: { en: "Beta Salon", zh: "内测沙龙" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "card-miniature",
        carrier: "beta-salon-coaster-picker",
        invocation: "persistent",
        feedback: "material-color-change",
      },
      transitionScore: {
        "1->2": "scale-fade",
        "2->3": "wipe",
        "3->4": "fade",
        "4->5": "hard-cut",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps bilingual metadata aligned by scene and beat IDs", () => {
    for (const language of ["en", "zh"] as const) {
      expect(topic.metadata[language].scenes).toHaveLength(5);
    }
    expect(
      topic.metadata.en.scenes.map((scene) => scene.beats.map((beat) => beat.id)),
    ).toEqual(topic.metadata.zh.scenes.map((scene) => scene.beats.map((beat) => beat.id)));
  });
});
