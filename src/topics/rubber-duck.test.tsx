import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./rubber-duck";

runTopicContract(topic);

describe("Rubber Duck protocol", () => {
  it("keeps the turn stepper, transition score, and illustrative boundary", () => {
    expect(topic).toMatchObject({
      id: "rubber-duck",
      styleId: "interactive-dialogue-stage",
      title: { en: "The Rubber Duck", zh: "橡皮鸭" },
      modelId: "Claude Opus 4.8",
      navigation: {
        geometry: "spatial-node",
        carrier: "duck-turn-stepper",
        invocation: "persistent",
        feedback: "next-state-preview",
      },
      transitionScore: {
        "1->2": "slide-y",
        "2->3": "slide-y",
        "3->4": "fade",
        "4->5": "scale-fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });
});
