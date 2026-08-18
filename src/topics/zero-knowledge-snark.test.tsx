import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./zero-knowledge-snark";

runTopicContract(definition);

describe("zero-knowledge-snark custom assertions", () => {
  it("renders the QAP polynomial title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Quadratic Arithmetic Program")).toBeDefined();
  });

  it("renders Chinese translated pipeline on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("公开声明与私有见证")).toBeDefined();
  });
});
