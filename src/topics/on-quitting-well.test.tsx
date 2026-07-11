import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import onQuittingWell from "./on-quitting-well";
import { runTopicContract } from "../testing/topic-contract";

runTopicContract(onQuittingWell);

it("keeps the ghost index and authored-reflection boundary", () => {
  expect(onQuittingWell.navigation).toEqual({
    geometry: "typographic-index",
    carrier: "quitting-ghost-index",
    invocation: "proximity-reveal",
    feedback: "typographic-emphasis",
  });
  expect(onQuittingWell.evidence.kind).toBe("illustrative");
});

it("renders the declared navigation profile", () => {
  if ("mode" in onQuittingWell.navigation) {
    throw new Error("on-quitting-well must declare visible navigation.");
  }
  const { container } = render(
    <div
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <onQuittingWell.Stage
        scene={1}
        beat={0}
        language="en"
        isThumbnail={false}
        reducedMotion={false}
      />
    </div>,
  );
  const navigation = container.querySelector<HTMLElement>(
    '[data-topic-navigation="true"]',
  );

  expect(navigation).toHaveAttribute(
    "data-navigation-geometry",
    onQuittingWell.navigation.geometry,
  );
  expect(navigation).toHaveAttribute(
    "data-navigation-carrier",
    onQuittingWell.navigation.carrier,
  );
  expect(navigation).toHaveAttribute(
    "data-navigation-invocation",
    onQuittingWell.navigation.invocation,
  );
  expect(navigation).toHaveAttribute(
    "data-navigation-feedback",
    onQuittingWell.navigation.feedback,
  );
});
