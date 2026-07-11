import { expect, it } from "vitest";
import cleanBrief from "./clean-brief";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(cleanBrief);

it("keeps the recipe-magnet navigation and illustrative briefing boundary", () => {
  expect(cleanBrief.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "clean-brief-recipe-magnets",
    invocation: "persistent",
    feedback: "material-color-change",
  });
  expect(cleanBrief.transitionScore).toEqual({
    "1->2": "slide-y",
    "2->3": "wipe",
    "3->4": "scale-fade",
    "4->5": "fade",
  });
  expect(cleanBrief.evidence.kind).toBe("illustrative");
});
