import { expect, it } from "vitest";
import agentPickup from "./agent-pickup";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(agentPickup);

it("keeps the issue-status navigation and handoff transition score", () => {
  expect(agentPickup.navigation).toEqual({
    geometry: "typographic-index",
    carrier: "agent-pickup-status-chips",
    invocation: "persistent",
    feedback: "material-color-change",
  });
  expect(agentPickup.transitionScore).toEqual({
    "1->2": "hard-cut",
    "2->3": "slide-y",
    "3->4": "wipe",
    "4->5": "hard-cut",
  });
  expect(agentPickup.evidence).toEqual({ kind: "none" });
});
