---
status: accepted
date: 2026-07-10
---

# Curate the 49-Topic set before parallel production

The next Topic Set will add one new Topic to each of the 49 registered Styles.
We will curate the complete assignment matrix before delegating implementation,
because independent agents given only Style DNA tend to converge on similar
subjects, card layouts, navigation bars, fade-up animation, and scene
transitions.

## Content decision

The Topic Set is a curated cross-domain anthology, not 49 unrelated prompts and
not 49 interpretations of one umbrella story. It uses a 7×7 orthogonal matrix:

- **Content Territories**: Universe & Deep Time; Earth, Ocean & Weather; Life &
  Evolution; Materials, Craft & Food; Cities, Machines & Infrastructure; Sound,
  Body & Ritual; Memory, Language & Hidden History.
- **Narrative Archetypes**: Scale Journey; Cutaway Decoding; Path Tracing;
  Material Transformation; Evidence Investigation; Dual-Force Conflict; Chorus
  of Examples.

Every Content Territory uses every Narrative Archetype exactly once. Each Topic
is a fact-driven micro-documentary with a clear claim: roughly 70% evidence and
30% interpretation, with no invented facts, numbers, people, quotations, or
historical conclusions. Subjects must be distinct from both existing Topic
collections and from one another; software-product launches, AI workflows,
metrics, roadmaps, team process, and similar overused material are excluded by
default.

## Visual decision

Viewing Mode and Visual Engine are independent axes. Viewing Mode controls
density and readability; Visual Engine controls how imagery is produced. A
speaker-led Topic may derive impact from giant type, Emoji character acting,
direct SVG drawing, hand-drawn reasoning, geometric force, material behavior,
photography and light, a working physical metaphor, or another Style-specific
medium. “Visual impact” is therefore not an implementation category.

Each assignment row must name a primary Visual Engine, secondary accent,
signature visual metaphor, material-specific motion verbs, and a forbidden
default. Design DNA invariants are authoritative; existing implementations may
be reused as mechanism references, but old showcase thumbnails are not layout,
navigation, or motion templates.

The **Style Fit Veto** resolves conflicts between collection-level symmetry and
an individual Style's identity: Style DNA, comprehension, reading safety, and
accessibility outrank soft distribution targets. The 7×7 content matrix,
fact-accuracy requirements, global specificity/fit/intensity counts, and the
one-Topic-per-Style scope remain hard constraints. Any veto exception must
record the invariant, harm if forced, swaps attempted, accepted deviation, and
reviewer.

Viewing Mode also constrains motion. Editorial-reading and evidence-report
Topics remain at intensity 1–2, settle before reading begins, and do not loop.
Stage impact may be near-static; scale, type, light, or one object can provide
impact without movement.

## Motion and transition decision

Topic-level Motion Intensity follows a restrained distribution:

| Intensity | Topic count |
|---|---:|
| 1/5 near-static | 7 |
| 2/5 restrained | 14 |
| 3/5 balanced | 14 |
| 4/5 expressive | 10 |
| 5/5 showcase | 4 |

Every Topic has at least one quiet Scene and no more than two peak-intensity
Scenes. Beat motion stays below Scene-transition intensity and must explain a
state change rather than decorate it.

Scene motion uses twelve named languages—type choreography, stroke drawing,
line drawing/growth, shape morph, character acting, material operations, object
mechanics, camera/light, path/topology, data/instrument, document/evidence, and
environmental life. A Topic has one primary and at most one secondary language;
generic fade-up is only an auxiliary or fallback.

The shared transition vocabulary will expand from the current eight primitives
to 21 primitives across seven families: editing, spatial push, camera depth,
mask/aperture, material surface, structural reconfiguration, and signal/time.
Each Topic receives a unique four-edge Transition Score using two or three
families. Seven controlled Signature Effects—one per Content Territory—may add
Style-specific expression while retaining shared lifecycle and deterministic
reduced-motion fallback. Topic components must not create their own outgoing
clone lifecycle.

At decision time, the 21-primitives vocabulary was a planned infrastructure
expansion rather than a claim about runtime support. That expansion has since
landed: the shared track now exposes all 21 canonical primitives while retaining
the legacy kinds for existing Topics. A Signature Effect remains an edge
modifier over a shared primitive and may not replace that fallback lifecycle.

## Navigation decision

Internal Navigation uses a three-axis matrix rather than a repeated bar:

- **Geometry families**: ambient, edge scale, path, object controller, card or
  miniature, typographic index, and spatial node.
- **Invocation behaviors**: persistent, auto-hide, proximity reveal,
  click-expand, drag or scrub, keyboard focus, and gesture or hold.
- **Feedback behaviors**: active glow, history trail, next-state preview,
  mechanical displacement, geometry reflow, material or color change, and
  typographic emphasis.

Each of the 49 Topics receives one named navigation geometry and a unique
combination of invocation and feedback. Navigation remains absolute,
thumbnail-safe, keyboard/touch accessible, and independent of the selected
Scene transition.

The three axes stay semantically separate: the carrier name describes geometry
only and must not encode hold, keyboard focus, glow, trails, or another
invocation/feedback behavior. Invocation controls enhanced reveal or handling,
never the sole means of access; ordinary click/tap and keyboard navigation
remain available.

## Production gate

No 49-agent implementation wave starts until the user confirms a 49-row
assignment matrix covering Topic, Content Territory, Narrative Archetype,
Viewing Mode, Visual Engine, Scene-level visual plan, Motion Intensity,
Navigation Language, and Transition Score. Future implementation agents receive
those assignments as constraints rather than inventing them independently.
The complete proposed matrix and production gates live in
`docs/CROSS_DOMAIN_TOPIC_SET_PLAN.md`.

The user confirmed the matrix and authorized implementation on 2026-07-10.
Production therefore proceeds as 49 independent Topic tasks with centralized
integration. The first 21 Topics shipped in seven historical three-Topic
commits. The user then aligned production concurrency and commit scope: the
remaining 28 Topics use logical commit batches of 10, 10, and 8. The first
10-Topic batch started all unfinished Topics concurrently under the
instruction active at that time. Starting with the second 10-Topic batch,
production is capped at four Topic agents concurrently and refills a slot
whenever one finishes. Concurrency does not change commit scope: each batch is
integrated, reviewed, committed, and pushed only after all of its Topics pass.

All three remaining logical batches are now integrated. The completed registry
contains 146 Topics, including all 49 independently produced cross-domain Topics.

## Considered alternatives

- **Forty-nine unrelated prompts** maximized local freedom but provided no
  collection-level defense against semantic and visual repetition.
- **One umbrella story in 49 Styles** created coherence but repeated the same
  argument and scene structure.
- **Only the existing transition primitives** was maintainable but too narrow
  for 49 new four-edge scores.
- **Fully bespoke transition lifecycles per Topic** maximized novelty but made
  interruption, frozen mode, reduced motion, and audit behavior inconsistent.
- **Immediate parallel delegation** optimized throughput before the design was
  stable and therefore amplified convergence risk.

## Consequences

Planning takes longer before implementation, but later agents receive bounded,
non-overlapping creative briefs. Review can test diversity against explicit
axes instead of relying on subjective impressions after all 49 Topics are
already built.
