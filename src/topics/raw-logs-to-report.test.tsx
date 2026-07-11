import { expect, it } from "vitest";
import rawLogsToReport from "./raw-logs-to-report";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(rawLogsToReport);

it("keeps the recipe rail and illustrative report boundary", () => {
  expect(rawLogsToReport.navigation).toEqual({
    geometry: "path",
    carrier: "report-recipe-rail",
    invocation: "auto-hide",
    feedback: "mechanical-displacement",
  });
  expect(rawLogsToReport.transitionScore).toEqual({
    "1->2": "wipe",
    "2->3": "wipe",
    "3->4": "slide-x",
    "4->5": "scale-fade",
  });
  expect(rawLogsToReport.evidence.kind).toBe("illustrative");
});
