import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./pirate-radio-broadcast";

runTopicContract(definition);

describe("pirate-radio-broadcast custom assertions", () => {
  it("renders unfiltered sound headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("200 Miles of Unfiltered Sound")).toBeDefined();
  });

  it("renders Chinese translated riso zine on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("地下电波孔版印刷杂志").length).toBeGreaterThan(0);
    expect(getByText("僵死停滞的电波垄断")).toBeDefined();
  });
});
