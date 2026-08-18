import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./bespoke-perfume-pyramid";

runTopicContract(definition);

describe("bespoke-perfume-pyramid custom assertions", () => {
  it("renders 4-hour harmonic heart headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("The 4-Hour Harmonic Heart")).toBeDefined();
  });

  it("renders Chinese translated fragrance title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("三段式嗅觉金字塔架构").length).toBeGreaterThan(0);
    expect(getByText("分子挥发度的物理学分层")).toBeDefined();
  });
});
