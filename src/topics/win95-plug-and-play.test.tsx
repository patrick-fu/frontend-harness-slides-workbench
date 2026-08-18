import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./win95-plug-and-play";

runTopicContract(definition);

describe("win95-plug-and-play custom assertions", () => {
  it("renders resource arbiter headline on Scene 3", () => {
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
      getByText("Automated Resource Arbiter (No Blue Screen)"),
    ).toBeDefined();
  });

  it("renders Chinese translated retro windows title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(
      getAllByText(/设备管理器/).length,
    ).toBeGreaterThan(0);
    expect(getByText("手动拨码跳线与中断冲突")).toBeDefined();
  });
});
