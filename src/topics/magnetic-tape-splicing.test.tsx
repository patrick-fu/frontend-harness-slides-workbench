import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./magnetic-tape-splicing";

runTopicContract(definition);

describe("magnetic-tape-splicing custom assertions", () => {
  it("renders 45-degree crossfade headline on Scene 3", () => {
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
      getByText("The 45-Degree Acoustic Crossfade"),
    ).toBeDefined();
  });

  it("renders Chinese translated tape session on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("双调开盘录音棚记录").length).toBeGreaterThan(0);
    expect(getByText("15 ips 走带速度空间映射")).toBeDefined();
  });
});
