import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./why-we-chose-lsm-tree";

runTopicContract(definition);

describe("why-we-chose-lsm-tree custom assertions", () => {
  it("renders decision outcome headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("DECISION: MemTable + Leveled SSTable")).toBeDefined();
  });

  it("renders Chinese translated ADR title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/STORAGE ENGINE SELECTION/).length).toBeGreaterThan(0);
    expect(getByText("B+ 树就地写入放大瓶颈")).toBeDefined();
  });
});
