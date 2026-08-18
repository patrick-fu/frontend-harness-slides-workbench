import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./linux-oom-killer";

runTopicContract(definition);

describe("linux-oom-killer custom assertions", () => {
  it("renders the oom_badness title on Scene 3", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("oom_badness() Heuristic Scoring")).toBeDefined();
    expect(getAllByText("leak_daemon").length).toBeGreaterThan(0);
  });

  it("renders Chinese translated kernel alert on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("内核内存区低水位告警")).toBeDefined();
  });
});
