import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./kuroshio-current-voyage";

runTopicContract(definition);

describe("kuroshio-current-voyage custom assertions", () => {
  it("renders winter swells headline on Scene 3", () => {
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
      getByText("Great Winter Swells & Foam Claws"),
    ).toBeDefined();
  });

  it("renders Chinese translated ukiyo-e print on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("深蓝黑水暖流涌动")).toBeDefined();
  });
});
