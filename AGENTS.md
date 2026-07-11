# Frontend Harness Slides Workbench

This is the sole agent, maintenance, and authoring manual for this repository.

## Authority and durable knowledge

- Current source and tests are authoritative. Inspect the implementation and its
  closest tests before changing a contract or adding an abstraction.
- CONTEXT.md is a glossary only. Do not use it as a roadmap, status report,
  implementation specification, or source of current behavior.
- ADRs record durable architectural decisions and their rationale. When a
  decision changes, add or supersede an ADR; source and tests still define the
  running contract.
- Do not recreate a separate maintenance or authoring guide. Keep this file
  current instead.
- Do not publish hard-coded catalog cardinalities in documentation, badges, or
  workflows. Derive those changing quantities from the registry and metadata.

## Repository workflow

Work directly on main by default. Unless the user says otherwise, make the
requested change, commit it, and push main; do not create a feature branch,
worktree, or pull request.

For personal commits, use this identity:

```bash
git -c user.name="Patrick Fu" -c user.email="paaatrickfu@gmail.com" commit
```

Before a commit, inspect git status, stage only task files, and run the
validation appropriate to the change. A user instruction not to commit or push
overrides the default workflow.

## Domain model

- A Style is a stable visual system with one semantic kebab-case ID, canonical
  bilingual name, and Band declared in the unordered Style definition map.
  Topics reference a Style by styleId and must not redefine Style identity.
- A Topic is one self-contained presentation inside a Style. It has its own
  semantic kebab-case ID, bilingual title, Model ID, metadata, and Stage
  implementation. It is not a version; never add vN IDs or compatibility
  aliases.
- A Model ID records Topic authoring provenance only. It does not select a
  schema, registration path, protocol, or collection identity.
- The single two-dimensional Topic registry is the only ordering authority.
  Outer-array position orders Style Groups; inner-array position orders Topics
  within a Style. Flattened registry position drives Catalog presentation and
  sequential Player navigation. Topic modules, IDs, filenames, metadata, and
  Styles must not encode an ordinal, rank, primary/secondary tier, or version.
- Topic metadata is the source for scene and beat structure, not Style
  identity. English and Chinese metadata must remain structurally aligned:
  identical scene IDs, beat IDs, and story states, with independently
  appropriate copy and layout.
- Each Topic follows the fixed five-scene structure enforced by the authoring
  protocol; beat cardinality remains metadata-defined.

## Envelope and Stage

The application is deliberately split into a responsive Envelope and an
isolated Stage.

- The Envelope owns the Catalog and Player chrome, routing, global controls,
  library/search, transport, and responsive layout. It may use normal browser
  UI units and breakpoints.
- The Stage is a fixed 1920x1080 canvas. Lab View fits it with a contain-style
  scale transform; it is not reflowed, cropped, or resized for surrounding
  chrome.
- Stage content uses Stage-relative container-query units such as cqw and cqh,
  not viewport-relative layout units. Keep visual content inside the Stage
  root.
- A Topic communicates with the Envelope only through BespokeStyleProps and
  onNavigate(scene, beat). onNavigate is an absolute destination, never a
  relative next/previous request.
- Honor isThumbnail and reducedMotion. Thumbnail mode has no interactive
  internal navigation; reduced motion and frozen capture frames must settle
  deterministically.

## Query routing and history

All shareable state lives in query parameters, never in URL fragments.

- view selects overview or lab.
- style and topic identify a semantic Style/Topic pair.
- scene and beat identify the metadata-defined playback position.
- band and model are repeated singular Overview filters.
- lang is a temporary language override; pure and frozen are shareable display
  flags.

Preserve unknown filter values as unresolved criteria instead of silently
removing or broadening them. Validate and clamp scene and beat against active
Topic metadata rather than against fixed counts.

A View, Style, or Topic destination normally creates a history entry. Filter,
scene, beat, language, Pure Mode, and Frozen state normally replace the current
entry. Use an explicit history override only when the interaction needs a
different user-visible back/forward behavior. Keep popstate synchronized with
the query state.

## Catalog, manifest, lazy Stages, and thumbnails

The Catalog must remain usable without loading every Stage.

- src/styles/catalog-source.ts is the authoring catalog. It imports concrete
  Topic modules and defines their two-dimensional Style Group and Topic order.
- The unordered Style definition map owns each Style's canonical ID, bilingual
  name, and Band. It must not encode order; Registry position remains the only
  ordering authority.
- scripts/generate-catalog-manifest.mjs generates
  src/styles/catalog-manifest.generated.ts. The generated manifest carries
  synchronous Catalog data and the path to each Topic module.
- src/styles/registry.ts builds the runtime registry from that manifest.
  Topic components load on Player demand through the module loader and may be
  prefetched only for likely nearby destinations.
- Do not edit the generated catalog manifest manually. Do not make the Catalog
  eagerly import or render Stage components.
- Overview cards use committed static WebP images from public/showcase, mapped
  by the generated src/data/showcase-thumbnails.ts. Do not restore live Stage
  thumbnail rendering.

## Topic authoring rules

Read the relevant types, registry entry, shared hooks, and nearest comparable
Topic before writing code.

- Put a Topic implementation in src/styles. The Topic module, optional CSS
  module, and focused test use the Topic's semantic kebab-case ID as their
  basename. Do not add numeric, Style, model, version, or batch affixes.
- A Topic module default-exports exactly one TopicDefinition created through
  the shared defineTopic API. The definition owns the Topic identity,
  provenance, metadata resolver, Stage component, and optional protocol data;
  model-specific or batch-specific exports and registration paths are
  prohibited.
- StyleDefinition.name is the canonical bilingual Style name;
  TopicDefinition.title is the canonical bilingual Topic title. Do not expose
  redundant topic.topic or metadata.name fields.
- Every Topic has exactly one focused test file. It imports the default
  TopicDefinition and runs the shared Topic contract before retaining any
  content-, evidence-, motion-, or interaction-specific assertions. Its
  filename uses the same Topic ID basename; shared Registry and runtime tests
  do not substitute for it. Component-name, model, batch, and ordinal test
  filenames are prohibited.
- Keep optional CSS beside the Topic as a module stylesheet and keep focused
  behavior tests beside the implementation.
- Register every new or moved Topic in catalog-source.ts. Do not hand-edit the
  runtime registry or generated manifest to bypass the authoring catalog.
- Declare navigation, transition score, evidence, and any required sources
  through the shared Topic contract. Do not inject protocol fields through a
  model-specific adapter or recreate batch identities in source or Markdown.
- Metadata must satisfy the current type and protocol tests. Provide localized
  Topic-specific copy, describe every Scene and Beat state, and derive loops,
  progress, and navigation bounds from metadata.
- Do not add global chrome, routing state, or cross-Style ordering to a Topic.
  Reuse the shared Envelope behavior.

### Scene lifecycle and beat layout

Every Topic uses SpatialSceneTrack for scene lifecycle and declares explicit
transition behavior with transitionKind or transitionMap.

- SpatialSceneTrack owns mounted scene panels, transition direction, outgoing
  panel lifetime, reduced-motion behavior, and transition interruption.
- Do not read or pass isTransitionClone. Do not maintain outgoing-scene clone
  state, render a transition clone, or emit a transition-clone marker.
- Choose a deliberate per-edge transition score where the Topic protocol
  requires one. Match the declared score to the rendered behavior.
- For each multi-beat scene, choose a beat layout strategy: reserved space for
  stable geometry, or motion for intentional reflow.
- Mark the beat layout container with data-beat-layout-container and
  data-beat-layout-mode. Mark stable visual children with
  data-beat-layout-item when a nested layout or FLIP-based motion needs them.
- Disable layout motion for thumbnails, reduced motion, and frozen capture
  paths. A beat must represent a meaningful story state, not a decorative fade.

### Sources and internal navigation

Keep claim-bearing Topic content traceable.

- Declare TopicSource records in the Topic module. Each source needs an
  absolute HTTPS URL, identifying authority, title, or citation, and a
  supports statement that names the claim and any relevant boundary.
- Do not invent citations, turn a broad source into support for an unsupported
  claim, or conceal uncertainty in presentation copy.
- Evidence classifies claim interpretation: fact evidence needs supporting
  sources, while illustrative content needs a bilingual boundary that prevents
  examples from being presented as measured facts.
- For Topic protocols that require sources, navigation, or a transition score,
  satisfy the current protocol tests rather than weakening the shared schema.
- Internal navigation belongs to the Topic's visual language. It must request
  absolute scene/beat destinations through onNavigate, expose the metadata
  required by the navigation contract, stop interaction events from leaking to
  Stage transport, and disappear in thumbnails.
- A declared navigation profile keeps geometry, carrier, invocation, and
  feedback in source and in the rendered data-topic-navigation attributes.
  Use a semantic lowercase carrier and preserve the uniqueness constraints
  asserted by the protocol tests.
- Gesture, proximity, drag, or hold behavior is enhancement only. Ordinary
  click/tap and keyboard navigation remain available and accessible.

## Generated catalog and thumbnail workflow

After changing a Topic registration, metadata, module identity, or component
location, regenerate the Catalog manifest:

```bash
node scripts/generate-catalog-manifest.mjs
```

Commit the generated manifest with its source change.

After a registration, hero-scene metadata, or Stage visual change, regenerate
the static showcase assets. The generator captures the English hero frame in
pure and frozen mode, writes a generated mapping, and removes stale WebPs.

```bash
cwebp -version
npm run generate:showcase-thumbnails
npm run verify:showcase-thumbnails
```

cwebp is required locally; install the WebP package for the platform if it is
missing. The generated WebPs and mapping are committed artifacts. Do not edit
them by hand. Use npm run clean:showcase-thumbnails only when intentionally
removing obsolete generated assets.

## Validation matrix

| Change | Required validation |
| --- | --- |
| Documentation or workflow only | Inspect the diff and run git diff --check. |
| TypeScript, shared behavior, or tests | Run the focused test, then npm run ci. |
| Catalog-source, metadata, or module path | Regenerate the catalog manifest, then run npm run ci. |
| Registration, hero-frame metadata, or Stage visual output | Regenerate and verify thumbnails, then run npm run ci. |
| Routing, Envelope, Stage, navigation, motion, or responsive visual behavior | Run npm run ci and npm run test:audit. |

npm run ci is the repository's standard non-browser gate: typecheck, build,
unit tests, and static-thumbnail verification. Keep GitHub Actions aligned to
this script instead of duplicating its subcommands.

Browser audits select Topics through model-neutral authoring requirements. Each
selected Topic's English and Chinese Hero Final Frame runs in Frozen mode with
the exact target resolution, no page or console errors, active content, no
Stage overflow, and a settled capture.

## Public repository hygiene

This repository is public.

- Never commit secrets, tokens, deployment IDs, local absolute paths, .env
  files, .vercel state, build output, caches, Playwright reports, temporary
  captures, or unrelated generated files.
- The committed public/showcase WebPs and their generated mapping are the
  narrow exception for approved generated visual assets.
- Do not hotlink unreviewed external assets. Keep licenses, attribution, and
  source claims accurate when assets or research are added.
- Keep dependency and tooling changes minimal. Do not introduce formatters,
  linters, CI gates, or broad formatting changes without a current,
  task-specific reason.
