import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EngineeringWhiteboardExplainer, {
  engineeringWhiteboardExplainerTopic,
  getMetadata,
} from "./engineering-whiteboard-explainer";

function renderStyle(scene: number, beat: number, language: "en" | "zh" = "en") {
  return render(
    <div style={{ width: 1920, height: 1080, containerType: "size" }}>
      <EngineeringWhiteboardExplainer
        scene={scene}
        beat={beat}
        language={language}
        isThumbnail={false}
        reducedMotion={false}
        onNavigate={vi.fn()}
      />
    </div>,
  );
}

describe("Engineering Whiteboard Explainer", () => {
  it("exports a semantic topic module", () => {
    expect(engineeringWhiteboardExplainerTopic.id).toBe("from-prompt-to-patch");
    expect(engineeringWhiteboardExplainerTopic.topic.en).toBe("From Prompt to Patch");
    expect(engineeringWhiteboardExplainerTopic.topic.zh).toBe("提示到补丁");
  });

  it("returns complete metadata with a balanced hybrid band", () => {
    const meta = getMetadata("en");

    expect(meta.id).toBe("engineering-whiteboard-explainer");
    expect(meta.band).toBe("balanced-hybrid");
    expect(meta.heroScene).toBe(3);
    expect(meta.scenes).toHaveLength(5);
    expect(meta.scenes.map((scene) => scene.beats.length)).toEqual([
      1, 3, 3, 3, 2,
    ]);
  });

  it("renders the active scene through SpatialSceneTrack", () => {
    renderStyle(3, 2);

    expect(screen.getByTestId("spatial-scene-track")).toBeInTheDocument();
    expect(screen.getByText("Review comments become patch tasks")).toBeInTheDocument();
    expect(screen.getByText("Tests + diff + PR summary")).toBeInTheDocument();
  });

  it("keeps the scene 3 patch lane inside the 16:9 stage", () => {
    renderStyle(3, 2);

    const lane = screen.getByTestId("engineering-whiteboard-patch-lane");
    expect(Number(lane.dataset.totalWidthCqw)).toBeLessThanOrEqual(100);
  });

  it("renders Chinese teaching copy", () => {
    renderStyle(5, 1, "zh");

    expect(screen.getByText("最终检查")).toBeInTheDocument();
    expect(screen.getByText("能解释的链路，才值得自动化。")).toBeInTheDocument();
  });
});
