# Curated v2 Assignment Matrix

This is the source of truth for the curated `v2` rollout. Each style gets one
new black-box version with `id: "v2"`. Existing `v1` files are not design input
for sub-agents.

## Global Rules

- Each style produces one self-contained version module and optional CSS module.
- Version id is always `v2`.
- Each module exports `defineStyleVersion(...)`, default component, and
  `getMetadata(lang)`.
- Each version has 5 scenes, bilingual content, complete beat metadata, internal
  navigation, thumbnail-safe rendering, and reduced-motion support.
- Each sub-agent must first create a temporary five-scene design board under
  `/tmp/frontend-harness-slides-v2-design-boards/{styleId}/`. The board is a
  reference only and is not committed.
- Runtime slides must be React/CSS/SVG/DOM. Do not use the generated design
  board as a slide background or text asset.
- Use `SpatialSceneTrack` and `transitionMap` for scene lifecycle. Do not use
  `outgoingScene`, `isTransitionClone`, or full-screen transition clones.
- Multi-beat scenes must expose `data-beat-layout-container`, choose
  `data-beat-layout-mode="motion"` or `"reserved"`, and mark stable children
  with `data-beat-layout-item`.

## Band 1: Minimal Keynote

| Style | Guide | v2 topic | Scene arc | Edge transitions | Beat mode | Internal nav |
|---|---|---|---|---|---|---|
| 01 | Minimal Product Keynote | Quiet Launch Window | threshold, product silhouette, proof signal, launch choice, final line | `1->2:scale-fade`, `2->3:wipe`, `3->4:fade`, `4->5:hard-cut` | reserved | tiny vertical five-mark aperture |
| 02 | Objective Swiss Grid | Metrics Without Noise | grid thesis, baseline, comparison, decision table, signed-off rule | `1->2:wipe`, `2->3:slide-y`, `3->4:fade`, `4->5:hard-cut` | reserved | left margin grid index |
| 03 | Wabi-Sabi Ceramic | Repair as Strategy | flawed vessel, crack map, repair sequence, quieter strength, held object | `1->2:fade`, `2->3:scale-fade`, `3->4:wipe`, `4->5:fade` | motion | small clay-chip ring |
| 04 | Interactive Dialogue Stage | The Better Question | two voices enter, friction, clarification loop, aligned answer, curtain call | `1->2:fade`, `2->3:glitch`, `3->4:slide-x`, `4->5:scale-fade` | motion | spotlight cue rail |
| 05 | Cyanotype Drafting Table | Resilience Blueprint | title sheet, system layers, stress path, inspection notes, approved plan | `1->2:wipe`, `2->3:slide-x`, `3->4:scale-fade`, `4->5:hard-cut` | reserved | blueprint sheet tabs |
| 06 | Kinetic Type Punchline | One Constraint Wins | loud constraint, false options, compressed proof, punchline, afterimage | `1->2:glitch`, `2->3:slide-y`, `3->4:scale-fade`, `4->5:hard-cut` | motion | typographic beat stamps |
| 07 | Sketch Board Emoji | Human Loop Retrofit | messy board, actor map, intervention, shared rhythm, open loop | `1->2:slide-x`, `2->3:scale-fade`, `3->4:wipe`, `4->5:fade` | motion | hand-drawn sticker dots |
| 08 | Spotlight Quote Poster | The Sentence We Keep | dark stage, first quote, evidence shadow, edit to essence, final hold | `1->2:fade`, `2->3:scale-fade`, `3->4:fade`, `4->5:hard-cut` | reserved | dim footlight ticks |

## Band 2: Balanced Hybrid

| Style | Guide | v2 topic | Scene arc | Edge transitions | Beat mode | Internal nav |
|---|---|---|---|---|---|---|
| 09 | Subway Map of Intent | Three Tracks to One Release | route map, parallel work, transfer station, convergence, arrival | `1->2:slide-x`, `2->3:wipe`, `3->4:slide-x`, `4->5:fade` | reserved | transit stop picker |
| 10 | Benchmark Matrix | Choosing the Durable Tool | criteria, contenders, matrix reveal, tie-break, verdict | `1->2:fade`, `2->3:wipe`, `3->4:scale-fade`, `4->5:hard-cut` | reserved | matrix corner tabs |
| 11 | Signal Pipeline Flow | From Event to Insight | signal source, routing, transform, alert, closed loop | `1->2:slide-x`, `2->3:glitch`, `3->4:wipe`, `4->5:scale-fade` | motion | pulsing route nodes |
| 12 | Soft Pastel Friendly | Onboarding That Breathes | welcome, first task, helpful nudge, confidence, habit | `1->2:scale-fade`, `2->3:slide-y`, `3->4:fade`, `4->5:scale-fade` | reserved | soft pill carousel |
| 13 | Kitchen Prep Station | Raw Notes to Clean Brief | ingredients, mise en place, simmer, plate, recipe card | `1->2:slide-y`, `2->3:wipe`, `3->4:scale-fade`, `4->5:fade` | motion | recipe-step magnets |
| 14 | Collaborative Pairing Board | Two Teams, One Artifact | pair setup, handoff gap, shared board, sync cadence, paired result | `1->2:fade`, `2->3:slide-x`, `3->4:wipe`, `4->5:scale-fade` | reserved | dual-column scene latch |
| 15 | Studio Mixing Console | Tuning the Operating Model | faders, noisy input, balanced mix, saved preset, master bus | `1->2:slide-y`, `2->3:glitch`, `3->4:scale-fade`, `4->5:hard-cut` | motion | mini fader rail |
| 16 | Debug Reaction Board | The Incident Learns | red signal, trace, hypothesis board, patch proof, monitor | `1->2:glitch`, `2->3:slide-x`, `3->4:wipe`, `4->5:hard-cut` | motion | status LED column |

## Band 3: Editorial and Print

| Style | Guide | v2 topic | Scene arc | Edge transitions | Beat mode | Internal nav |
|---|---|---|---|---|---|---|
| 17 | Front Page Broadsheet | The Morning After Launch | masthead, lead story, sidebars, correction, second edition | `1->2:page-flip`, `2->3:slide-y`, `3->4:wipe`, `4->5:fade` | reserved | newspaper folio marks |
| 18 | Magazine Masthead | A Product Gets a Cover | cover, feature quote, spread, fashion detail, back-page line | `1->2:scale-fade`, `2->3:page-flip`, `3->4:slide-x`, `4->5:fade` | motion | masthead issue strip |
| 19 | Warm Editorial Feature | Notes from a Useful Week | opener, interview, scene detail, lesson, closing pull quote | `1->2:fade`, `2->3:slide-y`, `3->4:scale-fade`, `4->5:page-flip` | reserved | margin chapter tabs |
| 20 | Scholars' Vellum | The Argument in the Margins | thesis, source text, marginalia, counterpoint, conclusion | `1->2:fade`, `2->3:wipe`, `3->4:page-flip`, `4->5:hard-cut` | reserved | vellum side bookmarks |
| 21 | Solar Biennale Poster | Public Light Program | poster, installation map, visitor path, critique, exhibition close | `1->2:scale-fade`, `2->3:wipe`, `3->4:slide-x`, `4->5:fade` | motion | solar orbit ticks |
| 22 | Duotone Session | Five Takes in the Room | sleeve, take one, producer note, final mix, liner note | `1->2:slide-x`, `2->3:fade`, `3->4:glitch`, `4->5:scale-fade` | motion | vinyl groove markers |
| 23 | Riso Print Zine | A Community Prints Itself | cover, cut list, spread, overprint, fold-out | `1->2:glitch`, `2->3:slide-y`, `3->4:wipe`, `4->5:hard-cut` | motion | misregistered staple dots |
| 24 | Analog Cutout Collage | The Archive Reassembled | fragments, found note, taped sequence, new pattern, wall view | `1->2:scale-fade`, `2->3:slide-x`, `3->4:wipe`, `4->5:fade` | motion | paper scrap wheel |

## Band 4: Craft and Cultural Traditions

| Style | Guide | v2 topic | Scene arc | Edge transitions | Beat mode | Internal nav |
|---|---|---|---|---|---|---|
| 25 | Woodblock Floating World | Tide Map for a Team | harbor, current, bridge, calm crossing, seal | `1->2:wipe`, `2->3:slide-x`, `3->4:fade`, `4->5:hard-cut` | motion | vermilion seal index |
| 26 | Botanical Specimen Plate | Classifying Growth Signals | specimen, taxonomy, comparison, annotation, plate label | `1->2:fade`, `2->3:wipe`, `3->4:scale-fade`, `4->5:page-flip` | reserved | pressed-leaf markers |
| 27 | Machine-Age Deco | The Infrastructure Gala | marquee, mechanism, capacity, ceremony, skyline | `1->2:slide-y`, `2->3:scale-fade`, `3->4:wipe`, `4->5:hard-cut` | reserved | stepped brass elevator |
| 28 | Expedition Screenprint | Field Route to the Signal | trailhead, map legs, weather, discovery, stamp | `1->2:slide-x`, `2->3:wipe`, `3->4:fade`, `4->5:scale-fade` | motion | map coordinate rail |
| 29 | Cassette-Era Packaging | The Release Mixtape | j-card, side A, side B, levels, rewind | `1->2:slide-x`, `2->3:glitch`, `3->4:slide-y`, `4->5:hard-cut` | reserved | cassette window counter |
| 30 | Neo-Brutalist Bulletin | Shipping the Hard Thing | taped thesis, blocker, blunt plan, evidence, poster wall | `1->2:hard-cut`, `2->3:slide-x`, `3->4:wipe`, `4->5:glitch` | motion | concrete tab punches |
| 31 | Red Wedge Agitprop | Move the Org Chart | wedge, opposition, mobilization, proof, call | `1->2:slide-x`, `2->3:glitch`, `3->4:scale-fade`, `4->5:hard-cut` | motion | diagonal wedge rail |
| 32 | Mechanical Scoring Funnel | Prioritize Without Debate | hopper, scoring lanes, reject chute, winner bin, scoreboard | `1->2:slide-y`, `2->3:wipe`, `3->4:glitch`, `4->5:hard-cut` | motion | pinball lane lights |

## Band 5: Contemporary Digital

| Style | Guide | v2 topic | Scene arc | Edge transitions | Beat mode | Internal nav |
|---|---|---|---|---|---|---|
| 33 | Liquid Glass | Spatial Product Brief | glass shell, layers, gesture, trust, product glow | `1->2:scale-fade`, `2->3:slide-x`, `3->4:wipe`, `4->5:fade` | reserved | floating glass chips |
| 34 | Retro Windows | The Toolchain Desktop | boot, windows, conflict dialog, fixed workflow, shutdown | `1->2:hard-cut`, `2->3:glitch`, `3->4:slide-x`, `4->5:hard-cut` | reserved | taskbar scene buttons |
| 35 | Mid-Century Grove | A Calmer Growth Model | grove, canopy layers, resource flow, seasonal check, path | `1->2:fade`, `2->3:slide-y`, `3->4:scale-fade`, `4->5:fade` | motion | wooden bead rail |
| 36 | After-Hours Luxe | Private Beta Salon | door, guest list, velvet demo, whispered proof, nightcap | `1->2:scale-fade`, `2->3:wipe`, `3->4:fade`, `4->5:hard-cut` | reserved | cocktail coaster picker |
| 37 | Operating Manual | Runbook for the New Habit | command, steps, warning, verification, done | `1->2:hard-cut`, `2->3:slide-y`, `3->4:glitch`, `4->5:hard-cut` | reserved | terminal prompt index |
| 38 | Widescreen Title Card | Five Acts of a System | title, inciting input, midpoint, reveal, end card | `1->2:fade`, `2->3:slide-x`, `3->4:scale-fade`, `4->5:hard-cut` | reserved | letterbox cue marks |
| 39 | Blackboard Chalk Talk | Derive the Shortcut | question, formula, worked example, simplification, boxed answer | `1->2:wipe`, `2->3:slide-y`, `3->4:fade`, `4->5:hard-cut` | motion | chalk tick marks |
| 40 | Arcade Boss Fight | Defeat the Latency Boss | boss intro, attack pattern, power-ups, final combo, score | `1->2:glitch`, `2->3:slide-x`, `3->4:scale-fade`, `4->5:hard-cut` | motion | HUD life pips |

## Band 6: Text Report

| Style | Guide | v2 topic | Scene arc | Edge transitions | Beat mode | Internal nav |
|---|---|---|---|---|---|---|
| 41 | Research Memo | Evidence for a Smaller Team | question, method, findings, recommendation, memo line | `1->2:fade`, `2->3:wipe`, `3->4:scale-fade`, `4->5:hard-cut` | reserved | memo section tabs |
| 42 | Decision Record | Choose the Boundary | context, options, decision, consequences, verification | `1->2:fade`, `2->3:slide-y`, `3->4:wipe`, `4->5:hard-cut` | reserved | ADR sidebar index |
| 43 | Maintainer Issue Brief | Ready for Agent Pickup | issue, repro, scope, fix plan, acceptance | `1->2:hard-cut`, `2->3:slide-y`, `3->4:wipe`, `4->5:hard-cut` | reserved | ticket status chips |
| 44 | Field Notes Report | Station Platform Study | field cover, observations, equipment, patterns, next walk | `1->2:fade`, `2->3:slide-y`, `3->4:scale-fade`, `4->5:page-flip` | motion | notebook edge flags |
| 45 | Annotated Source & Diff | Rewrite the Broken Flow | before, diff, annotation, after, proof | `1->2:slide-x`, `2->3:wipe`, `3->4:scale-fade`, `4->5:hard-cut` | reserved | diff hunk navigator |
| 46 | Checklist Ledger | Launch Gate Ledger | cover, checklist, exceptions, owner list, signoff | `1->2:fade`, `2->3:slide-y`, `3->4:wipe`, `4->5:hard-cut` | reserved | ledger check rail |
| 47 | Context Bento Box | Handoff in Six Compartments | bento cover, constraints, assets, risks, receipt | `1->2:scale-fade`, `2->3:wipe`, `3->4:slide-x`, `4->5:fade` | reserved | compartment selector |
| 48 | Object Metaphor Hero | The Recovery Kit | object reveal, parts, assembly, field test, kit closed | `1->2:scale-fade`, `2->3:slide-y`, `3->4:wipe`, `4->5:hard-cut` | motion | object-part orbit |

