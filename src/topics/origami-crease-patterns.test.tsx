import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./origami-crease-patterns";

runTopicContract(definition);

describe("origami-crease-patterns custom assertions", () => {
  it("renders the Miura-ori title on Scene 3", () => {
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
      getByText("Tessellated Parallelogram Tessellation"),
    ).toBeDefined();
  });

  it("renders Chinese translated fold labels on Scene 2", () => {
    const { getByText } = render(
      <definition.Stage
        scene={2}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("山折与谷折线定义")).toBeDefined();
  });
});
