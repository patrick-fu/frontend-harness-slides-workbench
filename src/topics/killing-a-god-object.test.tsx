import { expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import topic from "./killing-a-god-object";

runTopicContract(topic);

it("keeps the diff toggle, scored refactor transitions, and illustrative boundary", () => {
  expect(topic.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "god-object-diff-toggle",
    invocation: "keyboard-focus",
    feedback: "typographic-emphasis",
  });
  expect(topic.transitionScore).toEqual({
    "1->2": "slide-y",
    "2->3": "slide-y",
    "3->4": "wipe",
    "4->5": "slide-y",
  });
  expect(topic.evidence.kind).toBe("illustrative");
});
