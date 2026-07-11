import { expect, it } from "vitest";
import flakyTestRootCause from "./flaky-test-root-cause";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(flakyTestRootCause);

it("keeps the status-bar navigation and root-cause transition score", () => {
  expect(flakyTestRootCause.navigation).toEqual({
    geometry: "typographic-index",
    carrier: "flaky-ticket-status",
    invocation: "keyboard-focus",
    feedback: "geometry-reflow",
  });
  expect(flakyTestRootCause.transitionScore).toEqual({
    "1->2": "hard-cut",
    "2->3": "slide-y",
    "3->4": "slide-x",
    "4->5": "hard-cut",
  });
  expect(flakyTestRootCause.evidence).toMatchObject({
    kind: "illustrative",
    display: "envelope",
  });
});
