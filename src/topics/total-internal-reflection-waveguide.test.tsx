import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./total-internal-reflection-waveguide";

runTopicContract(definition);

describe("total-internal-reflection-waveguide custom assertions", () => {
  it("renders trapped photons headline on Scene 3", () => {
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
      getByText("Trapped Photons Around Physical Bends"),
    ).toBeDefined();
  });

  it("renders Chinese translated liquid glass on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("液态玻璃 · 光学波导系统").length).toBeGreaterThan(0);
    expect(getByText("纤芯与包层折射率分层")).toBeDefined();
  });
});
