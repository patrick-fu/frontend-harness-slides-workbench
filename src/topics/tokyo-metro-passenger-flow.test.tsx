import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./tokyo-metro-passenger-flow";

runTopicContract(definition);

describe("tokyo-metro-passenger-flow custom assertions", () => {
  it("renders platform arrival valve headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Platform Arrival Valve Throttling")).toBeDefined();
  });

  it("renders Chinese translated field notes title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/SHINJUKU STATION/).length).toBeGreaterThan(0);
    expect(getByText("日均 350 万人次换乘枢纽")).toBeDefined();
  });
});
