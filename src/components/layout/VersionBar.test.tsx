import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VersionBar from "./VersionBar";
import type { StyleRegistryEntry } from "../../types";

function makeStyle(
  versions: Array<{ id: string; topic: string; model: string }>,
): StyleRegistryEntry {
  return {
    id: "01",
    name: { en: "Minimal Product Keynote", zh: "极简产品演示" },
    versions: versions.map((version) => ({
      ...version,
      component: () => null,
      getMetadata: () => ({
        id: "01",
        name: "Minimal Product Keynote",
        band: "minimal-keynote",
        theme: "test",
        densityLabel: "Sparse",
        heroScene: 1,
        colors: { bg: "#fff", ink: "#111", panel: "#eee" },
        typography: { header: "Test 700", body: "Test 400" },
        tags: ["test"],
        fonts: [],
        scenes: [],
      }),
    })),
  };
}

function renderVersionBar(
  props: Partial<React.ComponentProps<typeof VersionBar>> = {},
) {
  const defaultProps = {
    style: makeStyle([
      { id: "v1", topic: "Original Launch", model: "GPT-4.1" },
      { id: "spatial-track", topic: "Quiet Launch", model: "GPT-5" },
    ]),
    currentVersionId: "spatial-track",
    language: "en" as const,
    onGoOverview: vi.fn(),
    onSelectVersion: vi.fn(),
    ...props,
  };

  const result = render(<VersionBar {...defaultProps} />);
  return {
    ...result,
    onGoOverview: defaultProps.onGoOverview,
    onSelectVersion: defaultProps.onSelectVersion,
  };
}

describe("VersionBar", () => {
  it("renders a compact dropdown trigger instead of direct version buttons", () => {
    renderVersionBar();

    expect(screen.getByTestId("version-switcher")).toBeInTheDocument();
    expect(screen.getByTestId("version-switcher")).toHaveTextContent("v2/2");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.queryByTestId("version-option-v1")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("version-option-spatial-track"),
    ).not.toBeInTheDocument();
  });

  it("opens the version menu on click", () => {
    renderVersionBar();

    fireEvent.click(screen.getByTestId("version-switcher"));

    expect(screen.getByTestId("version-menu")).toBeInTheDocument();
    expect(screen.getByTestId("version-option-v1")).toHaveTextContent("v1");
    expect(screen.getByTestId("version-option-v1")).toHaveTextContent(
      "Original Launch",
    );
    expect(screen.getByTestId("version-option-spatial-track")).toHaveTextContent(
      "spatial-track",
    );
    expect(screen.getByTestId("version-option-spatial-track")).toHaveTextContent(
      "Quiet Launch",
    );
  });

  it("opens the version menu on hover", () => {
    renderVersionBar();

    fireEvent.mouseEnter(screen.getByTestId("version-switcher"));

    expect(screen.getByTestId("version-menu")).toBeInTheDocument();
    expect(screen.getByTestId("version-option-v1")).toBeInTheDocument();
  });

  it("marks the active version inside the dropdown", () => {
    renderVersionBar();

    fireEvent.click(screen.getByTestId("version-switcher"));

    expect(screen.getByTestId("version-option-spatial-track")).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(screen.getByTestId("version-option-spatial-track")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByTestId("version-option-v1")).not.toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  it("clicking another version requests that version id", () => {
    const { onSelectVersion } = renderVersionBar();

    fireEvent.click(screen.getByTestId("version-switcher"));
    fireEvent.click(screen.getByTestId("version-option-v1"));

    expect(onSelectVersion).toHaveBeenCalledTimes(1);
    expect(onSelectVersion).toHaveBeenCalledWith("v1");
  });

  it("does not request a version change when clicking the active version", () => {
    const { onSelectVersion } = renderVersionBar();

    fireEvent.click(screen.getByTestId("version-switcher"));
    fireEvent.click(screen.getByTestId("version-option-spatial-track"));

    expect(onSelectVersion).not.toHaveBeenCalled();
  });

  it("does not render the switcher for a single-version style", () => {
    renderVersionBar({
      style: makeStyle([
        { id: "v1", topic: "Original Launch", model: "GPT-4.1" },
      ]),
      currentVersionId: "v1",
    });

    expect(screen.queryByTestId("version-switcher")).not.toBeInTheDocument();
    expect(screen.getByTestId("version-count")).toHaveTextContent("v1/1");
  });

  it("localizes the switcher label", () => {
    renderVersionBar({ language: "zh" });

    expect(screen.getByTestId("version-switcher")).toHaveAttribute(
      "aria-label",
      "版本",
    );
  });
});
