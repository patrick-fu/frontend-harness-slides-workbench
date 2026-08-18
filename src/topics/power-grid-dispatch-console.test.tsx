import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./power-grid-dispatch-console";

runTopicContract(definition);

describe("power-grid-dispatch-console custom assertions", () => {
  it("renders 50.00 Hz meter on Scene 1", () => {
    const { getAllByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("50.00 Hz (SYNC)").length).toBeGreaterThan(0);
  });

  it("renders Chinese translated console on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("50.00 Hz 动态平衡生命线")).toBeDefined();
  });
});
