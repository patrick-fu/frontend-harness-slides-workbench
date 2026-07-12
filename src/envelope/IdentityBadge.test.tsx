import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RUNTIME_CATALOG } from "../catalog/runtime-catalog";
import IdentityBadge from "./IdentityBadge";

const group = RUNTIME_CATALOG.discovery.styleGroups.find(
  (entry) => entry.style.id === "minimal-product-keynote",
)!;

describe("Identity Badge", () => {
  it("keeps the active Style, Topic, and exact Model ID visible and opens the Topic Switcher", () => {
    const current = group.topics.find(
      (topic) => topic.id === "product-keynote",
    )!;
    render(
      <IdentityBadge
        group={group}
        topicId={current.id}
        topicOptions={group.topics}
        language="en"
        onSelectTopic={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: `${group.style.name.en} · ${current.title.en} · ${current.modelId} · Open Topic Switcher`,
    });
    expect(trigger).toHaveTextContent(group.style.name.en);
    expect(trigger).toHaveTextContent(current.title.en);
    expect(trigger).toHaveTextContent(current.modelId);

    fireEvent.click(trigger);

    expect(
      screen.getByRole("dialog", { name: "Topic Switcher" }),
    ).toBeVisible();
  });

  it("selects only from the supplied Topic options and restores focus after closing", async () => {
    const current = group.topics.find(
      (topic) => topic.id === "product-keynote",
    )!;
    const next = group.topics.find((topic) => topic.id !== current.id)!;
    const onSelectTopic = vi.fn();
    render(
      <IdentityBadge
        group={group}
        topicId={current.id}
        topicOptions={[current, next]}
        language="en"
        onSelectTopic={onSelectTopic}
      />,
    );

    const trigger = screen.getByRole("button", {
      name: `${group.style.name.en} · ${current.title.en} · ${current.modelId} · Open Topic Switcher`,
    });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(
      screen.getByRole("button", {
        name: `${next.title.en} · ${next.modelId}`,
      }),
    );

    expect(onSelectTopic).toHaveBeenCalledOnce();
    expect(onSelectTopic).toHaveBeenCalledWith(next.id);
    expect(
      screen.queryByRole("dialog", { name: "Topic Switcher" }),
    ).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
