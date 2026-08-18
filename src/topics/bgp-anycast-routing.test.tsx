import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./bgp-anycast-routing";

runTopicContract(definition);

describe("bgp-anycast-routing custom assertions", () => {
  it("renders Anycast PoPs title on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Single IP, 300 Global PoPs")).toBeDefined();
  });

  it("renders Chinese translated transit content on Scene 1", () => {
    const { getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("自治系统互联拓扑")).toBeDefined();
  });
});
