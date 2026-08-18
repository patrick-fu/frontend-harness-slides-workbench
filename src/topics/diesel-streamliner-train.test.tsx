import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./diesel-streamliner-train";

runTopicContract(definition);

describe("diesel-streamliner-train custom assertions", () => {
  it("renders 1015 miles dash headline on Scene 3", () => {
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
      getByText("1,015 Miles in 13 Hours (112.5 MPH Peak)"),
    ).toBeDefined();
  });

  it("renders Chinese translated streamliner deco on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("装饰艺术 · 流线型时代").length).toBeGreaterThan(0);
    expect(getByText("笨重蒸汽锅炉的物理极限")).toBeDefined();
  });
});
