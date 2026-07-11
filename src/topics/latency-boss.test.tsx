import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./latency-boss";

runTopicContract(topic);

describe("Latency Boss protocol", () => {
  it("keeps the authored identity, level navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "latency-boss",
      styleId: "arcade-boss-fight",
      title: { en: "Latency Boss", zh: "延迟 Boss" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "edge-scale",
        carrier: "life-pip-level-navigation",
        invocation: "persistent",
        feedback: "history-trail",
      },
      transitionScore: {
        "1->2": "glitch",
        "2->3": "slide-x",
        "3->4": "scale-fade",
        "4->5": "hard-cut",
      },
    });
  });
});
