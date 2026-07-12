import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GlobalControls from "./GlobalControls";

function renderControls(overrides: Partial<React.ComponentProps<typeof GlobalControls>> = {}) {
  const props: React.ComponentProps<typeof GlobalControls> = {
    view: "overview",
    language: "en",
    languageMode: "auto",
    themeMode: "auto",
    onLanguageChange: vi.fn(),
    onThemeChange: vi.fn(),
    onCopyLink: vi.fn(),
    onOpenControls: vi.fn(),
    onToggleFullscreen: vi.fn(),
    isFullscreen: false,
    ...overrides,
  };
  render(<GlobalControls {...props} />);
  return props;
}

describe("GlobalControls", () => {
  it("selects Language and Theme from explicit menus", () => {
    const props = renderControls();

    fireEvent.click(screen.getByRole("button", { name: /Language/ }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "中文" }));
    expect(props.onLanguageChange).toHaveBeenCalledWith("zh");

    fireEvent.click(screen.getByRole("button", { name: /Theme/ }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Dark" }));
    expect(props.onThemeChange).toHaveBeenCalledWith("dark");
  });

  it("lists separate Skill and Workbench GitHub destinations", () => {
    renderControls();
    fireEvent.click(screen.getByRole("button", { name: "More" }));

    const skill = screen.getByRole("menuitem", { name: /Slides skill on GitHub/ });
    const workbench = screen.getByRole("menuitem", { name: /Workbench on GitHub/ });
    expect(skill).toHaveAttribute(
      "href",
      "https://github.com/patrick-fu/frontend-harness-slides",
    );
    expect(workbench).toHaveAttribute(
      "href",
      "https://github.com/patrick-fu/frontend-harness-slides-workbench",
    );
    for (const link of [skill, workbench]) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("adds Fullscreen only in Player", () => {
    renderControls({ view: "lab" });
    fireEvent.click(screen.getByRole("button", { name: "More" }));
    expect(screen.getByRole("menuitem", { name: "Enter fullscreen" })).toBeVisible();
  });

  it("moves keyboard focus into an opened menu", async () => {
    renderControls();
    const more = screen.getByRole("button", { name: "More" });
    more.focus();
    fireEvent.keyDown(more, { key: "ArrowDown" });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(screen.getByRole("menuitem", { name: "Copy link" })).toHaveFocus();
  });

  it("traverses the More menu and restores its trigger on Escape", async () => {
    renderControls();
    const more = screen.getByRole("button", { name: "More" });
    more.focus();
    fireEvent.keyDown(more, { key: "ArrowDown" });
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const copy = screen.getByRole("menuitem", { name: "Copy link" });
    const workbench = screen.getByRole("menuitem", { name: /Workbench on GitHub/ });
    fireEvent.keyDown(copy, { key: "End" });
    expect(workbench).toHaveFocus();
    fireEvent.keyDown(workbench, { key: "Home" });
    expect(copy).toHaveFocus();
    fireEvent.keyDown(copy, { key: "Escape" });
    expect(screen.queryByRole("menu", { name: "More" })).not.toBeInTheDocument();
    expect(more).toHaveFocus();
  });
});
