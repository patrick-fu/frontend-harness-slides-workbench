import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./repair-strategy";

runTopicContract(topic);

describe("Repair Strategy protocol", () => {
  it("keeps the authored navigation, transition, and evidence boundary", () => {
    expect(topic).toMatchObject({
      id: "repair-strategy",
      styleId: "wabi-sabi-ceramic",
      title: { en: "Repair Strategy", zh: "修复策略" },
      modelId: "GPT 5.5",
      navigation: {
        geometry: "spatial-node",
        carrier: "clay-chip-ring",
        invocation: "persistent",
        feedback: "material-color-change",
      },
      transitionScore: {
        "1->2": "fade",
        "2->3": "scale-fade",
        "3->4": "wipe",
        "4->5": "fade",
      },
      evidence: { kind: "illustrative", display: "envelope" },
    });
  });
});
