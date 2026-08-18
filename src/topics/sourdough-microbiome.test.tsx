import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./sourdough-microbiome";

runTopicContract(definition);

describe("sourdough-microbiome custom assertions", () => {
  it("renders gluten matrix title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Viscoelastic Gluten Matrix")).toBeDefined();
  });

  it("renders Chinese translated prep content on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("水合作用与野生菌种")).toBeDefined();
  });
});
