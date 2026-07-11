import { expect, it } from "vitest";
import keptSentence from "./kept-sentence";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(keptSentence);

it("keeps the footlight navigation and editorial boundary", () => {
  expect(keptSentence.navigation).toEqual({
    geometry: "ambient",
    carrier: "sentence-footlight-ticks",
    invocation: "persistent",
    feedback: "mechanical-displacement",
  });
  expect(keptSentence.evidence.kind).toBe("illustrative");
});
