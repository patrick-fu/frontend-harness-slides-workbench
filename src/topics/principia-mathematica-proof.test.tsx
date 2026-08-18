import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./principia-mathematica-proof";

runTopicContract(definition);

describe("principia-mathematica-proof custom assertions", () => {
  it("renders Proposition XI title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(
      getByText("Proposition XI: Inverse-Square Orbit"),
    ).toBeDefined();
  });

  it("renders Chinese translated geometry proof on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("以纯欧氏几何证明引力")).toBeDefined();
  });
});
