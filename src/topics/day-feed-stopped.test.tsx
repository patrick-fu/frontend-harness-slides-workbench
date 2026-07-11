import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./day-feed-stopped";

runTopicContract(topic);

describe("The Day the Feed Stopped protocol", () => {
  it("retains its identity, spine navigation, transition score, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "day-feed-stopped",
      styleId: "front-page-broadsheet",
      title: { en: "The Day the Feed Stopped", zh: "信息流停摆" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "typographic-index",
        carrier: "feed-page-spine",
        invocation: "proximity-reveal",
        feedback: "active-glow",
      },
      transitionScore: {
        "1->2": "page-flip",
        "2->3": "slide-y",
        "3->4": "slide-y",
        "4->5": "page-flip",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });

  it("keeps its bilingual news pages on the 1/2/3/2/1 beat curve", () => {
    expect(topic.metadata.en.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 3, 2, 1,
    ]);
    expect(topic.metadata.zh.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 2, 3, 2, 1,
    ]);
  });
});
