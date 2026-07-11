import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./shortcut";

runTopicContract(topic);

describe("Shortcut protocol", () => {
  it("keeps the authored identity, navigation, and transition score", () => {
    expect(topic).toMatchObject({
      id: "shortcut",
      styleId: "blackboard-chalk-talk",
      title: { en: "Shortcut", zh: "快捷路径" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "typographic-index",
        carrier: "chalk-tick-navigation",
        invocation: "persistent",
        feedback: "active-glow",
      },
      transitionScore: {
        "1->2": "wipe",
        "2->3": "slide-y",
        "3->4": "fade",
        "4->5": "hard-cut",
      },
    });
  });
});
