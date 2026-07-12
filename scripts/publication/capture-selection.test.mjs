import { describe, expect, it } from "vitest";
import { planCaptureSelection } from "./capture-selection.mjs";

const targets = [
  { topicId: "first" },
  { topicId: "second" },
  { topicId: "third" },
];

describe("planCaptureSelection", () => {
  it("keeps partial capture in Publication Plan order and forbids cleanup", () => {
    expect(
      planCaptureSelection(targets, {
        command: "capture",
        all: false,
        topicIds: ["third", "first"],
      }),
    ).toEqual({
      targets: [{ topicId: "first" }, { topicId: "third" }],
      removeOrphans: false,
    });
  });

  it("allows orphan cleanup only for explicit full capture", () => {
    expect(
      planCaptureSelection(targets, {
        command: "capture",
        all: true,
        topicIds: [],
      }),
    ).toEqual({ targets, removeOrphans: true });
  });
});
