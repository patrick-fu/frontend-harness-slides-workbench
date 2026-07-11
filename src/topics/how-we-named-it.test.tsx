import { expect, it } from "vitest";
import howWeNamedIt from "./how-we-named-it";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(howWeNamedIt);

it("keeps the connector-trail navigation and naming-workshop boundary", () => {
  expect(howWeNamedIt.navigation).toEqual({
    geometry: "path",
    carrier: "naming-connector-trail",
    invocation: "persistent",
    feedback: "geometry-reflow",
  });
  expect(howWeNamedIt.evidence.kind).toBe("illustrative");
});
