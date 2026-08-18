import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./trombe-wall-passive-solar";

runTopicContract(definition);

describe("trombe-wall-passive-solar custom assertions", () => {
  it("renders thermosiphon loop title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Buoyancy-Driven Thermosiphon")).toBeDefined();
  });

  it("renders Chinese translated poster on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("南向玻璃幕墙与集热暗面")).toBeDefined();
  });
});
