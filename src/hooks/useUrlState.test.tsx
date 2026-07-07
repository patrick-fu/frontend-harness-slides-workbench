import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useUrlState } from "./useUrlState";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("useUrlState query routing", () => {
  it("parses lab state from query parameters", () => {
    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=sketch-board-emoji&topic=workshop-board&scene=3&beat=1&pure=1&frozen=1",
    );

    const { result } = renderHook(() => useUrlState());

    expect(result.current[0]).toMatchObject({
      view: "lab",
      styleId: "sketch-board-emoji",
      topicId: "workshop-board",
      scene: 3,
      beat: 1,
      pureMode: true,
      frozen: true,
    });
  });

  it("writes query parameters without using the hash", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current[1]({
        view: "lab",
        styleId: "engineering-whiteboard-explainer",
        topicId: "from-prompt-to-patch",
        scene: 3,
        beat: 0,
        frozen: true,
      });
    });

    expect(window.location.hash).toBe("");
    expect(window.location.search).toBe(
      "?view=lab&style=engineering-whiteboard-explainer&topic=from-prompt-to-patch&scene=3&beat=0&frozen=1",
    );
  });

  it("updates state from browser back and forward popstate events", () => {
    const { result } = renderHook(() => useUrlState());

    window.history.replaceState(
      null,
      "",
      "/?view=lab&style=signal-pipeline-flow&topic=pipeline&scene=2&beat=0",
    );
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current[0].styleId).toBe("signal-pipeline-flow");
    expect(result.current[0].topicId).toBe("pipeline");
    expect(result.current[0].scene).toBe(2);
  });
});
