import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./comeback-issue";

runTopicContract(topic);

describe("The Comeback Issue protocol", () => {
  it("retains its identity, spine navigation, transition score, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "comeback-issue",
      styleId: "magazine-masthead",
      title: { en: "The Comeback Issue", zh: "回归特刊" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "typographic-index",
        carrier: "comeback-issue-spine",
        invocation: "proximity-reveal",
        feedback: "history-trail",
      },
      transitionScore: {
        "1->2": "page-flip",
        "2->3": "scale-fade",
        "3->4": "page-flip",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps its bilingual issue pages on the 1/2/3/2/1 beat curve", () => {
    expect(topic.metadata.en.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 3, 2, 1,
    ]);
    expect(topic.metadata.zh.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 3, 2, 1,
    ]);
  });
});
