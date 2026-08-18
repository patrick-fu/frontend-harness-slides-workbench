import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./fresnel-lens-drafting";

runTopicContract(definition);

describe("fresnel-lens-drafting custom assertions", () => {
  it("renders blueprint title and drawing title on Scene 3", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(
      getAllByText("FRESNEL OPTICAL BLUEPRINT // DWG-1822").length,
    ).toBeGreaterThan(0);
    expect(getByText("Annular Stepped Prisms")).toBeDefined();
  });

  it("renders Chinese translated blueprint content", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("实体吸收物理屏障")).toBeDefined();
  });
});
