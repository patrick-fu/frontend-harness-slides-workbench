import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import FilterPanel, { type FilterOption } from "./FilterPanel";

const bandOptions: FilterOption[] = [
  { value: "minimal-keynote", label: "Minimal Keynote", count: 4 },
  { value: "text-report", label: "Text Report", count: 2 },
];

const modelOptions: FilterOption[] = [
  { value: "GPT 5.5", label: "GPT 5.5", count: 5 },
  { value: "Doubao-Seed-Evolving", label: "Doubao-Seed-Evolving", count: 3 },
  { value: "Claude Opus", label: "Claude Opus", count: 2 },
  { value: "Gemini", label: "Gemini", count: 1 },
  { value: "Mistral", label: "Mistral", count: 1 },
  { value: "Perplexity", label: "Perplexity", count: 1 },
  { value: "Cohere", label: "Cohere", count: 1 },
  { value: "Qwen", label: "Qwen", count: 1 },
  { value: "Llama", label: "Llama", count: 1 },
];

const defaultProps = {
  bandOptions,
  modelOptions,
  selectedBands: [] as string[],
  selectedModels: [] as string[],
  unavailableBands: [] as string[],
  unavailableModels: [] as string[],
  onToggleBand: vi.fn(),
  onToggleModel: vi.fn(),
  onClearFilters: vi.fn(),
  language: "en" as const,
};

describe("FilterPanel", () => {
  it("exposes separate Band and Model ID facets and toggles their values", () => {
    const onToggleBand = vi.fn();
    const onToggleModel = vi.fn();

    render(
      <FilterPanel
        {...defaultProps}
        onToggleBand={onToggleBand}
        onToggleModel={onToggleModel}
      />,
    );

    const bands = screen.getByRole("group", { name: "Category" });
    const models = screen.getByRole("group", { name: "Model ID" });
    fireEvent.click(within(bands).getByRole("button", { name: /Minimal Keynote/ }));
    fireEvent.click(within(models).getByRole("button", { name: /GPT 5\.5/ }));

    expect(onToggleBand).toHaveBeenCalledWith("minimal-keynote");
    expect(onToggleModel).toHaveBeenCalledWith("GPT 5.5");
  });

  it("keeps overflowing Model ID options in a searchable +N popover", () => {
    const onToggleModel = vi.fn();

    render(<FilterPanel {...defaultProps} onToggleModel={onToggleModel} />);

    const trigger = screen.getByRole("button", { name: "+1 Model IDs" });
    fireEvent.click(trigger);
    const popover = screen.getByRole("dialog", { name: "More Model IDs" });
    const searchbox = within(popover).getByRole("searchbox", { name: "Search Model IDs" });
    expect(searchbox).toHaveFocus();
    fireEvent.change(searchbox, {
      target: { value: "Lla" },
    });
    fireEvent.click(within(popover).getByRole("button", { name: /Llama/ }));

    expect(onToggleModel).toHaveBeenCalledWith("Llama");
    fireEvent.keyDown(popover, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "More Model IDs" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("opens the complete filter list in a mobile bottom sheet", () => {
    const onToggleModel = vi.fn();

    render(<FilterPanel {...defaultProps} onToggleModel={onToggleModel} />);

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    const sheet = screen.getByRole("dialog", { name: "Filters" });
    fireEvent.click(within(sheet).getByRole("button", { name: /Llama/ }));

    expect(onToggleModel).toHaveBeenCalledWith("Llama");
  });

  it("leaves zero-count options visible but unavailable", () => {
    render(
      <FilterPanel
        {...defaultProps}
        bandOptions={[
          ...bandOptions,
          { value: "craft-cultural", label: "Craft & Cultural", count: 0, disabled: true },
        ]}
      />,
    );

    expect(
      screen.getByRole("button", { name: /Craft & Cultural.*0/ }),
    ).toBeDisabled();
  });
});
