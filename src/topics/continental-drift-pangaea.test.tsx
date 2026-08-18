import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./continental-drift-pangaea";

runTopicContract(definition);

describe("continental-drift-pangaea custom assertions", () => {
  it("renders 250 million years ago Pangaea headline on Scene 3", () => {
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
      getByText("250 Million Years Ago: Pangaea"),
    ).toBeDefined();
  });

  it("renders Chinese translated collage on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("南美与非洲大陆边缘咬合")).toBeDefined();
  });
});
