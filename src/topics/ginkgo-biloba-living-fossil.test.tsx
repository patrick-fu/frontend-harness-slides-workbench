import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./ginkgo-biloba-living-fossil";

runTopicContract(definition);

describe("ginkgo-biloba-living-fossil custom assertions", () => {
  it("renders ginkgolide defense armor headline on Scene 3", () => {
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
      getByText("Ginkgolide Biochemical Armor"),
    ).toBeDefined();
  });

  it("renders Chinese translated botanical specimen on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("原始二叉分叉叶脉")).toBeDefined();
  });
});
