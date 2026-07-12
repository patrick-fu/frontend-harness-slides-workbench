import { describe, expect, it } from "vitest";
import { assertGeneratedTargetsCurrent } from "./load-plan.mjs";

describe("assertGeneratedTargetsCurrent", () => {
  it("accepts identical generated targets", () => {
    expect(() =>
      assertGeneratedTargetsCurrent([{ topicId: "one" }], [{ topicId: "one" }]),
    ).not.toThrow();
  });

  it("rejects stale identity or capture metadata before capture", () => {
    expect(() =>
      assertGeneratedTargetsCurrent(
        [{ topicId: "one", capture: { beat: 2 } }],
        [{ topicId: "one", capture: { beat: 1 } }],
      ),
    ).toThrow("Generated Publication targets are stale");
  });
});
