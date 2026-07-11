import { expect, it } from "vitest";
import sharedArtifact from "./shared-artifact";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(sharedArtifact);

it("keeps the latch navigation and illustrative artifact boundary", () => {
  expect(sharedArtifact.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "shared-artifact-latch-nav",
    invocation: "persistent",
    feedback: "material-color-change",
  });
  expect(sharedArtifact.transitionScore).toEqual({
    "1->2": "fade",
    "2->3": "slide-x",
    "3->4": "wipe",
    "4->5": "scale-fade",
  });
  expect(sharedArtifact.evidence.kind).toBe("illustrative");
});
