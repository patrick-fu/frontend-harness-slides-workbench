import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./refactor-the-system";

runTopicContract(topic);

describe("Refactor the System protocol", () => {
  it("keeps its authored identity, progress-wedge navigation, authored edges, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "refactor-the-system",
      styleId: "red-wedge-agitprop",
      title: { en: "Refactor the System", zh: "重构体制" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "path",
        carrier: "refactor-progress-wedge",
        invocation: "drag-scrub",
        feedback: "active-glow",
      },
      transitionScore: {
        "1->2": "glitch",
        "2->3": "hard-cut",
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
