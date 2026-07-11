import { expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./launch-ledger";

runTopicContract(topic);

it("keeps the launch rail, ledger transition score, and illustrative boundary", () => {
  expect(topic.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "launch-ledger-rail",
    invocation: "persistent",
    feedback: "active-glow",
  });
  expect(topic.transitionScore).toEqual({
    "1->2": "fade",
    "2->3": "slide-y",
    "3->4": "wipe",
    "4->5": "hard-cut",
  });
  expect(topic.evidence.kind).toBe("illustrative");
});
