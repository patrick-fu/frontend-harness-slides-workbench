import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./falcon9-preflight-checklist";

runTopicContract(definition);

describe("falcon9-preflight-checklist custom assertions", () => {
  it("renders Merlin chilldown headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("T-07:00 9x Merlin 1D Engine Chill")).toBeDefined();
  });

  it("renders Chinese translated checklist title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/TERMINAL COUNTDOWN/).length).toBeGreaterThan(0);
    expect(getByText("T-45:00 推进剂加注全席就绪")).toBeDefined();
  });
});
