import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./black-hole-event-horizon";

runTopicContract(definition);

describe("black-hole-event-horizon custom assertions", () => {
  it("renders 1.5 Rs photon sphere headline on Scene 3", () => {
    const { getByText } = render(
      <definition.Stage
        scene={3}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Unstable 1.5 Rs Photon Sphere")).toBeDefined();
  });

  it("renders Chinese translated black hole title on Scene 1", () => {
    const { getAllByText, getByText } = render(
      <definition.Stage
        scene={1}
        beat={0}
        language="zh"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getAllByText(/WIDESCREEN 2.39:1/).length).toBeGreaterThan(0);
    expect(getByText("半光速相对论吸积流")).toBeDefined();
  });
});
