import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { runTopicContract } from "../testing/topic-contract";
import definition, {
  TCP_CONGESTION_CONTROL_SOURCES,
} from "./tcp-congestion-control";

runTopicContract(definition);

const Stage = definition.Stage;

function renderTopic(
  scene: number,
  beat: number,
  language: "en" | "zh" = "en",
) {
  return render(
    <div style={{ width: 1920, height: 1080, containerType: "size" }}>
      <Stage
        scene={scene}
        beat={beat}
        language={language}
        isThumbnail={false}
        reducedMotion={false}
      />
    </div>,
  );
}

describe("TCP Handshake & Congestion Control", () => {
  it("keeps the branch Topic identity and Model provenance", () => {
    expect(definition.id).toBe("tcp-congestion-control");
    expect(definition.styleId).toBe("engineering-whiteboard-explainer");
    expect(definition.title).toEqual({
      en: "TCP Handshake & Congestion",
      zh: "TCP 拥塞控制",
    });
    expect(definition.modelId).toBe("Doubao-Seed-Evolving");
  });

  it("preserves all authored Scene and Beat structure", () => {
    expect(definition.metadata.en.heroScene).toBe(4);
    expect(
      definition.metadata.en.scenes.map((scene) => scene.beats.length),
    ).toEqual([2, 3, 3, 4, 2]);
    expect(
      definition.metadata.zh.scenes.map((scene) => scene.beats.length),
    ).toEqual([2, 3, 3, 4, 2]);
  });

  it("renders the completed three-way handshake", () => {
    renderTopic(2, 2);

    expect(screen.getByTestId("spatial-scene-track")).toBeInTheDocument();
    expect(screen.getByText(/ACK — "Got it\. Let's talk\."/)).toBeVisible();
    expect(screen.getByText("SYN seq=x")).toBeVisible();
    expect(screen.getByText("SYN+ACK seq=y ack=x+1")).toBeVisible();
  });

  it("renders the Chinese congestion-control conclusion", () => {
    renderTopic(4, 3, "zh");

    expect(screen.getByText("这道锯齿波，就是互联网能跑的原因")).toBeVisible();
    expect(
      screen.getByText("AIMD = 加性增 + 乘性减。每条流公平分享带宽。"),
    ).toBeVisible();
  });

  it("anchors TCP claims to RFCs and labels the teaching simplifications", () => {
    expect(definition.evidence.kind).toBe("mixed");
    expect(TCP_CONGESTION_CONTROL_SOURCES.map((source) => source.url)).toEqual([
      "https://www.rfc-editor.org/rfc/rfc9293.html",
      "https://www.rfc-editor.org/rfc/rfc5681.html",
    ]);
    if (definition.evidence.kind !== "mixed") {
      throw new Error("Expected mixed Evidence");
    }
    expect(definition.evidence.boundary.en).toContain(
      "Simplified teaching model",
    );
    expect(definition.evidence.boundary.zh).toContain("简化教学模型");
  });

  it("removes CSS and SVG motion from frozen and thumbnail frames", () => {
    const frozen = render(
      <Stage
        scene={4}
        beat={3}
        language="en"
        isThumbnail={false}
        reducedMotion
      />,
    );
    expect(screen.getByTestId("tcp-congestion-control-stage")).toHaveAttribute(
      "data-settled",
      "true",
    );
    expect(
      frozen.container.querySelector("style[data-topic-motion-reset='true']"),
    ).toHaveTextContent("transition: none !important");
    expect(frozen.container.querySelector("animate")).toBeNull();
    frozen.unmount();

    const thumbnail = render(
      <Stage
        scene={4}
        beat={3}
        language="en"
        isThumbnail
        reducedMotion={false}
      />,
    );
    expect(
      thumbnail.container.querySelector("style[data-topic-motion-reset='true']"),
    ).toHaveTextContent("animation: none !important");
    expect(thumbnail.container.querySelector("animate")).toBeNull();
  });
});
