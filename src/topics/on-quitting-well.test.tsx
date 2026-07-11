import { expect, it } from "vitest";
import onQuittingWell from "./on-quitting-well";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(onQuittingWell);

it("keeps the ghost index and authored-reflection boundary", () => {
  expect(onQuittingWell.navigation).toEqual({
    geometry: "typographic-index",
    carrier: "quitting-ghost-index",
    invocation: "proximity-reveal",
    feedback: "typographic-emphasis",
  });
  expect(onQuittingWell.evidence.kind).toBe("illustrative");
});
