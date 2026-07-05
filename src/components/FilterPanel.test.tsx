import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterPanel from "./FilterPanel";

// ─── Helpers ────────────────────────────────────────────────────────────────

const ALL_TAGS = [
  { tag: "clean", count: 3 },
  { tag: "corporate", count: 5 },
  { tag: "dark", count: 4 },
  { tag: "dense", count: 2 },
  { tag: "elegant", count: 1 },
  { tag: "handmade", count: 1 },
  { tag: "light", count: 3 },
  { tag: "minimal", count: 2 },
  { tag: "modern", count: 2 },
  { tag: "premium", count: 3 },
];

const defaultProps = {
  allTags: ALL_TAGS,
  selectedBands: [] as string[],
  selectedTags: [] as string[],
  onToggleBand: vi.fn(),
  onToggleTag: vi.fn(),
  onClearFilters: vi.fn(),
  language: "en" as const,
};

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("FilterPanel", () => {
  it("renders all 6 band buttons", () => {
    render(<FilterPanel {...defaultProps} />);
    const bandIds = [
      "minimal-keynote",
      "balanced-hybrid",
      "editorial-print",
      "craft-cultural",
      "contemporary-digital",
      "text-report",
    ];
    bandIds.forEach((id) => {
      expect(screen.getByTestId(`band-${id}`)).toBeInTheDocument();
    });
  });

  it("renders band labels in English", () => {
    render(<FilterPanel {...defaultProps} language="en" />);
    expect(screen.getByText("Minimal Keynote")).toBeInTheDocument();
    expect(screen.getByText("Text Report")).toBeInTheDocument();
  });

  it("renders band labels in Chinese", () => {
    render(<FilterPanel {...defaultProps} language="zh" />);
    expect(screen.getByText("极简主旨")).toBeInTheDocument();
    expect(screen.getByText("文本报告")).toBeInTheDocument();
  });

  it("renders all tags with counts", () => {
    render(<FilterPanel {...defaultProps} />);
    ALL_TAGS.forEach(({ tag, count }) => {
      const tagEl = screen.getByTestId(`tag-${tag}`);
      expect(tagEl).toBeInTheDocument();
      expect(tagEl).toHaveTextContent(tag);
      expect(tagEl).toHaveTextContent(String(count));
    });
  });

  it("calls onToggleBand when a band button is clicked", () => {
    const onToggleBand = vi.fn();
    render(<FilterPanel {...defaultProps} onToggleBand={onToggleBand} />);

    fireEvent.click(screen.getByTestId("band-minimal-keynote"));
    expect(onToggleBand).toHaveBeenCalledWith("minimal-keynote");
  });

  it("calls onToggleTag when a tag is clicked", () => {
    const onToggleTag = vi.fn();
    render(<FilterPanel {...defaultProps} onToggleTag={onToggleTag} />);

    fireEvent.click(screen.getByTestId("tag-corporate"));
    expect(onToggleTag).toHaveBeenCalledWith("corporate");
  });

  it("selected bands have the selected class/attribute", () => {
    render(
      <FilterPanel
        {...defaultProps}
        selectedBands={["minimal-keynote", "text-report"]}
      />,
    );
    const mk = screen.getByTestId("band-minimal-keynote");
    const tr = screen.getByTestId("band-text-report");
    const bh = screen.getByTestId("band-balanced-hybrid");

    expect(mk).toHaveAttribute("aria-pressed", "true");
    expect(tr).toHaveAttribute("aria-pressed", "true");
    expect(bh).toHaveAttribute("aria-pressed", "false");
  });

  it("selected tags show a remove button (×)", () => {
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={["corporate", "dark"]}
      />,
    );
    const corporateTag = screen.getByTestId("tag-corporate");
    const darkTag = screen.getByTestId("tag-dark");
    const cleanTag = screen.getByTestId("tag-clean");

    expect(corporateTag.querySelector("[data-testid='tag-remove-corporate']")).toBeInTheDocument();
    expect(darkTag.querySelector("[data-testid='tag-remove-dark']")).toBeInTheDocument();
    expect(cleanTag.querySelector("[data-testid^='tag-remove-']")).toBeNull();
  });

  it("clicking × on a selected tag calls onToggleTag to remove it", () => {
    const onToggleTag = vi.fn();
    render(
      <FilterPanel
        {...defaultProps}
        selectedTags={["corporate"]}
        onToggleTag={onToggleTag}
      />,
    );
    const removeBtn = screen.getByTestId("tag-remove-corporate");
    fireEvent.click(removeBtn);
    expect(onToggleTag).toHaveBeenCalledWith("corporate");
  });

  it("does not show 'Clear All' button when no filters are active", () => {
    render(<FilterPanel {...defaultProps} />);
    expect(screen.queryByTestId("clear-filters")).toBeNull();
  });

  it("shows 'Clear All' button when bands are selected", () => {
    render(
      <FilterPanel {...defaultProps} selectedBands={["minimal-keynote"]} />,
    );
    expect(screen.getByTestId("clear-filters")).toBeInTheDocument();
  });

  it("shows 'Clear All' button when tags are selected", () => {
    render(<FilterPanel {...defaultProps} selectedTags={["dark"]} />);
    expect(screen.getByTestId("clear-filters")).toBeInTheDocument();
  });

  it("calls onClearFilters when 'Clear All' is clicked", () => {
    const onClearFilters = vi.fn();
    render(
      <FilterPanel
        {...defaultProps}
        selectedBands={["minimal-keynote"]}
        onClearFilters={onClearFilters}
      />,
    );
    fireEvent.click(screen.getByTestId("clear-filters"));
    expect(onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("Clear All label is localized", () => {
    const { unmount } = render(
      <FilterPanel {...defaultProps} selectedBands={["minimal-keynote"]} language="en" />,
    );
    expect(screen.getByTestId("clear-filters")).toHaveTextContent(/Clear All/i);
    unmount();

    render(
      <FilterPanel {...defaultProps} selectedBands={["minimal-keynote"]} language="zh" />,
    );
    expect(screen.getByTestId("clear-filters")).toHaveTextContent(/清除全部/i);
  });

  it("tag row has horizontal scroll", () => {
    render(<FilterPanel {...defaultProps} />);
    const tagRow = screen.getByTestId("tag-row");
    const style = window.getComputedStyle(tagRow);
    expect(style.overflowX).toBe("auto");
  });

  it("renders empty tag row when allTags is empty", () => {
    render(<FilterPanel {...defaultProps} allTags={[]} />);
    expect(screen.getByTestId("tag-row")).toBeInTheDocument();
    // No individual tag buttons should exist
    const tagButtons = screen.queryAllByTestId(/^tag-/);
    // Filter out the container itself (tag-row) — only buttons should be absent
    const tagButtonElements = tagButtons.filter(
      (el) => el.getAttribute("data-testid") !== "tag-row",
    );
    expect(tagButtonElements).toHaveLength(0);
  });
});
