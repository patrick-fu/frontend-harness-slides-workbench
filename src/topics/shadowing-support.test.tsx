import { expect, it } from "vitest";
import shadowingSupport from "./shadowing-support";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(shadowingSupport);

it("keeps the notebook-folio navigation and observed-workflow transitions", () => {
  expect(shadowingSupport.navigation).toEqual({
    geometry: "typographic-index",
    carrier: "support-notebook-folio",
    invocation: "keyboard-focus",
    feedback: "material-color-change",
  });
  expect(shadowingSupport.transitionScore).toEqual({
    "1->2": "page-flip",
    "2->3": "slide-y",
    "3->4": "slide-y",
    "4->5": "page-flip",
  });
  expect(shadowingSupport.evidence).toMatchObject({
    kind: "illustrative",
    display: "envelope",
  });
});
