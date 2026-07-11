import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./deriving-big-o";

runTopicContract(topic);

describe("Deriving Big-O protocol", () => {
  it("keeps the authored identity, step navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "deriving-big-o",
      styleId: "blackboard-chalk-talk",
      title: { en: "Deriving Big-O", zh: "推导复杂度" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "typographic-index",
        carrier: "chalk-step-line",
        invocation: "keyboard-focus",
        feedback: "active-glow",
      },
      transitionScore: {
        "1->2": "wipe",
        "2->3": "wipe",
        "3->4": "wipe",
        "4->5": "fade",
      },
    });
  });
});
