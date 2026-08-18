import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./floppy-disk-interleaving";

runTopicContract(definition);

describe("floppy-disk-interleaving custom assertions", () => {
  it("renders 200ms penalty headline on Scene 3", () => {
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
      getByText("The 200ms Full Revolution Penalty"),
    ).toBeDefined();
  });

  it("renders Chinese translated floppy specs on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("3.5寸软盘包装规格").length).toBeGreaterThan(0);
    expect(getByText("3.5寸软盘与 300 RPM 恒速")).toBeDefined();
  });
});
