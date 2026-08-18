import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./compiler-front-back-end";

runTopicContract(definition);

describe("compiler-front-back-end custom assertions", () => {
  it("renders SSA IR title and sync bridge on Scene 3", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Universal IR Synchronization Seam")).toBeDefined();
    expect(getAllByText("⇄ SSA IR ⇄").length).toBeGreaterThan(0);
  });

  it("renders Chinese translated compiler content on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("M × N 组合爆炸壁垒")).toBeDefined();
  });
});
