import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./recovery-kit";

runTopicContract(topic);

describe("Recovery Kit protocol", () => {
  it("retains its authored identity, navigation, and transitions", () => {
    expect(topic.title).toEqual({ en: "Recovery Kit", zh: "恢复工具包" });
    expect(topic.modelId).toBe("GPT 5.5");
    expect(topic.navigation).toEqual({
      geometry: "spatial-node",
      carrier: "recovery-kit-orbit",
      invocation: "persistent",
      feedback: "material-color-change",
    });
    expect(topic.transitionScore).toEqual({
      "1->2": "scale-fade",
      "2->3": "slide-y",
      "3->4": "wipe",
      "4->5": "hard-cut",
    });
  });
});
