import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./iss-docking-procedure";

runTopicContract(definition);

describe("iss-docking-procedure custom assertions", () => {
  it("renders 0.10 m/s descent headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("0.10 m/s Micro-Impulse Descent")).toBeDefined();
  });

  it("renders Chinese translated docking manual on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/OPERATING MANUAL/).length).toBeGreaterThan(0);
    expect(getByText("共面轨道 200 米停泊保持")).toBeDefined();
  });
});
