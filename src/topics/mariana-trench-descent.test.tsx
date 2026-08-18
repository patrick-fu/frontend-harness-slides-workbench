import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./mariana-trench-descent";

runTopicContract(definition);

describe("mariana-trench-descent custom assertions", () => {
  it("renders touchdown at 10,994m headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Touchdown at 10,994 Meters")).toBeDefined();
  });

  it("renders Chinese translated expedition screenprint on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("深海深潜探险海报").length).toBeGreaterThan(0);
    expect(getByText("穿透万米深渊带边界")).toBeDefined();
  });
});
