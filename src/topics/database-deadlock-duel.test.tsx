import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./database-deadlock-duel";

runTopicContract(definition);

describe("database-deadlock-duel custom assertions", () => {
  it("renders DFS graph cycle headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("SPECIAL MOVE: DFS GRAPH CYCLE SCAN")).toBeDefined();
  });

  it("renders Chinese translated arcade boss title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/DEADLOCK BOSS HP/).length).toBeGreaterThan(0);
    expect(getByText("1P 与 2P 互锁僵局触发")).toBeDefined();
  });
});
