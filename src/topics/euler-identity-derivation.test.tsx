import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./euler-identity-derivation";

runTopicContract(definition);

describe("euler-identity-derivation custom assertions", () => {
  it("renders Euler formula headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Euler's Formula: $e^{ix} = \\cos x + i\\sin x$")).toBeDefined();
  });

  it("renders Chinese translated blackboard title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/BLACKBOARD CHALK TALK/).length).toBeGreaterThan(0);
    expect(getByText("五大独立数学常数的相遇")).toBeDefined();
  });
});
