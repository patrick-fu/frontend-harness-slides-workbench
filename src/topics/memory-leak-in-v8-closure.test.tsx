import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./memory-leak-in-v8-closure";

runTopicContract(definition);

describe("memory-leak-in-v8-closure custom assertions", () => {
  it("renders root cause headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("ROOT CAUSE: Sibling Context Sharing")).toBeDefined();
  });

  it("renders Chinese translated issue brief title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/GITHUB ISSUE/).length).toBeGreaterThan(0);
    expect(getByText("问题报告 #1042：堆内存线性暴涨")).toBeDefined();
  });
});
