# Frontend Harness Slides Workbench

This is the repository's sole agent, maintenance, and authoring manual.

## Authority and documentation

- Source and tests define current behavior.
- `CONTEXT.md` is the domain glossary only. Keep implementation details out.
- `docs/adr/` records durable, hard-to-reverse decisions and their rationale.
  Supersede changed decisions instead of rewriting history.
- `README.md` and `README.zh-CN.md` are the public entry points and must remain
  aligned. `SECURITY.md` is the sole GitHub security-policy exception.
- Do not create separate plans, reports, handoffs, maintenance guides, or
  authoring manuals in the repository. Fold durable content into these files.
- Never publish fixed Style, Topic, or Model counts. Derive changing quantities
  from the Catalog.

## Repository workflow

Work directly on `main` unless the user says otherwise. Commit and push the
requested change without creating a feature branch, worktree, PR, or MR.

Use Patrick Fu's identity for personal commits:

```bash
git -c user.name="Patrick Fu" -c user.email="paaatrickfu@gmail.com" commit
```

Inspect status before and after the change, stage only task files, and run the
validation appropriate to the change. Explicit user instructions override
this default workflow.

## Domain and Catalog contracts

- A Style has one semantic kebab-case ID, canonical bilingual name, and Band in
  `src/catalog/style-definitions.ts`. Topics reference it through `styleId`.
- A Topic is one independent presentation. It has a globally unique semantic
  kebab-case ID, bilingual title, exact Model ID, static bilingual metadata,
  protocols, and one Stage implementation.
- Model ID records provenance only. It must match `MODEL_IDS` exactly and must
  not select schemas, registration paths, content, layout, motion, navigation,
  loading, or runtime behavior.
- Catalog Model filters include only Model IDs used by registered Topics and
  order them by first Registry appearance. Models own no order field.
- `src/catalog/topic-registry.ts` is the only hand-maintained ordering source.
  Its outer array orders Style Groups; each inner array contains Topics of one
  Style in Topic order. Flattened order drives Catalog and Player progression.
- IDs, filenames, exports, metadata, and Styles must not encode ordinals,
  versions, batches, ranks, or primary/secondary tiers.
- Topic metadata is static and bilingual. English and Chinese use identical
  Scene IDs, Beat IDs, and story states, while copy and layout may be localized.
- Every Topic follows the five-Scene authoring structure. Beat counts remain
  metadata-defined.

## Module boundaries

- `src/domain` owns Topic, Style, Model, Evidence, Source, and Stage contracts.
- `src/catalog` owns Style definitions, the authoring Registry, generated
  Manifest, runtime Registry, Publication Plan, and lazy Topic loading.
- `src/topics` contains production Topic implementations, focused tests, and
  optional same-basename CSS modules. Keep it flat and do not add a barrel.
- `src/testing` owns shared Topic contract test support.
- `src/navigation` is the only query-routing and History authority.
- `src/envelope` is the only responsive Workbench interface family.
- `src/player` is the only Player Runtime owner.
- `src/App.tsx` composes providers and top-level boundaries; it must not
  reconstruct Catalog, navigation, Envelope, or Player behavior.
- Do not restore `src/styles`, monolithic `src/types.ts`, compatibility
  re-exports, dual Registries, manual loader maps, or legacy chrome/layout
  families.

## Topic authoring

Before editing an existing Topic, read that Topic, its focused test, and the
shared contracts it uses. Before adding a Topic, follow `Adding Topics`; an
Author Worker must not inspect other Topic implementations for inspiration.

- Use the Topic ID as the basename for the implementation, focused test,
  optional CSS module, and committed showcase WebP.
- A Topic module default-exports exactly one `TopicDefinition` created with
  `defineTopic`. Its private React component is named `TopicStage`.
- `TopicDefinition` owns identity, `modelId`, static `metadata.en` and
  `metadata.zh`, Stage, navigation, transition score, and Evidence.
- Do not expose `getMetadata`, redundant title fields, model-specific exports,
  compatibility aliases, or Topic-specific registration interfaces.
- Topic IDs remain stable when a Topic moves between Styles. Change `styleId`
  and Registry position without renaming the Topic or companion files.
- Preserve Topic-visible copy, values, sources, assets, fonts, colors, layout,
  Scene/Beat order, interactions, motion, and transitions during contract or
  architecture maintenance unless the user explicitly requests a redesign.
- Shared Stage behavior belongs in the owning component, hook, or runtime
  module rather than in a model- or batch-specific adapter.

## Adding Topics

Use this guide whenever adding one or more slide presentations. The canonical
repository term is Topic; “Slides” describes the user-facing artifact, not a
second domain type.

### Authority and production scope

Invoke the current `frontend-harness-slides` skill before authoring. Its
[Style Selection Index](https://github.com/patrick-fu/frontend-harness-slides/blob/main/references/style/index.md)
and per-Style Design DNA files are the visual source of truth. Always read the
latest available skill content; do not pin or copy it into this repository.

- The Style Guide owns visual thesis, temperament, material, signature
  gestures, motion register, Identity Invariants, and creative freedoms.
- `src/catalog/style-definitions.ts` owns only runtime Style ID, bilingual
  name, and Band.
- Existing Workbench Topics are not Style authorities. A Coordinator may
  inspect them for portfolio de-duplication; an Author Worker must not use them
  as implementation references.
- Resolve Design DNA through the Style Index and canonical English Style name;
  do not assume its filename equals the Workbench Style ID. Record the resolved
  file in every Authoring Packet. If the mapping is missing or ambiguous, stop
  and repair it before authoring.

A **Production Run** is temporary execution scope, never a persisted domain
entity. Do not write a run, Set, batch, or version ID into Topic metadata,
files, URLs, Registry entries, or UI.

Choose one scope:

- **Single Topic Run**: add one Topic to one Style.
- **Selected Topics Run**: add a user-selected set of Topics or Styles.
- **Model Coverage Run**: add exactly one Topic for every current Style, with
  one exact Model ID across all newly authored Topics.

A Model Coverage Run does not make that Model ID unique to those Topics and
does not create a collection identity. Re-read the current Style list before
declaring coverage complete; if a Style was added during the run, add its Topic
or stop calling the result full coverage. New Topics append to their Style
Group by default; special placement changes only the two-dimensional Registry.

### Roles and originality boundary

**Coordinator**:

- Reads the current Style Guide, Registry, Manifest, Topic metadata, showcase
  WebPs, and only the existing Topic implementations needed to resolve a real
  similarity risk.
- Plans Topic-to-Style allocation and the portfolio's narrative, density,
  motion, transition, navigation, Evidence, and interaction distribution.
- Produces Authoring Packets, obtains user approval, keeps the run's external
  execution record, and owns the Portfolio Gate.

**Author Worker**:

- Reads the latest `frontend-harness-slides` skill, its Style index, the
  assigned Style's Design DNA, the approved Authoring Packet, `src/domain`,
  essential shared Stage/runtime interfaces, user sources, and authoritative
  external factual sources.
- Reads only its assigned Topic family plus the neutral shared interfaces
  required to integrate it, and modifies only the assigned Topic family.
- Must not inspect other `src/topics` implementations, focused tests, CSS,
  showcase WebPs, historical branches, or ready-made slide decks for visual or
  implementation guidance.
- Creates the Topic's concrete copy, layout, visual metaphor, animation,
  transition expression, interaction, and assets independently.

**Integrator**:

- Owns shared files such as Style definitions, Registry, generated Manifest,
  scripts, and cross-Topic integration tests.
- May repair imports, types, contract wiring, URL integration, tests, Frozen
  behavior, and other mechanical conformance problems.
- Must not redesign Topic copy, layout, color, visual metaphor, motion,
  transition, interaction, or density. Return creative failures to a Worker
  using the target model.

**Reviewer**:

- Checks an individual Topic without rewriting it, then checks the new
  portfolio as a whole.
- May inspect all relevant Topics and previews because review is not authoring.

Coordinator, Integrator, and Reviewer identity is not Topic provenance. The
Topic's `modelId` records its primary authoring model. Other models may plan,
review, or make mechanical repairs without changing it; they may not take over
the Topic's creative authorship. A full Model Coverage Run uses the target
model for every Author Worker.

For a Single Topic Run, a user-approved brief may replace a separate
Coordinator. The Author Worker remains isolated from existing Topics, and the
Reviewer performs the similarity check after authoring.

### Pre-build alignment and planning

For one Topic, complete the normal `frontend-harness-slides` Pre-Build
Alignment and approve one Authoring Packet. For multiple Topics, the
Coordinator completes one aggregate alignment covering the Portfolio Matrix,
packets, repository location, build, testing, previews, and delivery. User
approval of that aggregate plan satisfies the Workers' alignment gate; Workers
do not repeat the same questions.

Plan all selected Topics before parallel authoring begins. Changes remain
possible, but the Coordinator updates the matrix and checks downstream
distribution before replacing a Topic or constraint.

Use external durable tracking for a Model Coverage Run. An issue tracker,
Codex task/tickets, or another recoverable system should record the matrix,
ownership, state, blockers, and gate results. If no tracker exists, use an
untracked temporary file. Never commit run plans, status reports, or temporary
matrices to this repository.

When the target model has not produced stable Workbench Topics before, a small
Calibration Pilot across meaningfully different Styles is strongly
recommended. It validates contract, bilingual metadata, Evidence, Frozen
behavior, tests, and packet clarity. Pilot Topics may enter the final coverage,
but their code and visuals are not shown to later Workers as examples.

Parallelize independent authoring where useful. The Coordinator chooses
concurrency, task size, and waves for the available environment; this guide
does not fix a worker count or one-Topic-per-task rule. Avoid concurrent edits
to shared integration files.

### Portfolio Matrix

Before a Selected Topics or Model Coverage Run begins, give every planned Topic
one row containing:

- Style ID and Style Guide file.
- Proposed Topic ID and bilingual title direction.
- Core question, audience, and key takeaway.
- Narrative structure and five-Scene story direction.
- Content density target.
- Motion intensity and motion character.
- Transition rhythm or transition family.
- Primary visual metaphor.
- Signature interaction or expressive device.
- Internal Navigation expectation.
- Evidence kind, source needs, and factual risk.
- Style-fit rationale.
- Similar existing or planned Topics to avoid.

Maximize portfolio diversity rather than satisfying mechanical quotas. Topic
and core question must be distinct, and no two planned Topics should share the
same overall combination of narrative structure, density, motion, transition,
visual metaphor, and signature device. Individual techniques may repeat when
they genuinely fit the Style; explain concentrated repetitions instead of
forcing an unsuitable alternative.

### Authoring Packet template

Give each Author Worker a self-contained packet. Do not include existing Topic
screenshots, source, tests, CSS, or implementation links.

```text
Style
- ID:
- Design DNA file:
- Style-fit rationale:

Topic
- Proposed ID:
- English / Chinese title direction:
- Core question:
- Audience:
- Key takeaway:
- Five-Scene story direction:
- Exact Model ID:

Must Hold
- Style Identity Invariants:
- Content density target:
- Motion intensity and character:
- Transition rhythm or family:
- Internal Navigation requirement:
- Evidence kind and required sources/boundary:
- Similarity risks to avoid:
- Workbench contract, URL, Frozen, test, and file requirements:

Creative Freedom
- Copy and detailed argument:
- Scene composition and layout:
- Visual thesis and metaphor:
- Color/type choices within Design DNA:
- Animation trajectories and timing:
- Concrete transition expression:
- SVG, charts, objects, and decorative system:
- Interaction details and signature device:
```

“Must Hold” expresses goals and constraints, not a pixel-level solution,
component tree, animation script, or template. Anything not explicitly fixed
there remains the Author Worker's creative decision.

### Interface-only skeleton

Read the current domain types before using this shape. It deliberately omits
Scene JSX and all visual decisions; never copy metadata or protocol values from
another Topic.

```tsx
import {
  defineTopic,
  type TopicMetadata,
  type TopicStageProps,
  type TopicTransitionScore,
} from "../domain/topic";

const metadata: { en: TopicMetadata; zh: TopicMetadata } = {
  en: /* authored five-Scene metadata */,
  zh: /* structurally aligned authored metadata */,
};

const transitionScore: TopicTransitionScore = {
  "1->2": /* authored transition */,
  "2->3": /* authored transition */,
  "3->4": /* authored transition */,
  "4->5": /* authored transition */,
};

function TopicStage(props: TopicStageProps) {
  // Author the independent fixed-stage presentation here.
}

export default defineTopic({
  id: /* semantic Topic ID */,
  styleId: /* assigned Style ID */,
  title: /* bilingual Topic title */,
  modelId: /* exact primary authoring Model ID */,
  Stage: TopicStage,
  metadata,
  navigation: /* authored navigation contract */,
  transitionScore,
  evidence: /* authored Evidence */,
});
```

Every Topic also receives a same-basename focused test that imports the default
definition and starts with the shared contract:

```tsx
import { runTopicContract } from "../testing/topic-contract";
import definition from "./topic-id";

runTopicContract(definition);
```

Add Topic-specific assertions for content, interaction, motion, and Evidence
where they encode meaningful intent.

### Runbooks

**Single Topic Run**:

1. Confirm Style, Topic brief, Model ID, scope, delivery, and testing.
2. Read the latest Style index and assigned Design DNA.
3. Approve one Authoring Packet without showing other Topics to the Worker.
4. Author independently, run focused checks, and hand off to Integrator.
5. Pass Topic Gate, similarity review, Integration Gate, and production smoke.

**Selected Topics Run**:

1. Coordinator inspects the current portfolio and relevant Style DNA files.
2. Complete and approve the Portfolio Matrix and all Authoring Packets.
3. Author independent Topics in parallel where useful.
4. Run Topic Gate per Topic and Portfolio Gate before each integration batch.
5. Integrate only complete Topics, then run the final cross-Topic checks.

**Model Coverage Run**:

1. Create external durable tracking and resolve the current Style list.
2. Confirm the target Model ID and one planned Topic per Style.
3. Coordinator reads the latest Style Guide and existing portfolio, completes
   the full matrix, and obtains one user approval.
4. Run a Calibration Pilot when useful, without sharing its implementation
   with later Workers.
5. Dispatch isolated Authoring Packets and parallelize where practical.
6. Integrate complete, reviewed Topics in small batches; partial Topics never
   enter `main`.
7. Re-read the Style list, close missing coverage, run the final Portfolio and
   Integration Gates, and only then declare coverage complete.

### Gates and incremental integration

**Topic Gate** verifies:

- The assigned brief and Style Identity Invariants are recognizable.
- The Topic is original rather than a visual reskin of an existing argument.
- Both languages have aligned five-Scene structure and meaningful Beats.
- Navigation, transitions, Evidence, Sources, Frozen behavior, and interaction
  isolation match the authored intent.
- The focused test passes and the Hero Final Frame is complete and settled.

**Portfolio Gate** verifies:

- Topic, narrative, density, motion, transition, metaphor, navigation, and
  signature-device distribution remains diverse.
- Adjacent or semantically close Topics have distinct audience value and
  conclusions.
- Repetition is Style-appropriate rather than accidental convergence.
- The Coordinator may reject a technically passing Topic for portfolio
  similarity and return it to the target model for a local creative revision.

**Integration Gate** verifies:

- Topic files, exact Model ID, Style membership, Registry placement, generated
  Manifest, focused test, and showcase WebP are complete.
- Only affected Topic previews were captured manually; unrelated WebPs remain
  untouched.
- Required `npm run ci` and browser audits pass.
- Model filters, direct Topic/Scene/Beat URLs, both languages, Frozen/Pure, and
  production loading work for the new Topics.

Complete Topics may be committed and pushed to `main` in small validated
batches. Never push placeholders, missing previews, unregistered files, or
half-integrated contracts. Until every current Style passes all gates, describe
a Model Coverage Run as in progress rather than complete.

## Envelope and Stage

- The Envelope owns Catalog and Player chrome, headers, rail, transport,
  global controls, More menu, Library Drawer, Command Palette, Controls Guide,
  global shortcuts, modal focus, responsive layout, and font preloading.
- When Filters are active, the Player Envelope owns a persistent Cycle Scope
  Indicator with the matching Topic count, compact selected Band and Model
  labels, Filter editing, and an explicit clear action. Collapse it on narrow
  screens and warn when the selected Topic is outside the Cycle Scope. Do not
  render it when no Filters are active; instead keep a compact Filter entry in
  the Player Top Bar. Hide both with the rest of the Envelope in Pure.
- Keep the cross-Topic announcement visible for 3000 ms. Reduced motion may
  remove its movement but must not shorten its readable duration.
- The Stage is a fixed `1920×1080` canvas fitted with contain-style scaling. It
  is not reflowed or cropped for surrounding chrome.
- Stage content uses Stage-relative container-query units such as `cqw` and
  `cqh`, stays inside the Stage root, and does not use viewport layout units.
- A Topic communicates outward only through `TopicStageProps` and absolute
  `onNavigate(scene, beat)` destinations.
- Honor `isThumbnail` and `reducedMotion`. Thumbnail, reduced-motion, and
  Frozen paths must settle deterministically and disable layout motion.
- Pure removes Envelope output while keeping the active Stage mounted.
- Pure keeps Filter query state but neither renders the Cycle Scope Indicator
  nor crosses Topic boundaries. Exiting Pure restores the Indicator and Cycle
  Scope without changing Filters.
- Player touch gestures apply only to coarse-pointer mobile screens. Never map
  wheels, trackpads, or mouse movement to swipe navigation. Preserve guards for
  prevented, modified, non-primary, interactive-target, cancelled, and
  recent-touch synthetic input.

## Navigation and History

All shareable state uses query parameters, never URL fragments:

- `view=overview` selects Catalog; `view=lab` selects Player.
- `style` and `topic` select the canonical Topic destination.
- `scene` and `beat` select the metadata-defined presentation position.
- Repeated `band` and `model` values filter the Catalog and derive the
  Registry-ordered Player Cycle Scope.
- `lang`, `pure`, and `frozen` preserve language and display state.

Navigation callers dispatch semantic intents. They must not mutate query
strings directly or create a second movement helper.

- Resolve a known global Topic ID even when its Style query is stale; replace
  the Style with the Topic's current `styleId` without adding History.
- Preserve unknown filter values as unresolved criteria rather than silently
  broadening results.
- Keep a directly selected Topic visible when it falls outside the active
  Cycle Scope. Its Scene and Beat navigation remains available; the next
  cross-Topic move enters the nearest matching Topic in that direction.
- When the Cycle Scope is empty, do not fall back to all Topics. Stop at the
  Topic boundary and offer an explicit way to clear Filters.
- Apply the Cycle Scope to sequential cross-Topic movement from Player
  transport, keyboard, mobile swipe, and Topic Switcher. Keep Library Drawer,
  Command Palette, and search global direct-navigation surfaces; mark
  out-of-scope destinations rather than hiding them.
- Clamp Scene and Beat against active Topic metadata.
- Entering or leaving Player creates History. Topic changes within Player,
  filters, position, language, display modes, and stale-Style repair replace
  the current entry.
- Apply Player Filter edits immediately, keep the editor open for multi-select,
  recompute the Cycle Scope and count live, and never redirect the selected
  Topic merely because it becomes out of scope. Clearing Filters clears both
  Band and Model criteria in one replace-state update.
- Catalog scroll position is non-shareable return context in `history.state`.
  Preserve unrelated History state.

## Topic protocols

- Every Topic explicitly declares navigation, all four Scene transitions, and
  Evidence. Missing fields never imply defaults.
- Navigation uses either `mode: "none"` or an accurate profile describing the
  rendered geometry, carrier, invocation, and feedback.
- Internal Navigation requests absolute destinations, remains keyboard and
  pointer accessible, stops events from leaking to Player transport, and is
  hidden in thumbnails.
- `SpatialSceneTrack` owns active/outgoing Scene lifecycle, interruption, and
  reduced-motion fallback. Topics choose transition expression without
  creating outgoing clones or timers.
- Multi-Beat Scenes declare reserved or intentional motion layout. Beats must
  represent story states rather than decorative fades.
- Evidence uses `none`, `illustrative`, `facts`, or `mixed`. Facts and mixed
  Evidence own Sources; illustrative and mixed Evidence own bilingual
  interpretation boundaries.
- Evidence remains domain and audit metadata. The Player must not inject an
  Evidence boundary over the Stage; Topic-authored Stage content remains
  untouched.
- Sources use absolute HTTPS URLs and state the authority, reference, supported
  claim, and relevant boundary. Never invent or overstate support.

## Manifest and showcase workflow

After changing Topic registration, identity, metadata, or module location:

```bash
npm run generate:catalog
```

Commit `src/catalog/manifest.generated.ts` with its source change. Never edit
the generated Manifest manually or make Catalog load every Stage.

Overview cards use committed `public/showcase/{topic-id}.webp` assets. Preview
capture is always manual and explicit:

```bash
npm run generate:showcase-thumbnails -- --topic last-feature-cut
npm run generate:showcase-thumbnails -- --topic last-feature-cut --topic quiet-launch
npm run generate:showcase-thumbnails -- --all
npm run verify:showcase-thumbnails
```

- Ordinary builds, CI, validation, Manifest generation, Model ID changes, and
  non-visual migrations must never capture screenshots.
- Partial capture writes only requested Topics. Full capture and explicit
  cleanup are the only operations allowed to remove orphaned previews.
- Contract-only changes preserve committed WebP bytes.
- `src/catalog/publication-plan.ts` is the sole projection for generated
  Manifest data, dynamic statistics, preview targets, and audit cases.

## Testing and validation

- Every Topic has exactly one focused same-basename test. It imports the
  default definition, runs the shared Topic contract, and retains meaningful
  Topic-specific assertions.
- Registry validation is bidirectional: every entry has one Topic module,
  focused test, and WebP; every production Topic companion belongs to one
  Registry entry.
- `defineTopic` validates local structure. Registry validation rejects invalid
  global IDs, Style membership, Model IDs, grouping, and file coverage rather
  than filling or normalizing data.
- Browser audits cover both languages' Hero Final Frame in Frozen mode with no
  runtime errors, overflow, or unsettled motion.

| Change | Required validation |
| --- | --- |
| Documentation only | Inspect the diff and run `git diff --check`. |
| TypeScript, shared behavior, or tests | Run focused tests, then `npm run ci`. |
| Registry, metadata, identity, or module path | Regenerate the Manifest, then run `npm run ci`. |
| New or intentionally changed visual | Capture only affected previews, verify previews, then run `npm run ci`. |
| Routing, Envelope, Stage, navigation, motion, or responsive behavior | Run `npm run ci` and `npm run test:audit`. |

## Public repository hygiene

- Never commit secrets, tokens, deployment IDs, local absolute paths, `.env`
  files, `.vercel` state, build output, caches, Playwright reports, temporary
  captures, or unrelated generated files.
- Committed showcase WebPs are the narrow approved generated-asset exception.
- Do not hotlink unreviewed assets. Keep licenses, attribution, and source
  claims accurate.
- Keep dependencies and tooling minimal. Do not add formatters, linters, CI
  gates, or broad formatting changes without a task-specific reason.
