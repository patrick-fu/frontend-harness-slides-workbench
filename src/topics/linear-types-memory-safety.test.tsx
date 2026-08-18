import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./linear-types-memory-safety";

runTopicContract(definition);

describe("linear-types-memory-safety custom assertions", () => {
  it("renders compile-time smash headline on Scene 3", () => {
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
      getByText("SMASH DANGLING POINTERS AT COMPILE TIME"),
    ).toBeDefined();
  });

  it("renders Chinese translated agitprop manifesto on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("红楔宣传画 · 类型论宣言").length).toBeGreaterThan(0);
    expect(getByText("70% 高危漏洞源自内存破坏")).toBeDefined();
  });
});
