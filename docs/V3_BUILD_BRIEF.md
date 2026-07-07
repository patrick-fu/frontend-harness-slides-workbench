# V3 Sub-Agent Build Brief — SHARED CONTRACT (read this first)

You are building ONE slide-style version file for a React/Vite slide workbench.
Your entire deliverable is a single file `src/styles/NN-<kebab-topic>-v3.tsx`
(plus, optionally, a sibling `NN-<kebab-topic>-v3.module.css`). Nothing else.

Your specific assignment (topic, 5-scene narrative, beat counts, per-edge
transitions, navigation prototype, palette/type notes) is given SEPARATELY in
your task message. This file is the shared contract + the exact infrastructure
API you may use. Follow both.

────────────────────────────────────────────────────────────────────────────
## HARD ISOLATION RULE (non-negotiable)

You MUST NOT read, open, grep, or look at ANY existing style implementation or
registry. Specifically forbidden:
- any file matching `src/styles/NN-*.tsx` or `*.module.css` for styles (v1, v2,
  v3 — including your own style's other versions and any peer's v3),
- `src/styles/registry.ts`, `src/data/showcase-thumbnails.ts`,
- any other style's DNA `.md` file,
- the workbench components (`src/components/**`, `src/App.tsx`).

You may ONLY read:
- this shared brief,
- your own assignment (in the task message),
- `src/types.ts` (the props/metadata contract),
- `src/styles/version.ts` (`defineStyleVersion`),
- `src/styles/SpatialSceneTrack.tsx` and `src/styles/SpatialSceneTrack.module.css`,
- `src/hooks/useFLIP.ts`,
- your single assigned DNA file under
  `~/.agents/skills/frontend-harness-slides/references/style/<file>.md`.

Write your implementation FROM the DNA + assignment, not by copying anyone. If
you find yourself wanting to see how another style did it — don't. That is the
whole point of this exercise.

────────────────────────────────────────────────────────────────────────────
## THE INFRASTRUCTURE API (verified — use exactly this shape)

### Props your component receives (`BespokeStyleProps` from `../types`)
```ts
interface BespokeStyleProps {
  scene: number;        // 1..5
  beat: number;         // 0-based, length varies per scene
  language: "en" | "zh";
  isThumbnail: boolean; // true in overview cards — hide nav, disable motion
  reducedMotion: boolean;
  onNavigate?: (scene: number, beat: number) => void; // absolute jump
}
```
Do NOT read or pass `isTransitionClone` (deprecated).

### Version module (`defineStyleVersion` from `./version`)
```ts
import { defineStyleVersion } from "./version";

export const <camelTopic>V3Version = defineStyleVersion({
  id: "v3",
  topic: { en: "<≤32 chars>", zh: "<≤8 chars>" },
  model: "Claude-Opus-4.8",
  component: <YourComponent>,
  getMetadata,
});
```
Also `export default <YourComponent>` and `export function getMetadata(lang)`.

### Scene lifecycle (`SpatialSceneTrack`, default export of `./SpatialSceneTrack`)
This owns scene mounting + transitions. You render scene CONTENT via
`renderScene`. You never manage outgoing scenes yourself.
```tsx
import SpatialSceneTrack from "./SpatialSceneTrack";
import type { SceneTransitionMap } from "./SpatialSceneTrack";

const TRANSITIONS: SceneTransitionMap = {
  "1->2": "<kind>", "2->3": "<kind>", "3->4": "<kind>", "4->5": "<kind>",
}; // use the EXACT kinds from your assignment

<SpatialSceneTrack
  scene={scene}
  beat={beat}
  transitionKind="<your base kind>"   // REQUIRED literal — a grep checks for `transitionKind=`
  transitionMap={TRANSITIONS}
  reducedMotion={reducedMotion || isThumbnail}
  beatLayoutModes={{ 2: "motion", 3: "reserved", /* per multi-beat scene */ }}
  renderScene={(sceneId, sceneBeat, isActive) => (
    <YourScene scene={sceneId} beat={sceneBeat} isActive={isActive} />
  )}
/>
```
Supported transition kinds (ONLY these):
`slide-x`, `slide-y`, `fade`, `scale-fade`, `hard-cut`, `wipe`, `page-flip`, `glitch`.
`SpatialSceneTrack` renders all 5 scene panels mounted; it sets
`data-beat-layout-container/-mode` on a panel ONLY if you pass `beatLayoutModes`
for that scene — but the robust approach is to ALSO mark your own layout
container (see below), because the protocol test looks for a marked container in
the active panel.

### Beat layout (per scene with >1 beat) — REQUIRED markers
Every scene that has more than one beat must, in its rendered content, expose:
```tsx
<div data-beat-layout-container="true" data-beat-layout-mode="motion">
  <h1 data-beat-layout-item="true">…</h1>
  <p  data-beat-layout-item="true">…</p>
  {/* ≥2 items when the container is not the panel root */}
</div>
```
- `motion` mode: new beats reflow existing items; animate the moved items with
  FLIP (use `useFLIP`, non-linear easing). Not just fading the new element in.
- `reserved` mode: reserve final layout from beat 0; later beats only toggle
  opacity/emphasis/small transform in FIXED slots. Never `display:none` a slot
  that should hold space (use visibility/opacity).
Use the mode assigned per scene in your brief.

### FLIP hook (`useFLIP` from `../hooks/useFLIP`) — for `motion` scenes
```ts
import { useFLIP } from "../hooks/useFLIP";
const { ref } = useFLIP<HTMLDivElement>({
  watch: [beat],
  disabled: reducedMotion || isThumbnail || !isActive,
  duration: 480,
  easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  selector: '[data-beat-layout-item="true"]',
});
// attach ref to the data-beat-layout-container element
```

### Metadata (`StyleMetadata` from `../types`)
`getMetadata(lang)` must return, for BOTH "en" and "zh", structurally aligned:
```ts
{
  id: "NN",                    // your two-digit id, must match
  band: "<assigned band>",     // EXACT string from your brief
  name: "<canonical name>",    // from brief, identical across versions
  theme: "<your v3 topic>",    // localized
  densityLabel: "<localized>",
  heroScene: <1..5>,
  colors: { bg: "#…", ink: "#…", panel: "#…" }, // real hex
  typography: { header: "…", body: "…" },
  tags: [ /* mood/tone/density/scheme/motion from the DNA */ ],
  fonts: [ "Family", "cjk:CJK Family" ], // declare EVERY font you inject
  scenes: [ // EXACTLY 5, ids 1..5
    { id: 1, title: "<localized>", beats: [
        { id: 0, action: "<localized>", title: "<localized>", body: "<localized>" },
        /* beat count MUST match your assignment */
    ]},
    /* scenes 2..5 */
  ],
}
```

────────────────────────────────────────────────────────────────────────────
## STYLE / STAGE RULES

- The stage is 1920×1080 with `container-type: size`. Use ONLY `cqw`/`cqh` for
  sizing. NO `px`, `vw`, `vh`, `rem`, `em` for layout dimensions.
  (1cqw = 19.2px, 1cqh = 10.8px. Borders like `1px` are tolerable but prefer
  `0.1cqw`.)
- Root element: a full-size container (`width:100%;height:100%`) that hosts the
  `SpatialSceneTrack`. Give it your background.
- Fonts: inject via a `useFonts()` effect (append a Google Fonts `<link>` with a
  dedupe guard by id). Declare every family in `getMetadata().fonts`. CJK
  families get a `cjk:` prefix in the array.
- Colors: use the DNA's palette. Put real hex in `getMetadata().colors`.
- Reduced motion / thumbnail: when `reducedMotion || isThumbnail`, disable all
  animation (`animation-duration:0s; transition-duration:0s`), disable FLIP
  (`disabled` above), and settle to the FINAL readable layout. No overflow.
- Internal navigation: if you render nav UI, it MUST `return null` when
  `isThumbnail`. Jump with `onNavigate?.(targetScene, 0)`. Nav elements inside
  the stage must call `e.stopPropagation()` on click so the envelope's
  click-zone navigation is not double-triggered. Build the nav prototype named
  in your brief; make it feel native to the style, not a generic dot row (unless
  dots ARE your assigned prototype).
- Content: bilingual (en + zh), no lorem. Keep every scene at every beat inside
  the stage with no overflow (>2px) in EITHER language — Chinese text is often
  wider/taller, test both mentally.

────────────────────────────────────────────────────────────────────────────
## FORBIDDEN (protocol tests will fail the build otherwise)

- No `outgoingScene` state, no `transitionInfo` state, no full-screen transition
  clone, no `data-transition-clone`, no reading `isTransitionClone`,
  no `key={scene}` remount hack. `SpatialSceneTrack` owns all of that.
- No transition kind outside the supported 8.
- No missing `transitionKind=` literal in the source.
- No multi-beat scene without a `data-beat-layout-mode` of `motion`|`reserved`.
- No `model` other than `"Claude-Opus-4.8"`. No `id` other than `"v3"`.
- Topic longer than en≤32 / zh≤8 characters.

────────────────────────────────────────────────────────────────────────────
## DELIVERABLE

1. Create `src/styles/NN-<kebab-topic>-v3.tsx` (+ optional `.module.css`).
2. Self-check against the FORBIDDEN list and the metadata shape.
3. Report back: the file path(s) you created, your chosen `transitionMap`, the
   per-scene beat counts, and confirm reduced-motion + thumbnail handling. Do
   NOT run the whole test suite (the orchestrator integrates + tests). You may
   `npx tsc --noEmit` on your file's types if unsure, but it's optional.
