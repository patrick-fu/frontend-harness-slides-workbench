import { expect, it } from "vitest";
import humanReviewsAi from "./human-reviews-ai";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(humanReviewsAi);

it("keeps the review-seam navigation and illustrative review boundary", () => {
  expect(humanReviewsAi.navigation).toEqual({
    geometry: "edge-scale",
    carrier: "review-seam-tabs",
    invocation: "auto-hide",
    feedback: "geometry-reflow",
  });
  expect(humanReviewsAi.transitionScore).toEqual({
    "1->2": "slide-x",
    "2->3": "slide-x",
    "3->4": "fade",
    "4->5": "scale-fade",
  });
  expect(humanReviewsAi.evidence.kind).toBe("illustrative");
});
