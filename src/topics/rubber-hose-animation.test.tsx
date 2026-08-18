import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./rubber-hose-animation";

runTopicContract(definition);

describe("rubber-hose-animation custom assertions", () => {
  it("renders the 8-frame walk cycle title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("8-Frame Steamboat Strut 👟")).toBeDefined();
  });

  it("renders Chinese translated cartoon sketch on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("没有肘关节与膝盖 〰️")).toBeDefined();
  });
});
