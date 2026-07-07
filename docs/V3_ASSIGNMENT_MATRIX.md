# V3 Assignment Matrix — Curated Third Version (Claude-Opus-4.8)

> **Status:** DRAFT — awaiting user approval before sub-agent dispatch.
> **Purpose:** The single content constitution for a third curated version
> (`v3`) of all 48 styles. Each `v3` is built by an independent sub-agent that
> reads only the protocol, shared infrastructure, and its own assigned brief +
> its own style DNA file. Sub-agents must NOT read any existing style
> implementation (`src/styles/NN-*.tsx`, including v1/v2 and other v3 peers),
> `registry.ts`, `showcase-thumbnails.ts`, or any other style's DNA.
>
> Everything below is **guiding design intent, not code**. Sub-agents write
> their own implementation from these principles.

---

## 0. Why this document exists

Left to their own devices, 48 independent agents converge: everyone picks a
`1/2/3/2/1` beat rhythm, a horizontal slide transition, and bottom dots for
navigation. This matrix pre-assigns the axes most prone to collapse — **topic,
five-scene narrative, per-scene beat count, per-edge scene transition, internal
navigation prototype, and beat-layout strategy** — so the 48 v3 decks stay
varied by construction, not by luck.

The orchestrator (me) owns integration: registry wiring, audit tables,
protocol-test extension, cross-version navigation, and per-band commits.
Sub-agents own only their single `NN-<topic>-v3.tsx` (+ optional CSS module).

---

## 1. Global contract every v3 sub-agent must satisfy

These are enforced by `version.ts`, `styleVersionProtocol.test.tsx`, and
`e2e/audit.spec.ts`. A brief that violates them will fail CI.

- **Version identity:** `defineStyleVersion({ id: "v3", model: "Claude-Opus-4.8", topic, component, getMetadata })`.
- **File name:** `src/styles/NN-<kebab-topic>-v3.tsx` (+ optional `.module.css`).
- **Exactly 5 scenes** in `getMetadata`, `id` 1–5. `metadata.id` must equal the
  two-digit style ID. `band` must equal the value in this matrix (do not guess).
- **Metadata `name`** must be the canonical style name in this matrix (EN + ZH),
  identical across versions of the same style. **`theme`** is the v3 topic.
- **Topic length:** English topic ≤ 32 chars, Chinese topic ≤ 8 chars.
- **Stage units:** only `cqw` / `cqh` for sizing. No `px` / `vw` / `vh` / `rem`
  / `em` for layout dimensions. (1cqw = 19.2px, 1cqh = 10.8px.)
- **Scene lifecycle:** use `SpatialSceneTrack`. Render ≥5 mounted scene panels.
  Never maintain `outgoingScene` state, never render a full-screen transition
  clone, never read `isTransitionClone`, never emit `data-transition-clone`.
- **Per-edge transitions:** pass a `transitionMap` covering all four edges
  (`1->2`, `2->3`, `3->4`, `4->5`) using the exact kinds assigned in this
  matrix. Also pass a base `transitionKind` (protocol test greps the source for
  `transitionKind=`). Supported kinds: `slide-x`, `slide-y`, `fade`,
  `scale-fade`, `hard-cut`, `wipe`, `page-flip`, `glitch`.
- **Beat layout:** every scene with >1 beat must expose
  `data-beat-layout-container="true"` + `data-beat-layout-mode="motion|reserved"`
  and, when the container is not the panel root, ≥2
  `data-beat-layout-item="true"` children. Use the mode assigned per scene.
  - `motion`: new beats push/reflow existing stable items with FLIP/layout
    motion (non-linear easing on the moved items).
  - `reserved`: final layout is reserved from beat 0; later beats only change
    opacity/emphasis/small transform of items in fixed slots. Never
    `display:none` a slot that holds space.
- **Reduced motion / thumbnail:** when `reducedMotion` or `isThumbnail`, disable
  animation (`animation-duration: 0s`, `transition-duration: 0s`) and settle to
  the final readable, non-overflowing layout. Pass
  `reducedMotion={reducedMotion || isThumbnail}` into `SpatialSceneTrack`.
- **Internal navigation:** if the style renders nav UI, it must `return null`
  when `isThumbnail`, and jump via `onNavigate?.(scene, 0)`. Nav elements that
  live inside the stage must `stopPropagation` so the envelope's click-zone
  navigation is not double-triggered.
- **Fonts:** inject via a `useFonts()` hook (Google Fonts / CDN). Declare every
  family in `getMetadata().fonts`. Prefix CJK families with `cjk:` for lazy
  loading (e.g. `"cjk:Noto Serif SC"`). Fonts are free per this matrix — pick
  what best serves the DNA (see per-row `type_voice`).
- **No overflow:** at 1920×1080, no scene at any beat may overflow the stage
  (>2px) in EN or ZH.

### v3-specific quality gate (added at integration, stated here for contract)

The orchestrator will extend `styleVersionProtocol.test.tsx` so that the v3
subset is held to the same hard gate as v2:

- every v3 renders a per-edge transition map (each edge exposes a supported
  kind when advancing scene 2→5);
- every v3 declares `model === "Claude-Opus-4.8"`;
- the v3 subset uses ≥6 distinct transition kinds across the 48.

Sub-agents do not edit tests; they just must honor the assigned transitions so
these pass.

---

## 2. Diversity quotas (orchestrator-enforced)

### 2.1 Scene-transition vocabulary

All 8 kinds are used across the 48. No band collapses into one kind. Rough
target distribution across the full v3 set (exact per-row values in §4):

| kind | intended feel | approx count |
|---|---|---|
| `slide-x` | lateral travel, reading progression | ~7 |
| `slide-y` | vertical stack / descent / ascent | ~6 |
| `fade` | quiet dissolve, reflective | ~6 |
| `scale-fade` | zoom-in focus, premium settle | ~6 |
| `wipe` | directional reveal, print/ink push | ~7 |
| `page-flip` | turning pages / cards / sheets | ~6 |
| `hard-cut` | percussive, terminal, blunt | ~5 |
| `glitch` | digital rupture, kinetic shock | ~5 |

Each v3 style's four edges are **not** all the same kind — every row mixes at
least two kinds across its four edges (most use 3–4), so no single deck feels
monotone. `hard-cut` and `glitch` are concentrated where the DNA earns them
(terminal, arcade, agitprop, kinetic-type, retro-OS, brutalist).

### 2.2 Internal navigation prototypes

Ten prototypes. Each style is assigned one that fits its DNA; within every band
of 8, the assignments are spread so no two adjacent styles share a prototype.

| # | prototype | description |
|---|---|---|
| N1 | **Bespoke metaphor** | nav *is* the style metaphor (ruler, station line, fader, health bar, tape counter, seal column…) |
| N2 | **Bottom progress dots / bar** | minimal dot or bar row along the bottom |
| N3 | **Side vertical scale / tabs** | vertical ticks or tab stack on a stage edge |
| N4 | **Wheel / picker** | rotary or drum-style scene selector |
| N5 | **Page numerals / spine** | folio numbers, running head, table-of-contents spine |
| N6 | **Timeline / stepper** | horizontal step markers with a progress connector |
| N7 | **Ghost / hover-reveal** | near-invisible until hover/focus; whisper presence |
| N8 | **No visible nav** | keyboard/click-zone only; content self-orients |
| N9 | **Command / status bar** | terminal prompt, status strip, breadcrumb line |
| N10 | **Object dial / compartment index** | physical selector on an object (kit slots, deco gate index) |

### 2.3 Beat-rhythm variety

Beat counts are chosen per topic (range 1–5), tuned so the 48 do not all read
`1/2/3/2/1`. Scene 1 is almost always a single-beat title moment; density lives
in scenes 2–4; scene 5 is usually a 1–2 beat close. Reading-first bands
(editorial, text-report) lean `reserved`; kinetic/keynote bands lean `motion`.

---

## 3. How to read a row in §4

Each style block gives the sub-agent everything it needs and nothing it must
invent blind:

- **style / band / DNA file** — identity + the one DNA file it may read.
- **name (EN / ZH)** — canonical `metadata.name`, identical across versions.
- **v3 topic (EN / ZH)** — the assigned subject (distinct from v1/v2 topics).
- **why this topic** — the semantic fit to the DNA.
- **5-scene narrative** — the story spine; each scene's job + beat count +
  beat-layout mode.
- **transitionMap** — the four edge kinds (+ base kind).
- **nav** — the assigned prototype and its concrete metaphor.
- **motion / palette / type notes** — DNA-anchored reminders (intent, not code).

v1/v2 topics are listed once per band so the sub-agent's assigned topic is
visibly non-colliding (the sub-agent itself does not see v1/v2, but the
orchestrator guarantees distinctness here).

---

## 4. The 48 assignments

---

# === Band 1 — Minimal Keynote (styles 01–08) ===

**v1 topics (do not reuse):** Product Keynote · Swiss Grid · Ceramic Calm ·
Dialogue Stage · Blueprint · Type Poster · Workshop Board · Quote Poster.
**v2 topics (do not reuse):** Quiet Launch · Clean Metrics · Repair Strategy ·
Better Question · Resilience Plan · One Constraint · Human Loop · Kept Sentence.

Band-wide leaning: restrained, premium, one-idea-per-slide. Beat rhythms stay
sparse; density is earned, never default. Nav prototypes spread across the band:
N7, N1, N8, N1, N1, N8, N1, N7.

---

### Style 01 — Minimal Product Keynote
- **band:** `minimal-keynote` · **DNA file:** `minimal-product-keynote.md`
- **name:** EN `Minimal Product Keynote` / ZH `极简产品主题演讲`
- **v3 topic:** EN `The Last Feature We Cut` / ZH `删掉的功能`
- **why:** A subtraction story fits "restraint reads as luxury" — the hero idea
  is what was removed, not added. One enormous claim per slide.
- **5-scene narrative:**
  1. *Title* — the phrase "We cut it." alone in the void. **1 beat** · motion.
  2. *The temptation* — the feature everyone wanted, glowing, then held at
     arm's length. **2 beats** (want → doubt) · `motion`.
  3. *The cost* — three quiet costs surface one at a time in reserved slots.
     **3 beats** · `reserved`.
  4. *The decision* — the accent spark lands on "No." **2 beats** · `motion`.
  5. *After* — the product breathing easier, single line of proof. **1 beat** · motion.
- **transitionMap:** base `scale-fade`; `1->2 scale-fade`, `2->3 fade`,
  `3->4 scale-fade`, `4->5 fade`. (Premium zoom-settle + quiet dissolve.)
- **nav:** **N7 Ghost / hover-reveal** — a faint centered progress whisper that
  only surfaces on hover; otherwise invisible to protect the void.
- **notes:** value-extreme palette (warmed near-white ↔ spatial near-black), one
  scarce saturated accent. Motion calm-slow, long ease, never bouncy. Type: one
  dominant display voice (Canela / Neue Haas Grotesk Display), no body text.

---

### Style 02 — Objective Swiss Grid
- **band:** `minimal-keynote` · **DNA file:** `objective-swiss-grid.md`
- **name:** EN `Objective Swiss Grid` / ZH `客观瑞士网格`
- **v3 topic:** EN `Anatomy of a Timetable` / ZH `时刻表解剖`
- **why:** A public transit timetable is pure grid-as-instrument content —
  columns, baselines, one signal datum — the DNA's native habitat.
- **5-scene narrative:**
  1. *Title* — grid rules draw in, title flush-left on the scale. **1 beat** · motion.
  2. *The grid exposed* — hairline columns + baselines appear as structure.
     **2 beats** (rules → labels) · `reserved`.
  3. *Reading the data* — a timetable populates cell by cell, one signal-color
     "now" marker. **3 beats** · `reserved`.
  4. *The exception* — one delayed row highlighted by the single signal hue.
     **2 beats** · `reserved`.
  5. *Order restored* — the system reads clean, grid credited. **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 slide-y`,
  `3->4 hard-cut`, `4->5 slide-y`. (Mechanical snaps + vertical row travel.)
- **nav:** **N1 Bespoke metaphor** — a grid-coordinate "you are here" datum
  marker (column-letter × row-number) in the single signal color.
- **notes:** achromatic base, exactly one saturated signal hue for wayfinding
  only. Flat, no shadows. Flush-left ragged-right (centered forbidden). Type:
  single neutral grotesque (Helvetica Neue / Akzidenz-Grotesk), tabular figures.

---

### Style 03 — Wabi-Sabi Ceramic
- **band:** `minimal-keynote` · **DNA file:** `wabi-sabi-ceramic.md`
- **name:** EN `Wabi-Sabi Ceramic` / ZH `侘寂陶器`
- **v3 topic:** EN `The Beauty of the Unfinished` / ZH `未完成之美`
- **why:** Wabi-sabi's core — imperfection and incompleteness as beauty — mapped
  onto a maker's reflection. Charged emptiness carries the meaning.
- **5-scene narrative:**
  1. *Title* — one imperfect brush stroke underlines the title, off-axis. **1 beat** · motion.
  2. *The crack* — a flaw in the bowl, framed not hidden. **2 beats** (see → accept) · `motion`.
  3. *Kintsugi* — the mended seam described in three quiet lines. **2 beats** · `reserved`.
  4. *What time adds* — patina appears across four reflective beats of aging.
     **3 beats** · `motion`.
  5. *Rest* — the finished-because-abandoned piece, still. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 fade`, `3->4 slide-x`,
  `4->5 fade`. (Dust-settling crossfades, one slow lateral drift.)
- **nav:** **N8 No visible nav** — stillness is the point; keyboard/click-zone
  only, content self-orients. No nav chrome intrudes on the ma.
- **notes:** earthen muted palette (fiber off-white, ash/stone, never pure
  white/black), one faded accent (indigo or matcha) on a tiny fraction. At most
  one brush gesture per slide. Type: humanist, generously leaded (Söhne / GT
  Alpina). Motion "dust in sunlight."

---

### Style 04 — Interactive Dialogue Stage
- **band:** `minimal-keynote` · **DNA file:** `interactive-dialogue-stage.md`
- **name:** EN `Interactive Dialogue Stage` / ZH `互动对话舞台`
- **v3 topic:** EN `The Rubber Duck` / ZH `橡皮鸭`
- **why:** Rubber-duck debugging is literally a two-voice exchange (engineer ↔
  silent duck that "answers" by forcing articulation) — turn-taking is the form.
- **5-scene narrative:**
  1. *Title* — dim stage, two speaker markers glow up. **1 beat** · motion.
  2. *The stuck engineer* — first turn: the bug, spoken into the dark. **2 beats** · `motion`.
  3. *Explaining aloud* — three turns alternate, active-speaker glow moves.
     **2 beats** · `reserved`.
  4. *The realization* — mid-sentence the answer surfaces; glow snaps to the
     engineer. **3 beats** · `reserved`.
  5. *Resolved* — the duck, unchanged; the fix, obvious. **2 beats** · `motion`.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 slide-y`,
  `3->4 fade`, `4->5 scale-fade`. (Turns arrive vertically; realization fades;
  resolve settles in.)
- **nav:** **N1 Bespoke metaphor** — a turn-by-turn conversation stepper: two
  small speaker dots, the active one lit, advancing = next turn.
- **notes:** dark cool near-black stage (blue hint), crisp light text, one/two
  accents reserved for the active speaker (warm human vs cool digital). Type:
  mono/technical transcript voice (JetBrains Mono / IBM Plex Mono).

---

### Style 05 — Cyanotype Drafting Table
- **band:** `minimal-keynote` · **DNA file:** `cyanotype-drafting-table.md`
- **name:** EN `Cyanotype Drafting Table` / ZH `蓝图制图台`
- **v3 topic:** EN `Drawing a Bridge` / ZH `桥的设计`
- **why:** A bridge is the archetypal blueprint subject — orthographic hero
  diagram, dimension lines, title-block metadata; the DNA drawn straight.
- **5-scene narrative:**
  1. *Title block* — corner metadata + sheet title draw in on Prussian blue. **1 beat** · motion.
  2. *The span* — the bridge deck drawn as construction lines, then key-lines.
     **3 beats** · `motion`.
  3. *The loads* — dimension callouts + force arrows annotate the structure.
     **2 beats** · `reserved`.
  4. *The tolerance* — one warm annotation flags the critical joint. **3 beats** · `reserved`.
  5. *Approved* — revision stamp lands in the title block. **1 beat** · motion.
- **transitionMap:** base `wipe`; `1->2 wipe`, `2->3 wipe`, `3->4 slide-x`,
  `4->5 hard-cut`. (Lines wipe on like a drawing hand; stamp is a hard cut.)
- **nav:** **N1 Bespoke metaphor** — a title-block revision index (sheet
  1/5…5/5) in the corner drafting furniture, drafting-stencil caps.
- **notes:** deep Prussian-blue ground as paper, chalk-white linework + pale
  cyan construction lines, one scarce warm (red/amber) annotation. Type:
  drafting mono, uppercase callouts (Space Mono / IBM Plex Mono). Motion:
  elements draw along their geometry, no personality easing.

---

### Style 06 — Kinetic Type Punchline
- **band:** `minimal-keynote` · **DNA file:** `kinetic-type-punchline.md`
- **name:** EN `Kinetic Type Punchline` / ZH `动感字体金句`
- **v3 topic:** EN `Ship It` / ZH `发布`
- **why:** A percussive imperative deck — type IS the image, each slide a shout.
  "Ship It" is the punchline the whole deck drives toward.
- **5-scene narrative:**
  1. *Title* — one massive word slams in. **1 beat** · motion.
  2. *The excuses* — words stack, each a reason not to ship. **2 beats** · `motion`.
  3. *The strike* — "later" struck through, swapped for "NOW" in the electric
     accent. **2 beats** · `motion`.
  4. *The countdown* — three phrases hit one after another. **2 beats** · `reserved`.
  5. *Ship it* — the two words fill the field. **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 glitch`,
  `3->4 hard-cut`, `4->5 glitch`. (Percussive cuts + a type-glitch on the
  strike and the finale.)
- **nav:** **N8 No visible nav** — a poster shouts; no chrome. Keyboard/
  click-zone advances the hits.
- **notes:** extreme two-tone figure-ground + at most one electric accent.
  Heaviest condensed uppercase display (Druk / Anton / Neue Haas Display Bold).
  Flat graphic surfaces, no texture/depth. Motion fast/hard/jarring by design.

---

### Style 07 — Sketch Board Emoji
- **band:** `minimal-keynote` · **DNA file:** `sketch-board-emoji.md`
- **name:** EN `Sketch Board Emoji` / ZH `草图白板表情`
- **v3 topic:** EN `How We Named It` / ZH `起名字`
- **why:** A naming brainstorm is the perfect messy-to-structured workshop
  story — sticky notes, crossed-out candidates, a small emoji cast reacting.
- **5-scene narrative:**
  1. *Title* — hand-drawn board header, a taped title card. **1 beat** · motion.
  2. *The dump* — candidate names stuck up as notes, slightly rotated. **2 beats** · `motion`.
  3. *The debate* — connectors + emoji reactions link and reject notes. **2 beats** · `reserved`.
  4. *The shortlist* — two notes survive, circled by hand. **2 beats** · `motion`.
  5. *The name* — one note highlighted, a happy emoji lands. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-x`,
  `3->4 scale-fade`, `4->5 scale-fade`. (Board pans laterally; shortlist zooms.)
- **nav:** **N1 Bespoke metaphor** — a hand-drawn connector trail: little
  sketched arrows between numbered nodes, current node circled in marker.
- **notes:** warm aged-cream base, soft charcoal marks (never hard black), muted
  highlighter kit (note-yellow / tape-blue / caution-red). Handwriting (Caveat /
  Architects Daughter) + clean plain voice (Inter). Spring-gentle but slightly
  imperfect motion.

---

### Style 08 — Spotlight Quote Poster
- **band:** `minimal-keynote` · **DNA file:** `spotlight-quote-poster.md`
- **name:** EN `Spotlight Quote Poster` / ZH `聚光引言海报`
- **v3 topic:** EN `On Quitting Well` / ZH `好好离开`
- **why:** A reflective meditation on leaving — one lit statement per slide, held
  in a dark hush. The spotlight-and-shadow DNA is built for the reflective pause.
- **5-scene narrative:**
  1. *Title* — spotlight fades up on the opening line. **2 beats** (dark → lit) · `motion`.
  2. *The decision* — one quote, small attribution set apart. **2 beats** · `reserved`.
  3. *The last day* — the statement drifts as the light drifts. **2 beats** · `motion`.
  4. *What stays* — three lines surface in reserved slots, one accent word. **3 beats** · `reserved`.
  5. *The door* — a final line lingers, light dims to close. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 fade`, `3->4 scale-fade`,
  `4->5 fade`. (Atmospheric swells; one gentle zoom toward "what stays.")
- **nav:** **N7 Ghost / hover-reveal** — attribution-style faint index (i / v)
  that only glows on hover, never breaking the shadow.
- **notes:** deep near-black field, one soft radial spotlight pool, luminous
  text + at most one muted accent. Graceful high-contrast serif, often italic
  (Canela / GT Sectra / Freight Display). Motion calm-slow, light drifts not cuts.

---

# === Band 2 — Balanced Hybrid (styles 09–16) ===

**v1 topics (do not reuse):** Subway Flow · Benchmark · Pipeline · Friendly
Onboard · Prep Station · Pairing Board · Mixing Console · Debug Board.
**v2 topics (do not reuse):** Release Tracks · Durable Tool · Event Insight ·
Breathing Onboard · Clean Brief · Shared Artifact · Operating Model ·
Learning Incident.

Band-wide leaning: medium density, systematic, process/structure-forward. Every
multi-beat scene deliberately chooses `motion` or `reserved`. Nav spread: N1,
N2, N6, N4, N1, N3, N1, N2.

---

### Style 09 — Subway Map of Intent
- **band:** `balanced-hybrid` · **DNA file:** `subway-map-of-intent.md`
- **name:** EN `Subway Map of Intent` / ZH `意图地铁图`
- **v3 topic:** EN `Three Teams, One Launch` / ZH `三队一发`
- **why:** Three teams converging on a launch date = three transit lines meeting
  at one interchange. Convergence is the native subway-map story.
- **5-scene narrative:**
  1. *Title* — the network map draws in, three colored lines dormant. **1 beat** · motion.
  2. *The lines* — design/eng/marketing lines animate along their tracks. **3 beats** · `motion`.
  3. *The stations* — milestone stations light per line. **3 beats** · `reserved`.
  4. *The interchange* — all three meet at the launch station. **2 beats** · `motion`.
  5. *Terminus* — the map complete, one destination. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-x`,
  `3->4 scale-fade`, `4->5 slide-x`. (Travel along the line; zoom into the
  interchange.)
- **nav:** **N1 Bespoke metaphor** — a route line with station dots; current
  scene = current station, the connector fills as you advance.
- **notes:** light neutral signage ground, few distinct functional line colors,
  transit-signage type (Johnston / Akkurat). Flat diagrammatic depth. Motion:
  smooth along-track travel only.

---

### Style 10 — Benchmark Matrix
- **band:** `balanced-hybrid` · **DNA file:** `benchmark-matrix.md`
- **name:** EN `Benchmark Matrix` / ZH `基准矩阵`
- **v3 topic:** EN `Build vs Buy vs Borrow` / ZH `自建还是买`
- **why:** A three-option decision across criteria is exactly like-against-like
  comparison — the matrix's reason to exist. Judgment moves surface → structural.
- **5-scene narrative:**
  1. *Title* — the empty matrix frame, axes labeled. **1 beat** · motion.
  2. *The options* — three columns populate (build / buy / borrow). **3 beats** · `reserved`.
  3. *The criteria* — rows fill down; standout figures emphasized. **3 beats** · `reserved`.
  4. *The verdict* — winning cells promoted, losers dimmed. **2 beats** · `reserved`.
  5. *The call* — one column boxed as the choice. **1 beat** · motion.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 slide-y`,
  `3->4 fade`, `4->5 scale-fade`. (Rows stack in vertically; verdict fades; call
  zooms.)
- **nav:** **N2 Bottom progress dots** — a minimal dot row; the matrix is the
  focus, nav stays out of the way.
- **notes:** bright neutral ground, reserved positive + negative result tones,
  clean scanning sans with tabular figures (Inter / IBM Plex Sans). Minimal
  analytical depth. Motion clarifying, never decorative.

---

### Style 11 — Signal Pipeline Flow
- **band:** `balanced-hybrid` · **DNA file:** `signal-pipeline-flow.md`
- **name:** EN `Signal Pipeline Flow` / ZH `信号管道流`
- **v3 topic:** EN `Where the Request Goes` / ZH `请求去哪了`
- **why:** Tracing one HTTP request through a routed backend is the archetypal
  signal-pipeline story — nodes, connectors, status badges, glowing active edges.
- **5-scene narrative:**
  1. *Title* — the pipeline skeleton, nodes dormant. **1 beat** · motion.
  2. *Ingress* — request enters, first nodes light, flow animates the edge. **3 beats** · `motion`.
  3. *The fan-out* — the request branches across services. **2 beats** · `reserved`.
  4. *The slow node* — one stage badges a warning, flow stalls then clears. **2 beats** · `reserved`.
  5. *Response* — signal reaches egress, path fully lit. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-x`,
  `3->4 glitch`, `4->5 fade`. (Directional travel; a glitch at the slow node;
  quiet resolve.)
- **nav:** **N6 Timeline / stepper** — a horizontal stage stepper mirroring the
  pipeline (ingress → egress) with a progress connector.
- **notes:** dark technical ground, few luminous functional signal colors
  (teal/emerald healthy, warning tone), mono headings (JetBrains Mono / IBM Plex
  Mono). Instrument glow depth. Motion: directional flow, calm not flashy.

---

### Style 12 — Soft Pastel Friendly
- **band:** `balanced-hybrid` · **DNA file:** `soft-pastel-friendly.md`
- **name:** EN `Soft Pastel Friendly` / ZH `柔和粉彩友好`
- **v3 topic:** EN `Your First Week Here` / ZH `入职第一周`
- **why:** A gentle new-hire week-one guide — warmth, rounded pills, unthreatening
  approachability. The DNA is built to welcome an audience.
- **5-scene narrative:**
  1. *Title* — a rounded welcome card springs in. **1 beat** · motion.
  2. *Day one* — three friendly task pills settle with a small bounce. **3 beats** · `motion`.
  3. *The people* — squircle avatars of the team appear. **2 beats** · `reserved`.
  4. *The tools* — soft cards for each tool, one accent motif. **2 beats** · `motion`.
  5. *You're set* — a warm closing pill, tiny daisy punctuation. **1 beat** · motion.
- **transitionMap:** base `scale-fade`; `1->2 scale-fade`, `2->3 slide-y`,
  `3->4 slide-y`, `4->5 scale-fade`. (Gentle zooms + soft vertical settles.)
- **nav:** **N4 Wheel / picker** — a rounded day-picker (Day 1…5) drum that
  gently rolls to the current scene.
- **notes:** warm bone/peach ground (never pure white), low-sat pastels + one
  half-step accent, rounded pill/squircle on every container. Rounded display
  (Quicksand / Baloo 2) + humanist body (Nunito Sans). Gentle organic spring,
  "a smile, not a dance."

---

### Style 13 — Kitchen Prep Station
- **band:** `balanced-hybrid` · **DNA file:** `kitchen-prep-station.md`
- **name:** EN `Kitchen Prep Station` / ZH `厨房备料台`
- **v3 topic:** EN `From Raw Logs to Report` / ZH `日志到报告`
- **why:** Turning raw log noise into a clean report is a raw-to-plated
  transformation — the prep-station's whole metaphor, filler visibly trimmed.
- **5-scene narrative:**
  1. *Title* — a prep board, empty and ready. **1 beat** · motion.
  2. *The raw* — messy log lines dumped on the board. **2 beats** · `motion`.
  3. *The prep* — noise crossed out and swept away, step by step. **2 beats** · `motion`.
  4. *The plating* — clean metrics arranged onto a plate. **2 beats** · `reserved`.
  5. *Served* — the finished report, plated. **1 beat** · motion.
- **transitionMap:** base `wipe`; `1->2 wipe`, `2->3 wipe`, `3->4 slide-x`,
  `4->5 scale-fade`. (Ingredients wipe across the board; plating zooms in.)
- **nav:** **N1 Bespoke metaphor** — a recipe-step rail (raw → prep → plated)
  with utensil icons marking each stage.
- **notes:** warm appetizing cream ground, earthy accents (terracotta, wood
  brown, herb green), warm serif or rounded (Fraunces / Bitter / Baloo 2). Cozy
  tactile depth + soft shadow. Motion warm, hands-on.

---

### Style 14 — Collaborative Pairing Board
- **band:** `balanced-hybrid` · **DNA file:** `collaborative-pairing-board.md`
- **name:** EN `Collaborative Pairing Board` / ZH `协作配对板`
- **v3 topic:** EN `Human Reviews the AI` / ZH `人审 AI`
- **why:** Human ↔ AI code review is a two-party division of labor with sync
  points — the pairing board's exact structure, boundary and handoffs visible.
- **5-scene narrative:**
  1. *Title* — the board splits into two labeled sides. **1 beat** · motion.
  2. *The draft* — AI side proposes, human side watches. **2 beats** · `reserved`.
  3. *The review* — turns alternate across the boundary, comments cross. **2 beats** · `reserved`.
  4. *The sync* — a checkpoint lights when both align. **2 beats** · `motion`.
  5. *Merged* — the boundary dissolves, one artifact. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-x`,
  `3->4 fade`, `4->5 scale-fade`. (Side-to-side turns; sync fades; merge
  settles.)
- **nav:** **N3 Side vertical scale / tabs** — a center-seam vertical tab stack;
  the active side/step tick highlights, echoing the boundary.
- **notes:** clean light neutral ground, one calm professional accent for
  alignment, even-handed neutral type both sides (Inter / Source Sans 3) + mono
  role tags. Tidy low-chrome depth. Balanced alternating motion.

---

### Style 15 — Studio Mixing Console
- **band:** `balanced-hybrid` · **DNA file:** `studio-mixing-console.md`
- **name:** EN `Studio Mixing Console` / ZH `录音混音控制台`
- **v3 topic:** EN `Tuning the Model` / ZH `调模型`
- **why:** Balancing hyperparameters (speed / cost / quality / safety) is
  multi-factor tuning made physical — faders, knobs, level meters at real values.
- **5-scene narrative:**
  1. *Title* — the console powers on, meters at zero. **1 beat** · motion.
  2. *The channels* — four parameter faders slide to starting levels. **3 beats** · `reserved`.
  3. *The trade-off* — pushing one fader drops another, meters respond. **2 beats** · `motion`.
  4. *The mix* — knobs turn, meters settle into balance. **2 beats** · `reserved`.
  5. *Master out* — the output meter reads healthy. **1 beat** · motion.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 slide-y`,
  `3->4 hard-cut`, `4->5 fade`. (Faders travel vertically; a hard cut on the
  trade-off snap; quiet master fade.)
- **nav:** **N1 Bespoke metaphor** — a channel selector: small fader-cap markers
  along the bottom, the active channel's fader raised.
- **notes:** deep studio-dark hardware ground, few live meter colors (hot /
  healthy / attention) confined to faders & meters, compact mono labels (Space
  Mono / IBM Plex Mono). Tactile hardware depth + meter glow. Mechanical motion.

---

### Style 16 — Debug Reaction Board
- **band:** `balanced-hybrid` · **DNA file:** `debug-reaction-board.md`
- **name:** EN `Debug Reaction Board` / ZH `调试反应面板`
- **v3 topic:** EN `Is It Safe to Deploy?` / ZH `能发布吗`
- **why:** A pre-deploy readiness self-check with color-coded risk is the debug
  board's native content — uncertainty made explicit before acting.
- **5-scene narrative:**
  1. *Title* — the diagnostic board boots, status panel blank. **1 beat** · motion.
  2. *The checks* — self-check items appear with pending badges. **3 beats** · `reserved`.
  3. *The risks* — badges flip green/amber/red as checks resolve. **2 beats** · `reserved`.
  4. *The blocker* — one red card moves to a "blocked" column. **2 beats** · `motion`.
  5. *Verdict* — board reads: not yet. **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 hard-cut`,
  `3->4 slide-x`, `4->5 glitch`. (Terminal snaps; card slides columns; a glitch
  on the blocked verdict.)
- **nav:** **N2 Bottom progress dots** — terminal-styled square status ticks
  along the bottom (▪▪▫▫▫), matching the IDE vocabulary.
- **notes:** deep dark IDE slate, strict traffic-light status triad as status
  only, monospaced terminal voice throughout (JetBrains Mono / Fira Code). Matte
  panels, crisp edges. State-driven motion (badge flips, card moves).

---

# === Band 3 — Editorial & Print (styles 17–24) ===

**v1 topics (do not reuse):** Broadsheet · Masthead · Editorial Feature ·
Scholar Notes · Biennale Poster · Session Poster · Riso Zine · Cutout Collage.
**v2 topics (do not reuse):** After Launch · Product Cover · Useful Week ·
Margin Argument · Public Light · Five Takes · Community Print · Rebuilt Archive.

Band-wide leaning: publication-led. Transitions behave like pages, columns,
frames, scrolls. Reading-first density leans `reserved`. Nav spread favors
print metaphors: N5, N5, N7, N5, N1, N1, N1, N10.

---

### Style 17 — Front-Page Broadsheet
- **band:** `editorial-print` · **DNA file:** `front-page-broadsheet.md`
- **name:** EN `Front-Page Broadsheet` / ZH `头版大报`
- **v3 topic:** EN `The Day the Feed Stopped` / ZH `信息流停摆`
- **why:** A dense, authoritative front-page treatment of a fictional outage
  "news event" — multi-column journalism, drop cap, nameplate; the DNA verbatim.
- **5-scene narrative:**
  1. *Nameplate* — the masthead + dateline draw across the top. **1 beat** · motion.
  2. *The lede* — headline + drop-cap first column fills. **2 beats** · `reserved`.
  3. *The story* — columns populate; one halftone image breaks flow. **3 beats** · `reserved`.
  4. *The analysis* — a boxed sidebar with the accent kicker. **2 beats** · `reserved`.
  5. *Late edition* — a final update stamped over the page. **1 beat** · motion.
- **transitionMap:** base `page-flip`; `1->2 page-flip`, `2->3 slide-y`,
  `3->4 slide-y`, `4->5 page-flip`. (Page turns bookend; columns scroll
  vertically.)
- **nav:** **N5 Page numerals / spine** — section markers ("A1 · A2…") in the
  editorial furniture, small-caps.
- **notes:** newsprint off-white + near-black ink + grayscale halftones, one
  quarantined accent in nameplate/kicker only. Heavy display serif nameplate
  (Chomsky / Cheltenham) + justified text serif (Miller / Georgia). Dense
  justified multi-column; page must feel full. Minimal print-respectful motion.

---

### Style 18 — Magazine Masthead
- **band:** `editorial-print` · **DNA file:** `magazine-masthead.md`
- **name:** EN `Magazine Masthead` / ZH `杂志刊头`
- **v3 topic:** EN `The Comeback Issue` / ZH `回归特刊`
- **why:** A single theatrical cover word per moment — "the comeback" as a
  magazine cover story. High-contrast fashion serif at hero scale, masthead
  authority.
- **5-scene narrative:**
  1. *Cover* — masthead + double-rule ornament frame the hero word. **1 beat** · motion.
  2. *The fall* — an inverted color-block tile states the low point. **2 beats** · `reserved`.
  3. *The turn* — the theatrical headline swaps to the pivot. **3 beats** · `motion`.
  4. *The proof* — supporting tiles with issue/volume chrome. **2 beats** · `reserved`.
  5. *The cover line* — one final published statement. **1 beat** · motion.
- **transitionMap:** base `page-flip`; `1->2 page-flip`, `2->3 scale-fade`,
  `3->4 page-flip`, `4->5 fade`. (Cover-to-spread flips; the turn zooms.)
- **nav:** **N5 Page numerals / spine** — issue/section threshold chrome
  ("ISSUE 03 · P.02") in letter-spaced uppercase sans.
- **notes:** one saturated editorial field (emerald/crimson/indigo) + warm paper
  alternate + dark structural ink; strict three-color triad. Heavy fashion serif
  (Didot / Bodoni / Canela) + humanist sans chrome. Flat, no shadows/rounding.

---

### Style 19 — Warm Editorial Feature
- **band:** `editorial-print` · **DNA file:** `warm-editorial-feature.md`
- **name:** EN `Warm Editorial Feature` / ZH `暖色专题特稿`
- **v3 topic:** EN `A Letter to My Past Self` / ZH `写给过去`
- **why:** A first-person long-form feature — one idea breathing across warm
  paper, oversized pull-quotes in the margin; the feature-spread DNA at rest.
- **5-scene narrative:**
  1. *The opening* — title + generous margin, one hairline rule. **1 beat** · motion.
  2. *The regret* — body column with an offset pull-quote. **2 beats** · `reserved`.
  3. *The turning point* — a full-margin pull-quote takes over. **2 beats** · `motion`.
  4. *The lesson* — body resumes, botanical accent on one word. **2 beats** · `reserved`.
  5. *The sign-off* — a quiet closing line, italic. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 fade`, `3->4 slide-x`,
  `4->5 fade`. (Quiet dissolves like turning a page; one lateral drift.)
- **nav:** **N7 Ghost / hover-reveal** — a faint folio number in the corner,
  surfacing only on hover to keep the page calm.
- **notes:** warm cream paper (never clinical white), literary oldstyle serif
  with strong italic (Freight Text / Lyon / Caslon) + humanist sans body, one
  muted botanical accent per slide. Load-bearing whitespace, hairline rules only.
  Quiet fade-and-settle motion.

---

### Style 20 — Scholar's Vellum
- **band:** `editorial-print` · **DNA file:** `scholars-vellum.md`
- **name:** EN `Scholar's Vellum` / ZH `学者羊皮卷`
- **v3 topic:** EN `What the Ancients Knew` / ZH `古人的智慧`
- **why:** A candlelit manuscript arguing that old knowledge endures — one
  patient thought per page, pin-annotations, mono counters; the vellum DNA whole.
- **5-scene narrative:**
  1. *Frontispiece* — title in amber italic, pin-annotation bottom-left. **1 beat** · motion.
  2. *The claim* — a centered pull-quote with a jewel opening glyph. **2 beats** · `reserved`.
  3. *The evidence* — a mono numbered list, counters not bullets. **2 beats** · `reserved`.
  4. *The gloss* — one word switches italic→roman amber for emphasis. **2 beats** · `reserved`.
  5. *Colophon* — a closing line, pinned. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 hard-cut`, `3->4 hard-cut`,
  `4->5 fade`. (Stillness-first: instant cuts between leaves, gentle fades at
  the ends — honors the DNA's near-zero motion.)
- **nav:** **N5 Page numerals / spine** — mono folio counters (i · ii · iii) in
  the pin-annotation style, dignified and quiet.
- **notes:** warm-dark ink-navy ground (never cold black), amber-cream italic
  serif display (Cormorant Italic / Garamond Italic) + humanist sans body + mono
  chrome, one dusty-teal jewel accent for annotation marks only. Flat, centered,
  dark field dominant. Near-zero motion.

---

### Style 21 — Solar Biennale Poster
- **band:** `editorial-print` · **DNA file:** `solar-biennale-poster.md`
- **name:** EN `Solar Biennale Poster` / ZH `日光双年展海报`
- **v3 topic:** EN `Festival of Slow Ideas` / ZH `慢想节`
- **why:** A cultural festival poster — one enormous serif statement in warm
  solar light, slow and dignified; the biennale-poster DNA's exact register.
- **5-scene narrative:**
  1. *The poster* — parchment ground, sun-bloom behind the title. **1 beat** · motion.
  2. *The theme* — wide-tracked eyebrow + a flooded yellow panel. **2 beats** · `motion`.
  3. *The program* — a mono ledger of sessions in the indigo ink. **3 beats** · `reserved`.
  4. *The invitation* — a jumbo numeral date, bloom intensifies. **2 beats** · `motion`.
  5. *The mark* — page number, poster settles. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 scale-fade`, `2->3 fade`, `3->4 fade`,
  `4->5 scale-fade`. (Solar swells; slow crossfades; nothing snaps.)
- **nav:** **N1 Bespoke metaphor** — a persistent mono page number bottom-right
  at three-quarter opacity (the DNA's own signature), doubling as the index.
- **notes:** warm parchment ground, one solar yellow as flooded atmosphere (not
  a small accent), single deep indigo ink for all text/rules. Three-voice type
  (high-contrast serif display Canela/GT Sectra + clean sans + tabular mono).
  Slow atmospheric motion.

---

### Style 22 — Duotone Session
- **band:** `editorial-print` · **DNA file:** `duotone-session.md`
- **name:** EN `Duotone Session` / ZH `双调录制`
- **v3 topic:** EN `Cut in One Take` / ZH `一条过`
- **why:** A Blue Note-style record of a single perfect take — duotone photo +
  enormous condensed gothic, cool session discipline; the LP-sleeve DNA direct.
- **5-scene narrative:**
  1. *The sleeve* — duotone image bleeds to edge, title block in a corner. **2 beats** · `motion`.
  2. *The setup* — a thin credit band of session data slides in. **2 beats** · `reserved`.
  3. *The take* — enormous gothic title swaps to "TAKE 1". **2 beats** · `motion`.
  4. *The groove* — a flat-ink shelf holds the track list. **2 beats** · `reserved`.
  5. *Pressed* — the final sleeve, credits set. **1 beat** · motion.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 hard-cut`,
  `3->4 slide-y`, `4->5 hard-cut`. (Type blocks snap; credit band slides;
  percussive like a bass line.)
- **nav:** **N1 Bespoke metaphor** — an LP track index (A1·A2·A3…) in the thin
  credit band; current track lit.
- **notes:** rich warm black ground (never pure black), one flat spot-ink
  duotone over B&W photo, photo-first composition. Condensed gothic at image
  scale (Trade Gothic Bold Condensed / Franklin Gothic) + sparse high-contrast
  serif credits. Flat ink, no gradients/glow. Rhythmic percussive motion.

---

### Style 23 — Riso Print Zine
- **band:** `editorial-print` · **DNA file:** `riso-print-zine.md`
- **name:** EN `Riso Print Zine` / ZH `孔版印刷杂志`
- **v3 topic:** EN `Make Something Weekly` / ZH `每周做点`
- **why:** A DIY zine urging a weekly making habit — thick spot inks, gleeful
  misregistration, collage density; the riso DNA's happy-accident spirit.
- **5-scene narrative:**
  1. *The cover* — grainy paper, drifting misregistered title. **1 beat** · motion.
  2. *The manifesto* — a loud condensed all-caps statement, tape strip. **2 beats** · `motion`.
  3. *The method* — three collage panels, stamps and rotations. **3 beats** · `reserved`.
  4. *The gallery* — overlapping print samples, hand-script byline. **2 beats** · `motion`.
  5. *The colophon* — a stamped back-cover mark. **1 beat** · motion.
- **transitionMap:** base `page-flip`; `1->2 page-flip`, `2->3 hard-cut`,
  `3->4 page-flip`, `4->5 hard-cut`. (Stapled-zine page flips + blunt stamp-press
  cuts.)
- **nav:** **N1 Bespoke metaphor** — a stamped page counter (a small ink-seal
  numeral), pressing to the next page on advance.
- **notes:** warm cream/khaki aged stock, 2–3 spot inks max with celebrated
  overprint zones, grain overlay on every slide. Three-voice type (condensed
  all-caps Druk/Knockout + quiet body + handwritten script Caveat). Small
  rotations, offset slabs, no soft shadows. Quick, slightly jerky settle.

---

### Style 24 — Analog Cutout Collage
- **band:** `editorial-print` · **DNA file:** `analog-cutout-collage.md`
- **name:** EN `Analog Cutout Collage` / ZH `模拟剪纸拼贴`
- **v3 topic:** EN `Piecing the Idea Together` / ZH `拼出想法`
- **why:** An idea literally assembled from scraps — scissor-cut fragments,
  tape, pins, one bleeding off-frame; the collage-desk DNA as a thinking process.
- **5-scene narrative:**
  1. *The desk* — a first fragment lands, title scrawled. **1 beat** · motion.
  2. *The scraps* — fragments pile on at angles, paper shadows. **2 beats** · `motion`.
  3. *The connections* — hand-drawn arrows link the pieces. **2 beats** · `reserved`.
  4. *The composition* — pieces nudge into a coherent whole. **2 beats** · `motion`.
  5. *Pinned down* — the finished collage, one piece off-frame. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 scale-fade`,
  `3->4 slide-x`, `4->5 scale-fade`. (Scraps slide onto the desk; composition
  zooms as it resolves.)
- **nav:** **N10 Object dial / compartment index** — pin-prick dots as a scene
  index; the active pin pressed in, like tacking the current scrap.
- **notes:** warm paper-textured ground, irregular scissor-cut edges everywhere
  (no clean vector curves), earthy found palette + one saturated focal cutout,
  visible paper-stacking shadows. Handwritten annotation (Caveat / Shantell
  Sans) + "clipped from print" serif body. Hand-placing settle, slight overshoot.

---

# === Band 4 — Craft & Cultural Traditions (styles 25–32) ===

**v1 topics (do not reuse):** Woodblock · Specimen Plate · Deco Gala ·
Expedition Print · Cassette Pack · Brutalist Bulletin · Red Wedge ·
Scoring Funnel.
**v2 topics (do not reuse):** Tide Map · Growth Signals · Infrastructure Gala ·
Field Route · Release Mixtape · Hard Thing · Org Move · Priority Score.

Band-wide leaning: material and cultural specificity through coded texture,
ornament, layout, motion — never superficial decoration. Nav spread: N1, N5,
N10, N1, N1, N2, N1, N1.

---

### Style 25 — Woodblock Floating-World
- **band:** `craft-cultural` · **DNA file:** `woodblock-floating-world.md`
- **name:** EN `Woodblock Floating-World` / ZH `木版浮世绘`
- **v3 topic:** EN `A River's Journey` / ZH `一条河`
- **why:** A river from source to sea is a floating-world journey narrative —
  flat keyline planes, one graded sky, asymmetric cropping, drifting horizon.
- **5-scene narrative:**
  1. *Source* — mountain spring, vermilion seal, vertical title. **1 beat** · motion.
  2. *The rapids* — water planes crop dramatically mid-form. **3 beats** · `motion`.
  3. *The valley* — the river widens, one bokashi sky. **3 beats** · `reserved`.
  4. *The delta* — branching channels as flat planes. **3 beats** · `motion`.
  5. *The sea* — horizon opens, seal closes. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-x`,
  `3->4 slide-x`, `4->5 fade`. (Continuous horizontal drift across a landscape;
  final fade to the sea.)
- **nav:** **N1 Bespoke metaphor** — a horizon-pan indicator: a small boat glyph
  drifting along a river line marks scene position.
- **notes:** warm paper ground, disciplined inks (deep indigo, vermilion for
  seal/rare accents, earth ochre, quiet malachite), flat unshaded fields, one
  graded sky max, single red seal. Brushed display (Yuji Syuku / Klee One) +
  quiet body (Zen Kaku Gothic New). Calm drifting motion, overlap-not-shadow.

---

### Style 26 — Botanical Specimen Plate
- **band:** `craft-cultural` · **DNA file:** `botanical-specimen-plate.md`
- **name:** EN `Botanical Specimen Plate` / ZH `植物标本板`
- **v3 topic:** EN `Anatomy of an Idea` / ZH `想法解剖`
- **why:** Dissecting an idea like a pressed specimen — engraving precision,
  taxonomic labels, symmetrical centered composition; the herbarium DNA exact.
- **5-scene narrative:**
  1. *Plate I* — plate number + the whole "specimen" centered. **1 beat** · motion.
  2. *The parts* — labeled callouts point to components. **3 beats** · `reserved`.
  3. *The detail* — a magnified section, fine hatching. **2 beats** · `reserved`.
  4. *The taxonomy* — italic Latin binomial + locality attribution. **3 beats** · `reserved`.
  5. *Pressed* — the complete plate, catalogued. **1 beat** · motion.
- **transitionMap:** base `page-flip`; `1->2 page-flip`, `2->3 fade`,
  `3->4 fade`, `4->5 page-flip`. (Turning numbered plates; focus-pull fades
  between details.)
- **nav:** **N5 Page numerals / spine** — small-caps plate numbers (PLATE I…V)
  in the taxonomic label voice.
- **notes:** aged bone/cream ground (never white), iron-gall/sepia linework,
  zero-saturation muted palette with scarce botanical-green/ochre accent.
  Oldstyle serif + true italic binomials + small-caps labels (EB Garamond /
  Sorts Mill Goudy). Symmetrical, centered, low density. Near-imperceptible motion.

---

### Style 27 — Machine-Age Deco
- **band:** `craft-cultural` · **DNA file:** `machine-age-deco.md`
- **name:** EN `Machine-Age Deco` / ZH `机器时代装饰艺术`
- **v3 topic:** EN `The Grand Unveiling` / ZH `盛大揭幕`
- **why:** A monumental product/vision unveiling suits the ocean-liner-saloon
  DNA — bilateral symmetry, gilt rules, stepped ziggurat forms, one idea as altar.
- **5-scene narrative:**
  1. *The facade* — symmetric gilt frame, centered monogram. **1 beat** · motion.
  2. *The ascent* — stepped ziggurat borders build outward from center. **2 beats** · `motion`.
  3. *The reveal* — a radiating sunburst emblem behind the hero line. **3 beats** · `motion`.
  4. *The specifications* — a symmetric two-column ledger, gilt rules. **2 beats** · `reserved`.
  5. *The seal* — a centered stepped-arch closing device. **1 beat** · motion.
- **transitionMap:** base `scale-fade`; `1->2 scale-fade`, `2->3 scale-fade`,
  `3->4 slide-y`, `4->5 scale-fade`. (Geometric reveals stepping outward; a
  vertical ledger drop.)
- **nav:** **N10 Object dial / compartment index** — a symmetric ceremonial gate
  index: stepped-arch markers along the central axis, active one gilded.
- **notes:** deep lacquer ground (oxblood/midnight/jade/black), one flat metallic
  (gold/brass/chrome) tracing frames not fields, symmetry about a vertical axis.
  Tall condensed deco caps (Poiret One / Limelight / Cinzel) + recessive body.
  Grand slow stately motion along the axis.

---

### Style 28 — Expedition Screenprint
- **band:** `craft-cultural` · **DNA file:** `expedition-screenprint.md`
- **name:** EN `Expedition Screenprint` / ZH `探险丝网印`
- **v3 topic:** EN `Mapping Unknown Ground` / ZH `勘探未知`
- **why:** A WPA-poster expedition into "unknown territory" — flat spot inks,
  a felt horizon giving each slide place; a civic invitation, not a pitch.
- **5-scene narrative:**
  1. *The trailhead* — horizon line, condensed caps in the sky. **1 beat** · motion.
  2. *The route* — a stylized path crosses the landscape plane. **2 beats** · `motion`.
  3. *The camps* — three waypoints marked in flat ink. **3 beats** · `reserved`.
  4. *The summit* — the high point, headline in the ridge. **2 beats** · `motion`.
  5. *The marker* — a printer's-mark attribution. **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-y`,
  `3->4 slide-x`, `4->5 fade`. (Traverse the landscape; ascend vertically to
  the summit.)
- **nav:** **N1 Bespoke metaphor** — an altitude/horizon tick scale on a stage
  edge; the marker climbs as scenes advance.
- **notes:** warm limited spot inks (dusk orange, forest depth, sky-teal, sand),
  flat planes, visible screenprint grain, no light-sim/gradients. Condensed
  poster caps (Oswald / Bebas Neue) + plain humanist support (Archivo Narrow).
  Type integrated into the plane. Poster-static or gentle drift.

---

### Style 29 — Cassette-Era Packaging
- **band:** `craft-cultural` · **DNA file:** `cassette-era-packaging.md`
- **name:** EN `Cassette-Era Packaging` / ZH `卡带时代包装`
- **v3 topic:** EN `Greatest Hits, Vol. 1` / ZH `精选辑一`
- **why:** A "greatest hits" compilation is the J-card's native content — diagonal
  rainbow ribbon, spec-sheet furniture, loud condensed type, ×-mark checkboxes.
- **5-scene narrative:**
  1. *The J-card* — cream stock, diagonal ribbon behind the title. **1 beat** · motion.
  2. *The tracklist* — a spec-table of "hits" fills, tabular mono. **3 beats** · `reserved`.
  3. *The specs* — ×-mark checkboxes tick through features. **3 beats** · `reserved`.
  4. *The equalizer* — colored EQ bars rise per track. **3 beats** · `motion`.
  5. *Side B* — a red status stamp closes the inlay. **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 slide-y`,
  `3->4 slide-y`, `4->5 hard-cut`. (Tape-engage snaps; spec rows slide
  vertically.)
- **nav:** **N1 Bespoke metaphor** — a tape-counter readout (a small 4-digit
  mechanical counter) advancing per scene, plus the bottom-right page number.
- **notes:** warm cream ground with faint halftone grain, deep warm-brown ink
  (never black), the diagonal five-bar rainbow ribbon as sole chroma used
  sparingly, ×-mark square checkboxes. Condensed heavy display (Oswald / Anton,
  negative tracking) + humanist body + mono specs. Brisk mechanical motion.

---

### Style 30 — Neo-Brutalist Bulletin
- **band:** `craft-cultural` · **DNA file:** `neo-brutalist-bulletin.md`
- **name:** EN `Neo-Brutalist Bulletin` / ZH `新粗野公告`
- **v3 topic:** EN `Read This Before You Merge` / ZH `合并前必读`
- **why:** A blunt, unignorable pre-merge warning bulletin — thick black borders,
  hard offset shadows, one electric accent; dense info with bold character.
- **5-scene narrative:**
  1. *The notice* — a bordered headline panel, offset shadow. **1 beat** · motion.
  2. *The rules* — bordered tiles snap in, one accent-wrapped word. **2 beats** · `reserved`.
  3. *The warnings* — label-pills mark severity per tile. **3 beats** · `reserved`.
  4. *The consequences* — two dense panels of what breaks. **3 beats** · `reserved`.
  5. *Acknowledged* — a stamped "READ" pill. **2 beats** · `motion`.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 slide-x`,
  `3->4 hard-cut`, `4->5 slide-x`. (Blocky un-eased snaps + near-instant slides.)
- **nav:** **N2 Bottom progress dots** — thick-bordered square page chips with
  hard offset shadow, active chip in the accent.
- **notes:** warm off-white paper (never white/dark), heavy black borders doing
  structural work, hard zero-blur offset shadows, one high-voltage acidic accent
  (single region/slide). Heavy grotesque uppercase (Archivo Black / Space
  Grotesk) + plain sans body. Snappy blocky un-eased motion.

---

### Style 31 — Red-Wedge Agitprop
- **band:** `craft-cultural` · **DNA file:** `red-wedge-agitprop.md`
- **name:** EN `Red-Wedge Agitprop` / ZH `红楔宣传画`
- **v3 topic:** EN `Refactor the System` / ZH `重构体制`
- **why:** A call to tear down and rebuild suits Constructivist agitprop — a red
  wedge driving into black, hard-cropped montage, type as structural beams.
- **5-scene narrative:**
  1. *The manifesto* — red wedge drives in on a diagonal, title stacked. **1 beat** · motion.
  2. *The old order* — hard-cropped fragments of "legacy" collide. **2 beats** · `motion`.
  3. *The demand* — heavy type blocks brace a slogan. **3 beats** · `reserved`.
  4. *The mobilization* — fragments assemble along the diagonal vector. **3 beats** · `motion`.
  5. *Forward* — the wedge points to the new. **1 beat** · motion.
- **transitionMap:** base `glitch`; `1->2 glitch`, `2->3 hard-cut`,
  `3->4 glitch`, `4->5 hard-cut`. (Sharp angular rupture + abrupt arrive-and-stop
  cuts, matching the insistent register.)
- **nav:** **N1 Bespoke metaphor** — a diagonal progress wedge itself: a red bar
  that drives further across the field with each scene.
- **notes:** red/black/raw-paper triad (non-negotiable), at least one dominant
  diagonal, hard-cropped photomontage, heavy geometric sans as bars/wedges
  (Druk / Archivo Black). Flat color, no gradients/soft shadows. Centered
  symmetry forbidden. Angular vector-arriving motion.

---

### Style 32 — Mechanical Scoring Funnel
- **band:** `craft-cultural` · **DNA file:** `mechanical-scoring-funnel.md`
- **name:** EN `Mechanical Scoring Funnel` / ZH `机械评分漏斗`
- **v3 topic:** EN `Triage the Backlog` / ZH `需求分拣`
- **why:** Sorting a backlog through weighted lanes is the scoring-funnel made
  literal — inputs drop, lanes categorize, scores tick, slots light on fill.
- **5-scene narrative:**
  1. *The machine* — the funnel structure, lanes dormant. **1 beat** · motion.
  2. *The inputs* — backlog items drop in and bounce through pins. **3 beats** · `motion`.
  3. *The lanes* — items sort into category channels. **3 beats** · `reserved`.
  4. *The scoring* — multipliers apply, scores tick up per lane. **3 beats** · `motion`.
  5. *The output* — ranked slots light, top item crowned. **1 beat** · motion.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 slide-y`,
  `3->4 slide-y`, `4->5 scale-fade`. (Inputs descend through the machine;
  output zooms.)
- **nav:** **N1 Bespoke metaphor** — a lane/stage indicator: small numbered
  slots at the funnel base, the active stage lit like a filled slot.
- **notes:** deep dark playfield ground, a few saturated coded accents carrying
  lane meaning, glowing lane edges. Bold technical labels (Chakra Petch /
  Rajdhani) + monospaced scoreboard numerals (JetBrains Mono). Layered
  mechanical depth. Kinetic physical arcade-adjacent motion.

---

# === Band 5 — Contemporary Digital (styles 33–40) ===

**v1 topics (do not reuse):** Liquid Glass · Retro Desktop · Botanical Brand ·
Luxe Reveal · Runbook Manual · Title Card · Chalk Talk · Boss Fight.
**v2 topics (do not reuse):** Spatial Brief · Toolchain Desk · Calm Growth ·
Beta Salon · Habit Runbook · System Acts · Shortcut · Latency Boss.

Band-wide leaning: digital-native surfaces, interface metaphors — must NOT
collapse into one glass-card layout. Navigation patterns differ across the band
and match each interface metaphor. Animated effects stay deterministic and turn
off for reduced-motion/thumbnail. Nav spread: N1, N1, N7, N7, N9, N8, N9, N1.

---

### Style 33 — Liquid Glass
- **band:** `contemporary-digital` · **DNA file:** `liquid-glass.md`
- **name:** EN `Liquid Glass` / ZH `液态玻璃`
- **v3 topic:** EN `Layers of a Product` / ZH `产品的层`
- **why:** A product explained as depth layers is native to glass — edge
  highlights, refraction, z-stacked panes making each layer feel precious.
- **5-scene narrative:**
  1. *The surface* — one glass pane settles in with edge highlight. **1 beat** · motion.
  2. *Beneath* — a second pane reveals behind, parallax depth. **2 beats** · `motion`.
  3. *The stack* — three layers separate front-to-back. **3 beats** · `reserved`.
  4. *The focus* — one pane lifts forward, specular glint. **1 beat** · motion.
  5. *Whole* — layers recombine into the product. **1 beat** · motion.
- **transitionMap:** base `scale-fade`; `1->2 fade`, `2->3 scale-fade`,
  `3->4 scale-fade`, `4->5 fade`. (Panes settle with slight overshoot; depth
  zooms; quiet recombine.)
- **nav:** **N1 Bespoke metaphor** — a z-depth layer indicator: stacked pane
  glyphs, the active layer brought forward.
- **notes:** nearly colorless neutral glass picking up ambient temperature,
  faint cool bloom, accent only as edge light-catch. Glass used sparingly on
  panels (never full-screen), real depth behind, foreground legibility via
  vibrancy. Clean sans (SF Pro Display / Inter). Physical calm ease + parallax.

---

### Style 34 — Retro Windows
- **band:** `contemporary-digital` · **DNA file:** `retro-windows.md`
- **name:** EN `Retro Windows` / ZH `复古 Windows`
- **v3 topic:** EN `Setup.exe` / ZH `安装向导`
- **why:** A classic install wizard is peak Win9x application content — beveled
  windows, title bars, progress fills, group-boxes; dense application UI.
- **5-scene narrative:**
  1. *Welcome* — a beveled window, navy title bar "SETUP.EXE". **1 beat** · motion.
  2. *License* — a sunken text well + literal-x checkbox. **2 beats** · `reserved`.
  3. *Components* — chevron list of options, group-boxes. **3 beats** · `reserved`.
  4. *Installing* — a progress bar jumps in blocky steps. **1 beat** · motion.
  5. *Finish* — a "Complete" dialog, OK button. **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 hard-cut`,
  `3->4 glitch`, `4->5 hard-cut`. (Windows snap; a CRT glitch as install churns.)
- **nav:** **N1 Bespoke metaphor** — wizard Back/Next chrome buttons + a
  step-of-5 dialog label ("Step 3 of 5"), the OS-native navigation.
- **notes:** warm button-face gray chrome, navy sole primary accent, fixed
  four-status-color meaning, CRT scanline overlay. System sans (MS Sans Serif /
  Tahoma) + optional pixel splash (Press Start 2P). Bevel depth, no soft shadows/
  rounding. Dense application UI. Blocky instant motion.

---

### Style 35 — Mid-Century Grove
- **band:** `contemporary-digital` · **DNA file:** `mid-century-grove.md`
- **name:** EN `Mid-Century Grove` / ZH `中世纪林间`
- **v3 topic:** EN `Growing Slowly on Purpose` / ZH `慢成长`
- **why:** A deliberate slow-growth philosophy suits the warm walnut/green
  Eames-era calm — deep cultivated green, cream serif, one rust mark, patient.
- **5-scene narrative:**
  1. *The seed* — green ground, cream title, rust em-dash kicker. **1 beat** · motion.
  2. *Roots* — a cream inset panel breaks the green like a leaf. **3 beats** · `motion`.
  3. *The canopy* — staggered points settle like leaves on water. **2 beats** · `reserved`.
  4. *The grove* — several thin-ruled sections coexist. **2 beats** · `reserved`.
  5. *Rings* — a closing line, faint corner watermark. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 slide-y`, `3->4 slide-y`,
  `4->5 fade`. (Soft fade-ups + gentle vertical settling, leaves landing.)
- **nav:** **N7 Ghost / hover-reveal** — a faint rust progress mark low on the
  green, surfacing only on hover to keep the calm.
- **notes:** botanical green/sage dominant ground (wins ~two-thirds), warm cream
  ink (never pure white), one burnt-orange/rust accent as punctuation only, thin
  hairline rules. Classical mid-century serif (Freight Text / Neutraface Display)
  + humanist body + editorial label sans. Slow organic motion.

---

### Style 36 — After-Hours Luxe
- **band:** `contemporary-digital` · **DNA file:** `after-hours-luxe.md`
- **name:** EN `After-Hours Luxe` / ZH `深夜奢华`
- **v3 topic:** EN `The Midnight Release` / ZH `午夜上线`
- **why:** A premium late-night product release — dim, warm, magnetic; one glowing
  serif headline through smoke, pearl-cream panels of light; the lounge DNA.
- **5-scene narrative:**
  1. *Last call* — warm-black field, a mono kicker over a glowing headline. **2 beats** · `motion`.
  2. *The pour* — a pearl-cream callout rail states the offering. **2 beats** · `reserved`.
  3. *The reveal* — the hero serif swells with its halo. **2 beats** · `motion`.
  4. *The details* — 2–3 fragments orbit in deliberate imbalance. **2 beats** · `reserved`.
  5. *Signed* — a final line dims to close. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 scale-fade`, `3->4 fade`,
  `4->5 fade`. (Smooth slow fades; the reveal zooms gently.)
- **nav:** **N7 Ghost / hover-reveal** — a hot-accent hairline index that glows
  faintly on hover, matching the neon-through-smoke mood.
- **notes:** warm-black ground (never flat black) + faint corner radial + film
  grain + hairline pearl-cream frame, one single hot magenta/pink accent (never
  two), pearl-cream insets (not white cards), accent kicker above every headline.
  High-contrast serif display (Didot / Canela) + ultra-light sans + mono labels.
  Asymmetric. Smooth confident slow motion.

---

### Style 37 — Operating Manual
- **band:** `contemporary-digital` · **DNA file:** `operating-manual.md`
- **name:** EN `Operating Manual` / ZH `操作手册`
- **v3 topic:** EN `Rotate the Secrets` / ZH `轮换密钥`
- **why:** A high-stakes credential-rotation runbook is the operating-manual's
  native content — numbered steps, command blocks, annotated output, urgency.
- **5-scene narrative:**
  1. *The procedure* — a warning-striped operational header. **1 beat** · motion.
  2. *The steps* — numbered do-this directives appear in order. **2 beats** · `reserved`.
  3. *Execution* — a terminal command block runs, output reveals. **3 beats** · `reserved`.
  4. *Verification* — a status check confirms rotation. **2 beats** · `reserved`.
  5. *Complete* — a final "DONE" state. **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 slide-y`,
  `3->4 slide-y`, `4->5 hard-cut`. (Crisp terminal cuts; steps/output scroll
  vertically.)
- **nav:** **N9 Command / status bar** — a terminal status strip
  (`STEP 3/5 · OK`) along the bottom, prompt-styled.
- **notes:** deep industrial-dark ground driven by a high-visibility warning
  tone (amber/hazard) + crisp light text, bold monospaced terminal voice
  throughout (JetBrains Mono / IBM Plex Mono). Flat high-contrast depth
  (contrast/striping, not shadow). Crisp sequential motion.

---

### Style 38 — Widescreen Title Card
- **band:** `contemporary-digital` · **DNA file:** `widescreen-title-card.md`
- **name:** EN `Widescreen Title Card` / ZH `宽屏标题卡`
- **v3 topic:** EN `Chapter Zero` / ZH `第零章`
- **why:** An origin-story opening credit sequence — deep letterbox, graded
  still, a title hanging in the dark; the cinematic title-card DNA as prologue.
- **5-scene narrative:**
  1. *Fade in* — letterbox bars, a graded still emerges. **2 beats** · `motion`.
  2. *The title* — film-poster title settles into the frame. **1 beat** · motion.
  3. *The premise* — a recessive credit line beneath, still drifts (Ken Burns). **2 beats** · `motion`.
  4. *The cast* — sparse credit stack, one warm highlight from the still. **1 beat** · motion.
  5. *Cut to black* — title lingers, light dims. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 scale-fade`, `3->4 fade`,
  `4->5 fade`. (Cinematic dissolves; a slow push on the premise.)
- **nav:** **N8 No visible nav** — a title card is a held cinematic moment;
  keyboard/click-zone only, no chrome breaks the frame.
- **notes:** deep warm-black letterbox bars in a wide band, graded still as
  ground, film-poster title with real presence, supporting text recessive/
  credit-like. Bold-condensed or elegant high-contrast title (Bebas Neue /
  Trajan) + small recessive sans credits. Accent nearly absent (one warm
  highlight from the still). Slow cinematic motion, subtle drift.

---

### Style 39 — Blackboard Chalk Talk
- **band:** `contemporary-digital` · **DNA file:** `blackboard-chalk-talk.md`
- **name:** EN `Blackboard Chalk Talk` / ZH `粉笔推导`
- **v3 topic:** EN `Deriving Big-O` / ZH `推导复杂度`
- **why:** Deriving algorithmic complexity by hand is the chalk-talk's reason to
  exist — reasoning built stroke by stroke, formulas term by term, in real time.
- **5-scene narrative:**
  1. *The question* — a hand-drawn title, underlined in chalk. **1 beat** · motion.
  2. *The setup* — a diagram sketches itself, arrows extend. **2 beats** · `motion`.
  3. *The derivation* — a formula appears term by term. **3 beats** · `reserved`.
  4. *The insight* — the result boxed, a margin note added. **2 beats** · `motion`.
  5. *Q.E.D.* — the final bound, chalk-circled. **1 beat** · motion.
- **transitionMap:** base `wipe`; `1->2 wipe`, `2->3 wipe`, `3->4 wipe`,
  `4->5 fade`. (Chalk wipes on like a writing hand; final fade as if stepping
  back from the board.)
- **nav:** **N9 Command / status bar** — a chalk-scrawled step line at the
  board's edge ("① ② ③ ④ ⑤"), current step circled.
- **notes:** deep matte dark-green/slate board, soft off-white chalk marks + a
  few pastel chalk accents (gentle yellow, soft mint), chalk dust/streak texture.
  Handwritten hand (Caveat / Gochi Hand) + light notation voice for formulas.
  Near-flat board plane. Stroke-by-stroke drawing motion, slightly uneven.

---

### Style 40 — Arcade Boss Fight
- **band:** `contemporary-digital` · **DNA file:** `arcade-boss-fight.md`
- **name:** EN `Arcade Boss Fight` / ZH `街机 Boss 战`
- **v3 topic:** EN `Defeating Tech Debt` / ZH `打败技术债`
- **why:** Framing tech debt as a boss fight is the arcade DNA's exact play —
  health bars, power-ups, inventory, player-vs-boss; stakes made fun.
- **5-scene narrative:**
  1. *Insert coin* — title screen, pixel logo, "PRESS START". **1 beat** · motion.
  2. *The boss* — the tech-debt boss appears, health bar full. **2 beats** · `motion`.
  3. *Power-ups* — inventory slots fill with tools/tactics. **3 beats** · `reserved`.
  4. *The fight* — boss health drains as hits land, damage flashes. **2 beats** · `motion`.
  5. *Victory* — score tallies, "STAGE CLEAR". **1 beat** · motion.
- **transitionMap:** base `glitch`; `1->2 glitch`, `2->3 hard-cut`,
  `3->4 glitch`, `4->5 hard-cut`. (Pixel-glitch stage changes + blocky snaps.)
- **nav:** **N1 Bespoke metaphor** — a stage/level progress bar (STAGE 1–5) in
  arcade neon, current stage lit like a game HUD.
- **notes:** deep near-black field, few saturated arcade neons mapped to game
  meaning (neon-green health, hot-red danger, arcade-yellow reward), committed
  pixel/bitmap type (Press Start 2P / VT323 / Silkscreen). Flat pixel-honest
  surfaces. Snappy stepped choppy game-state motion (meters tick, sprites step).

---

# === Band 6 — Text Report (styles 41–48) ===

**v1 topics (do not reuse):** Research Memo · Decision Record · Issue Brief ·
Field Notes · Source Diff · Checklist · Context Bento · Object Hero.
**v2 topics (do not reuse):** Small Team · Boundary · Agent Pickup · Platform
Study · Flow Rewrite · Launch Ledger · Handoff Box · Recovery Kit.

Band-wide leaning: dense, evidence-first, document-like — yet scene/beat state
changes stay polished and legible. Dense tables/briefs/footnotes/exhibits must
not overflow in EN or ZH. Most transitions restrained but per-edge varied.
Reading-first ⇒ mostly `reserved`. Nav spread: N5, N6, N9, N5, N1, N2, N10, N10.

---

### Style 41 — Research Memo
- **band:** `text-report` · **DNA file:** `research-memo.md`
- **name:** EN `Research Memo` / ZH `研究备忘录`
- **v3 topic:** EN `Why Users Churn` / ZH `用户流失`
- **why:** An evidence-first churn analysis is the research memo's native form —
  masthead, thin rules, structured findings, one highlighted metric per page.
- **5-scene narrative:**
  1. *Masthead* — subject/date/author header, thin rule. **1 beat** · motion.
  2. *The finding* — a structured findings block, one big metric callout. **2 beats** · `reserved`.
  3. *The evidence* — supporting data in a columned layout. **3 beats** · `reserved`.
  4. *The interpretation* — reasoning beside the highlighted figure. **2 beats** · `reserved`.
  5. *The recommendation* — a closing directive, accent heading. **1 beat** · motion.
- **transitionMap:** base `fade`; `1->2 fade`, `2->3 slide-y`, `3->4 slide-y`,
  `4->5 fade`. (Quiet document fades; sections scroll vertically.)
- **nav:** **N5 Page numerals / spine** — a document section index (§1–§5) +
  footnote-style source marks; unobtrusive.
- **notes:** bright clean paper ground with thin rules, single serious accent
  (one max) for a key metric/heading, elegant header (Tiempos Headline / GT
  Sectra) + neutral body (Inter / Söhne). Near-flat depth. Quiet dignified motion,
  generous never-cramped hierarchy.

---

### Style 42 — Decision Record
- **band:** `text-report` · **DNA file:** `decision-record.md`
- **name:** EN `Decision Record` / ZH `决策记录`
- **v3 topic:** EN `Why We Chose Monorepo` / ZH `选单仓库`
- **why:** An ADR justifying a monorepo choice is the decision-record verbatim —
  context, decision, trade-offs, verification; reasoning made explicit.
- **5-scene narrative:**
  1. *Record header* — title + status "PROPOSED". **1 beat** · motion.
  2. *Context* — a labeled reasoning block sets the situation. **2 beats** · `reserved`.
  3. *The trade-offs* — a side-by-side matrix (mono vs multi). **3 beats** · `reserved`.
  4. *The decision* — the choice stated, rationale listed. **2 beats** · `reserved`.
  5. *Approved* — status resolves to "ACCEPTED". **1 beat** · motion.
- **transitionMap:** base `slide-x`; `1->2 slide-x`, `2->3 slide-x`,
  `3->4 fade`, `4->5 scale-fade`. (Reasoning blocks advance laterally; decision
  fades; status settles.)
- **nav:** **N6 Timeline / stepper** — a decision-stage stepper (Context →
  Decision → Trade-offs → Verification → Status) with a progress connector.
- **notes:** structured light cool ground with sharp thin rules, one procedural
  accent (serious blue / considered green) for approval/status, clean technical/
  mono documentation voice (IBM Plex Mono / JetBrains Mono) + IBM Plex Sans
  labels. Near-flat spec-sheet depth. Orderly motion.

---

### Style 43 — Maintainer Issue Brief
- **band:** `text-report` · **DNA file:** `maintainer-issue-brief.md`
- **name:** EN `Maintainer Issue Brief` / ZH `维护者问题简报`
- **v3 topic:** EN `Flaky Test, Root Cause` / ZH `不稳定测试`
- **why:** A flaky-test investigation ticket is the issue-brief's native content —
  status badge, labeled sections, mono checklists, diff-style before/after.
- **5-scene narrative:**
  1. *The ticket* — bold title + status badge "OPEN". **1 beat** · motion.
  2. *The symptom* — a labeled "observed" section, scannable. **2 beats** · `reserved`.
  3. *The investigation* — a mono checklist checks off leads. **3 beats** · `reserved`.
  4. *The fix* — a diff-style before/after of the flaky code. **2 beats** · `reserved`.
  5. *Merged* — status flips to "RESOLVED". **1 beat** · motion.
- **transitionMap:** base `hard-cut`; `1->2 hard-cut`, `2->3 slide-y`,
  `3->4 slide-x`, `4->5 hard-cut`. (Crisp functional cuts; checklist scrolls;
  diff slides in.)
- **nav:** **N9 Command / status bar** — a breadcrumb/status line
  (`#1428 · OPEN → RESOLVED`) mirroring a tracker.
- **notes:** light developer-gray ground with quiet borders, small status-color
  vocabulary (merge-ready green + informational blue on badges only), sharp
  neutral headings (Inter) + monospaced code voice (SF Mono / JetBrains Mono).
  Tidy low-chrome depth. Crisp motion (checks flip, diff emphasizes).

---

### Style 44 — Field Notes Report
- **band:** `text-report` · **DNA file:** `field-notes-report.md`
- **name:** EN `Field Notes Report` / ZH `田野笔记`
- **v3 topic:** EN `A Day Shadowing Support` / ZH `跟班客服`
- **why:** Shadowing a support team is observational field research — logged
  header, hand-drawn bullets, margin notes, a simple sketch; the notebook DNA.
- **5-scene narrative:**
  1. *The log* — a dated notebook header, handwritten title. **1 beat** · motion.
  2. *Observations* — hand-marked bullet observations appear one by one. **2 beats** · `reserved`.
  3. *The sketch* — a simple setup sketch beside findings. **2 beats** · `motion`.
  4. *The patterns* — margin notes annotate recurring behaviors. **2 beats** · `reserved`.
  5. *The takeaway* — a warm closing note. **1 beat** · motion.
- **transitionMap:** base `page-flip`; `1->2 page-flip`, `2->3 slide-y`,
  `3->4 slide-y`, `4->5 page-flip`. (Notebook page-turns bookend; observations
  scroll like writing down the page.)
- **nav:** **N5 Page numerals / spine** — handwritten notebook page numbers in
  the corner, hand-drawn folio style.
- **notes:** soft aged-paper / notebook-yellow ground, sepia/charcoal writing +
  one warm amber/terracotta accent, legible handwriting (Caveat / Shantell Sans)
  + readable observation body (Lora / Source Serif 4). Flat papery depth. Gentle
  hand-paced motion (notes reveal as if written).

---

### Style 45 — Annotated Source & Diff
- **band:** `text-report` · **DNA file:** `annotated-source-and-diff.md`
- **name:** EN `Annotated Source & Diff` / ZH `注解源码与差异`
- **v3 topic:** EN `Killing a God Object` / ZH `拆解巨类`
- **why:** Refactoring a bloated god-object is a before/after transformation the
  diff-annotator makes undeniable — removal/addition highlights, annotations.
- **5-scene narrative:**
  1. *The file* — the source header, line numbers, calm ground. **1 beat** · motion.
  2. *The problem* — the god-object highlighted, annotation callout. **2 beats** · `reserved`.
  3. *The diff* — removals strike through, additions tint in. **3 beats** · `reserved`.
  4. *The split* — one class becomes three, annotated. **2 beats** · `motion`.
  5. *After* — clean modules, change marked complete. **3 beats** · `reserved`.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 slide-y`,
  `3->4 wipe`, `4->5 slide-y`. (Code scrolls vertically; a wipe as the class
  splits.)
- **nav:** **N1 Bespoke metaphor** — a before/after diff toggle indicator (a
  small ⟷ swipe marker) showing which side/stage is in view.
- **notes:** clean light ground, soft git-red removal + git-green addition tones
  as the only strong color, sharp monospaced source (JetBrains Mono / Fira Code)
  + readable annotation (Inter). Minimal reviewer depth. Change-focused motion
  (before resolves into after).

---

### Style 46 — Checklist Ledger
- **band:** `text-report` · **DNA file:** `checklist-ledger.md`
- **name:** EN `Checklist Ledger` / ZH `检查清单台账`
- **v3 topic:** EN `Close the Quarter` / ZH `季度结账`
- **why:** A financial quarter-close checklist is the ledger's native tone —
  strict aligned items, clear checks, completeness as the whole point.
- **5-scene narrative:**
  1. *The ledger* — a formal header, ruled rows empty. **1 beat** · motion.
  2. *The books* — checklist items populate in aligned rows. **2 beats** · `reserved`.
  3. *Reconciling* — items confirm one by one with a check. **3 beats** · `reserved`.
  4. *The exceptions* — two flagged rows await sign-off. **3 beats** · `reserved`.
  5. *Closed* — a resolved readiness total. **2 beats** · `reserved`.
- **transitionMap:** base `slide-y`; `1->2 slide-y`, `2->3 slide-y`,
  `3->4 fade`, `4->5 hard-cut`. (Rows accumulate vertically; a hard cut on the
  closed state.)
- **nav:** **N2 Bottom progress dots** — a completeness meter dot row that fills
  as scenes resolve, echoing the checklist total.
- **notes:** very light ledger-ruled ground, calm confirming green for checks,
  plain steady traditional voice (IBM Plex Serif / IBM Plex Sans), consistent
  alignment. Flat ledger depth. Calm cumulative motion (items confirm one by
  one).

---

### Style 47 — Context Bento Box
- **band:** `text-report` · **DNA file:** `context-bento-box.md`
- **name:** EN `Context Bento Box` / ZH `上下文便当盒`
- **v3 topic:** EN `Everything the Intern Needs` / ZH `新人须知`
- **why:** An onboarding context package is the bento's native content — distinct
  compartments (goal / setup / people / risks), each a portion of one whole.
- **5-scene narrative:**
  1. *The box* — the bento frame, compartments outlined. **1 beat** · motion.
  2. *The portions* — compartments fill with labeled sections. **3 beats** · `reserved`.
  3. *The detail* — one compartment lifts to reveal depth. **2 beats** · `motion`.
  4. *The balance* — all portions shown as a complete whole. **2 beats** · `reserved`.
  5. *Packed* — the finished handoff box. **2 beats** · `reserved`.
- **transitionMap:** base `scale-fade`; `1->2 scale-fade`, `2->3 scale-fade`,
  `3->4 fade`, `4->5 scale-fade`. (Compartments settle/lift with zoom; quiet
  fade to the whole.)
- **nav:** **N10 Object dial / compartment index** — a compartment selector: the
  bento sections double as nav; the active portion outlined/lifted.
- **notes:** deep warm lacquer-black ground (never cold void), ≤4 category
  accents on labels + thin border tint only (never fills/body), warm considered
  serif display (Newsreader / Source Serif 4) + humanist sans body + all-caps
  mono labels. Matte depth from subtle separation. Calm orderly motion.

---

### Style 48 — Object Metaphor Hero
- **band:** `text-report` · **DNA file:** `object-metaphor-hero.md`
- **name:** EN `Object Metaphor Hero` / ZH `物体主视觉`
- **v3 topic:** EN `The Onboarding Toolkit` / ZH `入职工具包`
- **why:** An onboarding kit rendered as a real, well-made physical toolkit is
  the object-metaphor DNA exact — a tangible hero, organized slots, neat labels.
- **5-scene narrative:**
  1. *The case* — a closed toolkit case eases in, title tag. **1 beat** · motion.
  2. *Opened* — the lid lifts, compartments revealed. **3 beats** · `motion`.
  3. *The tools* — each slot's tool labeled and related to a task. **2 beats** · `reserved`.
  4. *Assembled* — connectors relate parts to the whole kit. **2 beats** · `reserved`.
  5. *Ready* — the complete kit, packed and tagged. **2 beats** · `reserved`.
- **transitionMap:** base `page-flip`; `1->2 page-flip`, `2->3 scale-fade`,
  `3->4 fade`, `4->5 scale-fade`. (A lid-lift page-flip open; parts settle with
  zoom.)
- **nav:** **N10 Object dial / compartment index** — the kit's own slots as a
  compartment index; the active slot highlighted, physical selector feel.
- **notes:** warm natural material tones (sand/cream/tan + leather/wood/brass/
  kraft browns, ambers, golds), contrast from warmth + believable shadow (no
  neon accents), calm label voice + considered title (Canela / Tiempos titles +
  Söhne / Inter labels). Physical texture. Unhurried assembly-like motion.

---

## 5. Post-approval integration checklist (orchestrator-owned)

After all 48 v3 files land (6 per-band commits), the orchestrator will:

1. Wire each v3 into `registry.ts` as the third entry in `buildEntry("NN", […])`
   — v1/v2 untouched; Overview `×N` badge auto-updates to `×3`.
2. Extend `styleVersionProtocol.test.tsx` with the v3 hard gate (per-edge
   transition map, `model === "Claude-Opus-4.8"`, v3-subset ≥6 transition kinds).
3. Extend `e2e/audit.spec.ts`: add a v3 beat table + v3 scene-5 last-beat map,
   teach `getLastBeat` about `"v3"`, and update the version-aware cross-style
   cycling / wrap-around cases (last version is now v3, not v2).
4. Run `npm run ci` per wave; `npm run test:audit` at each band close.
5. EN + ZH spot checks per band; confirm v1/v2 regression-free.
6. Record the decision in `CONTEXT.md` (successor to D94) and update the
   Progress Log.

No git push and no deployment unless separately requested. v3 gets no dedicated
Overview thumbnail (Overview keeps showing the v1 static screenshot; v3 is
viewable in Lab).












