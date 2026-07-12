import { describe, expect, it } from "vitest";
import { planCaptureSelection } from "./capture-selection.mjs";

const targets = [
  { topicId: "first" },
  { topicId: "second" },
  { topicId: "third" },
];

describe("planCaptureSelection", () => {
  it("keeps partial capture in Publication Plan order", () => {
    expect(
      planCaptureSelection(targets, {
        command: "capture",
        all: false,
        topicIds: ["third", "first"],
      }),
    ).toEqual([{ topicId: "first" }, { topicId: "third" }]);
  });

  it("selects every target for full capture without cleanup policy", () => {
    expect(
      planCaptureSelection(targets, {
        command: "capture",
        all: true,
        topicIds: [],
      }),
    ).toEqual(targets);
  });
});
