import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUrlState } from "./useUrlState";

beforeEach(() => {
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  vi.restoreAllMocks();
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

  it("keeps repeated overview band and model criteria from the query", () => {
    window.history.replaceState(
      null,
      "",
      "/?view=overview&band=minimal-keynote&band=unavailable-band&model=GPT%205.5&model=unavailable-model",
    );

    const { result } = renderHook(() => useUrlState());

    expect(result.current[0]).toMatchObject({
      view: "overview",
      bands: ["minimal-keynote", "unavailable-band"],
      models: ["GPT 5.5", "unavailable-model"],
    });
  });

  it("exposes a valid lang query as a temporary override and can remove it", () => {
    window.history.replaceState(null, "", "/?lang=zh");

    const { result } = renderHook(() => useUrlState());

    expect(result.current[0].lang).toBe("zh");

    act(() => {
      result.current[1]({ lang: "en" });
    });
    expect(new URLSearchParams(window.location.search).get("lang")).toBe("en");

    act(() => {
      result.current[1]({ lang: null });
    });
    expect(new URLSearchParams(window.location.search).has("lang")).toBe(false);
  });

  it("pushes explicit destinations, replaces in-place state, and allows an explicit history override", () => {
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current[1]({ view: "lab" });
    });
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(replaceState).not.toHaveBeenCalled();

    for (const patch of [
      { bands: ["minimal-keynote"] },
      { models: ["GPT 5.5"] },
      { scene: 2, beat: 1 },
      { pureMode: true },
      { frozen: true },
    ]) {
      pushState.mockClear();
      replaceState.mockClear();

      act(() => {
        result.current[1](patch);
      });

      expect(replaceState).toHaveBeenCalledTimes(1);
      expect(pushState).not.toHaveBeenCalled();
    }

    pushState.mockClear();
    replaceState.mockClear();
    act(() => {
      result.current[1]({ topicId: "workshop-board" }, { history: "replace" });
    });
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();

    pushState.mockClear();
    replaceState.mockClear();
    act(() => {
      result.current[1]({ scene: 3 }, { history: "push" });
    });
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("writes Overview criteria as repeated singular query parameters", () => {
    const { result } = renderHook(() => useUrlState());

    act(() => {
      result.current[1]({
        bands: ["minimal-keynote", "unavailable-band"],
        models: ["GPT 5.5", "unavailable-model"],
      });
    });

    const params = new URLSearchParams(window.location.search);
    expect(params.getAll("band")).toEqual([
      "minimal-keynote",
      "unavailable-band",
    ]);
    expect(params.getAll("model")).toEqual([
      "GPT 5.5",
      "unavailable-model",
    ]);
    expect(params.has("bands")).toBe(false);
    expect(params.has("models")).toBe(false);
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
