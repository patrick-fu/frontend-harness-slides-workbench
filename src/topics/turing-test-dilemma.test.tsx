import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { runTopicContract } from "../testing/topic-contract";
import definition from "./turing-test-dilemma";

runTopicContract(definition);

describe("turing-test-dilemma custom assertions", () => {
  it("renders dialogue stage nodes when not in thumbnail mode", () => {
    const { getByText, container } = render(
      <definition.Stage
        scene={2}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={true}
      />,
    );
    expect(getByText("Rulebook Lookup (Syntax)")).toBeDefined();
    const nav = container.querySelector('[data-topic-navigation="true"]');
    expect(nav).not.toBeNull();
    expect(nav).toHaveAttribute("data-navigation-geometry", "spatial-node");
  });

  it("hides navigation nodes in thumbnail mode", () => {
    const { container } = render(
      <definition.Stage
        scene={2}
        beat={0}
        language="en"
        isThumbnail={true}
        reducedMotion={true}
      />,
    );
    const nav = container.querySelector('[data-topic-navigation="true"]');
    expect(nav).toBeNull();
  });
});
