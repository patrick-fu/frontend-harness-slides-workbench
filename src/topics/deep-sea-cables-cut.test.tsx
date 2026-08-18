import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./deep-sea-cables-cut";

runTopicContract(definition);

describe("deep-sea-cables-cut custom assertions", () => {
  it("renders cleanroom core fusion splicing headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Cleanroom Core Fusion Splicing")).toBeDefined();
  });

  it("renders Chinese translated newspaper nameplate on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("全球海洋电信导报").length).toBeGreaterThan(0);
    expect(getByText("海底浊流导致跨洋光缆瞬断")).toBeDefined();
  });
});
