import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./onboarding-toolkit";

runTopicContract(topic);

describe("Onboarding Toolkit protocol", () => {
  it("retains its authored identity, navigation, and transitions", () => {
    expect(topic.title).toEqual({ en: "The Onboarding Toolkit", zh: "入职工具包" });
    expect(topic.modelId).toBe("Claude Opus 4.8");
    expect(topic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "onboarding-kit-slots",
      invocation: "gesture-hold",
      feedback: "next-state-preview",
    });
    expect(topic.transitionScore).toEqual({
      "1->2": "page-flip",
      "2->3": "scale-fade",
      "3->4": "fade",
      "4->5": "scale-fade",
    });
  });
});
