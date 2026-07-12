import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { TopicMetadata } from "../domain/topic";
import PlayerTransport from "./PlayerTransport";

function scenes(
  beatCounts = [1, 2, 3, 2, 1],
): TopicMetadata["scenes"] {
  return beatCounts.map((count, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    beats: Array.from({ length: count }, (_, beat) => ({
      id: beat,
      action: `Beat ${beat + 1}`,
      title: `Beat ${beat + 1}`,
      body: "",
    })),
  }));
}

function setup(overrides: Partial<React.ComponentProps<typeof PlayerTransport>> = {}) {
  const props: React.ComponentProps<typeof PlayerTransport> = {
    language: "en",
    scenes: scenes(),
    currentScene: 3,
    currentBeat: 1,
    onPrev: vi.fn(),
    onNext: vi.fn(),
    onJumpScene: vi.fn(),
    onJumpBeat: vi.fn(),
    ...overrides,
  };
  render(<PlayerTransport {...props} />);
  return props;
}

describe("Player Scene Timeline", () => {
  it("exposes all five Scenes while naming the active Scene", () => {
    setup();
    const timeline = screen.getByRole("group", { name: "Scene navigation" });
    expect(timeline).toBeVisible();
    expect(screen.getAllByRole("button", { name: /Scene [1-5]/ })).toHaveLength(5);
    expect(screen.getByRole("button", { name: "Scene 3" })).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(screen.getByText("Scene 3")).toBeVisible();
  });

  it("opens an inactive Scene at its first Beat without resetting the active Scene", () => {
    const props = setup();
    fireEvent.click(screen.getByRole("button", { name: "Scene 5" }));
    fireEvent.click(screen.getByRole("button", { name: "Scene 3" }));
    expect(props.onJumpScene).toHaveBeenCalledTimes(1);
    expect(props.onJumpScene).toHaveBeenCalledWith(5);
  });

  it("renders directly selectable Beat segments for the active Scene", () => {
    const props = setup();
    const beats = screen.getAllByRole("button", { name: /Beat [123] of 3/ });
    expect(beats).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "Beat 3 of 3" }));
    expect(props.onJumpBeat).toHaveBeenCalledWith(2);
  });

  it("keeps sequential previous and next controls available", () => {
    const props = setup();
    fireEvent.click(screen.getByTestId("prev-button"));
    fireEvent.click(screen.getByTestId("next-button"));
    expect(props.onPrev).toHaveBeenCalledTimes(1);
    expect(props.onNext).toHaveBeenCalledTimes(1);
  });

  it("localizes its complete navigation contract in Chinese", () => {
    setup({ language: "zh" });

    expect(screen.getByRole("toolbar", { name: "幻灯片导航" })).toBeVisible();
    expect(screen.getByRole("button", { name: "上一步" })).toBeVisible();
    expect(screen.getByRole("button", { name: "下一步" })).toBeVisible();
    expect(screen.getByRole("group", { name: "场景导航" })).toBeVisible();
    expect(screen.getByRole("button", { name: "场景 3" })).toBeVisible();
    expect(screen.getByLabelText("节拍进度")).toBeVisible();
    expect(screen.getByRole("button", { name: "节拍 2/3" })).toBeVisible();
  });
});
