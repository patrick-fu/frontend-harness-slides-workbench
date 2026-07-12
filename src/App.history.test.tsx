import { StrictMode } from "react";
import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { CATALOG_MANIFEST } from "./catalog/manifest.generated";

const CATALOG_TOPIC_COUNT = CATALOG_MANIFEST.reduce(
  (total, style) => total + style.topics.length,
  0,
);

const PRODUCT_ROUTE =
  "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=2&beat=0";

const navigatorClipboardDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard",
);
const navigatorShareDescriptor = Object.getOwnPropertyDescriptor(
  navigator,
  "share",
);
const elementScrollToDescriptor = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  "scrollTo",
);

function params() {
  return new URLSearchParams(window.location.search);
}

function setRoute(route: string) {
  window.history.replaceState(null, "", route);
}

function restoreNavigatorProperty(
  property: "clipboard" | "share",
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) {
    Object.defineProperty(navigator, property, descriptor);
  } else {
    Reflect.deleteProperty(navigator, property);
  }
}

beforeEach(() => {
  setRoute("/");
  localStorage.clear();
  sessionStorage.clear();
  document.documentElement.removeAttribute("data-frozen");
  document.documentElement.removeAttribute("data-pure-mode");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  restoreNavigatorProperty("clipboard", navigatorClipboardDescriptor);
  restoreNavigatorProperty("share", navigatorShareDescriptor);
  if (elementScrollToDescriptor) {
    Object.defineProperty(
      HTMLElement.prototype,
      "scrollTo",
      elementScrollToDescriptor,
    );
  } else {
    Reflect.deleteProperty(HTMLElement.prototype, "scrollTo");
  }
  document.documentElement.removeAttribute("data-frozen");
  document.documentElement.removeAttribute("data-pure-mode");
});

describe("Workbench URL, history, and sharing contract", () => {
  it("retains repeated Band and Model criteria and treats an in-place filter edit as a replacement", () => {
    setRoute(
      "/?view=overview&band=minimal-keynote&band=balanced-hybrid&model=Doubao-Seed-Evolving&model=GPT+5.5",
    );
    render(<App />);

    expect(params().getAll("band")).toEqual([
      "minimal-keynote",
      "balanced-hybrid",
    ]);
    expect(params().getAll("model")).toEqual([
      "Doubao-Seed-Evolving",
      "GPT 5.5",
    ]);
    expect(
      within(screen.getByRole("group", { name: "Category" })).getByRole(
        "button",
        { name: /Minimal Keynote/ },
      ),
    ).toHaveAttribute("aria-pressed", "true");

    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));

    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
    expect(params().getAll("band")).toEqual([]);
    expect(params().getAll("model")).toEqual([]);
  });

  it("replaces scene, beat, and Pure Mode changes while preserving a frozen URL frame", () => {
    setRoute(`${PRODUCT_ROUTE}&frozen=1`);
    render(<App />);
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    fireEvent.click(screen.getByTestId("scene-dot-3"));
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
    expect(params().get("scene")).toBe("3");
    expect(params().get("beat")).toBe("0");
    expect(params().get("frozen")).toBe("1");
    expect(document.documentElement).toHaveAttribute("data-frozen", "true");

    replaceState.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Beat 2 of 3" }));
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
    expect(params().get("beat")).toBe("1");
    expect(params().get("frozen")).toBe("1");

    replaceState.mockClear();
    fireEvent.click(screen.getByRole("button", { name: "Present" }));
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
    expect(params().get("pure")).toBe("1");
    expect(params().get("frozen")).toBe("1");
  });

  it("pushes a deliberate Topic destination, then restores its filtered Catalog entry with Back", async () => {
    setRoute("/?view=overview&band=minimal-keynote&model=GPT+5.5");
    render(<App />);
    const catalogSearch = window.location.search;
    const catalogScroller = screen.getByTestId("catalog-view").parentElement;
    if (!catalogScroller) throw new Error("Catalog scroller is missing");
    catalogScroller.scrollTop = 480;
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    fireEvent.click(within(screen.getAllByTestId("topic-card")[0]).getByRole("link"));

    await waitFor(() => expect(screen.getByTestId("player-runtime")).toBeVisible());
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(params().get("view")).toBe("lab");

    act(() => window.history.back());
    await waitFor(() => expect(screen.getByTestId("catalog-view")).toBeVisible());
    expect(window.location.search).toBe(catalogSearch);
    expect(params().getAll("band")).toEqual(["minimal-keynote"]);
    expect(params().getAll("model")).toEqual(["GPT 5.5"]);
    expect(catalogScroller.scrollTop).toBe(480);
  });

  it("pushes an explicit View change from the Player", () => {
    setRoute(PRODUCT_ROUTE);
    render(<App />);
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    fireEvent.click(
      within(
        screen.getByRole("navigation", { name: "Player navigation" }),
      ).getByRole("button", { name: "Overview" }),
    );

    expect(screen.getByTestId("catalog-view")).toBeVisible();
    expect(params().get("view")).toBe("overview");
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(replaceState).not.toHaveBeenCalled();
  });

  it("restores Catalog scroll context between same-view History entries", async () => {
    const scrollTo = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: scrollTo,
    });
    window.history.replaceState(
      { navigation: { catalog: { scrollTop: 120 } } },
      "",
      "/?view=overview&band=first-context",
    );
    render(<App />);
    await waitFor(() =>
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 120, behavior: "auto" }),
    );

    scrollTo.mockClear();
    window.history.pushState(
      { navigation: { catalog: { scrollTop: 560 } } },
      "",
      "/?view=overview&band=second-context",
    );
    act(() => window.dispatchEvent(new PopStateEvent("popstate")));

    await waitFor(() =>
      expect(scrollTo).toHaveBeenLastCalledWith({ top: 560, behavior: "auto" }),
    );
  });

  it("replaces the current destination when sequential navigation crosses a Topic boundary", async () => {
    setRoute(
      "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=5&beat=0",
    );
    render(<App />);
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => expect(params().get("topic")).toBe("quiet-launch"));
    expect(params().get("style")).toBe("minimal-product-keynote");
    expect(params().get("scene")).toBe("1");
    expect(params().get("beat")).toBe("0");
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
  });

  it("preserves Filters and skips non-matching Topics during sequential Player navigation", async () => {
    setRoute(
      "/?view=lab&style=minimal-product-keynote&topic=quiet-launch&scene=5&beat=1&band=minimal-keynote&model=GPT+5.5",
    );
    render(<App />);

    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => expect(params().get("topic")).toBe("clean-metrics"));
    expect(params().get("style")).toBe("objective-swiss-grid");
    expect(params().getAll("band")).toEqual(["minimal-keynote"]);
    expect(params().getAll("model")).toEqual(["GPT 5.5"]);
    expect(params().get("scene")).toBe("1");
    expect(params().get("beat")).toBe("0");
  });

  it("replaces a deliberate Topic change inside the Player", async () => {
    setRoute(PRODUCT_ROUTE);
    render(<App />);
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    fireEvent.click(screen.getByRole("button", { name: /Product Keynote/ }));
    fireEvent.click(
      screen.getByRole("menuitemradio", { name: /Quiet Launch/ }),
    );

    await waitFor(() => expect(params().get("topic")).toBe("quiet-launch"));
    expect(params().get("style")).toBe("minimal-product-keynote");
    expect(params().get("scene")).toBe("1");
    expect(params().get("beat")).toBe("0");
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
  });

  it("clamps malformed Scene and Beat values against Topic metadata", async () => {
    setRoute(
      "/?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=999&beat=999",
    );
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(<App />);

    await waitFor(() => expect(params().get("scene")).toBe("5"));
    expect(params().get("beat")).toBe("0");
    expect(replaceState).toHaveBeenCalledTimes(1);
  });

  it("resolves a stale Style query from the global Topic ID without adding History", async () => {
    setRoute(
      "/?view=lab&style=sketch-board-emoji&topic=quiet-launch&scene=2&beat=0",
    );
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(<App />);

    await waitFor(() =>
      expect(params().get("style")).toBe("minimal-product-keynote"),
    );
    expect(params().get("topic")).toBe("quiet-launch");
    expect(screen.getByTestId("player-runtime")).toBeVisible();
    expect(
      screen.queryByText("This slide deck is unavailable"),
    ).not.toBeInTheDocument();
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
  });

  it("adds a missing Style query from the global Topic ID with replaceState", async () => {
    setRoute("/?view=lab&topic=quiet-launch&scene=2&beat=0");
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(<App />);

    await waitFor(() =>
      expect(params().get("style")).toBe("minimal-product-keynote"),
    );
    expect(params().get("topic")).toBe("quiet-launch");
    expect(window.location.hash).toBe("");
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
  });

  it("shows Not Found only when the global Topic ID is unknown", () => {
    setRoute(
      "/?view=lab&style=sketch-board-emoji&topic=missing-topic&scene=1&beat=0",
    );
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(<App />);

    expect(screen.getByText("This slide deck is unavailable")).toBeVisible();
    expect(params().get("style")).toBe("sketch-board-emoji");
    expect(replaceState).not.toHaveBeenCalled();
    expect(pushState).not.toHaveBeenCalled();
  });

  it("uses Home to replace the current entry with an unfiltered Catalog", () => {
    setRoute("/?view=overview&band=minimal-keynote&model=GPT+5.5");
    Object.defineProperty(HTMLElement.prototype, "scrollTo", {
      configurable: true,
      value: vi.fn(),
    });
    render(<App />);
    const pushState = vi.spyOn(window.history, "pushState");
    const replaceState = vi.spyOn(window.history, "replaceState");

    fireEvent.click(
      screen.getByRole("button", { name: "Return to unfiltered Overview" }),
    );

    expect(screen.getByTestId("catalog-summary")).toHaveTextContent(
      `All ${CATALOG_TOPIC_COUNT} Topics · ${CATALOG_MANIFEST.length} Styles`,
    );
    expect(params().get("view")).toBe("overview");
    expect(params().getAll("band")).toEqual([]);
    expect(params().getAll("model")).toEqual([]);
    expect(replaceState).toHaveBeenCalledTimes(1);
    expect(pushState).not.toHaveBeenCalled();
  });

  it("keeps unknown criteria explicit instead of broadening the Catalog", () => {
    setRoute(
      "/?view=overview&band=retired-band&model=Retired+Model",
    );
    render(<App />);

    expect(screen.getByTestId("catalog-unavailable-state")).toHaveTextContent(
      "retired-band, Retired Model",
    );
    expect(screen.queryByTestId("catalog-grid")).not.toBeInTheDocument();
    expect(params().getAll("band")).toEqual(["retired-band"]);
    expect(params().getAll("model")).toEqual(["Retired Model"]);
  });

  it("copies and shares the resolved URL language override without changing the saved preference", async () => {
    localStorage.setItem("fhsw:language", "zh");
    setRoute(`${PRODUCT_ROUTE}&frozen=1&lang=en`);
    const writeText = vi.fn().mockResolvedValue(undefined);
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Copy link" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    const copied = new URL(writeText.mock.calls[0][0]);
    expect(copied.searchParams.get("lang")).toBe("en");
    expect(copied.searchParams.get("frozen")).toBe("1");
    expect(copied.searchParams.get("scene")).toBe("2");
    expect(localStorage.getItem("fhsw:language")).toBe("zh");

    fireEvent.click(screen.getByRole("button", { name: "More" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Share…" }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(new URL(share.mock.calls[0][0].url).searchParams.get("lang")).toBe(
      "en",
    );
  });

  it("does not create a duplicate Back step for a deliberate destination in the StrictMode app shell", async () => {
    render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    const pushState = vi.spyOn(window.history, "pushState");

    fireEvent.click(within(screen.getAllByTestId("topic-card")[0]).getByRole("link"));
    await waitFor(() => expect(screen.getByTestId("player-runtime")).toBeVisible());
    expect(pushState).toHaveBeenCalledTimes(1);

    act(() => window.history.back());
    await waitFor(() => expect(screen.getByTestId("catalog-view")).toBeVisible());
  });
});
