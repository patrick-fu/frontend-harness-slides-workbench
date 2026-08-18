import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./shannon-information";

runTopicContract(definition);

describe("shannon-information custom assertions", () => {
  it("renders the entropy formula quote on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("“H = -\\sum p_i \\log_2 p_i”")).toBeDefined();
  });

  it("renders Chinese translated quote on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("“一条信息在发出之前究竟是什么？”")).toBeDefined();
  });
});
