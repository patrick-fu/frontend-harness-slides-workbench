import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./venture-capital-deal-funnel";

runTopicContract(definition);

describe("venture-capital-deal-funnel custom assertions", () => {
  it("renders 30 diligence title on Scene 3", () => {
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
      getByText("30 Full Diligence Deep-Dives"),
    ).toBeDefined();
  });

  it("renders Chinese translated deal funnel on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("风投漏斗分拣机").length).toBeGreaterThan(0);
    expect(getByText("3000 份初始商业计划书")).toBeDefined();
  });
});
