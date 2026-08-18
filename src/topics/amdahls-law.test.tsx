import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./amdahls-law";

runTopicContract(definition);

describe("amdahls-law custom assertions", () => {
  it("renders the 20x speedup punchline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("MAXIMUM SPEEDUP: 20X FOREVER")).toBeDefined();
  });

  it("renders Chinese translated punchline on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("堆核心 ≠ 提速度")).toBeDefined();
  });
});
