import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./wasm-simd-compiler-box";

runTopicContract(definition);

describe("wasm-simd-compiler-box custom assertions", () => {
  it("renders 4x parallel pipeline headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("f32x4.add Quad-Lane Pipeline")).toBeDefined();
  });

  it("renders Chinese translated WASM bento title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/128-BIT SIMD ARCHITECTURE/).length).toBeGreaterThan(0);
    expect(getByText("跨平台 v128 原生定宽向量基元")).toBeDefined();
  });
});
