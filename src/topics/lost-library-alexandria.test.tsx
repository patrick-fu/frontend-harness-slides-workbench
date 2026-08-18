import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./lost-library-alexandria";

runTopicContract(definition);

describe("lost-library-alexandria custom assertions", () => {
  it("renders the slow erasure essay title on Scene 3", () => {
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
      getByText("Not One Fire, But Centuries of Neglect"),
    ).toBeDefined();
  });

  it("renders Chinese translated essay on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("托勒密全书搜罗法令")).toBeDefined();
  });
});
