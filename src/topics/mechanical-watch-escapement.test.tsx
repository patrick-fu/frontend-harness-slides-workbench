import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./mechanical-watch-escapement";

runTopicContract(definition);

describe("mechanical-watch-escapement custom assertions", () => {
  it("renders 28,800 BPH isochronous headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("28,800 BPH Isochronous Breath")).toBeDefined();
  });

  it("renders Chinese translated masthead on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("瑞士精密钟表刊头").length).toBeGreaterThan(0);
    expect(getByText("发条盒发条势能积蓄")).toBeDefined();
  });
});
