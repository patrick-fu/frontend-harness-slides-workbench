import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Style17, { getMetadata } from "./17-editorial-broadsheet";
import type { BespokeStyleProps, StyleMetadata } from "../types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function renderStage(props: Partial<BespokeStyleProps> = {}) {
  const defaultProps: BespokeStyleProps = {
    scene: 1,
    beat: 0,
    language: "en",
    isThumbnail: false,
    reducedMotion: false,
    onNavigate: vi.fn(),
    ...props,
  };
  // The Stage is 1920x1080 with container-type: size — simulate that
  return render(
    <div
      data-testid="stage"
      style={{
        width: 1920,
        height: 1080,
        containerType: "size",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Style17 {...defaultProps} />
    </div>
  );
}

const BEAT_COUNTS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 2,
  5: 1,
};

// ─── 1. All 5 scenes × all beats render without errors ──────────────────────

describe("Style 17 — Scene/Beat coverage", () => {
  it("renders all 5 scenes × all beats without throwing", () => {
    for (let scene = 1; scene <= 5; scene++) {
      const beatCount = BEAT_COUNTS[scene];
      for (let beat = 0; beat < beatCount; beat++) {
        const { unmount } = renderStage({ scene, beat });
        unmount();
      }
    }
  });

  it("renders scene 1 beat 0 (front page masthead)", () => {
    renderStage({ scene: 1, beat: 0 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 2 beat 0 (lead story headline)", () => {
    renderStage({ scene: 2, beat: 0 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 2 beat 1 (lead story full text)", () => {
    renderStage({ scene: 2, beat: 1 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 3 beat 0 (data sidebar stat 1)", () => {
    renderStage({ scene: 3, beat: 0 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 3 beat 1 (data sidebar stat 2)", () => {
    renderStage({ scene: 3, beat: 1 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 3 beat 2 (data sidebar stat 3)", () => {
    renderStage({ scene: 3, beat: 2 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 4 beat 0 (photo essay caption 1)", () => {
    renderStage({ scene: 4, beat: 0 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 4 beat 1 (photo essay caption 2)", () => {
    renderStage({ scene: 4, beat: 1 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("renders scene 5 beat 0 (editorial closing)", () => {
    renderStage({ scene: 5, beat: 0 });
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });
});

// ─── 2. isThumbnail=true: no interactive elements, onNavigate undefined ─────

describe("Style 17 — isThumbnail behavior", () => {
  it("does not render navigation elements when isThumbnail=true", () => {
    renderStage({ scene: 3, beat: 2, isThumbnail: true });
    const nav = screen.queryByTestId("style-17-nav");
    expect(nav).not.toBeInTheDocument();
  });

  it("renders hero scene (scene 3) when isThumbnail=true", () => {
    renderStage({ scene: 3, beat: 2, isThumbnail: true });
    // Should render the data sidebar content
    expect(screen.getByTestId("style-17-root")).toBeInTheDocument();
  });

  it("onNavigate is undefined when isThumbnail=true", () => {
    const onNavigate = vi.fn();
    render(
      <div style={{ width: 1920, height: 1080, containerType: "size" }}>
        <Style17
          scene={3}
          beat={2}
          language="en"
          isThumbnail={true}
          reducedMotion={false}
          onNavigate={undefined}
        />
      </div>
    );
    // No nav elements to click — verify none exist
    expect(screen.queryByTestId("style-17-nav")).not.toBeInTheDocument();
    // onNavigate should never have been called
    expect(onNavigate).not.toHaveBeenCalled();
  });
});

// ─── 3. isThumbnail=false: internal navigation elements exist ───────────────

describe("Style 17 — Navigation presence", () => {
  it("renders navigation elements when isThumbnail=false", () => {
    renderStage({ scene: 1, beat: 0, isThumbnail: false });
    expect(screen.getByTestId("style-17-nav")).toBeInTheDocument();
  });

  it("renders page number display", () => {
    renderStage({ scene: 3, beat: 0, isThumbnail: false });
    const nav = screen.getByTestId("style-17-nav");
    expect(nav).toHaveTextContent(/3/);
    expect(nav).toHaveTextContent(/5/);
  });
});

// ─── 4. Clicking internal nav calls onNavigate with correct (scene, beat) ───

describe("Style 17 — Navigation interaction", () => {
  let onNavigate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onNavigate = vi.fn();
  });

  it("clicking right half of nav goes to next scene", () => {
    renderStage({ scene: 1, beat: 0, isThumbnail: false, onNavigate });
    const navRight = screen.getByTestId("style-17-nav-right");
    fireEvent.click(navRight);
    // stopPropagation should have been called internally
    expect(onNavigate).toHaveBeenCalledWith(2, 0);
  });

  it("clicking left half of nav goes to previous scene", () => {
    renderStage({ scene: 3, beat: 0, isThumbnail: false, onNavigate });
    const navLeft = screen.getByTestId("style-17-nav-left");
    fireEvent.click(navLeft);
    expect(onNavigate).toHaveBeenCalledWith(2, 0);
  });

  it("clicking left on scene 1 wraps to scene 5", () => {
    renderStage({ scene: 1, beat: 0, isThumbnail: false, onNavigate });
    const navLeft = screen.getByTestId("style-17-nav-left");
    fireEvent.click(navLeft);
    expect(onNavigate).toHaveBeenCalledWith(5, 0);
  });

  it("clicking right on scene 5 wraps to scene 1", () => {
    renderStage({ scene: 5, beat: 0, isThumbnail: false, onNavigate });
    const navRight = screen.getByTestId("style-17-nav-right");
    fireEvent.click(navRight);
    expect(onNavigate).toHaveBeenCalledWith(1, 0);
  });

  it("nav click calls stopPropagation on the event", () => {
    renderStage({ scene: 2, beat: 0, isThumbnail: false, onNavigate });
    const navRight = screen.getByTestId("style-17-nav-right");
    const clickEvent = new MouseEvent("click", { bubbles: true });
    const stopPropagationSpy = vi.spyOn(clickEvent, "stopPropagation");
    fireEvent(navRight, clickEvent);
    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});

// ─── 5. reducedMotion=true: no CSS animations active ────────────────────────

describe("Style 17 — Reduced motion", () => {
  it("applies reduced-motion class when reducedMotion=true", () => {
    renderStage({ scene: 1, beat: 0, reducedMotion: true });
    const root = screen.getByTestId("style-17-root");
    expect(root).toHaveClass("reducedMotion");
  });

  it("does not apply reduced-motion class when reducedMotion=false", () => {
    renderStage({ scene: 1, beat: 0, reducedMotion: false });
    const root = screen.getByTestId("style-17-root");
    expect(root).not.toHaveClass("reducedMotion");
  });
});

// ─── 6. language="zh": Chinese text rendered ────────────────────────────────

describe("Style 17 — Chinese language", () => {
  it("renders Chinese headline on scene 1", () => {
    renderStage({ scene: 1, beat: 0, language: "zh" });
    expect(screen.getByText("变迁中的城市")).toBeInTheDocument();
  });

  it("renders Chinese editorial closing on scene 5", () => {
    renderStage({ scene: 5, beat: 0, language: "zh" });
    expect(screen.getByText("我们失去什么，获得什么")).toBeInTheDocument();
  });

  it("renders vertical writing mode for zh headline on scene 1", () => {
    renderStage({ scene: 1, beat: 0, language: "zh" });
    const headline = screen.getByTestId("style-17-headline");
    expect(headline).toHaveClass("verticalZh");
  });
});

// ─── 7. language="en": English text rendered ────────────────────────────────

describe("Style 17 — English language", () => {
  it("renders English headline on scene 1", () => {
    renderStage({ scene: 1, beat: 0, language: "en" });
    expect(screen.getByText("The Transforming City")).toBeInTheDocument();
  });

  it("renders English editorial closing on scene 5", () => {
    renderStage({ scene: 5, beat: 0, language: "en" });
    expect(screen.getByText("What we lose, what we gain")).toBeInTheDocument();
  });

  it("does not apply vertical writing mode for en headline", () => {
    renderStage({ scene: 1, beat: 0, language: "en" });
    const headline = screen.getByTestId("style-17-headline");
    expect(headline).not.toHaveClass("verticalZh");
  });
});

// ─── 8. No content overflows Stage ──────────────────────────────────────────

describe("Style 17 — Overflow check", () => {
  it("scene 1 does not overflow stage", () => {
    renderStage({ scene: 1, beat: 0 });
    const stage = screen.getByTestId("stage");
    expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
    expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
  });

  it("scene 2 does not overflow stage", () => {
    renderStage({ scene: 2, beat: 1 });
    const stage = screen.getByTestId("stage");
    expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
    expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
  });

  it("scene 3 does not overflow stage", () => {
    renderStage({ scene: 3, beat: 2 });
    const stage = screen.getByTestId("stage");
    expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
    expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
  });

  it("scene 4 does not overflow stage", () => {
    renderStage({ scene: 4, beat: 1 });
    const stage = screen.getByTestId("stage");
    expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
    expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
  });

  it("scene 5 does not overflow stage", () => {
    renderStage({ scene: 5, beat: 0 });
    const stage = screen.getByTestId("stage");
    expect(stage.scrollWidth).toBeLessThanOrEqual(stage.clientWidth + 1);
    expect(stage.scrollHeight).toBeLessThanOrEqual(stage.clientHeight + 1);
  });
});

// ─── 9. getMetadata returns complete structure ──────────────────────────────

describe("Style 17 — getMetadata structure", () => {
  let metaEn: StyleMetadata;
  let metaZh: StyleMetadata;

  beforeEach(() => {
    metaEn = getMetadata("en");
    metaZh = getMetadata("zh");
  });

  it("returns all required top-level fields", () => {
    expect(metaEn.id).toBe("17");
    expect(metaEn.band).toBe("editorial-print");
    expect(typeof metaEn.name).toBe("string");
    expect(metaEn.name.length).toBeGreaterThan(0);
    expect(typeof metaEn.theme).toBe("string");
    expect(metaEn.theme.length).toBeGreaterThan(0);
    expect(typeof metaEn.densityLabel).toBe("string");
    expect(metaEn.densityLabel.length).toBeGreaterThan(0);
  });

  it("returns valid colors", () => {
    expect(metaEn.colors.bg).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(metaEn.colors.ink).toMatch(/^#[0-9a-fA-F]{6}$/);
    expect(metaEn.colors.panel).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("returns typography hints", () => {
    expect(typeof metaEn.typography.header).toBe("string");
    expect(typeof metaEn.typography.body).toBe("string");
    expect(metaEn.typography.header.length).toBeGreaterThan(0);
    expect(metaEn.typography.body.length).toBeGreaterThan(0);
  });

  it("returns tags array with expected tags", () => {
    expect(Array.isArray(metaEn.tags)).toBe(true);
    expect(metaEn.tags).toContain("editorial");
    expect(metaEn.tags).toContain("newspaper");
    expect(metaEn.tags).toContain("serif");
    expect(metaEn.tags).toContain("dense");
    expect(metaEn.tags).toContain("academic");
    expect(metaEn.tags).toContain("light");
    expect(metaEn.tags).toContain("journalism");
    expect(metaEn.tags).toContain("urban");
    expect(metaEn.tags).toContain("multicolumn");
  });

  it("returns fonts with CJK prefix", () => {
    expect(metaEn.fonts).toContain("Playfair Display");
    expect(metaEn.fonts).toContain("Source Serif Pro");
    expect(metaEn.fonts).toContain("cjk:Noto Serif SC");
  });

  it("returns 5 scenes with correct beat counts", () => {
    expect(metaEn.scenes).toHaveLength(5);
    for (const scene of metaEn.scenes) {
      expect(scene.id).toBeGreaterThanOrEqual(1);
      expect(scene.id).toBeLessThanOrEqual(5);
      expect(typeof scene.title).toBe("string");
      expect(scene.title.length).toBeGreaterThan(0);
      expect(Array.isArray(scene.beats)).toBe(true);
      expect(scene.beats.length).toBeGreaterThan(0);
      for (const beat of scene.beats) {
        expect(typeof beat.id).toBe("number");
        expect(typeof beat.action).toBe("string");
        expect(typeof beat.title).toBe("string");
        expect(typeof beat.body).toBe("string");
      }
    }
    // Verify specific beat counts
    expect(metaEn.scenes[0].beats).toHaveLength(1);
    expect(metaEn.scenes[1].beats).toHaveLength(2);
    expect(metaEn.scenes[2].beats).toHaveLength(3);
    expect(metaEn.scenes[3].beats).toHaveLength(2);
    expect(metaEn.scenes[4].beats).toHaveLength(1);
  });

  it("zh metadata has localized name and theme", () => {
    expect(typeof metaZh.name).toBe("string");
    expect(metaZh.name.length).toBeGreaterThan(0);
    expect(typeof metaZh.theme).toBe("string");
    expect(metaZh.theme.length).toBeGreaterThan(0);
    // zh name should differ from en
    expect(metaZh.name).not.toBe(metaEn.name);
  });
});

// ─── 10. heroScene is valid, heroScene beats non-empty ──────────────────────

describe("Style 17 — heroScene validity", () => {
  it("heroScene is between 1 and 5", () => {
    const meta = getMetadata("en");
    expect(meta.heroScene).toBeGreaterThanOrEqual(1);
    expect(meta.heroScene).toBeLessThanOrEqual(5);
  });

  it("heroScene is scene 3 (data sidebar — most visually interesting)", () => {
    const meta = getMetadata("en");
    expect(meta.heroScene).toBe(3);
  });

  it("heroScene has non-empty beats", () => {
    const meta = getMetadata("en");
    const heroScene = meta.scenes.find((s) => s.id === meta.heroScene);
    expect(heroScene).toBeDefined();
    expect(heroScene!.beats.length).toBeGreaterThan(0);
  });
});
