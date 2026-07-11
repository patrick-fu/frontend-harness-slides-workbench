import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./priority-score";

runTopicContract(topic);

describe("Priority Score protocol", () => {
  it("keeps its authored identity, lane-light navigation, scene edges, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "priority-score",
      styleId: "mechanical-scoring-funnel",
      title: { en: "Priority Score", zh: "优先评分" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "object-controller",
        carrier: "pinball-lane-lights",
        invocation: "persistent",
        feedback: "material-color-change",
      },
      transitionScore: {
        "1->2": "slide-y",
        "2->3": "wipe",
        "3->4": "glitch",
        "4->5": "hard-cut",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps bilingual scene and beat identifiers aligned", () => {
    expect(topic.metadata.en.scenes.map((scene) => scene.beats.length)).toEqual(
      topic.metadata.zh.scenes.map((scene) => scene.beats.length),
    );
  });
});
