import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./loop-tiling-cache-diff";

runTopicContract(definition);

describe("loop-tiling-cache-diff custom assertions", () => {
  it("renders 4-level nested tile headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("DIFF: 4-Level Nested Tile Refactor")).toBeDefined();
  });

  it("renders Chinese translated diff title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/diff --git/).length).toBeGreaterThan(0);
    expect(getByText("朴素按列写入引发缓存行颠簸")).toBeDefined();
  });
});
