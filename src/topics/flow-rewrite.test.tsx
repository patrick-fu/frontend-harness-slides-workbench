import { expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./flow-rewrite";

runTopicContract(topic);

it("keeps the hunk navigator, four scored edges, and illustrative boundary", () => {
  expect(topic.navigation).toEqual({
    geometry: "typographic-index",
    carrier: "flow-rewrite-hunk-navigator",
    invocation: "persistent",
    feedback: "typographic-emphasis",
  });
  expect(topic.transitionScore).toEqual({
    "1->2": "slide-x",
    "2->3": "wipe",
    "3->4": "scale-fade",
    "4->5": "hard-cut",
  });
  expect(topic.evidence.kind).toBe("illustrative");
});
