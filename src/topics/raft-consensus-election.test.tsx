import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./raft-consensus-election";

runTopicContract(definition);

describe("raft-consensus-election custom assertions", () => {
  it("renders majority quorum title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Majority Quorum (N/2 + 1) Reached")).toBeDefined();
  });

  it("renders Chinese translated node states on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("跟随者、候选人与领袖")).toBeDefined();
  });
});
