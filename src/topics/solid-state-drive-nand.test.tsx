import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./solid-state-drive-nand";

runTopicContract(definition);

describe("solid-state-drive-nand custom assertions", () => {
  it("renders benchmark table and IOPS headers on Scene 3", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("4K Random Read/Write IOPS")).toBeDefined();
    expect(getAllByText("RANDOM IOPS").length).toBeGreaterThan(0);
  });

  it("renders Chinese translated content on Scene 2", () => {
    const { getByText } = render(
      <definition.Stage
        scene={2}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("SLC: 100,000 次 P/E 寿命")).toBeDefined();
  });
});
