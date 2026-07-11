import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./defeating-tech-debt";

runTopicContract(topic);

describe("Defeating Tech Debt protocol", () => {
  it("keeps the authored identity, HUD navigation, and scene score", () => {
    expect(topic).toMatchObject({
      id: "defeating-tech-debt",
      styleId: "arcade-boss-fight",
      title: { en: "Defeating Tech Debt", zh: "打败技术债" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "edge-scale",
        carrier: "arcade-stage-hud",
        invocation: "keyboard-focus",
        feedback: "history-trail",
      },
      transitionScore: {
        "1->2": "glitch",
        "2->3": "hard-cut",
        "3->4": "glitch",
        "4->5": "hard-cut",
      },
    });
  });
});
