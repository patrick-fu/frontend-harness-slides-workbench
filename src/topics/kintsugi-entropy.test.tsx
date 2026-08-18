import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./kintsugi-entropy";

runTopicContract(definition);

describe("kintsugi-entropy custom assertions", () => {
  it("renders Kintsugi title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Urushi Lacquer & Gold Dust")).toBeDefined();
  });

  it("renders Chinese translated seal and content", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("金缮 · 侘寂").length).toBeGreaterThan(0);
    expect(getByText("完好秩序的脆弱")).toBeDefined();
  });
});
