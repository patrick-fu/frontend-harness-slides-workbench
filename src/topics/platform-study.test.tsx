import { expect, it } from "vitest";
import platformStudy from "./platform-study";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(platformStudy);

it("keeps the edge-flag navigation and field-log transition score", () => {
  expect(platformStudy.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "platform-study-edge-flags",
    invocation: "persistent",
    feedback: "mechanical-displacement",
  });
  expect(platformStudy.transitionScore).toEqual({
    "1->2": "fade",
    "2->3": "slide-y",
    "3->4": "scale-fade",
    "4->5": "page-flip",
  });
  expect(platformStudy.evidence).toEqual({ kind: "none" });
});
