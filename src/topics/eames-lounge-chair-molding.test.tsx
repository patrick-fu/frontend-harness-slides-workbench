import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./eames-lounge-chair-molding";

runTopicContract(definition);

describe("eames-lounge-chair-molding custom assertions", () => {
  it("renders 5-ply veneer headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("5-Ply Veneer & Shock Mounts")).toBeDefined();
  });

  it("renders Chinese translated organic wood title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText("伊姆斯曲木成型工艺").length).toBeGreaterThan(0);
    expect(getByText("传统实木的刚性局限")).toBeDefined();
  });
});
