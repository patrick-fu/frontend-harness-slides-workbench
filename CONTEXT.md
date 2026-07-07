# Project Context

Unified glossary, decisions, and progress for frontend-harness-slides-workbench.

---

## Current State Override

This file is a historical decision log. Source and tests are authoritative when
older entries differ.

Current routing and registry contract:

- Styles use semantic slug IDs, not numeric sequence IDs.
- Topics are the unit inside a style; there is no v1/v2 URL or compatibility
  layer.
- `STYLE_REGISTRY` array order defines style order, and each entry's `topics`
  array defines topic order.
- Stable URLs use query parameters:
  `?view=lab&style=<style-id>&topic=<topic-id>&scene=<n>&beat=<n>`.
- The active catalog currently contains 49 registered styles.

---

## Domain Glossary

### Style (风格)

A self-contained slide presentation with its own visual DNA. Each Style is authored in isolation — the agent building a Style does not know it will be wrapped in a Workbench. A Style exports:

- A React component that receives `scene`, `beat`, `language`, `isThumbnail`, `onNavigate`
- A `getMetadata(lang)` function returning localized metadata

Each Style has a unique semantic slug ID (e.g. `"minimal-product-keynote"`,
`"engineering-whiteboard-explainer"`). There are 49 Styles total, organized
into 6 Bands.

### Band (风格族)

A high-level grouping of Styles by visual family. The 6 Bands are:

1. **Minimal Keynote** — sparse, premium, one-idea-per-slide
2. **Balanced Hybrid** — medium density, systematic, process-oriented
3. **Editorial & Print** — publication-inspired, serif authority, magazine/broadsheet
4. **Craft & Cultural Traditions** — handmade, cultural, material-specific (woodblock, cyanotype, risograph)
5. **Contemporary Digital** — modern UI language, glass, grid, retro-OS
6. **Text Report** — evidence-first, dense, structured reading

### Scene (场景)

One of 5 major narrative sections within a Style. The count is fixed at 5 per Style — this is a structural invariant. Scenes are numbered 1 through 5.

### Beat (节拍)

A sub-step within a Scene that represents a meaningful story state change. Beat count is **dynamic per Scene** — Scene 1 may have 1 beat, Scene 5 may have 5. Beats are zero-indexed.

A Beat is not a decorative fade; it is a reviewable story state that changes what the audience understands.

### Overview View (总览视图)

A responsive grid showing all Styles as 16:9 thumbnail cards. Supports tag-based AND filtering. This is the "lobby" of the Workbench.

### Lab View (实验室视图)

The single-Style interactive presentation hall. Shows the 16:9 Stage with Workbench chrome (sidebar, header, bottom progress bar) around it.

### Pure Mode (纯净模式)

A display state where all Workbench chrome is hidden and only the Style's Stage is visible, centered and maximized in the viewport. Activated via `&pure=1` URL parameter. Used for:

- Clean screenshots and recording
- iframe embedding without visual pollution
- Focused single-Style presentation

In Pure Mode, only the Style's own internal navigation and global keyboard/touch/click-zone inputs remain functional. No floating controls or exit buttons are rendered. Exit via browser back button or `Esc` key.

### Envelope (外壳)

The Workbench chrome that wraps the Stage: header (language/theme toggles, GitHub link), sidebar (style catalog), bottom bar (scene progress, beat progress, prev/next). The Envelope uses viewport-relative units (`px`, `rem`) and is responsive to viewport size.

### Stage (舞台)

The 16:9 fixed-ratio canvas (nominal 1920×1080) where a Style renders. The Stage uses `container-type: size` so that `cqw`/`cqh` units inside the Style resolve relative to the Stage dimensions, not the viewport. The Stage scales as a whole via CSS `transform: scale()`.

### Internal Navigation (内嵌导航)

Navigation UI rendered **inside** the Stage by a Style component. Each Style designs its own Internal Navigation to match its aesthetic (360° spatial dispersal, ghost/weakened presence). This is the Style's own navigation, not the Workbench's.

Internal Navigation communicates with the Envelope via the `onNavigate(scene, beat)` callback.

### Topic（题材）

风格内的主题/内容方向，如 "Product Keynote"、"From Prompt to Patch"。
Topic 使用稳定语义 ID，通过 `topic` query 参数定位。

### Model Label（模型标签）

每个 Topic 的元信息中包含编写该 Topic 的模型名称，如
"Doubao-Seed-Evolving"、"GPT-5.5"。显示在 TopicBar 和 Topic 信息中。

### TopicBar（题材条）

Header 下方的紧凑信息条，显示当前位置：`风格名 › 题材名 [模型]`。

### Registry (注册表)

The authoritative array of all available Styles. Each entry contains the
Style's ID, localized name, and a `topics` array. This is the single source of
truth for enumeration.

### Active Styles List (活跃风格列表)

The full set of all 49 Styles. This is the list used for cross-style Next/Prev
cycling. Filtering does **not** change the Active Styles List — it only affects
Overview View visibility.

### Filter (过滤器)

Tag-based AND filtering that controls which Style cards are visible in Overview View. Does not affect Lab View navigation cycling. Two-layer:

1. **Band quick-filter** — select one or more Bands to narrow the set
2. **Tag cloud refine** — multi-select tags (mood, tone, density, etc.) with AND intersection logic

### Navigation State (导航状态)

The current position tuple: `(styleId, scene, beat)`. This state is fully reflected in the URL query parameters for stable frame addressing.

### Seamless Cycling (无缝循环)

When advancing past the last Beat of Scene 5 of a Style, the system cycles to
Scene 1, Beat 0 of the **next Style in the Active Styles List**. Similarly for
Prev going backward. This creates an infinite loop across all 49 Styles.

### Theme Mode (深浅色模式)

The Envelope's color scheme: `auto` (follows system), `light`, or `dark`. Persisted in localStorage. Does not affect individual Style visuals (each Style controls its own background/foreground).

### Language Mode (语言模式)

`auto`, `en`, or `zh`. Controls both Envelope UI text and the `language` prop passed to Style components. Persisted in localStorage. Auto mode follows `navigator.language`: `zh-*` → Chinese, everything else → English.

### Harness Contract (线束契约)

The set of invariants that any slide implementation must satisfy to survive iteration:

- **Stable Frame Address** — every scene/beat reachable by stable URL
- **Fixed Stage** — 1920×1080 base, scales as a whole
- **Frozen Mode** — deterministic render for tests (settled end state)
- **Audit Surface** — checks catch overflow, missing content, console errors
- **Registry** — enumerable source of truth for order and beat counts

### Thumbnail Mode (缩略图模式)

When a Style is rendered in Overview View cards (`isThumbnail={true}`), it must suppress Internal Navigation UI and any interactive elements. The `onNavigate` prop is `undefined` in this mode.

---

## Decision Snapshot

```
deck_root:        ~/dev/frontend-harness-slides-workbench
project_type:     Workbench demo site (not a slide deck itself)
purpose:          Showcase 48 bespoke slide styles in a browser-able framework
audience:         Internal review + external iframe embedding + demo visitors
technology_stack: React 19 + Vite 6 + Tailwind CSS v4 + TypeScript + Playwright
stage:            1920x1080 fixed, container-type: size, CSS transform scale()
style_count:      48 (all from skill Design DNA catalog)
style_isolation:  Each style fully self-contained; sub-agents build without knowing Workbench exists
shared_infra:     None initially; extract common patterns after all 48 are built
delivery_target:  Vercel (via GitHub Actions CI)
non_goals:        Not a slide authoring tool; not an npm package; not a presentation runner
```

---

## Decisions

### D01 — Mixed-Mode Envelope/Stage Boundary

The Workbench is a "movie theater" — it wraps independent "films" (Styles). Each Style is built in isolation by a sub-agent who does not know the Workbench exists.

- **Envelope chrome** (header, sidebar, bottom bar, scene tabs): outside the Stage, uses `px`/`rem`, responsive to viewport.
- **Style content + internal navigation**: inside the Stage, uses `cqw`/`cqh`, scales with the Stage.
- **Communication**: via `onNavigate(scene, beat)` callback prop passed to Style component.
- **Keyboard/touch/click-zone listeners**: attached at Envelope level. Style internal elements call `e.stopPropagation()`.

This is not a Viewport Trap violation because the Workbench is a meta-application, not a slide deck.

### D02 — Pure Mode via URL Parameter

Pure Mode activated by `&pure=1` query parameter. Behavior:

- Hides all Envelope chrome. Stage scales to fill viewport, centered.
- No floating exit button — fully bare. Exit via browser back or `Esc`.
- Keyboard/touch/click-zone and Style internal navigation still active.
- **No cross-style cycling in Pure Mode**: at last beat of Scene 5, Next does nothing (no-op). Pure Mode is for single-Style focus.
- Use cases: clean screenshots, iframe embedding, focused presentation.

### D03 — Active Styles List = All 48 (Filter Does Not Affect Cycling)

The Active Styles List for seamless cross-style cycling is always the full 48. Filtering only affects Overview View card visibility, not Lab View navigation order.

### D04 — Filter System: Two-Layer Composite

1. **Band quick-filter** (6 bands): multi-select, OR within band layer.
2. **Tag cloud refine**: extracted from all Style metadata tags (mood, tone, formality, density, scheme, motion, aliases). Multi-select with AND intersection logic.

Combined: Band filter narrows the pool, then tag cloud further refines with AND.

### D05 — Bottom Progress Bar: Dual-Layer

Scene level: 5 fixed dots (scenes are always 5 per Style).
Beat level: dynamic progress bar + "N/M" digital readout for current scene's beat count.

### D06 — Style Content: Sub-Agent Self-Generated from Design DNA

Each of the 48 styles built by a sub-agent who receives:
- The skill's Design DNA for that style
- The BespokeStyleProps interface contract
- The getMetadata interface contract

The sub-agent independently decides:
- Narrative content (what the 5 scenes are about)
- Beat count per scene (dynamic, not fixed at 3)
- Scene titles and beat copy (EN + ZH)
- Internal navigation placement and design
- Scene transition model (H-Slide, V-Slide, Magic Move, Mechanical Stamp)

Constraint: content must semantically fit the style's visual DNA.

### D07 — Implementation Phasing

```
Phase 1: 2-3 reference styles (validate contract, prove the pattern works)
Phase 2: Envelope framework (Overview, Lab, Pure Mode, nav, filter, theme, i18n)
Phase 3: Batch production of remaining 45+ styles (parallel sub-agents)
Phase 4: Extract shared infrastructure (after all styles exist)
```

### D08 — Metadata Structure: PRD-Specified Rich Format (Unified)

All styles use the PRD §1.2.2 rich metadata structure. No Variant A/B split:

```typescript
{
  id: string;                    // "01" .. "48"
  band: string;                  // visual family: "minimal-keynote" | "balanced-hybrid" | "editorial-print" | "craft-cultural" | "contemporary-digital" | "text-report"
  name: string;                  // localized
  theme: string;                 // localized
  densityLabel: string;          // localized
  heroScene: number;             // 1-5, which scene to show in Overview thumbnail
  colors: { bg, ink, panel };
  typography: { header, body };
  tags: string[];                // mood, tone, formality, density, scheme, motion, aliases — used for filter
  scenes: Array<{
    id: number;                  // 1-5
    title: string;               // localized
    beats: Array<{
      id: number;                // 0-based
      action: string;            // localized
      title: string;             // localized
      body: string;              // localized
    }>
  }>
}
```

`scene.title` (not `scene.name`). Beat objects always have `{id, action, title, body}`. No `tier` field — classification is via `band` + `tags`.

### D09 — Routing: URL Query Parameters

All navigation state in URL query params:

```
?view=lab&style=01&scene=1&beat=0&pure=0
```

- `view`: `"overview"` | `"lab"`
- `style`: two-digit string ID
- `scene`: 1-5
- `beat`: 0-based index
- `pure`: `"1"` activates Pure Mode

No React Router. Use `history.pushState`/`replaceState` + `popstate` listener.

### D10 — No Shared Infrastructure Initially

Phase 1-3: each style is 100% self-contained — own font imports, own CSS animations, own scene transition logic, own beat state handling. No shared `<SceneTrack>` component, no shared animation utility library.

Phase 4: after all 48 styles are built, identify common patterns and extract shared infrastructure.

### D11 — Scene Transitions: Style-Controlled, Fully Self-Determined

Each Style fully controls its own scene transitions. The Envelope only updates `scene`/`beat` props; the Style decides how to animate between them (H-Slide, V-Slide, Magic Move, Mechanical Stamp, or anything else). This preserves diversity across 48 styles.

The Envelope does NOT provide transition containers, animation classes, or easing curves. Each Style imports/defines its own.

### D12 — Cross-Style Cycling: Top-Bar Notification + Sidebar Flash

**Lab View**: When Next crosses a Style boundary (Scene 5 last beat → next Style Scene 1 Beat 0), two things happen simultaneously:

1. **Stage top notification bar**: A thin bar slides down from the top of the Stage area showing `"Style 02 — Swiss Precision"`. Fades in 200ms, holds 800ms, fades out 200ms. Does not block keyboard input.
2. **Sidebar highlight flash**: The new Style entry in the sidebar briefly pulses/flashes to draw attention.

**Pure Mode**: No cross-style cycling at all. At Scene 5 last beat, Next is a no-op.

### D13 — Overview Thumbnail: heroScene + Last Beat

Each Style's `getMetadata` includes a `heroScene` field (1-5) chosen by the sub-agent as the most representative scene. The Overview card thumbnail renders `heroScene` at its **last beat** (settled complete state), giving the fullest visual impression of the Style.

Card layout: thumbnail on top, Style name + ID below it. No specimen table, no scene list, no metadata badges.

### D14 — Classification: Band Only, No Tier

Discard PRD's `tier: "A" | "B" | "C"` classification. Use `band` (6 visual families) as the primary grouping dimension, plus `tags` array (extracted from skill Design DNA: mood, tone, formality, density, scheme, motion, aliases) for fine-grained filtering.

Rationale: Tier A/B/C is orthogonal to visual family and adds confusion. A single "Craft & Cultural" band can contain both kinetic (A-like) and reading-first (C-like) styles. The 6 bands + tag cloud give richer, more accurate filtering than 3 tiers.

### D15 — Overview → Lab Navigation: Full Card Click → Scene 1 Beat 0

Clicking anywhere on an Overview card navigates to Lab view for that Style, starting at Scene 1, Beat 0 (the very beginning). Not the heroScene, not the last beat — always the start so the user can experience the full narrative flow.

### D16 — Resource Declaration in Metadata + Envelope Deduplication

Fonts and similar shared resources follow a declaration pattern:

1. `getMetadata()` includes a `fonts: string[]` field listing all font families the Style needs (e.g. `["Playfair Display", "Noto Serif SC"]`).
2. The Envelope collects all `fonts` arrays from the Registry, deduplicates, and injects a single `<link>` preload in `<head>`.
3. Each Style component still includes its own `@import` or `@font-face` as a fallback — it remains self-contained and renderable without the Envelope.
4. This same pattern applies to other potentially-duplicated resources (icon sets, animation libraries, etc.) — declare in metadata, Envelope deduplicates, component keeps fallback.

This preserves D10's self-containment principle while solving the Overview-grid font-storm problem.

### D17 — Invalid URL Params: Silent Correction + replaceState

When the user navigates with invalid query parameters (out-of-range style ID, scene, beat, or unrecognized view), the system silently clamps to valid values and corrects the URL via `history.replaceState` (no history pollution).

- `style` not in registry → fallback to `"01"`
- `scene` outside 1-5 → clamp to nearest valid (1 or 5)
- `beat` outside 0..maxBeat for that scene → clamp to nearest valid
- `view` not `"overview"` or `"lab"` → fallback to `"overview"`
- `pure` not `"0"` or `"1"` → fallback to `"0"`

No error page, no toast. The URL is always a stable, valid frame address.

### D18 — Keyboard Input Throttling: 150ms Debounce

The Envelope applies a 150ms debounce on keyboard-driven navigation (arrow keys, space). After each scene/beat change, subsequent keyboard events within 150ms are ignored.

- Prevents accidental multi-skip on long key press (per skill verification spec).
- Fast deliberate taps still work (150ms is generous enough for normal typing cadence).
- Touch/swipe/click-zone navigation is NOT throttled — those are discrete physical gestures.
- Style internal navigation elements are also NOT throttled by the Envelope (they call `onNavigate` directly; if a Style wants its own debounce, it implements it internally).

### D19 — Sidebar Style List: Band-Grouped Collapsible

Lab View sidebar organizes the 48 Styles into 6 collapsible Band sections.

- Each section header shows the Band name (e.g. "Minimal Keynote") with a collapse/expand toggle.
- Within each section, Styles are listed in numerical order: `"01  Executive Silence"`, `"02  Swiss Precision"`, etc.
- The currently active Style is highlighted and auto-scrolled into view.
- All sections default to expanded on first load. Collapse state is NOT persisted (keeps it simple).
- On mobile (`< 768px`), the sidebar collapses into a slide-over drawer triggered by a hamburger button in the header.

### D20 — Overview Card Lazy Loading via IntersectionObserver

Overview View uses `IntersectionObserver` to lazy-mount Style components in thumbnail cards.

- Initially, only cards within the viewport (plus a small rootMargin buffer) mount their full Style component.
- Cards not yet loaded show a placeholder: the Style's `metadata.colors.bg` as background, with the Style name + ID overlaid. This preserves visual richness without the mount cost.
- Once a card has been mounted, it stays mounted (no unmount on scroll-out) — avoids re-mount thrash during fast scrolling.
- The Envelope's font deduplication preload still runs at startup, so when a lazy card mounts, its fonts are likely already loaded.

### D21 — Reduced Motion: Envelope Detection + Prop Pass-Through

The Envelope detects `prefers-reduced-motion: reduce` via `matchMedia` and:

1. Disables its own animations (sidebar slide, filter fade, flash notification) — instant transitions instead.
2. Passes `reducedMotion: boolean` as an additional prop to every Style component.
3. Each Style decides how to honor the flag (typically setting `transition-duration: 0s` or simplifying animations).

This is an accessibility baseline. The prop is additive (optional, defaults to false) so existing Style contracts don't break.

### D22 — Per-Style Error Boundary

Every Style render site (Lab View Stage, Overview card thumbnail) is wrapped in its own React ErrorBoundary.

- If a Style throws during render, only that component's slot is affected.
- Fallback display: the Style's `metadata.colors.bg` as background, with "Style XX — render failed" text overlay.
- In Overview, one broken card does not affect the other 47.
- In Lab View, a broken Stage shows the fallback but sidebar/header/bottom bar remain functional.
- Error details are logged to console with the Style ID for debugging.

### D23 — Scene Navigation: Bottom Bar Dots Are the Switcher

No separate scene tab bar. The 5 scene dots in the bottom progress bar are the scene switcher.

- Clicking a dot jumps to that scene, beat 0.
- The dots show scene number; the current scene is highlighted.
- No scene titles displayed in the bottom bar (keeps it compact).
- Scene titles are available in the sidebar style detail panel (if we add one later) and in the Style's own internal navigation.

This keeps the Envelope minimal and avoids redundant navigation surfaces.

### D24 — Filter State in URL Query Params

Overview filter state is fully encoded in URL query parameters:

```
?view=overview&bands=minimal-keynote,editorial-print&tags=premium,dense
```

- `bands`: comma-separated Band IDs (OR logic within this layer).
- `tags`: comma-separated tag strings (AND logic within this layer).
- When both are absent, show all 48 Styles unfiltered.
- Filter changes use `history.pushState` (not replaceState) so browser back/forward works through filter changes.
- This makes filtered views shareable, bookmarkable, and refresh-safe.

### D25 — Mobile Touch Navigation: Swipe + Edge Tap

On touch devices, the Stage area supports:

- **Horizontal swipe left** → Next beat
- **Horizontal swipe right** → Prev beat
- **Tap right half of Stage** → Next beat
- **Tap left half of Stage** → Prev beat
- **Vertical swipe** → does NOT trigger navigation (prevents accidental triggers from scroll)
- Swipe threshold: 50px minimum horizontal displacement to register.
- These are in addition to the bottom bar prev/next buttons and the Style's own internal navigation.

### D26 — Frozen Mode: URL Param + Global CSS Override

Activated by `&frozen=1` query parameter. When active:

1. Envelope sets `data-frozen="true"` on the `<html>` element.
2. A global CSS rule forces all animations and transitions to instant:
   ```css
   [data-frozen="true"] * {
     animation-duration: 0s !important;
     transition-duration: 0s !important;
   }
   ```
3. `reducedMotion={true}` is also passed to the Style component as a belt-and-suspenders measure.
4. `frozen` is not persisted — it is a per-request flag for Playwright tests only.

This gives tests deterministic settled end states without requiring each of the 48 Styles to implement custom frozen-mode logic. Edge cases (JS-driven animations) are handled by the individual Style if needed.

### D27 — Style Registry: Explicit Manual Array

Style files live flat in `src/styles/` as `01-executive-silence.tsx`, `02-swiss-precision.tsx`, etc. A `src/styles/registry.ts` manually imports all 48 and exports a typed array:

```typescript
import * as Style01 from "./01-executive-silence";
import * as Style02 from "./02-swiss-precision";
// ... 48 total

export const STYLE_REGISTRY = [
  { id: "01", component: Style01.default, getMetadata: Style01.getMetadata },
  { id: "02", component: Style02.default, getMetadata: Style02.getMetadata },
  // ...
];
```

- Explicit over implicit: no build-time scanning, no dynamic import magic.
- IDE-friendly: go-to-definition, find-references all work.
- Each style file exports `default` (the React component) and `getMetadata(lang)`.
- Registry order is the canonical order used for cross-style cycling and Overview grid.

### D28 — Beat Animation Interruption: Style-Controlled + Debounce Guard

Two-layer approach:

1. **D18's 150ms keyboard debounce** prevents accidental long-press multi-skip. This is the first line of defense.
2. **Envelope updates scene/beat props immediately** when a valid navigation event fires (keyboard, click-zone, swipe, sidebar, internal nav). It does NOT wait for the Style's transition to complete.
3. **The Style decides how to handle mid-animation prop changes**. Most CSS `transition`-based animations will naturally interpolate to the new target state when interrupted. JS-driven animations should also handle prop changes gracefully (the sub-agent building the Style is responsible for this).
4. No `onTransitionComplete` callback in the interface — keeps the contract simple.

### D29 — Bottom Bar Beat Layer: Progress Bar + Digital Readout

The bottom progress bar has two layers:

1. **Scene layer**: 5 fixed dots (always 5, since scenes are always 5 per Style). Current scene highlighted. Clickable to jump to that scene (beat 0).
2. **Beat layer**: a horizontal progress bar showing current beat position within the current scene, plus a digital readout `"3/5"` (current beat 1-based / total beats in scene).

The beat count is dynamic per scene — read from `style.scenes[scene - 1].beats.length`. The progress bar width adapts accordingly.

### D30 — Overview Cards: No Hover Preview, Static Only

Overview cards are static: thumbnail + Style name + ID. No hover popovers, no animated previews, no metadata tooltips.

- Hover state: subtle visual feedback only (slight scale or elevation change, cursor pointer).
- The "cinema poster wall" metaphor — posters don't show trailers on hover.
- Rich information (tags, density, scene count) lives in the Lab View sidebar and metadata panel.
- This keeps Overview clean and performant.

### D31 — onNavigate Semantics: Absolute Jump

The `onNavigate(scene: number, beat: number)` callback uses absolute jump semantics. Calling `onNavigate(3, 2)` jumps directly to Scene 3, Beat 2.

- The Envelope does not compute relative positions. It simply validates the target (clamps to valid range per D17) and updates state.
- If a Style wants next/prev behavior, it computes the target from its own metadata and calls `onNavigate` with absolute values.
- This keeps the interface minimal and gives the Style full control over navigation targets.

### D32 — Initial Load: Progressive Render with Skeleton

First-paint experience:

1. **Envelope chrome renders immediately** (header, sidebar, bottom bar) — these are lightweight and don't depend on fonts or Style components.
2. **Stage area** shows a placeholder with the target Style's `metadata.colors.bg` background. No spinner — the color itself is informative.
3. **Overview cards** show skeleton placeholders (matching metadata background + name + ID text). As IntersectionObserver triggers, real Style components mount and fade in.
4. **Font loading**: the Envelope's deduplicated font preload runs at startup. `document.fonts.ready` resolves; if a Style mounts before its fonts are ready, it uses fallback fonts briefly — no blocking.
5. No full-screen loading spinner. The user always sees something actionable.

### D33 — Style Display Order: Band-Grouped per Skill Catalog

The 48 Styles in the registry are ordered by Band, following the Skill's Design DNA catalog:

- Styles 01-08: Minimal Keynote
- Styles 09-16: Balanced Hybrid
- Styles 17-24: Editorial & Print
- Styles 25-32: Craft & Cultural Traditions
- Styles 33-40: Contemporary Digital
- Styles 41-48: Text Report

Within each Band, Styles follow the Skill's original ordering. This order is fixed — no UI reordering controls.

Benefit: cross-style cycling (D03) goes through all Styles in one Band before moving to the next, giving the user a coherent visual-family experience rather than jumping between aesthetics.

### D34 — Filter Tag Cloud: Auto-Aggregated from Style Metadata

The tag cloud in the Overview filter panel is generated by aggregating all `tags` arrays from every Style's `getMetadata()` output.

- Traverse the full registry, collect all tags, deduplicate, sort alphabetically.
- Each tag displays its frequency count (e.g. "premium (12)") so users know how many Styles match.
- When a new Style is added to the registry, its tags automatically appear in the cloud — no manual maintenance.
- Tags are used with AND logic (D04): selecting multiple tags narrows to Styles that have ALL of them.

### D35 — Style CSS Isolation: CSS Modules

Each Style component uses CSS Modules (`style.module.css`) for scoped styling.

- Vite supports CSS Modules natively — class names and `@keyframes` are automatically hashed to be unique per module.
- Sub-agents building Styles don't need to worry about naming collisions with other Styles.
- Global CSS (Tailwind utilities, Envelope styles) lives outside CSS Modules and is unaffected.
- Exception: CSS custom properties (`--my-var`) set by a Style on its root element are NOT scoped by CSS Modules. Styles should prefix custom properties with their style ID (e.g. `--style-02-bg`) to avoid leakage.

### D36 — CJK Font Loading: Marked + Lazy

CJK fonts (5-15MB each) are NOT bulk-preloaded. Instead:

- In `metadata.fonts`, CJK font families are prefixed with `"cjk:"` (e.g. `"cjk:Noto Serif SC"`).
- Latin fonts: deduplicated and preloaded at startup via `<link>`.
- CJK fonts: loaded only when:
  1. The Style is actively rendered in Lab View AND `language === "zh"`, OR
  2. The Style's Overview card is lazy-mounted by IntersectionObserver AND `language === "zh"`.
- When `language === "en"`, CJK fonts are never loaded (they're unnecessary).
- Each Style still keeps its own `@import` fallback in CSS for standalone rendering.

This prevents Chinese users from downloading dozens of MB of unused CJK fonts on first load.

### D37 — Envelope i18n: Simple Translation Dictionary + Context

Envelope UI text (not Style content) uses a lightweight custom i18n system:

- `src/i18n/translations.ts` contains a flat EN/ZH key-value dictionary (~30 keys).
- A `LanguageContext` provides `{ language, t(key) }` to components.
- Components use `const { t } = useI18n()` to get translated strings.
- No external i18n library (no react-i18next).
- This system is for Envelope chrome only. Style content uses `getMetadata(lang)`.
- Language state is persisted in localStorage (D09 area) and synced via the same context.

### D38 — Lab → Overview Navigation: Preserve Scroll + Filter State

When the user returns to Overview from Lab View:

- Scroll position is preserved (the user is back where they were in the grid).
- Filter selections (bands, tags) are preserved.
- Implementation: the Overview component stays mounted (hidden via CSS `display: none` or similar) when in Lab View. This preserves DOM state including scroll position.
- Filter state is already in URL params (D24), so even a hard refresh preserves it.

This avoids the "scroll all the way back down" frustration.

### D39 — Stage Scaling: CSS transform: scale() + Centered

The Stage maintains its nominal 1920×1080 dimensions at all times. Scaling is done via CSS `transform: scale()` on an outer wrapper:

1. Calculate available space: viewport minus header height, sidebar width, and bottom bar height.
2. `scale = min(availableWidth / 1920, availableHeight / 1080)`.
3. The Stage container stays at 1920×1080 (this is what `container-type: size` sees).
4. A wrapper div applies `transform: scale(scale)` and centers the result.
5. This means `1cqw` inside the Stage always equals `19.2px` (1% of 1920) regardless of how small the Stage appears on screen.

This is critical: the Skill's "去像素化单位律" depends on `cqw`/`cqh` being stable relative to the 1920×1080 design canvas. If we resized the container directly instead of using transform, `cqw` values would shift and Style layouts would break.

### D40 — Test Coverage: Three-Layer Strategy

Testing follows the Skill's verification tiers with a practical three-layer approach:

1. **Envelope unit tests** (Vitest, fast, no browser):
   - URL parameter parsing and validation (D17 silent correction)
   - Filter logic (Band OR + Tag AND)
   - Registry integrity (all 48 entries, valid IDs, non-empty metadata)
   - Navigation state computation (next/prev beat, cross-style boundary detection)

2. **Structural audit** (Playwright, browser):
   - Every Style × Scene × Beat combination is directly addressable via URL
   - No overflow (Stage content stays within 1920×1080 bounds)
   - No console errors or uncaught exceptions
   - Frozen mode (`&frozen=1`) renders deterministically
   - Keyboard navigation works (space, arrows, Esc for Pure Mode)

3. **Visual smoke** (Playwright screenshots + human review):
   - Each Style's `heroScene` at last beat (settled state)
   - Representative edge cases: first Style, last Style, smallest beat count, largest beat count
   - Mobile viewport representative shots
   - No pixel-level regression baseline for all 720+ frames — too expensive to maintain

### D41 — Thumbnail Stage: Same 1920×1080 + transform Scale

Overview card thumbnails use the exact same scaling strategy as Lab View:

- The Stage container is always 1920×1080 (nominal design size).
- `container-type: size` on the Stage means `cqw`/`cqh` always resolve against 1920×1080.
- A wrapper applies `transform: scale(cardWidth / 1920)` to fit the card.
- The Style component has no idea it's in a thumbnail — `isThumbnail` prop only tells it to suppress interactive elements, not to change layout.

This guarantees pixel-identical rendering between thumbnail and full Stage (just scaled down). No layout surprises when the user clicks into Lab View.

### D42 — Thumbnail Mode: Settled End State, No Animation

When `isThumbnail={true}`:

- The Style renders its `heroScene` at the **last beat** (settled complete state, per D13).
- All animations are forced to instant completion (same mechanism as D26 frozen mode: `animation-duration: 0s`, `transition-duration: 0s` applied via CSS on the thumbnail wrapper).
- No entrance animations, no scene transitions, no looping effects.
- The 48 Overview cards are a static "poster wall" — visually calm, performant, and each card shows the Style at its most representative, fully-revealed state.
- Interactive elements (internal navigation) are suppressed (D01/D08).

### D43 — Sidebar: No Expanded Detail, Highlight Only

The sidebar shows a flat list of Styles (grouped by Band per D19). The active Style is highlighted; no inline expansion of scene list or metadata.

- Scene navigation is handled by: bottom bar dots (D23), keyboard arrows, and the Style's own internal navigation.
- Rich metadata (tags, density, scene titles) is available in the Style's own content and in the Overview filter system.
- This keeps the sidebar minimal and scannable — it is a catalog, not an inspector.

### D44 — Keyboard Shortcuts: Standard Presenter Mapping

Full keyboard map:

| Key | Action |
|-----|--------|
| Space / → / ↓ | Next beat |
| ← / ↑ | Prev beat |
| Home | Scene 1, Beat 0 |
| End | Scene 5, last beat |
| 1-5 | Jump to Scene N, Beat 0 |
| O | Return to Overview |
| L | Switch to Lab View (current style) |
| P | Toggle Pure Mode |
| Esc | Exit Pure Mode (return to Lab) |
| Tab | Next style (cross-style jump) |
| Shift+Tab | Prev style |

- All shortcuts respect D18's 150ms debounce.
- Shortcuts are disabled when focus is in an input/textarea element.
- Tab/ShiftTab for style switching calls `e.preventDefault()` to avoid browser focus cycling.

### D45 — Overview Empty State: Friendly Message + Clear Button

When no Styles match the current filter combination:

- Display a centered empty state message: "No styles match your filters" (localized).
- Show the currently selected bands and tags as chips so the user can see what's active.
- Provide a "Clear all filters" button that resets both band and tag selections.
- The empty state replaces the grid area; the filter panel remains visible and interactive.

### D46 — Audit Surface: Envelope Sets data-* Attributes

The Envelope sets audit attributes on the Stage wrapper div:

```html
<div data-style-id="01" data-scene-id="3" data-beat="2" data-testid="stage">
  <Style ... />
</div>
```

- `data-style-id`: current Style's two-digit ID.
- `data-scene-id`: current scene number (1-5).
- `data-beat`: current beat index (0-based).
- `data-testid="stage"`: stable selector for Playwright.

Playwright structural audit tests use these attributes to verify that URL navigation lands on the expected scene/beat. Style components don't need to set any data attributes themselves — the Envelope handles it.

### D47 — Overview: No "Currently Playing" Indicator

Overview cards do not show which Style is currently being viewed in Lab.

- The Overview is a poster wall — a static catalog, not a status dashboard.
- The user's current position is indicated in the Lab View sidebar (D19/D43).
- No auto-scrolling to the current style's card when returning to Overview.
- This preserves the Overview's clean, undistracted browsing experience.

### D48 — Phase 1 Reference Styles: 3 Cross-Band Picks

Phase 1 validates the contract with 3 Styles spanning different Bands:

1. **Style 01 — Executive Silence** (Minimal Keynote) — sparse, premium, low density
2. **Style 17 — Editorial Broadsheet** (Editorial & Print) — typography-heavy, reading-first
3. **Style 33 — Glass Dashboard** (Contemporary Digital) — UI-component-driven, high interactivity

These cover the spectrum of density, typography strategy, and interaction model. If the contract works for all three, it should work for the remaining 45.

### D49 — Sidebar: Resizable Width + Collapse Toggle

Desktop sidebar width behavior:

- **Resizable**: drag the right edge to adjust width between 240px and 360px.
- **Collapsible**: a chevron toggle collapses the sidebar to a thin strip (~48px) showing only style numbers.
- Width and collapse state persisted in localStorage.
- On mobile (`< 1024px`), the sidebar becomes a slide-over drawer (320px from left, backdrop) triggered by a hamburger button in the header. Resize/collapse does not apply on mobile.

### D50 — Bottom Bar Prev/Next: Icon-Only Buttons

The bottom bar uses icon-only buttons for Prev and Next:

```
[◀]  ●───●───●───●───●   ████████░░░░ 3/5   [▶]
```

- Left chevron for Prev, right chevron for Next.
- Hover tooltip shows the keyboard shortcut (← / →).
- Disabled state: reduced opacity when at boundary (e.g. Prev at Scene 1 Beat 0, or Next at Scene 5 last beat in Pure Mode).
- Icon-only keeps the bottom bar minimal and Stage-focused.

### D51 — Header: Centered Title + Controls on Both Sides

Header layout:

```
┌──────────────────────────────────────────────────────────────┐
│  [☰]          FH Slides Workbench          [EN/ZH] [🌓] [GH] │
└──────────────────────────────────────────────────────────────┘
```

- **Left**: hamburger button (triggers sidebar drawer on mobile; hidden on desktop ≥1024px when sidebar is always visible).
- **Center**: project title "FH Slides Workbench" (clickable, returns to Overview).
- **Right**: language toggle (EN/ZH), theme mode (🌓), GitHub link.
- Header height: 56px. Uses `px`/`rem`, not `cqw`/`cqh`.

### D52 — Overview Filter Panel: Horizontal Bar Above Grid

The filter panel sits as a horizontal bar above the Overview grid, always visible:

```
┌─────────────────────────────────────────────────────────┐
│  Bands: [Minimal] [Balanced] [Editorial] [Craft] ...    │
│  Tags:  [premium×] [dense×] [retro] [academic] ...      │
├─────────────────────────────────────────────────────────┤
│  [Card] [Card] [Card] [Card] ...                        │
```

- **Band row**: 6 band toggle buttons. Selected bands are highlighted. OR logic within this layer.
- **Tag row**: horizontally scrollable tag cloud. Selected tags show with an × to remove. AND logic.
- Filter state is encoded in URL params (D24).
- No "apply" button — changes are instant.
- On mobile, the filter panel stacks vertically (bands on top, tags below) and both rows can scroll horizontally.

### D53 — Style Internal Structure: Fully Self-Determined

The Envelope provides only the Stage container (1920×1080, `container-type: size`, `overflow-hidden`). Inside the Stage, the Style has complete freedom:

- The Style decides its own DOM structure (flex row for H-Slide, absolute positioning for Magic Move, flex column for V-Slide, etc.).
- The Style decides how to render 5 scenes (all mounted at once with transforms, or conditionally rendered, or any other approach).
- The Style decides scene transition mechanics (CSS transitions, JS animations, instant cuts).
- The Envelope does NOT provide scene wrappers, transition containers, or layout utilities.

This is the practical implication of D11: the Style receives `scene`/`beat` props and decides internally what to render.

### D54 — Mobile Lab View: Portrait Hint + Landscape Optimized

On mobile:

- **Portrait**: Stage scales to fit (same as D39 logic), centered. Below the Stage, a non-blocking hint: "For best experience, rotate to landscape". The hint is dismissible (× button) and does not reappear after dismissal in the same session.
- **Landscape**: Stage maximizes to fill available space (header + bottom bar still visible).
- No forced rotation, no auto-redirect to Overview.
- The bottom bar and header remain functional in both orientations.
- Touch navigation (D25) works in both orientations.

### D55 — onNavigate Validation: Silent Correction (Same as D17)

When a Style calls `onNavigate(scene, beat)`, the Envelope validates and clamps:

1. `scene` clamped to 1-5.
2. `beat` clamped to `0 .. metadata.scenes[scene-1].beats.length - 1`.
3. Corrected values are used to update state and URL.
4. No error thrown, no feedback to the Style.

This is consistent with D17's URL parameter correction strategy. The Envelope always normalizes to a valid `(styleId, scene, beat)` tuple.

### D56 — Phase 3 Sub-Agent Isolation: Independent Prompt + Scratch Directory

Each of the 48 Styles is built by a sub-agent who:

- Receives a prompt saying "you are building a standalone slide deck" — no mention of Workbench, Envelope, or other Styles.
- Gets: the Skill's Design DNA for that Style, the `BespokeStyleProps` interface, the `getMetadata` interface, and the 1920×1080 Stage contract.
- Works in a temporary scratch directory (not the project repo).
- Produces a single `.tsx` file exporting `default` component and `getMetadata(lang)`.
- May also produce a `.module.css` file for scoped styles (D35).

The main agent collects the output, places it in `src/styles/`, and adds the entry to `registry.ts`.

This preserves the isolation principle: the sub-agent genuinely thinks it's building an independent project.

### D57 — Style Font Fallback: Dynamic <link> Injection with Dedup

Each Style component injects its font stylesheets on mount via a `useEffect`:

```typescript
useEffect(() => {
  const id = "style-01-fonts";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap";
    document.head.appendChild(link);
  }
}, []);
```

- Checks for an existing element with the same ID before injecting (no duplicates).
- If the Envelope already preloaded the same font (D16), the browser's cache handles it — no double download.
- This guarantees the Style works standalone (D10) without depending on the Envelope's font preloading.
- CJK fonts use the same pattern but with `&subset=chinese-simplified` or equivalent.

### D58 — Default Route: Overview

When the app is opened with no query parameters (bare URL), it shows Overview View.

- `https://workbench.vercel.app/` → equivalent to `?view=overview`.
- The URL is NOT rewritten to add `?view=overview` — the absence of params defaults to Overview.
- This follows the "cinema lobby" metaphor: users enter the lobby first, then choose a film.
- If the user navigates to Lab View and refreshes, the URL params preserve their position (D09).

### D59 — Overview Grid: CSS auto-fill + Mobile-Ready

Grid layout uses CSS `auto-fill` with `minmax`:

```css
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 1.25rem;
padding: 0 1rem;
```

- Browser auto-calculates column count based on available width.
- Minimum card width: 280px. On a 375px mobile viewport this yields 1 column with the card nearly full-width.
- The 16:9 thumbnail at 280px width is ~157px tall — the Style content is still legible enough for browsing.
- Card name + ID text below the thumbnail uses a readable font size (not scaled down with the Stage).
- Grid padding and gap are reduced on mobile (`px-2`, `gap-3`) vs desktop (`px-8`, `gap-5`) to maximize content area.
- No horizontal scrolling required at any viewport width.

### D60 — Style Image Assets: public/styles/XX/ Directory

Static assets for Styles live in `public/styles/<id>/`:

```
public/
  styles/
    01/
      hero.jpg
      texture.png
    17/
      photo.webp
```

- Style components reference assets via absolute path: `/styles/01/hero.jpg`.
- Vite serves `public/` as-is — no import, no bundling, no TypeScript module declarations needed.
- Sub-agents building a Style simply place their assets in the corresponding folder.
- SVG icons that are part of the Style's visual system should be inlined as JSX/SVG in the component (scales with cqw/cqh). Only raster images (photos, textures) go in `public/`.

### D61 — CI: Two Workflows

Two separate GitHub Actions workflows:

**1. CI & Deploy** (`.github/workflows/ci.yml`)
- Trigger: push to `main` + pull requests
- Steps: `npm ci` → `npm run build` → `npm test` (Vitest unit tests)
- On push to main: also deploys to Vercel (via Vercel CLI or Vercel's GitHub integration)
- Fast, runs on every code change

**2. Full Visual Audit** (`.github/workflows/audit.yml`)
- Trigger: manual (`workflow_dispatch`) + scheduled (weekly)
- Steps: `npm ci` → `npm run build` → Playwright structural audit (all 48×5×N beats) → visual smoke screenshots
- Reports: artifact with screenshots + audit log
- Slow, runs on demand or on a schedule, not on every push

### D62 — Sharing: URL Is the Share Link

No dedicated "share" button. The browser URL bar is the share mechanism:

- Every view, style, scene, and beat is fully addressable (D09).
- Users copy the URL directly from the address bar to share a specific frame.
- `?view=lab&style=01&scene=3&beat=2` is a stable, permanent link.
- Pure Mode URLs (`&pure=1`) are ideal for iframe embedding.
- Filtered Overview views (`?view=overview&bands=...&tags=...`) are also shareable (D24).

### D63 — Browser Support: Modern Browsers, ~2 Year Window

Minimum browser versions:

- Chrome / Edge ≥ 110
- Firefox ≥ 110
- Safari ≥ 16.4
- iOS Safari ≥ 16.4

The hard constraint is **CSS Container Queries** (`cqw`/`cqh` units), which are the foundation of the Stage scaling system (D39). Safari 16.4 was the first version with full support.

No IE support. No polyfills for Container Queries (they cannot be reliably polyfilled).

Users on older browsers see a message: "This site requires a modern browser with Container Queries support."

### D64 — React Re-render: Same Instance for Same Style

In Lab View, the Style component uses `key={styleId}`:

- **Within the same Style**: changing `scene` or `beat` updates props on the same component instance. The Style can use `useEffect` to detect changes and trigger animations. Internal state (e.g. animation progress) is preserved across beat changes.
- **Switching to a different Style**: the old component unmounts and the new one mounts. Cleanup happens naturally.
- In Overview, each card has `key={styleId}` as well — once mounted, it stays mounted (D20).

This is standard React behavior and gives Styles the ability to animate between scenes/beats smoothly.

### D65 — Accessibility: Baseline ARIA + Focus Order

Envelope chrome implements baseline accessibility:

- All interactive elements have descriptive `aria-label` (icon-only buttons especially).
- Tab order follows visual layout: header → sidebar → stage area → bottom bar.
- Current style in sidebar has `aria-current="true"`.
- Current scene dot in bottom bar has `aria-current="true"`.
- Color contrast meets WCAG AA for Envelope UI text.
- The Stage content itself is the Style's responsibility — the Envelope does not add ARIA attributes to Style-rendered content.
- No focus traps, no skip links, no aria-live regions (Phase 4 enhancement candidates).

### D66 — Overview → Lab Transition: Instant, No Animation

Clicking an Overview card switches to Lab View instantly — no fade, no scale, no FLIP animation.

- Zero perceived latency.
- Consistent with the "enter the cinema" metaphor: you walk in, the movie starts.
- The Stage renders at the correct scene/beat immediately. No intermediate state.

### D67 — Development Discipline: TDD Required

All code — both Envelope framework and individual Style components — must be developed using Test-Driven Development.

- **Envelope framework**: write Vitest unit tests first (URL parsing, filter logic, navigation computation, registry validation), then implement.
- **Style components (Phase 1 reference styles)**: write tests first — render at each scene/beat, verify key elements exist, verify `onNavigate` calls, verify `isThumbnail` suppresses interactive elements.
- **Phase 3 batch styles**: each sub-agent receives a TDD mandate in its prompt. The agent must:
  1. Write a test file that imports the Style component and verifies:
     - Component renders without error for all 5 scenes × all beats
     - `data-*` attributes are present on the root element (or the Envelope wrapper provides them)
     - `onNavigate` is called when internal nav is clicked (if applicable)
     - `isThumbnail={true}` suppresses interactive elements
  2. Then implement the component to pass the tests.
- Tests for Styles live alongside the component: `src/styles/01-executive-silence.test.tsx`.

### D68 — localStorage Keys: fhsw: Prefix

All localStorage keys use the `fhsw:` prefix (Frontend Harness Slides Workbench):

| Key | Purpose | Decision |
|-----|---------|----------|
| `fhsw:language` | "en" or "zh" | D37 |
| `fhsw:theme` | "auto", "light", or "dark" | D02 area |
| `fhsw:sidebar-width` | number (px) | D49 |
| `fhsw:sidebar-collapsed` | "true" or "false" | D49 |
| `fhsw:portrait-hint-dismissed` | "true" (session only) | D54 |

No single JSON blob — each value is a separate key for independent reads/writes.

### D69 — Style Exports: Default Component + Named getMetadata

Each Style file exports:

```typescript
// src/styles/01-executive-silence.tsx
export default function ExecutiveSilence(props: BespokeStyleProps) { ... }
export function getMetadata(lang: "en" | "zh"): StyleMetadata { ... }
```

Registry imports:

```typescript
import Style01, { getMetadata as meta01 } from "./01-executive-silence";
```

This is the standard React component pattern. `getMetadata` is a named export because it's a pure function, not a component.

### D70 — CSS Custom Properties: Must Prefix with style-XX-

Style components that set CSS custom properties must prefix them with their style ID:

```css
/* Good */
--style-01-bg: #030712;
--style-01-accent: #f59e0b;

/* Bad — leaks to other styles */
--bg: #030712;
--accent: #f59e0b;
```

This prevents cross-style variable leakage since CSS custom properties inherit through the DOM tree and are NOT scoped by CSS Modules.

The sub-agent prompt (D56) explicitly requires this convention.

### D71 — Stage Overflow Detection: Playwright Audit + CSS Defense

Two-layer overflow protection:

1. **CSS defense**: Stage container has `overflow: hidden` as a hard boundary. Content cannot visually escape the 1920×1080 canvas. This is the last line of defense.

2. **Playwright structural audit**: For each Style × Scene × Beat, the test checks:
   ```typescript
   const stage = page.locator('[data-testid="stage"]');
   const hasOverflow = await stage.evaluate(el =>
     el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1
   );
   expect(hasOverflow).toBe(false);
   ```
   This catches content that would be silently clipped by `overflow: hidden`.

The `+1` tolerance accounts for subpixel rounding. A failed test means the Style's content exceeds the Stage bounds — the sub-agent must fix it.

### D72 — PDF Export: Pure Mode + Browser Print

PDF export uses the browser's native print capability:

1. User navigates to the desired Style/scene/beat.
2. Enters Pure Mode (`&pure=1`) — all Envelope chrome hidden.
3. Uses browser Print (⌘P / Ctrl+P) → "Save as PDF".

`@media print` CSS rules:
- Hide everything except the Stage.
- Stage fills the page (no margins, no headers/footers).
- Background colors and images are preserved (`-webkit-print-color-adjust: exact`).
- Page size set to 16:9 landscape (`@page { size: 16in 9in; margin: 0; }`).

No "Export PDF" button, no html2canvas, no jsPDF. The browser is the PDF engine.

### D73 — Dev Server: Vite Default Port 5173

No custom port configuration. Vite's default `5173` is used.

### D74 — Envelope Chrome Follows System Theme

The Envelope chrome (Header, Sidebar, BottomBar) responds to the system/selected theme mode. It is NOT permanently dark.

- **Light mode**: chrome background `#f5f5f5` (warm light gray), text dark
- **Dark mode**: chrome background `#1a1a1a` (deep gray), text light
- Stage canvas background also follows theme: light `#e8e8e8`, dark `#141414`
- This gives clear visual hierarchy in both modes: chrome is always one step darker/lighter than the canvas

This supersedes the earlier "always dark chrome" experiment. The Figma aesthetic is preserved via subtle layering, not permanent darkness.

### D75 — Theme Switch: Segmented Control (Desktop) + Single Button (Mobile)

Theme switching UI:

- **Desktop ≥768px**: segmented control with three options: `Auto | Light | Dark`. Selected option uses filled background.
- **Mobile <768px**: single icon button showing current state (☀ for Light, ☾ for Dark, ⚙ for Auto). Tapping cycles through Auto → Light → Dark → Auto.
- Theme state persisted in localStorage (`fhsw:theme`).
- Auto follows `prefers-color-scheme`.

### D76 — Language Switch: Segmented Control (Desktop) + Single Button (Mobile)

Language switching UI mirrors the theme switch pattern:

- **Desktop ≥768px**: segmented control with three options: `Auto | EN | ZH`. Selected option uses filled background.
- **Mobile <768px**: single text button showing current state (`A` for Auto, `EN` for English, `中` for Chinese). Tapping cycles through Auto → EN → ZH → Auto.
- Language state persisted in localStorage (`fhsw:language`).
- **Auto behavior**: if `navigator.language` starts with `"zh"`, use Chinese; otherwise use English (covers all non-Chinese locales: en, ja, ko, es, fr, etc.).

### D77 — Scene Transition Bug: Inner `key` Prop Destroys DOM

Root cause of all scene/beat transitions being hard cuts:

Every Style component's inner animation track div has `key={`XX-${scene}`}`. When scene changes, React destroys the old DOM node and creates a new one. The new node mounts with `entered=true` (carried over from the previous scene's state), so content appears instantly — the hard cut. Then `useEffect` fires, sets `entered=false`, double-rAF, sets `entered=true` — causing a brief flash rather than a smooth transition.

For V-slide styles (17, 19, 22, 24, 33-48), this is even worse: they rely on `transition: transform` to animate between scenes, but the `key` causes the element to be recreated with the final `translateY` value directly — no transition can occur.

**Fix**: remove the inner `key` prop from all track divs, and change `useEffect` to `useLayoutEffect` so `setEntered(false)` runs before the browser paints (avoids the flash). DOM elements are reused across scene changes, so CSS transitions have a starting value to animate from.

### D78 — Transition Fix Phasing: Pilot 4 Styles, Then Full Rollout

Fix D77 in phases:

1. **Pilot**: fix styles 01 (Executive Silence, fade), 04 (Aurora Gradient, complex animation), 17 (Editorial Broadsheet, V-slide), 34 (Retro OS 95, interactive). Verify transitions work correctly in browser.
2. **Full rollout**: apply same fix to remaining 44 styles.

This de-risks the change — if the fix breaks something, it's contained to 4 styles.

### D79 — Sidebar: No Collapse Toggle Button (Removed)

The sidebar's top collapse/expand toggle button was removed as redundant. The hamburger button in the Header is the single control for sidebar visibility:

- **Desktop**: hamburger toggles `sidebarCollapsed` (48px strip vs full width)
- **Mobile**: hamburger toggles `sidebarOpen` (drawer slide-in)
- The resize handle on the right edge is preserved for desktop width adjustment.

### D80 — Multi-Version Architecture: Style → Versions[]

Each Style can have multiple Versions, each produced by a different Agent/model. A Version is identified by its topic (e.g. "决策的艺术"), not by v1/v2 numbering.

```typescript
interface StyleVersion {
  id: string;                    // "v1", "v2" — internal ordering
  topic: string;                 // 题材名，如 "决策的艺术"
  model: string;                 // 编写模型，如 "Doubao-Seed-Evolving"
  component: ComponentType<BespokeStyleProps>;
  getMetadata: (lang: "en" | "zh") => StyleMetadata;
}

interface StyleRegistryEntry {
  id: string;                    // "01" .. "48"
  name: { en: string; zh: string };  // 风格名（双语）
  versions: StyleVersion[];
}
```

- 当前所有 48 个风格各有 1 个版本，model 统一为 "Doubao-Seed-Evolving"
- 版本的 `getMetadata` 返回的 `theme` 字段即题材描述
- 风格名（name）从版本 metadata 中提取，双语存储在 registry entry 上
- 新增版本时追加到 `versions` 数组末尾

### D81 — Version-Aware Navigation Cycling

跨风格/版本导航顺序：style01v1 → style01v2 → ... → style02v1 → style02v2 → ...

- 导航状态扩展为 `(styleId, versionId, scene, beat)`
- Next 到达当前版本最后一个 beat 时，先检查该风格是否有更多版本
  - 有下一个版本 → 跳到下一个版本的 scene 1 beat 0
  - 无下一个版本 → 跳到下一个风格的第一个版本的 scene 1 beat 0
- Prev 同理反向
- URL 参数增加 `version`（默认 "v1"）
- Active Versions List = 所有版本的扁平列表，按风格顺序排列

### D82 — VersionBar: Header 下方的版本信息条

在 Header 和 Stage 之间增加一条高 28px（h-7）的紧凑信息条：

```
┌──────────────────────────────────────────────────────────────┐
│  01 · Executive Silence  ›  决策的艺术  [Doubao]  v1/1  ⋮    │
└──────────────────────────────────────────────────────────────┘
```

- 左侧：风格编号·风格名（可点击返回 Overview）
- 中间：› 题材名（当前版本的 topic）
- 右侧：[模型标签] 版本序号 ⋮ 下拉菜单
- ⋮ 下拉："查看版本信息"（显示 model、topic、版本详情）
- 当风格只有 1 个版本时，版本序号显示 "v1/1" 但视觉弱化
- 当风格有多个版本时，版本序号可点击切换版本
- 移动端：简化为 "01 › 决策的艺术"，其余收入 ⋮ 菜单
- Pure Mode 下隐藏

### D83 — BottomBar: 拟物堆叠卡片指示版本切换

BottomBar 的 Prev/Next 按钮区域增加堆叠卡片视觉效果，暗示跨版本切换：

- 当 Next 将跨版本边界时，Next 按钮右侧出现层叠卡片预览
- 当 Prev 将跨版本边界时，Prev 按钮左侧出现层叠卡片预览
- Hover 时卡片扇形展开，显示下一个/上一个版本的题材名
- 点击卡片直接跳到该版本
- 这是 "拟物" 设计语言的体现：卡片堆叠 = 版本堆叠

### D84 — Sidebar: 风格展开显示版本列表

Sidebar 中每个风格条目可展开，显示该风格的所有版本：

```
▼ 01  Executive Silence
    ▸ 决策的艺术  [Doubao]
    ▸ 产品发布会  [GPT-5.5]
  02  Swiss Precision
    ▸ 效率系统  [Doubao]
```

- 点击版本条目跳到该版本的 scene 1 beat 0
- 当前版本高亮
- 版本条目显示：题材名 + 模型标签（小号、弱化）
- 默认收起（保持 sidebar 简洁）
- 当前活跃风格自动展开

### D85 — Scene Transition Fix: key={scene} + CSS @keyframes

正确的场景转场模式（取代 D77 的 useLayoutEffect + entered 方案）：

```tsx
// ✅ 正确：key 强制重新挂载，CSS animation 从第 0 帧开始
<div key={scene} className={styles.animateEnter}>
  {content}
</div>
```

```css
.animateEnter {
  animation: sceneEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

- **禁止** `useLayoutEffect` + `entered` state 模式（导致空白帧闪烁）
- `key={scene}` 放在内容包装 div 上（不是最外层 root）
- `animation: ... forwards` 确保动画结束后保持最终状态
- `reducedMotion` 时设置 `animationDuration: "0s"`

### D86 — Navigation Diversity: 6 类导航风格分配

48 个风格的内部导航分为 6 类，每类有不同的视觉表现：

| 类别 | 风格范围 | 导航形式 |
|------|----------|----------|
| A: Bespoke | 01-08, 17-24 | 风格定制化导航（ruler、时间轴等） |
| B: Bottom | 09-16 | 底部标准圆点 |
| C: Side | 25-32 | 侧边标签/刻度 |
| D: Picker | 33-40 | 选择器/下拉式 |
| E: Subtle | 41-48 | 极弱化/无可见导航 |
| F: None | (特殊) | 完全无内部导航 |

这是 Phase 4 导航多样性改造的分配方案，由 sub-agent 自由发挥实现。

### D87 — Segmented Control: Pill + Soft Shadow + Icons

Header 中的语言/主题切换采用 segmented control 设计：

- **Track**: `rounded-full p-0.5 bg-ink/[0.06]`（药丸形轨道，微妙背景色）
- **Selected item**: `bg-elevated text-ink shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]`（微妙 elevation）
- **Icons**: 移动端使用 SVG icon（Auto=齿轮, Light=太阳, Dark=月亮; 语言用 A/EN/中）
- 桌面端 ≥768px 显示完整 segmented control，移动端 <768px 变为单按钮循环切换

### D88 — Chrome Theme-Aware: Envelope 响应深浅色

Envelope（Header、Sidebar、BottomBar）跟随系统/用户选择的主题模式：

- **Light mode**: chrome bg `#f5f5f5`（暖浅灰），text dark；Stage canvas bg `#e8e8e8`
- **Dark mode**: chrome bg `#1a1a1a`（深灰），text light；Stage canvas bg `#141414`
- 设计语言：Figma-style chrome，微妙的层次感（不是永久深色）
- 每个风格自己控制 Stage 内的背景/前景色（不受 Envelope 主题影响）

### D89 — Dual-Scene Transition Rendering: Outgoing + Incoming Layers

正确的场景转场模式（取代 D85 的单场景 `key={scene}` 方案）：同时渲染 outgoing 和 incoming 两个场景层，分别应用 `.exitAnim` 和 `.enterAnim` CSS 动画类。

```tsx
<div className={styles.sceneLayer + ' ' + styles.exitAnim}>
  {/* outgoing scene content */}
</div>
<div className={styles.sceneLayer + ' ' + styles.enterAnim}>
  {/* incoming scene content */}
</div>
```

```css
.sceneLayer {
  position: absolute;
  inset: 0;
  pointer-events: none;  /* D91: 防止 outgoing 拦截点击 */
}

.exitAnim {
  animation: sceneExit 0.4s ease-in forwards;
  z-index: 1;
}

.enterAnim {
  animation: sceneEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
  z-index: 2;
}
```

- **两层同时渲染**：outgoing 层（z-index 1）播放退出动画，incoming 层（z-index 2）播放进入动画
- **绝对定位叠加**：`.sceneLayer` 使用 `position: absolute; inset: 0` 确保两层完全重叠
- **动画结束后清理**：setTimeout 在转场时长后清除 outgoingScene，只保留 incoming 层
- **不再使用 `key={scene}`**：D85 的单场景 key 方案会导致 DOM 重建闪烁，已废弃
- **reducedMotion**：所有动画类在 reducedMotion 时设置 `animation-duration: 0s`

### D90 — Synchronous State Derivation: 渲染时同步检测场景变化

消除转场闪烁的核心修复。旧模式（`useState` + `useLayoutEffect` + `prevSceneRef`）的问题：effect 在渲染后才执行，导致新场景以"无转场"状态渲染一帧后才被检测到。

新模式：在渲染期间同步检测 `scene` prop 变化，立即调用 `setTransitionInfo`：

```tsx
const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const [transitionInfo, setTransitionInfo] = useState({
  outgoingScene: null as number | null,
  isTransitioning: false,
  lastScene: scene,
});

// 渲染时同步检测：如果 scene 变了，立即设置转场状态
if (transitionInfo.lastScene !== scene) {
  if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  if (!reducedMotion) {
    transitionTimerRef.current = setTimeout(() => {
      setTransitionInfo(prev => ({
        outgoingScene: null,
        isTransitioning: false,
        lastScene: prev.lastScene,
      }));
    }, TRANSITION_DURATION);
    setTransitionInfo({
      outgoingScene: transitionInfo.lastScene,
      isTransitioning: true,
      lastScene: scene,
    });
  } else {
    setTransitionInfo({ outgoingScene: null, isTransitioning: false, lastScene: scene });
  }
}

const outgoingScene = transitionInfo.outgoingScene;
const isTransitioning = transitionInfo.isTransitioning;
```

- **零帧闪烁**：同步推导确保第一次渲染新场景时就已经处于"正在转场"状态，outgoing 层已就位
- **React 允许渲染时 setState**：只要是条件性的（`if (lastScene !== scene)`），不会触发无限循环
- **timer 清理**：每次新的 scene 变化先 clearTimeout 旧的，防止快速切换时残留

### D91 — CSS Hardening: pointer-events + both Fill-Mode

两个关键 CSS 修复，适用于所有 48 个风格的 CSS Module：

1. **`.sceneLayer { pointer-events: none; }`**：outgoing 层虽然视觉上在淡出（opacity → 0），但仍然覆盖在 incoming 层上方。如果不加 `pointer-events: none`，outgoing 层会拦截用户点击（尤其是内部导航按钮），导致点击无响应。

2. **`.enterAnim { animation-fill-mode: both; }`**：`forwards` 只保持动画结束后的状态，但动画开始前（0% keyframe 定义的初始状态）不会应用。`both` = `backwards` + `forwards`，确保：
   - 动画开始前：元素已经处于 0% keyframe 定义的状态（如 `opacity: 0; transform: translateX(100%)`）
   - 动画结束后：保持 100% keyframe 的最终状态
   
   这消除了"元素先以最终状态闪现一帧，然后才开始动画"的问题。

### D92 — Style Name Alignment: Workbench ↔ Skill Design DNA Catalog

Workbench 的 48 个风格名称已完全对齐 Skill 的 `frontend-harness-slides` Design DNA Catalog。

- **之前**：Workbench 使用内容导向命名（如 "Executive Silence" → "决策的艺术"），Skill 使用美学导向命名
- **现在**：所有 48 个风格的 `getMetadata().name` 使用 Skill 的原始美学命名
- **文件名不变**：`src/styles/01-executive-silence.tsx` 等文件名保持不变（registry 按文件名导入）
- **双语名称**：`getMetadata(lang)` 返回的 `name` 字段在 EN/ZH 下都使用 Skill 定义的名称
- **6 个 Band 的划分和顺序**与 Skill catalog 完全一致（D33 已定义）

### D93 — Visual DNA Alignment: 颜色/字体/标签/场景内容匹配 Skill

除名称对齐外，每个风格的视觉 DNA 也已根据 Skill 的 `.md` Design DNA 文件调整：

- **颜色**：`metadata.colors` 的 `bg`、`ink`、`panel`、`accent` 值匹配 Skill 定义
- **字体**：`metadata.typography` 的 `header`、`body` 字体族匹配 Skill 推荐
- **标签**：`metadata.tags` 数组包含 Skill 定义的 mood、tone、density、scheme、motion 标签
- **场景内容**：5 个场景的叙事方向匹配 Skill 的风格语义（如 Style 25 Woodblock 用木刻美学讲传统工艺故事）
- **题材（theme）**：每个风格的主题描述匹配 Skill 的视觉 DNA 方向

对齐方式：逐批读取 Skill 的 `references/style/` 目录下对应风格的 Design DNA `.md` 文件，提取颜色、字体、标签和语义方向，然后更新 Workbench 对应风格的 `getMetadata` 和组件内部样式。

### D94 — Batch Commit Strategy: Per-Band 分批提交

48 个风格的对齐工作按 6 个 Band 分批提交，每批一个 commit：

1. Band 1 (01-08 Minimal Keynote) → `ae6b306`
2. Band 2 (09-16 Balanced Hybrid) → `9843d16`
3. Band 3 (17-24 Editorial & Print) → `7b84e45`
4. Band 4 (25-32 Craft & Cultural) → `f741bcf`
5. Band 5 (33-40 Contemporary Digital) → `b2430e1`
6. Band 6 (41-48 Text Report) → `c6053cf`

每个 commit 包含该 Band 内所有风格的：名称更新、视觉 DNA 调整、dual-scene 转场实现、CSS 加固。

---

## Local Issue Queue — Curated v2 Style Versions

Status: ready for local execution. These issues are tracked in this context
document instead of GitHub Issues.

### Issue 1 — Establish v2 slide protocol and assignment matrix

## What to build

Define the end-to-end protocol for adding a curated `v2` version to every
style. The slice must make one generated v2 style mechanically possible without
letting agents copy existing v1 implementations: per-edge scene transition
support, v2 authoring constraints, a 48-style assignment matrix, and a repeatable
sub-agent brief template.

## Acceptance criteria

- [ ] `SpatialSceneTrack` supports per-edge scene transition choices without reintroducing outgoing scene clones.
- [ ] The v2 authoring rules state that sub-agents may read only protocol, shared infrastructure, and their assigned brief, not existing v1 style implementations.
- [ ] The assignment matrix fixes each style's topic, five-scene narrative, transition edges, beat layout strategy, internal navigation concept, and visual constraints.
- [ ] Tests fail if registered v2 versions omit supported transition data, beat layout markers, bilingual metadata, or the no-clone lifecycle.
- [ ] The design-board workflow is documented as temporary GPT-Image-2 reference only; generated images are not committed or used as runtime assets.

## Blocked by

None - can start immediately.

### Issue 2 — Build minimal-keynote v2 styles 01-08

## What to build

Create curated `v2` versions for styles 01-08. Each style is built by an
independent sub-agent from the assignment brief and style guide only. The band
must demonstrate restrained, premium keynote design while keeping topics,
navigation treatments, beat strategies, and per-edge transitions visibly varied.

## Acceptance criteria

- [ ] Styles 01-08 each register exactly one additional version with `id: "v2"` while preserving `v1`.
- [ ] Each v2 has bilingual content, five scenes, complete beat metadata, reduced-motion behavior, and thumbnail-safe rendering.
- [ ] Each sub-agent creates a temporary five-scene design board before implementation and uses it only as a reference.
- [ ] The band passes unit, protocol, audit, and visual spot checks in both English and Chinese.
- [ ] None of the v2 implementations copy v1 layout, content, CSS structure, or transition lifecycle patterns.

## Blocked by

- Issue 1 — Establish v2 slide protocol and assignment matrix.

### Issue 3 — Build balanced-hybrid v2 styles 09-16

## What to build

Create curated `v2` versions for styles 09-16. Each style is built by an
independent sub-agent from the assignment brief and style guide only. The band
must cover process, systems, roadmap, organization, and case-study narratives
with strong information structure and non-repetitive navigation.

## Acceptance criteria

- [ ] Styles 09-16 each register exactly one additional version with `id: "v2"` while preserving `v1`.
- [ ] Each v2 has bilingual content, five scenes, complete beat metadata, reduced-motion behavior, and thumbnail-safe rendering.
- [ ] Each multi-beat scene explicitly chooses `motion` or `reserved` layout and animates or reserves layout changes accordingly.
- [ ] Per-edge transitions match the assignment matrix and do not collapse into a single slide/fade pattern.
- [ ] The band passes unit, protocol, audit, and visual spot checks in both English and Chinese.

## Blocked by

- Issue 1 — Establish v2 slide protocol and assignment matrix.

### Issue 4 — Build editorial-print v2 styles 17-24

## What to build

Create curated `v2` versions for styles 17-24. Each style is built by an
independent sub-agent from the assignment brief and style guide only. The band
must feel publication-led: editorial hierarchy, print artifacts, reading rhythm,
and scene transitions that behave like pages, columns, frames, or scrolls.

## Acceptance criteria

- [ ] Styles 17-24 each register exactly one additional version with `id: "v2"` while preserving `v1`.
- [ ] Each v2 has bilingual content, five scenes, complete beat metadata, reduced-motion behavior, and thumbnail-safe rendering.
- [ ] Typography, columns, captions, and image-like composition are code-rendered, not baked into generated image assets.
- [ ] Internal navigation matches the print/editorial metaphor assigned to each style.
- [ ] The band passes unit, protocol, audit, and visual spot checks in both English and Chinese.

## Blocked by

- Issue 1 — Establish v2 slide protocol and assignment matrix.

### Issue 5 — Build craft-cultural v2 styles 25-32

## What to build

Create curated `v2` versions for styles 25-32. Each style is built by an
independent sub-agent from the assignment brief and style guide only. The band
must show material and cultural specificity through coded texture, ornament,
layout, motion, and navigation rather than generic decorative themes.

## Acceptance criteria

- [ ] Styles 25-32 each register exactly one additional version with `id: "v2"` while preserving `v1`.
- [ ] Each v2 has bilingual content, five scenes, complete beat metadata, reduced-motion behavior, and thumbnail-safe rendering.
- [ ] Cultural motifs are used as structural design language, not superficial background decoration.
- [ ] Per-edge transitions and beat reveals reflect each assigned material metaphor.
- [ ] The band passes unit, protocol, audit, and visual spot checks in both English and Chinese.

## Blocked by

- Issue 1 — Establish v2 slide protocol and assignment matrix.

### Issue 6 — Build contemporary-digital v2 styles 33-40

## What to build

Create curated `v2` versions for styles 33-40. Each style is built by an
independent sub-agent from the assignment brief and style guide only. The band
must use digital-native surfaces, dashboards, canvases, terminals, particles,
and interface metaphors without collapsing into the same glass-card layout.

## Acceptance criteria

- [ ] Styles 33-40 each register exactly one additional version with `id: "v2"` while preserving `v1`.
- [ ] Each v2 has bilingual content, five scenes, complete beat metadata, reduced-motion behavior, and thumbnail-safe rendering.
- [ ] Navigation patterns differ across the band and match each interface metaphor.
- [ ] Animated digital effects are deterministic enough for tests and disabled for reduced motion and thumbnails.
- [ ] The band passes unit, protocol, audit, and visual spot checks in both English and Chinese.

## Blocked by

- Issue 1 — Establish v2 slide protocol and assignment matrix.

### Issue 7 — Build text-report v2 styles 41-48

## What to build

Create curated `v2` versions for styles 41-48. Each style is built by an
independent sub-agent from the assignment brief and style guide only. The band
must be dense, evidence-first, and document-like while still making scene and
beat state changes polished and legible.

## Acceptance criteria

- [ ] Styles 41-48 each register exactly one additional version with `id: "v2"` while preserving `v1`.
- [ ] Each v2 has bilingual content, five scenes, complete beat metadata, reduced-motion behavior, and thumbnail-safe rendering.
- [ ] Dense tables, briefs, footnotes, exhibits, and report sections remain readable without overflow in English or Chinese.
- [ ] Most transitions are restrained but still follow the assigned per-edge vocabulary.
- [ ] The band passes unit, protocol, audit, and visual spot checks in both English and Chinese.

## Blocked by

- Issue 1 — Establish v2 slide protocol and assignment matrix.

### Issue 8 — Run full v2 acceptance pass and polish regressions

## What to build

Run the final acceptance pass after all six v2 bands are integrated. This slice
must verify that `v2` works as a coherent Workbench-wide release while `v1`
continues to behave as before.

## Acceptance criteria

- [ ] All 48 styles expose both `v1` and `v2`, and version switching works from Lab View and URL hash state.
- [ ] Full unit, typecheck, build, and audit validation pass.
- [ ] English and Chinese spot checks cover every band and catch overflow, missing content, broken metadata, or unreadable layouts.
- [ ] Transition diversity is verified across v2 styles and per-edge transitions.
- [ ] v1 regression checks confirm existing styles still render, navigate, and transition correctly.

## Blocked by

- Issue 2 — Build minimal-keynote v2 styles 01-08.
- Issue 3 — Build balanced-hybrid v2 styles 09-16.
- Issue 4 — Build editorial-print v2 styles 17-24.
- Issue 5 — Build craft-cultural v2 styles 25-32.
- Issue 6 — Build contemporary-digital v2 styles 33-40.
- Issue 7 — Build text-report v2 styles 41-48.

---

## Open Questions

_(None currently)_

---

## Progress Log

| Phase | Status | Notes |
|-------|--------|-------|
| Domain modeling & decisions | ✅ Done | D01-D94 confirmed |
| Phase 1: Reference styles | ✅ Done | Styles 01, 17, 33 validated contract |
| Phase 2: Envelope framework | ✅ Done | Overview, Lab, Pure Mode, nav, filter, theme, i18n |
| Phase 3: Batch style production | ✅ Done | All 48 styles built and registered |
| Phase 4: Shared infra extraction | ✅ Done | Font dedup, registry, shared utilities |
| Chrome redesign | ✅ Done | Segmented controls, theme-aware, Figma-style |
| Header test fix | ✅ Done | 31/31 tests passing after segmented control update |
| Style authoring spec | ✅ Done | docs/STYLE_AUTHORING_SPEC.md written |
| Dual-scene transitions (all 48) | ✅ Done | D89: outgoing+incoming layers, no more hard cuts |
| Flash fix: sync derivation (all 48) | ✅ Done | D90: render-time state derivation, zero frame gap |
| CSS hardening (all 48) | ✅ Done | D91: pointer-events: none + both fill-mode |
| Style name alignment to skill | ✅ Done | D92: all 48 names match skill Design DNA catalog |
| Visual DNA alignment to skill | ✅ Done | D93: colors, typography, tags, scene content matched |
| 6-band batch commits | ✅ Done | D94: 6 commits pushed to main |
| Multi-version skeleton | ⏸ Paused | types.ts + registry refactoring deferred |
| Navigation diversity | ⏳ Pending | 48-style nav diversity implementation (D86 allocation) |
| Testing setup | ✅ Done | 648 unit tests (Vitest) + Playwright e2e, 0 TS errors |
| Adversarial review fixes | ✅ Done | 46 high-severity defects fixed across all 48 styles |
| Deployment | ✅ Done | Vercel: https://frontend-harness-slides-workbench.vercel.app |

### Current State (2026-07-06)

**已完成的本轮工作**（D89-D94）：

- **转场架构升级**：所有 48 个风格从 `key={scene}` 硬切 / `useLayoutEffect` 闪烁模式，迁移到 dual-scene 双层渲染 + 同步状态推导模式。彻底消除场景切换闪烁。
- **CSS 加固**：所有 48 个 CSS Module 的 `.sceneLayer` 添加 `pointer-events: none`，`.enterAnim` fill-mode 从 `forwards` 改为 `both`。
- **Skill 对齐**：所有 48 个风格的名称、颜色、字体、标签、场景叙事方向与 `frontend-harness-slides` Skill 的 Design DNA Catalog 完全对齐。
- **6 个 Band 分批提交**：已推送到 main，构建通过（648 tests passing, 0 TS errors）。

**待办**：
- Multi-version 骨架（D80-D84）：暂停，优先级低于风格质量
- Navigation diversity（D86）：48 风格内部导航多样性改造
- 新增版本（D80）：当前每个风格只有 1 个版本（Doubao-Seed-Evolving），可由其他模型生成更多版本
