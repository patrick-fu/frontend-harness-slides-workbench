import { expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./close-the-quarter";

runTopicContract(topic);

it("keeps the completeness meter, close transitions, and illustrative boundary", () => {
  expect(topic.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "quarter-close-meter",
    invocation: "gesture-hold",
    feedback: "active-glow",
  });
  expect(topic.transitionScore).toEqual({
    "1->2": "slide-y",
    "2->3": "slide-y",
    "3->4": "fade",
    "4->5": "hard-cut",
  });
  expect(topic.evidence.kind).toBe("illustrative");
});
