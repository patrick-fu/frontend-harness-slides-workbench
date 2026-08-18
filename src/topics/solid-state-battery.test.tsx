import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./solid-state-battery";

runTopicContract(definition);

describe("solid-state-battery custom assertions", () => {
  it("renders the 800 Wh/L hero metric on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("800 Wh/L")).toBeDefined();
  });

  it("renders Chinese translated content properly", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("液态电解质极限")).toBeDefined();
  });
});
