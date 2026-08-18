import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./air-traffic-separation";

runTopicContract(definition);

describe("air-traffic-separation custom assertions", () => {
  it("renders Swiss Grid system headers on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("ICAO SEPARATION SPEC").length).toBeGreaterThan(0);
    expect(getByText("Orthogonal Air Corridor")).toBeDefined();
  });

  it("renders Chinese translated content on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("S 模式应答机矩阵")).toBeDefined();
  });
});
