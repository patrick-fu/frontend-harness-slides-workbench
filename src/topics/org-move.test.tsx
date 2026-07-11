import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./org-move";

runTopicContract(topic);

describe("Org Move protocol", () => {
  it("keeps its authored identity, path navigation, scene edges, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "org-move",
      styleId: "red-wedge-agitprop",
      title: { en: "Org Move", zh: "组织移动" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "path",
        carrier: "org-wedge-rail",
        invocation: "persistent",
        feedback: "active-glow",
      },
      transitionScore: {
        "1->2": "slide-x",
        "2->3": "glitch",
        "3->4": "scale-fade",
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
