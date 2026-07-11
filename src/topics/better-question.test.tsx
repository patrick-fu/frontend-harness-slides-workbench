import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./better-question";

runTopicContract(topic);

describe("Better Question protocol", () => {
  it("keeps the cue rail, transition score, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "better-question",
      styleId: "interactive-dialogue-stage",
      title: { en: "Better Question", zh: "更好问题" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "path",
        carrier: "spotlight-cue-rail",
        invocation: "persistent",
        feedback: "active-glow",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "glitch",
        "3->4": "slide-x",
        "4->5": "scale-fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });
});
