import { expect, it } from "vitest";
import humanLoop from "./human-loop";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(humanLoop);

it("keeps the sticker navigation and illustrative workflow boundary", () => {
  expect(humanLoop.navigation).toEqual({
    geometry: "card-miniature",
    carrier: "human-loop-sticker-row",
    invocation: "persistent",
    feedback: "active-glow",
  });
  expect(humanLoop.evidence.kind).toBe("illustrative");
});
