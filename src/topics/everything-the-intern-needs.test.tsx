import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./everything-the-intern-needs";

runTopicContract(topic);

describe("Everything the Intern Needs protocol", () => {
  it("retains its authored identity, navigation, and transitions", () => {
    expect(topic.title).toEqual({ en: "Everything the Intern Needs", zh: "新人须知" });
    expect(topic.modelId).toBe("Claude Opus 4.8");
    expect(topic.navigation).toEqual({
      geometry: "object-controller",
      carrier: "intern-bento-selector",
      invocation: "gesture-hold",
      feedback: "history-trail",
    });
    expect(topic.transitionScore).toEqual({
      "1->2": "scale-fade",
      "2->3": "scale-fade",
      "3->4": "fade",
      "4->5": "scale-fade",
    });
  });
});
