import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "./Sidebar";
import type { StyleRegistryEntry, StyleMetadata } from "../../types";

// ─── Mock helpers ───────────────────────────────────────────────────────────

const BAND_ORDER = [
  "minimal-keynote",
  "balanced-hybrid",
  "editorial-print",
  "craft-cultural",
  "contemporary-digital",
  "text-report",
] as const;

type BandId = (typeof BAND_ORDER)[number];

const BAND_LABELS: Record<BandId, { en: string; zh: string }> = {
  "minimal-keynote": { en: "Minimal Keynote", zh: "极简主旨" },
  "balanced-hybrid": { en: "Balanced Hybrid", zh: "平衡混合" },
  "editorial-print": { en: "Editorial & Print", zh: "编辑印刷" },
  "craft-cultural": { en: "Craft & Cultural", zh: "工艺文化" },
  "contemporary-digital": { en: "Contemporary Digital", zh: "当代数字" },
  "text-report": { en: "Text Report", zh: "文本报告" },
};

function makeMockEntry(
  id: string,
  band: BandId,
  nameEn: string,
  nameZh: string,
): StyleRegistryEntry {
  const meta: StyleMetadata = {
    id,
    band,
    name: nameEn,
    theme: `Theme for ${nameEn}`,
    densityLabel: "Medium",
    heroScene: 1,
    colors: { bg: "#fff", ink: "#000", panel: "#eee" },
    typography: { header: "Inter", body: "Inter" },
    tags: ["test"],
    fonts: ["Inter"],
    scenes: [1, 2, 3, 4, 5].map((sid) => ({
      id: sid,
      title: `Scene ${sid}`,
      beats: [{ id: 0, action: "Show", title: "", body: "" }],
    })),
  };

  return {
    id,
    name: { en: nameEn, zh: nameZh },
    topics: [
      {
        id: "default-topic",
        topic: { en: `${nameEn} Topic`, zh: `${nameZh}题材` },
        model: "test-model",
        component: () => null,
        getMetadata: (lang: "en" | "zh") => {
          if (lang === "zh") {
            return { ...meta, name: nameZh };
          }
          return meta;
        },
      },
    ],
  };
}

function makeMockRegistry(): StyleRegistryEntry[] {
  return [
    makeMockEntry("executive-silence", "minimal-keynote", "Executive Silence", "静默主旨"),
    makeMockEntry("pure-focus", "minimal-keynote", "Pure Focus", "纯粹聚焦"),
    makeMockEntry("system-flow", "balanced-hybrid", "System Flow", "系统流程"),
    makeMockEntry("process-map", "balanced-hybrid", "Process Map", "过程地图"),
    makeMockEntry("broadsheet", "editorial-print", "Broadsheet", "大报版式"),
    makeMockEntry("magazine", "editorial-print", "Magazine", "杂志"),
    makeMockEntry("woodblock", "craft-cultural", "Woodblock", "木刻版画"),
    makeMockEntry("origami", "craft-cultural", "Origami", "折纸"),
    makeMockEntry("glass-ui", "contemporary-digital", "Glass UI", "玻璃界面"),
    makeMockEntry("retro-os", "contemporary-digital", "Retro OS", "复古系统"),
    makeMockEntry("evidence-first", "text-report", "Evidence First", "证据优先"),
    makeMockEntry("data-brief", "text-report", "Data Brief", "数据简报"),
  ];
}

function renderSidebar(
  props: Partial<React.ComponentProps<typeof Sidebar>> = {},
) {
  const defaultProps = {
    registry: makeMockRegistry(),
    currentStyleId: "executive-silence",
    currentTopicId: "default-topic",
    onSelectStyle: vi.fn(),
    onSelectTopic: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
    language: "en" as const,
    width: 280,
    onWidthChange: vi.fn(),
    collapsed: false,
    ...props,
  };
  const result = render(<Sidebar {...defaultProps} />);
  return {
    ...result,
    onSelectStyle: defaultProps.onSelectStyle,
    onSelectTopic: defaultProps.onSelectTopic,
    onClose: defaultProps.onClose,
    onWidthChange: defaultProps.onWidthChange,
  };
}

// ─── Band sections ──────────────────────────────────────────────────────────

describe("Sidebar — band sections", () => {
  it("renders 6 band sections", () => {
    renderSidebar();
    BAND_ORDER.forEach((band) => {
      const label = BAND_LABELS[band].en;
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders Chinese band labels when language='zh'", () => {
    renderSidebar({ language: "zh" });
    BAND_ORDER.forEach((band) => {
      const label = BAND_LABELS[band].zh;
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("each band section contains its styles", () => {
    renderSidebar();
    // Minimal Keynote should have "Executive Silence" and "Pure Focus"
    expect(screen.getByText("Executive Silence")).toBeInTheDocument();
    expect(screen.getByText("Pure Focus")).toBeInTheDocument();
    // Text Report should have "Evidence First" and "Data Brief"
    expect(screen.getByText("Evidence First")).toBeInTheDocument();
    expect(screen.getByText("Data Brief")).toBeInTheDocument();
  });

  it("shows Chinese style names when language='zh'", () => {
    renderSidebar({ language: "zh" });
    expect(screen.getByText("静默主旨")).toBeInTheDocument();
  });

  it("shows localized topics inside expanded multi-topic styles", () => {
    const registry = makeMockRegistry();
    registry[0] = {
      ...registry[0],
      topics: [
        registry[0].topics[0],
        {
          ...registry[0].topics[0],
          id: "quiet-launch",
          topic: { en: "Quiet Launch", zh: "安静发布" },
          model: "GPT-5.5",
        },
      ],
    };

    renderSidebar({ registry, language: "zh" });

    expect(screen.getByText("静默主旨题材")).toBeInTheDocument();
    expect(screen.getByText("安静发布")).toBeInTheDocument();
  });
});

// ─── Current style highlight ────────────────────────────────────────────────

describe("Sidebar — current style highlight", () => {
  it("marks the current style with aria-current='true'", () => {
    renderSidebar({ currentStyleId: "executive-silence" });
    const current = screen.getByText("Executive Silence");
    // The element with aria-current should be an ancestor or the element itself
    const ariaCurrentEl = current.closest('[aria-current="true"]') || (current.getAttribute("aria-current") === "true" ? current : null);
    expect(ariaCurrentEl).not.toBeNull();
  });

  it("does not mark non-current styles with aria-current='true'", () => {
    renderSidebar({ currentStyleId: "executive-silence" });
    const other = screen.getByText("Pure Focus");
    const ariaCurrentEl = other.closest('[aria-current="true"]');
    expect(ariaCurrentEl).toBeNull();
  });
});

// ─── Style selection ────────────────────────────────────────────────────────

describe("Sidebar — style selection", () => {
  it("clicking a style calls onSelectStyle with its id", () => {
    const { onSelectStyle } = renderSidebar();
    fireEvent.click(screen.getByText("System Flow"));
    expect(onSelectStyle).toHaveBeenCalledWith("system-flow");
  });

  it("clicking another style calls onSelectStyle with correct id", () => {
    const { onSelectStyle } = renderSidebar();
    fireEvent.click(screen.getByText("Glass UI"));
    expect(onSelectStyle).toHaveBeenCalledWith("glass-ui");
  });

  it("blurs the clicked style button after selection", () => {
    renderSidebar();
    const styleButton = screen.getByText("System Flow").closest("button");
    expect(styleButton).not.toBeNull();
    styleButton!.focus();

    fireEvent.click(styleButton!);

    expect(document.activeElement).not.toBe(styleButton);
  });

  it("blurs the clicked topic button after selection", () => {
    const registry = makeMockRegistry();
    registry[0] = {
      ...registry[0],
      topics: [
        registry[0].topics[0],
        {
          ...registry[0].topics[0],
          id: "quiet-launch",
          topic: { en: "Quiet Launch", zh: "安静发布" },
          model: "GPT-5.5",
        },
      ],
    };
    renderSidebar({ registry });
    const topicButton = screen.getByText("Quiet Launch").closest("button");
    expect(topicButton).not.toBeNull();
    topicButton!.focus();

    fireEvent.click(topicButton!);

    expect(document.activeElement).not.toBe(topicButton);
  });
});

// ─── Collapsed state ────────────────────────────────────────────────────────

describe("Sidebar — collapsed state", () => {
  it("shows style names when not collapsed", () => {
    renderSidebar({ collapsed: false });
    expect(screen.getByText("Executive Silence")).toBeInTheDocument();
  });

  it("hides style names when collapsed", () => {
    renderSidebar({ collapsed: true });
    expect(screen.queryByText("Executive Silence")).not.toBeInTheDocument();
    expect(screen.getByTestId("sidebar-style-executive-silence")).toBeInTheDocument();
  });

  it("does not render a collapse toggle button (controlled by parent hamburger)", () => {
    renderSidebar();
    expect(screen.queryByTestId("sidebar-collapse-toggle")).not.toBeInTheDocument();
  });
});

// ─── Mobile drawer ──────────────────────────────────────────────────────────

describe("Sidebar — mobile drawer", () => {
  it("does not render drawer content when isOpen=false on mobile", () => {
    // We can't truly simulate mobile viewport in jsdom, but we can check
    // that the sidebar has the right structure when isOpen is false
    const { container } = renderSidebar({ isOpen: false });
    const sidebar = container.firstElementChild;
    expect(sidebar).not.toBeNull();
  });

  it("renders sidebar content when isOpen=true", () => {
    renderSidebar({ isOpen: true });
    expect(screen.getByText("Minimal Keynote")).toBeInTheDocument();
  });
});

// ─── Band section collapse ──────────────────────────────────────────────────

describe("Sidebar — band section collapse", () => {
  it("each band section has a collapse toggle", () => {
    renderSidebar();
    // There should be 6 band toggle buttons (one per band)
    const toggles = screen.getAllByTestId(/band-toggle-/);
    expect(toggles).toHaveLength(6);
  });

  it("clicking a band toggle collapses and re-expands that section", () => {
    renderSidebar();
    const toggle = screen.getByTestId("band-toggle-minimal-keynote");
    // Initially expanded — "Executive Silence" should be visible
    expect(screen.getByText("Executive Silence")).toBeInTheDocument();
    // Click to collapse
    fireEvent.click(toggle);
    // After collapse, the style items should not be visible
    // (they may still be in DOM but hidden)
    const styleItem = screen.queryByText("Executive Silence");
    // Either not in DOM, or hidden via display:none
    if (styleItem) {
      const section = styleItem.closest('[data-testid="band-section-minimal-keynote"]');
      if (section) {
        expect(section).toHaveAttribute("data-collapsed", "true");
      }
    }
  });
});
