import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./gyroscope-attitude-control";

runTopicContract(definition);

describe("gyroscope-attitude-control custom assertions", () => {
  it("renders CMG zero-fuel headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Zero-Fuel Control Moment Gyros (CMG)")).toBeDefined();
  });

  it("renders Chinese translated gyroscope title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/SPACECRAFT GYRO/).length).toBeGreaterThan(0);
    expect(getByText("真空中万转磁悬浮铍合金转子")).toBeDefined();
  });
});
