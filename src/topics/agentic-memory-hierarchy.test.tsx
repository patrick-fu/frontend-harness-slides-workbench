import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./agentic-memory-hierarchy";

runTopicContract(definition);

describe("agentic-memory-hierarchy custom assertions", () => {
  it("renders vectorized episodic retrieval headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Vectorized Episodic Retrieval")).toBeDefined();
  });

  it("renders Chinese translated research memo title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/RESEARCH LAB/).length).toBeGreaterThan(0);
    expect(getByText("瞬态上下文的衰减困局")).toBeDefined();
  });
});
