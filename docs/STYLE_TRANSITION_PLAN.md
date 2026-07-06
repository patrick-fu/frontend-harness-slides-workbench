# Style Transition Plan

> Historical note: this document originally specified per-style outgoing scene
> clones. That model has been superseded. Existing v1 styles now use
> `SpatialSceneTrack` for scene lifecycle and must not maintain `outgoingScene`,
> render full-screen transition clones, or read `isTransitionClone`. The visual
> vocabulary below is implemented through explicit `transitionKind` choices and
> may be refined per style without reintroducing clone lifecycle state.

## Principles

### Core Architecture Decision

Scene lifecycle is owned by `SpatialSceneTrack`. The framework changes the
`scene` prop, and each style renders stable panels through the shared track.
The style must:

1. Render scene content through `SpatialSceneTrack`.
2. Keep persistent background/nav chrome outside scene-specific content when needed.
3. Pass `reducedMotion || isThumbnail` into the shared track.
4. Explicitly pass `transitionKind` so visual motion does not collapse to one default.
5. Declare `data-beat-layout-mode="motion"` or `"reserved"` for every multi-beat scene.

The previous outgoing-clone pattern caused full-screen duplicate scenes during
transitions and is no longer accepted.

**Recommended pattern for all styles:**

```tsx
<SpatialSceneTrack
  scene={scene}
  beat={beat}
  transitionKind="scale-fade"
  reducedMotion={reducedMotion || isThumbnail}
  beatLayoutModes={BEAT_LAYOUT_MODES}
  renderScene={(sceneId, sceneBeat, isActive) => (
    <div className={styles.sceneLayer}>
      {renderSceneFor(sceneId, sceneBeat, isActive)}
    </div>
  )}
/>
```

Allowed scene transition kinds:

- `slide-x`: left/right spatial slide.
- `slide-y`: top/bottom spatial slide.
- `fade`: simple dissolve.
- `scale-fade`: dissolve with a restrained scale shift.
- `hard-cut`: document-like direct cut.
- `wipe`: directional reveal.
- `page-flip`: editorial page motion.
- `glitch`: digital disruption.

### Band-Based Guidance

- **Minimal Keynote** (styles 01-08): Most restrained. Cross-fade, subtle scale, gentle opacity. No flashy motion. Think Apple Keynote "Dissolve" or "Cube" but softer.
- **Balanced Hybrid** (styles 09-16): Moderate variety. Can use slide, fade, scale depending on content. The "safe creative" band.
- **Editorial & Print** (styles 17-24): Print-inspired. Page-flip, column-slide, rule-draw, ink-reveal. Typography-driven transitions.
- **Craft & Cultural** (styles 25-32): Organic, irregular paths. Rotation, skew, hand-drawn feel. Paper-tear, brush-stroke, stamp effects.
- **Contemporary Digital** (styles 33-40): Tech-feel. Scan lines, grid transitions, glitch, pixel-shift, data-stream effects.
- **Text Report** (styles 41-48): Minimal, almost hard cut. Typewriter, line-reveal, cursor-blink. Document-like.

### Beat-Level FLIP Usage

When to use `useFLIP`:
- When new content pushes existing elements to new positions (e.g., a new argument card appears in a list and pushes others down).
- When list items reorder or grow.
- When layout shifts would otherwise look jarring.
- NOT needed for simple opacity-only reveals.

Import: `import { useFLIP } from "../hooks/useFLIP";`

Usage:
```tsx
const { ref } = useFLIP({ watch: [beat], duration: 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
return <div ref={ref}>{itemsThatShift}</div>;
```

### Reduced Motion

All styles receive `reducedMotion: boolean`. When true, skip all animations. Set `transition-duration: 0s` and `animation-duration: 0s`. For scene transitions, render only the current scene without the outgoing clone.

---

## Per-Style Transition Plan

### Style 01: Executive Silence
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Cross-fade with subtle scale-down-out / scale-up-in.
  - Outgoing scene: opacity 1→0 over 500ms ease-out, scale 1→0.97 over 500ms ease-out.
  - Incoming scene: opacity 0→1 over 600ms ease-out, starts at 50ms delay, scale 0.98→1 over 600ms ease-out.
  - Both scenes absolutely positioned (`position: absolute; inset: 0;`) in the stage container.
- **Beat-Level Reveals**: Each question item uses `opacity 0→1` + `translateY(1cqh)→0` with 800ms cubic-bezier(0.16, 1, 0.3, 1). Stagger by index × 0.15s.
- **FLIP Candidates**: Scene 3 question list — when a new question appears and pushes existing ones down. Wrap `<ul>` in `useFLIP` with `watch: [beat]`.
- **Implementation Notes**: Use CSS custom properties for the scale values. Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for enter, `ease-in` for exit.

### Style 02: Swiss Precision
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Rule-draw reveal (horizontal line sweeps down).
  - A 2px horizontal rule (Swiss grid accent) sweeps from top to bottom over 700ms with `cubic-bezier(0.7, 0, 0.3, 1)`.
  - Above the rule: outgoing scene visible, opacity 1→0 in last 200ms of sweep.
  - Below the rule: incoming scene revealed progressively as line passes.
  - Implementation: Use a `clip-path: inset(0 0 ${100-progress}% 0)` on incoming scene. The rule is a positioned div with `transform: translateY(${progress}%)`.
- **Beat-Level Reveals**: Metric blocks slide in from left (`translateX(-2cqw)→0`) with 400ms ease, staggered by 120ms. Quality bars animate width from 0→target with 800ms cubic-bezier(0.16, 1, 0.3, 1).
- **FLIP Candidates**: Scene 3 process step list. Wrap process list in `useFLIP`.
- **Implementation Notes**: The red accent color (#d32f2f) should color the sweep rule. Ties to Swiss International Style visual language.

### Style 03: Zen Void
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Ink-drop fade (opacity + gentle blur-to-focus).
  - Outgoing: opacity 1→0 over 600ms, `filter: blur(0)→blur(4px)` over 600ms ease-in.
  - Incoming: opacity 0→1 over 800ms, `filter: blur(6px)→blur(0)` over 800ms ease-out, starts at 100ms delay.
  - The kanji character gets a subtle `scale: 0.95→1.02→1` overshoot on enter (400ms spring).
- **Beat-Level Reveals**: Body text reveals with `opacity 0→1` + `translateY(0.8cqh)→0` over 800ms ease-out. Practice list items stagger in from left.
- **FLIP Candidates**: Scene 4 practice steps list. Wrap in `useFLIP` with `watch: [beat]`.

### Style 04: Aurora Gradient
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Aurora curtain (diagonal wipe from top-left to bottom-right).
  - A soft gradient curtain (matching the aurora blob colors) sweeps diagonally across the stage.
  - Use `clip-path: polygon(0 0, ${progress×1.5}% 0, ${progress}% 100%, 0 100%)` on incoming scene.
  - Duration: 900ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
  - The aurora background blobs persist across scenes, so only the content layer transitions.
- **Beat-Level Reveals**: Data cards illuminate from below (`translateY(2cqh)→0`, `opacity 0→1`). Stagger by 100ms.
- **FLIP Candidates**: Scene 4 region cards grid. Wrap region grid in `useFLIP` with `selector: ".regionCard"`.
- **Implementation Notes**: Keep aurora background blobs as a persistent layer outside the transition. Only the content track animates.

### Style 05: Blueprint
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Grid-line dissolve.
  - The blueprint grid lines animate their `stroke-dashoffset` to "dissolve" the outgoing scene.
  - Outgoing: grid lines retract (dashoffset increases) over 400ms, then content fades over 200ms.
  - Incoming: grid lines draw in (dashoffset 0) from edges over 500ms, content fades in over 400ms starting at 200ms.
  - Total duration: ~800ms.
- **Beat-Level Reveals**: Schematic elements (annotations, dimension lines) draw in via SVG `stroke-dashoffset`. New callout boxes scale from 0.8→1 with opacity fade.
- **FLIP Candidates**: Part lists or bill-of-materials tables.
- **Implementation Notes**: Use `stroke-dasharray` and `stroke-dashoffset` for all line-draw animations. Linear easing for grid (mechanical feel), ease-out for content.

### Style 06: Monochrome Study
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Hard cut with 1-frame flash (white flash for light scheme, black for dark).
  - Outgoing scene holds until frame N.
  - Frame N+1: full-screen white/black overlay at opacity 0.6.
  - Frame N+2: overlay fades out over 150ms, revealing incoming scene.
  - Total perceived duration: ~200ms. Feels snappy and deliberate.
- **Beat-Level Reveals**: Content appears instantly but with a subtle `opacity 0→1` over 200ms to soften.
- **FLIP Candidates**: None — this style is about stillness. FLIP would feel wrong.

### Style 07: Quiet Confidence
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: Breath-pause dissolve.
  - Outgoing: opacity 1→0.3 over 300ms (holds at 0.3 for 100ms "breath"), then 0.3→0 over 200ms.
  - Incoming: opacity 0→0.3 over 200ms (starts 100ms after outgoing begins fade), holds at 0.3 for 100ms, then 0.3→1 over 300ms.
  - Total: ~900ms. The "breath" pause creates a moment of reflection between scenes.
- **Beat-Level Reveals**: Gentle `opacity 0→1` over 600ms with `translateY(0.5cqh)→0`. No scale.
- **FLIP Candidates**: Minimal. Only if a list grows significantly.

### Style 08: Terminal Glow
- **Band**: Minimal Keynote
- **Scene-to-Scene Transition**: CRT scan-out / scan-in.
  - Outgoing scene: horizontal scan lines collapse from bottom and top toward center over 300ms. Use `clip-path: inset(${collapse}% 0 ${collapse}% 0)` where collapse goes from 0 to 50%.
  - Brief 80ms black gap.
  - Incoming scene: scan lines expand from center outward over 300ms. `clip-path: inset(${50-progress}% 0 ${50-progress}% 0)`.
  - Add a subtle green phosphor glow (`text-shadow: 0 0 8px #0f0`) during the scan.
- **Beat-Level Reveals**: Typewriter effect for new text. Terminal prompt blinks.
- **FLIP Candidates**: Log output areas where new lines push old ones up.

---

### Style 09: Process Flow
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Horizontal slide (right-to-left for forward navigation).
  - Outgoing scene: `translateX(0)→translateX(-30%)` + `opacity 1→0.3` over 500ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
  - Incoming scene: `translateX(100%)→translateX(0)` + `opacity 0.4→1` over 500ms with same easing.
  - Both absolutely positioned. Horizontal track with opacity blend for premium feel.
- **Beat-Level Reveals**: Process step cards slide in from right with 80ms stagger. Sprint cycle nodes scale in with opacity.
- **FLIP Candidates**: Scene 3 five-step delivery list. Wrap step list in `useFLIP`.

### Style 10: Matrix Grid
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Grid cell cascade (staggered cell reveal).
  - The stage is conceptually divided into a 3×2 grid of cells.
  - Outgoing: cells fade out one by one in reverse order (bottom-right to top-left), each cell taking 200ms, 60ms stagger between cells.
  - Incoming: cells fade in from top-left to bottom-right, same timing.
  - Implementation: Render 6 clip-panel divs with `grid-template-columns: repeat(3, 1fr)` and animate each individually.
- **Beat-Level Reveals**: Matrix quadrants scale from 0.95→1 with opacity fade, staggered.
- **FLIP Candidates**: Any grid where cells reorder or grow.

### Style 11: Timeline Spiral
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Spiral zoom (scale + rotate).
  - Outgoing scene: `scale(1)→scale(0.3)` + `rotate(0deg)→rotate(-15deg)` + `opacity 1→0` over 600ms ease-in.
  - Incoming scene: `scale(2.5)→scale(1)` + `rotate(20deg)→rotate(0deg)` + `opacity 0→1` over 600ms ease-out, starts at 50ms.
  - The spiral timeline element persists and rotates continuously; only content layers zoom.
- **Beat-Level Reveals**: Timeline nodes pop in along the spiral path, each with a 100ms delay.
- **FLIP Candidates**: Not ideal for this style (spatial layout is fixed).

### Style 12: Iconography
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Icon morph / shape-shift.
  - The primary icon of the outgoing scene scales down and fades.
  - Simultaneously, the primary icon of the incoming scene scales up from 0 and fades in.
  - The background content cross-fades underneath over 500ms.
  - Total: 500ms. The icon transition is the visual anchor.
- **Beat-Level Reveals**: Icons in a grid stagger in with `scale(0)→scale(1)` + `opacity 0→1` over 300ms each, 50ms stagger.
- **FLIP Candidates**: Icon grid where new icons appear and push the layout. Wrap icon grid container in `useFLIP`.

### Style 13: Sticky Board
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Sticky note peel-and-replace.
  - Outgoing scene notes: each note "peels off" with `rotate(${random-5to5}deg)→rotate(${random-15to-10}deg)` + `translateY(0)→translateY(-3cqh)` + `opacity 1→0` over 400ms. Stagger by 80ms.
  - Incoming scene notes: each note "slaps down" with `rotate(${random-8to8}deg)` + `scale(1.05)→scale(1)` + `opacity 0→1` over 350ms with `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring). Stagger by 60ms.
- **Beat-Level Reveals**: New sticky notes appear with spring scale-in. Existing notes shift position.
- **FLIP Candidates**: **YES** — prime FLIP candidate. Wrap the board container in `useFLIP` with `watch: [beat]`, `selector: ".stickyNote"`.
- **Implementation Notes**: Each note should have a slight random rotation (-5 to +5 degrees). Use CSS custom properties set via inline `style` for per-note rotation seeds.

### Style 14: Org Chart
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Tree re-grow (nodes fade in from root outward).
  - Outgoing: leaf nodes fade out first (opacity 1→0 over 200ms), then their parents, cascading to root. Total 400ms.
  - Incoming: root node appears first (scale 0.8→1, opacity 0→1 over 300ms), then children cascade in level by level, each level taking 200ms with 100ms delay from parent.
  - Connector lines draw via `stroke-dashoffset` as nodes appear.
- **Beat-Level Reveals**: New team members appear as cards in their level, pushing siblings.
- **FLIP Candidates**: **YES** — when a new person is added to a team, the layout shifts. Wrap chart container in `useFLIP` with `selector: ".orgNode"`.

### Style 15: Roadmap
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Road extends forward (horizontal slide with perspective).
  - Outgoing scene: `transform: perspective(800px) translateX(0) translateZ(0)` → `translateX(-60%) translateZ(-100px)` + `opacity 1→0` over 550ms ease-in.
  - Incoming scene: `transform: perspective(800px) translateX(60%) translateZ(-100px)` → `translateX(0) translateZ(0)` + `opacity 0→1` over 550ms ease-out.
  - Creates the feeling of driving forward along a roadmap.
- **Beat-Level Reveals**: Milestone markers pop in along the timeline with `scale(0)→scale(1.1)→scale(1)` spring animation. Road segments extend via `width: 0→100%`.
- **FLIP Candidates**: Roadmap timeline where adding milestones extends the road.

### Style 16: Case Study
- **Band**: Balanced Hybrid
- **Scene-to-Scene Transition**: Stacked card push (cards slide up from bottom).
  - Outgoing card: `translateY(0)→translateY(-8%)` + `opacity 1→0.4` + `scale(1)→scale(0.97)` over 450ms ease-in.
  - Incoming card: `translateY(100%)→translateY(0)` + `opacity 0→1` + `scale(0.98)→scale(1)` over 450ms with `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Creates a "deck of cards" feeling where each scene is a card in the case study deck.
- **Beat-Level Reveals**: Evidence blocks slide in from right with opacity. Quote callouts scale in.
- **FLIP Candidates**: Evidence list where new items push existing ones.
- **Implementation Notes**: Add a subtle `box-shadow` increase on the incoming card as it settles, to give depth.

---

### Style 17: Editorial Broadsheet
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Page turn (3D flip around Y-axis, left edge).
  - Outgoing page: `transform-origin: left center`, `rotateY(0)→rotateY(-160deg)` over 700ms with `cubic-bezier(0.4, 0, 0.2, 1)`. Add `backface-visibility: hidden`.
  - Incoming page: positioned behind outgoing, `rotateY(160deg)→rotateY(0)` over same duration.
  - Add a subtle paper-curl shadow on the turning edge using a pseudo-element with `background: linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)`.
  - **Note**: Currently uses `translateY` vertical track. **REPLACE** with this page-flip approach.
- **Beat-Level Reveals**: Drop cap letter scales in. Body paragraphs reveal line by line using `clip-path: inset(0 0 ${100-progress}% 0)`.
- **FLIP Candidates**: Not needed for this print-inspired style.
- **Implementation Notes**: Use `perspective: 2000px` on the stage to prevent distortion.

### Style 18: Literary Review
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Book spread turn (two pages flip together).
  - The stage shows two pages side by side.
  - Center spine is a 2px vertical shadow.
  - Outgoing spread: both pages rotate away from spine (`rotateY(0)→rotateY(+/-170deg)`) over 800ms.
  - Incoming spread: rotates in from behind.
  - If single-scene per view, simulate by having the "page" content rotate.
- **Beat-Level Reveals**: Text reveals word by word (or line by line) using `opacity 0→1` with 30ms stagger per word, creating a "reading" cadence.
- **FLIP Candidates**: Minimal.

### Style 19: Financial Times
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Column slide (content columns slide up independently).
  - The FT layout is multi-column. Each column slides up from below at slightly different rates.
  - Column 1: `translateY(100%)→translateY(0)` over 600ms, delay 0ms.
  - Column 2: same, delay 80ms.
  - Column 3: same, delay 160ms.
  - Outgoing columns slide up and out: `translateY(0)→translateY(-100%)` over 400ms, staggered.
  - **Note**: Currently uses `translateY` vertical track. **REPLACE** with per-column slide.
- **Beat-Level Reveals**: Stock ticker numbers count up. Table rows appear with `opacity 0→1` + slight `translateY`.
- **FLIP Candidates**: Data tables where new rows push old ones.

### Style 20: National Geographic
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Photo reveal (yellow border frame expands from center).
  - The iconic Nat Geo yellow rectangle border expands from center (scale 0→1 with `clip-path: inset(...)`) over 500ms.
  - Inside the frame, the photo/content cross-fades.
  - Outgoing: frame border stays, content fades out (300ms).
  - Incoming: content fades in (400ms) as frame settles.
  - The yellow frame is the persistent visual anchor.
- **Beat-Level Reveals**: Photo captions slide up from bottom. Map annotations draw in with SVG stroke-dashoffset.
- **FLIP Candidates**: Photo gallery grids where new images push layout.
- **Implementation Notes**: The yellow (#FFCC00) border is the brand anchor. Make it a persistent SVG rectangle.

### Style 21: Vogue Editorial
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Fashion curtain pull (diagonal fabric sweep).
  - A diagonal "fabric" panel sweeps from top-right to bottom-left.
  - Use `clip-path: polygon(${100+progress×1.5}% 0, 100% 0, 100% 100%, ${100-progress×0.5}% 100%)` on the curtain overlay.
  - Curtain color: deep black or editorial red.
  - Duration: 650ms with slight overshoot easing at the end (`cubic-bezier(0.34, 1.56, 0.64, 1)` for the final 10%).
- **Beat-Level Reveals**: Headline letters track in (`letter-spacing: 0.5em→0.05em` over 600ms). Pull quotes scale with opacity.
- **FLIP Candidates**: Not needed.
- **Implementation Notes**: The letter-spacing animation on headlines is the typography-specific signature.

### Style 22: Academic Journal
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Vertical scroll (like scrolling a PDF paper).
  - This is the one style where vertical slide IS appropriate — academic papers are read top-to-bottom.
  - Outgoing: `translateY(0)→translateY(-30%)` + `opacity 1→0.2` over 500ms.
  - Incoming: `translateY(30%)→translateY(0)` + `opacity 0.2→1` over 500ms.
  - Add a subtle "page edge" shadow at the transition boundary.
  - **Note**: Currently uses `translateY` track. **KEEP** but enhance with opacity blend and shadow.
- **Beat-Level Reveals**: Equation displays fade in with `scale(0.95)→scale(1)`. Citation numbers appear as superscript pop-ins.
- **FLIP Candidates**: Reference lists where new citations push the list.

### Style 23: Zine Culture
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Collage scatter-and-reassemble.
  - Outgoing scene: elements (text blocks, images, borders) scatter outward in random directions with `translate(${random}px, ${random}px)` + `rotate(${random}deg)` + `opacity 1→0` over 500ms.
  - Incoming scene: elements fly in from off-screen edges to their final positions, each with its own 300-500ms animation and random 0-200ms delay.
  - Creates a "collage being assembled" feel.
- **Beat-Level Reveals**: New elements pop in with `scale(0)→scale(1.2)→scale(1)` + random rotation (-5 to +5 deg).
- **FLIP Candidates**: **YES** — collage elements shifting positions is ideal FLIP territory. Wrap collage container in `useFLIP` with `selector: ".zineElement"`, `duration: 500`.

### Style 24: Manuscript Scroll
- **Band**: Editorial & Print
- **Scene-to-Scene Transition**: Scroll unroll (vertical scroll reveals new content).
  - An actual "scroll" visual: the incoming scene is revealed as a scroll unrolls from top.
  - Use a `clip-path: inset(0 0 ${100-progress}% 0)` on incoming content, paired with a decorative "scroll rod" SVG at the reveal edge.
  - The scroll rod (horizontal bar with finials on ends) moves from top to bottom.
  - Outgoing content fades to opacity 0.3 behind the scroll.
  - Duration: 800ms.
  - **Note**: Currently uses `translateY` track. **REPLACE** with scroll-unroll clip-path.
- **Beat-Level Reveals**: Calligraphy characters draw in via SVG stroke-dashoffset. Seal stamps appear with `scale(2)→scale(1)` + rotation.
- **FLIP Candidates**: Not needed.

---

### Style 25: Woodblock Print
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Woodblock press (stamp-down from above).
  - Incoming scene content "stamps" down from above: `translateY(-5cqh)→translateY(0)` + `scale(1.05)→scale(1)` + `opacity 0→1` over 350ms with `cubic-bezier(0.34, 1.56, 0.64, 1)`.
  - Outgoing scene: `opacity 1→0` + `filter: blur(0)→blur(2px)` over 300ms.
  - At the moment of "contact" (frame where scale hits 1.0), add a 1-frame `brightness(1.2)` flash.
- **Beat-Level Reveals**: Print process steps each stamp in with the same press-down animation. Wood grain texture details fade in.
- **FLIP Candidates**: Process step list where new steps push layout.

### Style 26: Chinese Ink
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Ink wash bleed (content emerges from ink diffusion).
  - Incoming scene: starts as a blurred, low-opacity shape (`filter: blur(20px)`, `opacity 0.3`) that gradually sharpens (`blur(20px)→blur(0)`) and increases opacity (`0.3→1`) over 900ms with ease-out.
  - Outgoing scene: dissolves like ink in water — `blur(0)→blur(12px)` + `opacity 1→0` over 600ms ease-in.
  - The ink-wash effect should feel organic and slow, like sumi-e ink spreading on rice paper.
- **Beat-Level Reveals**: Brush stroke characters draw in via SVG path with `stroke-dashoffset`. Seal stamps press in.
- **FLIP Candidates**: Not ideal for this style (organic feel resists mechanical FLIP).

### Style 27: Art Deco
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Geometric fan reveal (Art Deco sunburst pattern expands).
  - Incoming scene is revealed through an expanding fan/sunburst pattern using `clip-path: polygon(...)` with an increasing number of triangular segments.
  - Or simpler: use a `clip-path: circle(${progress}% at 50% 50%)` where the circle expands from 0 to 75%.
  - The circle edge has a gold/bronze Art Deco border accent.
  - Outgoing: fades to opacity 0 behind the expanding circle.
  - Duration: 700ms.
- **Beat-Level Reveals**: Decorative border elements draw in via SVG. Stat lines scale in with geometric precision.
- **FLIP Candidates**: Minimal.

### Style 28: Bauhaus Poster
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Shape slide (primary geometric shape slides across).
  - A large circle, square, or triangle (Bauhaus primary shapes) in red, blue, or yellow slides diagonally across the stage.
  - The shape acts as a "wipe" — behind it, the incoming scene is revealed.
  - Use `clip-path` on incoming scene, masked by the shape's path.
  - Shape moves from top-left (off-screen) to bottom-right (off-screen) over 600ms linear.
- **Beat-Level Reveals**: Content blocks (each a geometric shape container) pop in with `scale(0)→scale(1)` + color fill animation.
- **FLIP Candidates**: Grid of shape-contained elements where new items push layout.

### Style 29: Celtic Knot
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Interlace weave (strands cross over and under).
  - The transition features 3-4 horizontal "strands" that slide across the stage at different speeds and in alternating directions.
  - Strand 1: left→right at translateY(-20%), 500ms.
  - Strand 2: right→left at translateY(-10%), 600ms.
  - Strand 3: left→right at translateY(0%), 550ms.
  - Strand 4: right→left at translateY(10%), 650ms.
  - Incoming scene content is revealed between/behind the strands as they pass.
  - Creates a "weaving" effect.
- **Beat-Level Reveals**: Knot elements draw in via SVG stroke animation along the interlace path.
- **FLIP Candidates**: Not needed.

### Style 30: Mexican Mural
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Fresco reveal (plaster texture sweeps across).
  - A diagonal "wet plaster" texture sweeps from bottom-left to top-right.
  - Use `clip-path: polygon(0 ${100-progress}%, ${progress}% 100%, 100% ${progress}%, ${100-progress}% 0)` on incoming scene.
  - The plaster edge has a warm, earthy color wash.
  - Duration: 750ms with slight ease-in-out.
- **Beat-Level Reveals**: Mural elements appear with a "fresco secco" feel — content materializes from a textured base. Use `opacity 0.3→1` + `filter: saturate(0.5)→saturate(1.2)` over 500ms.
- **FLIP Candidates**: Figure groupings that reposition.

### Style 31: African Kente
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Weft insertion (horizontal bars slide in from sides).
  - Multiple horizontal colored bars (representing weft threads) slide in from left and right, interlacing.
  - Each bar is 2-3cqh tall, in Kente colors (gold, green, red, black, blue).
  - Bars from left: `translateX(-100%)→translateX(0)` over 400ms, staggered by 50ms.
  - Bars from right: `translateX(100%)→translateX(0)` over 400ms, staggered by 50ms (offset by 25ms from left bars).
  - Behind the bars, incoming scene fades in.
  - After bars settle, they fade to opacity 0 and retract.
- **Beat-Level Reveals**: Pattern elements grow in with `scale(0)→scale(1)` from their center point.
- **FLIP Candidates**: Weave pattern grids.
- **Implementation Notes**: Kente cloth colors: #F5C518 (gold), #007A3D (green), #C8102E (red), #000000, #003DA5 (blue).

### Style 32: Nordic Rosemaling
- **Band**: Craft & Cultural
- **Scene-to-Scene Transition**: Floral vine grow (curling vines draw across screen).
  - SVG vine paths (rosemaling-style scrolls and flowers) draw across the stage from edges, using `stroke-dashoffset` animation.
  - As vines grow across, they "push back" a curtain that reveals the incoming scene behind them.
  - Implementation: Vines are drawn on a full-screen overlay. Behind the overlay, incoming scene is at full opacity. The overlay's opacity fades from 1 to 0 once the vines are fully drawn (over 300ms).
  - Total: vine-draw 600ms + fade 300ms = 900ms.
- **Beat-Level Reveals**: Rosemaling decorative elements bloom in with `scale(0)→scale(1)` + `rotate(-10deg)→rotate(0)`.
- **FLIP Candidates**: Not needed.
- **Implementation Notes**: Rosemaling colors: soft blues (#4A7BA5), rose pinks (#C77B8A), cream whites (#F5F0E6), forest greens (#2D5A3D).

---

### Style 33: Glass Dashboard
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Glass panel shuffle (cards fly out and new ones fly in).
  - Outgoing glass cards: each card `translateY(0)→translateY(-3cqh)` + `opacity 1→0` + `scale(1)→scale(0.95)` over 350ms, staggered by 40ms (top cards first).
  - Incoming glass cards: each card `translateY(3cqh)→translateY(0)` + `opacity 0→1` + `scale(0.95)→scale(1)` over 350ms with `cubic-bezier(0.16, 1, 0.3, 1)`, staggered by 40ms.
  - The glassmorphism blur effect (`backdrop-filter: blur(12px)`) persists on card backgrounds.
- **Beat-Level Reveals**: KPI values count up. Chart bars grow height from 0→target. Activity feed items slide in from right.
- **FLIP Candidates**: **YES** — dashboard widgets reordering. Wrap the dashboard grid in `useFLIP` with `selector: ".glassCard"`, `duration: 450`.

### Style 34: Retro OS 95
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Window minimize/maximize (Win95 style).
  - Outgoing scene "minimizes": `transform: scale(1) translate(0, 0)` → `scale(0.1) translate(-40cqw, 40cqh)` (to bottom-left "taskbar" area) + `opacity 1→0.3` over 400ms with `cubic-bezier(0.4, 0, 1, 1)`.
  - Incoming scene "maximizes": starts at `scale(0.1)` at bottom-left, then `scale(0.1)→scale(1)` + `translate(...)` to center + `opacity 0.3→1` over 400ms with `cubic-bezier(0, 0, 0.2, 1)`.
  - Add the classic Win95 bevel border to the "window" being animated.
- **Beat-Level Reveals**: UI elements appear with the classic "button depress" feel. Dialog boxes pop in with `scale(0.9)→scale(1)`.
- **FLIP Candidates**: Desktop icons rearranging. Wrap icon area in `useFLIP`.
- **Implementation Notes**: Win95 gray (#c0c0c0) with bevel borders. Use `box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #808080` for bevel.

### Style 35: Neon Grid
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Grid pulse + scan line sweep.
  - The perspective grid background pulses: `opacity 0.3→0.6→0.3` over 300ms (a "power surge" through the grid).
  - Simultaneously, a horizontal scan line (bright neon band) sweeps from bottom to top over 500ms.
  - Outgoing content: `opacity 1→0` + `filter: hue-rotate(0deg)→hue-rotate(30deg)` over 400ms.
  - Incoming content: `opacity 0→1` + `filter: hue-rotate(-30deg)→hue-rotate(0deg)` over 400ms, starts at 100ms.
  - Creates a "synthwave tape flip" feel.
- **Beat-Level Reveals**: Neon elements flicker on (`opacity 0→1` with 2-3 quick oscillations over 200ms, like a neon tube igniting). Grid cells illuminate in sequence.
- **FLIP Candidates**: Grid layouts where cells shift.
- **Implementation Notes**: Neon colors: hot pink (#ff00ff), cyan (#00ffff), purple (#9900ff).

### Style 36: Glass Morph
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Blur-to-clear (depth-of-field focus pull).
  - Outgoing scene: `filter: blur(0) brightness(1)` → `filter: blur(12px) brightness(0.7)` over 400ms ease-in + `opacity 1→0.3`.
  - Incoming scene: `filter: blur(16px) brightness(0.8)` → `filter: blur(0) brightness(1)` over 500ms ease-out + `opacity 0.3→1`, starts at 50ms.
  - The glass panels' `backdrop-filter: blur()` values also animate, creating a "lens focusing" effect.
- **Beat-Level Reveals**: Glass cards materialize from the blur: `backdrop-filter: blur(0px)→blur(12px)` + `opacity 0→1` + `scale(0.98)→scale(1)` over 400ms.
- **FLIP Candidates**: **YES** — card layouts shifting. Wrap card container in `useFLIP` with `selector: ".glassCard"`.

### Style 37: Terminal UI
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Clear screen + reprint (`^L` effect).
  - Outgoing: `opacity 1→0` over 150ms (quick, like a terminal clearing).
  - Brief 50ms gap (black screen).
  - Incoming: content appears line by line, top to bottom. Each line: `opacity 0→1` over 50ms, with 20ms delay per line.
  - A blinking cursor appears at the end of the last line printed.
  - Total: ~400ms for full scene reveal.
- **Beat-Level Reveals**: New terminal output lines appear with typewriter effect.
- **FLIP Candidates**: Terminal output where new lines push old ones up. Wrap the output area in `useFLIP` with `watch: [beat]`.
- **Implementation Notes**: Terminal green (#00ff41) on black (#000). `font-family: 'Courier New', monospace`. Cursor blink: `animation: blink 1s step-end infinite`.

### Style 38: Figma Canvas
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Frame pan + zoom (Figma canvas navigation).
  - Outgoing scene: `transform: scale(1) translate(0, 0)` → `scale(0.4) translate(-20cqw, -10cqh)` (zooms out and pans left) over 500ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
  - Incoming scene: `transform: scale(0.4) translate(20cqw, 10cqh)` → `scale(1) translate(0, 0)` over 500ms with same easing.
  - The "canvas" background (dot grid pattern) persists and pans smoothly.
- **Beat-Level Reveals**: Design elements appear with `opacity 0→1` + a subtle "selection blue" border flash (`box-shadow: 0 0 0 2px #0d99ff` that fades out after 400ms).
- **FLIP Candidates**: **YES** — design elements moving on the canvas. Wrap the canvas area in `useFLIP` with `selector: ".figmaElement"`.
- **Implementation Notes**: Dot grid background. Use `background-image: radial-gradient(#e5e5e5 1px, transparent 1px)` with `background-size: 20px 20px`.

### Style 39: Notion Doc
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Block stack (content blocks slide up like a Notion page scroll).
  - Outgoing blocks: each block `translateY(0)→translateY(-2cqh)` + `opacity 1→0` over 300ms, staggered by 30ms (top to bottom).
  - Incoming blocks: each block `translateY(2cqh)→translateY(0)` + `opacity 0→1` over 300ms, staggered by 30ms (top to bottom), starts at 100ms.
  - The Notion sidebar persists (fades only slightly, opacity 1→0.8→1).
- **Beat-Level Reveals**: New blocks (todo items, callouts, toggles) insert with a smooth push-down. Toggle reveals expand height from 0→auto with opacity.
- **FLIP Candidates**: **PRIME candidate**. When a new block is inserted, all blocks below shift down. Wrap the document container in `useFLIP` with `watch: [beat]`, `selector: ".notionBlock"`, `duration: 350`.

### Style 40: Particle Field
- **Band**: Contemporary Digital
- **Scene-to-Scene Transition**: Particle scatter-and-coalesce.
  - Outgoing scene: content dissolves into particles. Each text block or element "explodes" into 8-12 small dots that fly outward with `translate(${random}px, ${random}px)` + `opacity 1→0` + `scale(1)→scale(0)` over 500ms.
  - Particle "cloud" briefly visible (200ms).
  - Incoming scene: particles fly in from random positions and coalesce into the content elements. Dots converge with `translate` + `opacity 0→1` + `scale(0)→scale(1)` over 500ms.
  - Total: ~1000ms.
- **Beat-Level Reveals**: New data points appear as particles that materialize at their position. Field lines draw via SVG stroke animation.
- **FLIP Candidates**: Particle positions changing. Wrap the field container in `useFLIP` with `selector: ".particle"`.

---

### Style 41: Annual Report
- **Band**: Text Report
- **Scene-to-Scene Transition**: Hard cut with page number flash.
  - Outgoing scene holds for 0ms (instant).
  - A "PAGE N OF 5" indicator flashes in the bottom-right for 200ms (opacity 0→1→0).
  - Incoming scene appears immediately.
  - This mimics flipping through a printed annual report.
- **Beat-Level Reveals**: Financial figures count up. Table rows appear with `opacity 0→1` over 150ms, staggered by 30ms.
- **FLIP Candidates**: Table rows where new data pushes layout.

### Style 42: Legal Brief
- **Band**: Text Report
- **Scene-to-Scene Transition**: Section divider rule (bold horizontal rule draws across).
  - A thick (3px) black horizontal rule animates from left edge to right edge over 250ms (`width: 0→100%`).
  - Above the rule: outgoing. Below: incoming.
  - After rule completes, outgoing fades to opacity 0 over 100ms.
  - Total: 350ms. Fast and formal.
- **Beat-Level Reveals**: Legal citations appear as superscript pop-ins. Indented paragraphs reveal with `opacity 0→1` over 200ms.
- **FLIP Candidates**: Not needed for this formal style.

### Style 43: Research Digest
- **Band**: Text Report
- **Scene-to-Scene Transition**: Line-by-line reveal (top to bottom).
  - Incoming scene content is revealed progressively from top to bottom.
  - Use `clip-path: inset(0 0 ${100-progress}% 0)` on incoming scene, animated from `inset(0 0 100% 0)` to `inset(0 0 0% 0)` over 500ms with linear timing.
  - Outgoing: `opacity 1→0.2` over 300ms.
  - Creates a "scanning down the page" feel.
- **Beat-Level Reveals**: Bullet points appear with `opacity 0→1` + `translateX(-0.5cqw)→0` over 200ms each, 40ms stagger.
- **FLIP Candidates**: Bullet lists that grow.

### Style 44: Meeting Minutes
- **Band**: Text Report
- **Scene-to-Scene Transition**: Timestamp stamp (date/time header flashes).
  - A "meeting timestamp" banner slides down from top: `translateY(-100%)→translateY(0)` over 200ms, holds for 150ms, then `opacity 1→0` over 100ms.
  - During the hold, the incoming scene content cross-fades in behind the banner.
  - Outgoing: `opacity 1→0` over 200ms (starts when banner appears).
  - Total: ~450ms.
- **Beat-Level Reveals**: Action items appear with a checkbox that animates. Attendee names pop in.
- **FLIP Candidates**: Action item lists where new items push layout.

### Style 45: Policy Paper
- **Band**: Text Report
- **Scene-to-Scene Transition**: Margin rule slide (vertical rule line draws from top).
  - A vertical accent rule on the left margin draws from top to bottom: `height: 0→100%` over 400ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
  - Content to the right of the rule fades in as the rule passes it: `opacity 0→1` with a 50ms delay per "section."
  - Outgoing: `opacity 1→0` over 300ms.
- **Beat-Level Reveals**: Policy recommendations appear with a left-border highlight that animates from 0 to full width.
- **FLIP Candidates**: Recommendation lists.
- **Implementation Notes**: Vertical rule 2-3px, policy-blue (#1a3a6c). Content indented right of rule by 2cqw.

### Style 46: Audit Report
- **Band**: Text Report
- **Scene-to-Scene Transition**: Finding stamp (audit finding stamp slams down).
  - A red "FINDING" or "CONCLUSION" stamp graphic presses down onto the outgoing scene: `scale(2)→scale(1)` + `rotate(-8deg)` + `opacity 0→1` over 200ms with spring easing.
  - Stamp holds for 100ms.
  - Stamp fades out + incoming scene fades in over 200ms.
  - Total: 500ms.
- **Beat-Level Reveals**: Audit findings appear with severity indicators (red/amber/green) that flash once on appearance.
- **FLIP Candidates**: Finding tables.
- **Implementation Notes**: Stamp looks like a red rubber stamp: circular, with "AUDIT FINDING" text. Use `filter: contrast(1.2)`.

### Style 47: White Paper
- **Band**: Text Report
- **Scene-to-Scene Transition**: Page edge peel (top-right corner curls).
  - The top-right corner of the outgoing scene "peels" back, revealing the incoming scene underneath.
  - Use a `clip-path` that creates a triangular peel from the top-right corner, growing from 0 to cover the full page over 600ms.
  - The peeled-back corner has a subtle shadow underneath.
  - The back of the peeled corner shows a faint watermark or logo.
- **Beat-Level Reveals**: Technical diagrams draw in via SVG stroke animation. Equations appear with `opacity 0→1` over 300ms.
- **FLIP Candidates**: Not needed.

### Style 48: Executive Summary
- **Band**: Text Report
- **Scene-to-Scene Transition**: Bullet point typewriter (key points appear one by one).
  - Outgoing: `opacity 1→0` over 200ms (quick).
  - Incoming: the title appears first (300ms). Then each bullet point types in: characters reveal left to right using `clip-path: inset(0 ${100-progress}% 0 0)` per line.
  - Each bullet takes 200ms to type out, with 100ms gap between bullets.
  - Total: ~1200ms for a 5-bullet summary. Feels like information being delivered.
- **Beat-Level Reveals**: Sub-bullets indent and appear with `opacity 0→1` + `translateX(1cqw)→0` over 200ms.
- **FLIP Candidates**: Bullet lists expanding.
- **Implementation Notes**: Typewriter per line uses growing `clip-path` inset from right. Add a blinking cursor `|` at the end of the currently-typing line.

---

## Diversity Coverage

| Family | Styles | Count |
|--------|--------|-------|
| 1. Cross-fade / dissolve | 01, 03, 07, 20, 36, 41 | 6 |
| 2. Horizontal slide | 09, 15, 28 | 3 |
| 3. Vertical slide | 19, 22 (enhanced), 43 | 3 |
| 4. Scale / zoom | 01, 11, 15, 34, 38 | 5 |
| 5. Rotation / 3D flip | 17, 18, 28, 34 | 4 |
| 6. Clip-path reveal | 02, 05, 08, 20, 22, 24, 27, 30, 35, 43, 47, 48 | 12 |
| 7. Blur-to-focus | 03, 04, 26, 36 | 4 |
| 8. Typography-specific | 02, 21, 42, 45, 48 | 5 |
| 9. Staggered element entrance | 10, 13, 14, 23, 31, 32, 39, 44 | 8 |
| 10. Mask / wipe | 04, 05, 08, 21, 30, 35, 43, 45, 47 | 9 |
| 11. Overlay / curtain | 06, 21, 24, 37, 44, 46 | 6 |
| 12. Stacked card push | 16, 33 | 2 |

---

## Implementation Checklist

For each style, follow this implementation sequence:

1. **Add transition state management**:
   ```tsx
   const [outgoingScene, setOutgoingScene] = useState<number | null>(null);
   const [isTransitioning, setIsTransitioning] = useState(false);
   
   useEffect(() => {
     // Detect scene change, set outgoing, clear after duration
   }, [scene]);
   ```

2. **Create dual-scene rendering**:
   ```tsx
   <div className={styles.root}>
     {/* Persistent background layers */}
     {renderPersistentBackground()}
     
     {/* Outgoing scene (if transitioning) */}
     {outgoingScene !== null && (
       <div className={`${styles.sceneLayer} ${styles.exitAnim}`}>
         {renderSceneFor(outgoingScene)}
       </div>
     )}
     
     {/* Incoming/current scene */}
     <div className={`${styles.sceneLayer} ${isTransitioning ? styles.enterAnim : ""}`}>
       {renderSceneContent()}
     </div>
     
     {renderNav()}
   </div>
   ```

3. **Add CSS for enter/exit animations** in the module CSS file.

4. **Handle `reducedMotion`**: When true, skip the outgoing scene entirely and render only the current scene with no animation classes.

5. **Handle `isTransitionClone`**: When true, skip all enter animations.

6. **Add `useFLIP`** where identified in the per-style plan above.

7. **Test with thumbnail mode** (`isThumbnail`): All transitions should work or be disabled in thumbnails.
