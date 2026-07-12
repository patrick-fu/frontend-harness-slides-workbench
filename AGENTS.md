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
- Model IDs must match the canonical allowlist exactly. Do not accept aliases,
  normalize punctuation, or silently correct unknown values. Model filters show
  only IDs present in registered Topics and order them by first appearance in
  the two-dimensional Registry; Models own no separate ordering field.
- The single two-dimensional Topic registry is the only ordering authority.
  Outer-array position orders Style Groups; inner-array position orders Topics
  within a Style. Flattened registry position drives Catalog presentation and
  sequential Player navigation. Topic modules, IDs, filenames, metadata, and
  Styles must not encode an ordinal, rank, primary/secondary tier, or version.
- Static bilingual Topic metadata is the source for Scene and Beat structure,
  not Style identity. English and Chinese metadata must remain structurally
  aligned: identical scene IDs, beat IDs, and story states, with independently
  appropriate copy and layout.
- TopicDefinition exposes metadata.en and metadata.zh. A Topic may use private
  builders internally, but callers, Manifest generation, Player, and tests must
  not depend on a getMetadata function.
- Each Topic follows the fixed five-scene structure enforced by the authoring
  protocol; beat cardinality remains metadata-defined.

## Envelope and Stage

The application is deliberately split into a responsive Envelope and an
isolated Stage.

- The Envelope owns the Catalog and Player chrome, routing, global controls,
  library/search, transport, and responsive layout. It may use normal browser
  UI units and breakpoints.
- The Stage is a fixed 1920x1080 canvas. The Player fits it with a contain-style
  scale transform; it is not reflowed, cropped, or resized for surrounding
  chrome.
- Stage content uses Stage-relative container-query units such as cqw and cqh,
  not viewport-relative layout units. Keep visual content inside the Stage
  root.
- A Topic communicates with the Envelope only through TopicStageProps and
  onNavigate(scene, beat). onNavigate is an absolute destination, never a
  relative next/previous request.
- Honor isThumbnail and reducedMotion. Thumbnail mode has no interactive
  internal navigation; reduced motion and frozen capture frames must settle
  deterministically.

## Query routing and history

All shareable state lives in query parameters, never in URL fragments.

`src/navigation` is the only routing and History authority. It parses,
normalizes, serializes, clamps against Topic metadata, moves through Registry
order, and chooses push versus replace through browser or in-memory History
adapters. App, Catalog, Player, keyboard, click, and touch callers dispatch
semantic Navigation Intents; do not add partial URL setters, direct query
mutation, or a second movement helper.

- view=overview selects the Catalog and view=lab selects the Player.
- topic identifies the Topic; style records its canonical current Style and is
  replaced from TopicDefinition.styleId when stale.
- scene and beat identify the metadata-defined playback position.
- band and model are repeated singular Overview filters.
- lang is a temporary language override; pure and frozen are shareable display
  flags.

Preserve unknown filter values as unresolved criteria instead of silently
removing or broadening them. Validate and clamp scene and beat against active
Topic metadata rather than against fixed counts.

Entering the Player from the Catalog and returning across surfaces create
history entries. Style or Topic changes within the Player, filters, scene,
beat, language, Pure Mode, Frozen state, and stale-Style canonicalization
replace the current entry. Keep popstate synchronized with query state.
Catalog scroll position is non-shareable return context stored under the
Navigation namespace in `history.state`; preserve unrelated History state when
updating it.

## Catalog, manifest, lazy Stages, and thumbnails

The Catalog must remain usable without loading every Stage.

- src/catalog/topic-registry.ts is the authoring catalog. It imports concrete
  Topic modules and defines their two-dimensional Style Group and Topic order.
- The unordered Style definition map owns each Style's canonical ID, bilingual
  name, and Band. It must not encode order; Registry position remains the only
  ordering authority.
- scripts/generate-catalog-manifest.mjs generates
  src/catalog/manifest.generated.ts. The generated manifest carries
  synchronous Catalog data and the path to each Topic module.
- src/catalog/runtime-registry.ts builds the runtime registry from that manifest.
  Topic components load on Player demand through the module loader and may be
  prefetched only for likely nearby destinations.
- Do not edit the generated catalog manifest manually. Do not make the Catalog
  eagerly import or render Stage components.
- Overview cards use committed static `{topic-id}.webp` images from
  public/showcase through Topic-ID-derived URLs. Do not restore live Stage
  thumbnail rendering or a generated thumbnail mapping.

## Topic authoring rules

Read the relevant types, registry entry, shared hooks, and nearest comparable
Topic before writing code.

- Domain contracts live in src/domain: topic.ts owns TopicDefinition,
  defineTopic, and the Stage contract; style.ts owns StyleDefinition; model.ts
  owns MODEL_IDS and ModelId; evidence.ts owns Evidence and Source.
- Catalog composition lives in src/catalog: style-definitions.ts,
  topic-registry.ts, manifest.generated.ts, runtime-registry.ts, and
  topic-loader.ts. Shared Topic contract test utilities live in src/testing.
  Do not rebuild a monolithic src/types.ts domain surface.
- The completed migration removes src/styles entirely. Move Topic
  implementations to src/topics, Style identity and Catalog composition to
  src/catalog, domain contracts to src/domain, and genuine shared Stage code to
  the owning components, hooks, or runtime module. Do not retain forwarding
  modules, old-path re-exports, or an empty compatibility directory.

- Put every Topic implementation in the flat src/topics directory. The Topic
  module, optional CSS
  module, and focused test use the Topic's semantic kebab-case ID as their
  basename. Do not add numeric, Style, model, version, or batch affixes, and do
  not group Topic files by Style, Model, batch, or version. Registry, Manifest,
  loaders, and shared Stage modules live outside src/topics.
- Do not create a src/topics barrel index. Catalog generation may import
  TopicDefinitions through the authoring Registry, while application runtime
  reaches Stages only through the lazy Topic loader.
- Topic IDs are globally unique and stable across all Style Groups. Reject a
  duplicate anywhere in the Registry; do not repair it with an automatic
  suffix or alias. Moving a Topic to another Style changes its styleId and
  Registry position, not its Topic ID or same-basename files. Public URLs keep
  the Style plus Topic ID identity defined by the Navigation State contract.
- When a shared query contains an existing global Topic ID with a stale or
  mismatched Style ID, resolve the Topic by Topic ID, replace the Style query
  with TopicDefinition.styleId through replaceState, and do not add History.
  Show Not Found only when the Topic ID itself is unknown.
- During the unified-contract migration, preserve every existing canonical
  Topic ID. Rename its implementation, focused test, optional CSS module, and
  showcase WebP to that ID; do not derive a replacement from the old filename,
  component symbol, display title, Style, or Model ID.
- Remove structural generation and ordering language from internal identifiers,
  CSS classes, data attributes, comments, test names, and test selection. Terms
  such as v1/v2/v3, primary/secondary, curated, coordinated, and legacy may
  remain only when they are genuine Topic content or ordinary subject-matter
  language, never when they encode model batch, code generation, Registry
  position, or Topic rank.
- A Topic module default-exports exactly one TopicDefinition created through
  the shared defineTopic API. The definition owns the Topic identity,
  provenance, static bilingual metadata, Stage component, and protocol data;
  model-specific or batch-specific exports and registration paths are
  prohibited.
- Use modelId for Model ID in TopicDefinition, CatalogTopic, RuntimeTopic,
  filters, search, and tests. Do not expose model or an old-to-new Model field
  adapter. UI labels use “Model ID”.
- Model ID is provenance only. TopicStageProps does not expose modelId, and a
  Topic Stage, loader, Registry, or Player must not select content, layout,
  motion, navigation, transitions, interfaces, or adapters by Model ID. Only
  TopicDefinition, generated Catalog data, and Catalog provenance display,
  search, or filtering may consume modelId. Static validation rejects Model ID
  branching or model constants in Topic implementations.
- MODEL_IDS is the explicit canonical allowlist and produces the ModelId type.
  Topic modelId values must match it exactly; reject spelling variants instead
  of normalizing them. Catalog Model filters include only values actually used
  by TOPIC_REGISTRY and order them by first Topic appearance. Do not document a
  fixed Model or Topic count in README or Context.
- Name the module-local React Stage component TopicStage in every Topic. Do not
  encode the Topic name, Style, Model, batch, ordinal, or version in that
  component name; the module basename and TopicDefinition.id own Topic
  identity. TopicStage is an implementation detail, not an additional export.
- StyleDefinition.name is the canonical bilingual Style name;
  TopicDefinition.title is the canonical bilingual Topic title. Do not expose
  redundant topic.topic or metadata.name fields.
- Preserve the existing canonical Style IDs, Catalog bilingual Style names,
  Bands, and semantic Topic titles during the unified-contract migration.
  Move Style identity into the single STYLE_DEFINITIONS map and remove
  duplicated Topic Metadata values. Remove only structural ordinal, version,
  or batch wording; do not use the migration to rewrite presentation or
  Catalog copy.
- Public types use the domain vocabulary directly: TopicMetadata,
  TopicStageProps, TopicStage, TopicDefinition, RuntimeTopic, StyleGroup,
  CatalogTopic, and CatalogStyleGroup. Remove obsolete StyleMetadata,
  BespokeStyleProps, StyleComponent, StyleTopic, StyleTopicModule,
  LoadableStyleTopic, StyleRegistryEntry, CatalogTopicManifest, and
  CatalogStyleManifest names without compatibility aliases.
- Contract migrations use an atomic cutover. Local implementation commits may
  stage the work, but the final pushed state must migrate every Topic,
  Registry, Manifest, loader, and test together. Do not merge or retain
  defineStyleTopic, legacy type aliases, field adapters, dual Registries, or
  other old-to-new compatibility paths.
- Architecture and contract migrations may change filenames, symbols, types,
  fields, imports, exports, Catalog identity field names, tests, and explicit
  protocol declarations. They must not change Stage-visible copy, numbers,
  citations, assets, fonts, colors, layout or CSS values; Scene or Beat count,
  order, or state; click, keyboard, touch, motion, or transition behavior; or
  the factual meaning of Evidence. Describe and reconnect existing behavior;
  do not redesign it.
- A Topic contract migration does not regenerate showcase screenshots. Preserve
  every committed showcase WebP byte-for-byte; verify its pre/post checksum.
  Also preserve a one-to-one mapping of Topic count, globally unique Topic ID,
  exact Model ID, and Style membership; retain all bespoke assertions; run the
  shared contract for every Topic, regenerate the Manifest, pass npm run ci,
  and load every Topic URL without runtime errors. Review rejects any
  non-mechanical Stage JSX, visible copy, or CSS-value change.
- Every Topic has exactly one focused test file. It imports the default
  TopicDefinition and runs the shared Topic contract before retaining any
  content-, evidence-, motion-, or interaction-specific assertions. Its
  filename uses the same Topic ID basename; shared Registry and runtime tests
  do not substitute for it. Component-name, model, batch, and ordinal test
  filenames are prohibited.
- Keep optional CSS beside the Topic as a module stylesheet and keep focused
  behavior tests beside the implementation.
- Register every new or moved Topic in src/catalog/topic-registry.ts. Do not
  hand-edit the runtime registry or generated manifest to bypass the authoring
  catalog.
- The authoring TOPIC_REGISTRY is the only hand-maintained ordering source. It
  is a two-dimensional array: outer position orders Style Groups, inner
  position orders Topics of exactly one Style, and flattening it defines
  sequential Player order. Generate the synchronous Catalog Manifest, lazy
  RuntimeTopic Registry, and Stage loading map from it; do not maintain a
  second Registry, order table, or manual module-loader mapping.
- src/topics contains production Topics only. Contract validation is
  bidirectional: every Registry entry resolves to exactly one same-ID Topic
  module and focused test, and every Topic module in src/topics appears exactly
  once in the Registry. Optional CSS modules must use the same basename and may
  not be orphaned. Every registered Topic has one same-ID showcase WebP.
  Unregistered drafts stay outside src/topics and outside the main branch.
- Declare navigation, transition score, evidence, and any required sources
  through the shared Topic contract. Do not inject protocol fields through a
  model-specific adapter or recreate batch identities in source or Markdown.
- Every Topic explicitly declares navigation, transitionScore, and evidence.
  Navigation uses a concrete profile or mode none; transitionScore declares all
  four Scene edges; evidence uses none, illustrative, facts, or mixed. Missing
  fields must not imply protocol behavior.
- defineTopic validates one Topic's required fields and local structure when
  authoring modules load. validateTopicRegistry enforces global Topic ID,
  Style, Model ID, two-dimensional grouping, ordering-source, and file coverage
  invariants. Manifest generation and CI fail on any violation; they do not
  fill, normalize, skip, or downgrade invalid Topics. Runtime consumes the
  validated Manifest, while genuine dynamic Stage load failures retain the
  recoverable Player error UI.
- When migrating a Topic that lacks explicit protocol data, audit that Topic's
  existing Stage and content individually. Declare navigation mode none only
  when it has no Internal Navigation; otherwise describe its actual geometry,
  invocation, and feedback. Record each of the four actual Scene edges in
  transitionScore and classify its real Evidence boundary. Do not apply one
  blanket navigation, transition, or Evidence template merely to satisfy the
  type system.
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

- Declare Source records inside the Topic's facts or mixed Evidence. Each
  Source needs an
  absolute HTTPS URL, identifying authority, title, or citation, and a
  supports statement that names the claim and any relevant boundary.
- Do not invent citations, turn a broad source into support for an unsupported
  claim, or conceal uncertainty in presentation copy.
- Evidence classifies claim interpretation explicitly: none carries no external
  claim; facts owns supporting Sources; illustrative owns a bilingual boundary;
  mixed owns both Sources and a bilingual boundary. Do not expose Sources as a
  separate optional Topic field.
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
npm run generate:catalog
```

Commit the generated manifest with its source change.
`src/catalog/publication-plan.ts` is the only projection from the validated
Topic Catalog to the generated Manifest, dynamic statistics, Topic-ID preview
targets, and browser audit cases. Publication scripts, Vite, and Playwright
consume its generated outputs; do not derive a second target list, count, hero
frame, module path, or audit order.

When a new Topic has no preview, its Hero Final Frame target changes, or its
Stage visual output intentionally changes, manually regenerate only the
affected static showcase assets. The generator captures the English hero frame
in Pure and Frozen modes.

Showcase capture is always an explicit manual action. Each WebP uses the
globally unique Topic ID as its basename, and getShowcaseThumbnail derives its
public URL directly from that ID and the application base URL. Do not generate
or maintain a Style-to-Topic thumbnail mapping or store a redundant thumbnail
path in the Catalog Manifest. Build, CI, Manifest
generation, and ordinary validation must never invoke screenshot generation.
The generator supports selecting individual Topic IDs and must not rewrite
unselected WebPs. A capture command without --topic or --all must fail with
usage help; full regeneration requires explicit --all.

```bash
cwebp -version
npm run generate:showcase-thumbnails -- --topic last-feature-cut
npm run generate:showcase-thumbnails -- --topic last-feature-cut --topic quiet-launch
npm run generate:showcase-thumbnails -- --all
npm run verify:showcase-thumbnails
```

cwebp is required locally; install the WebP package for the platform if it is
missing. The generated WebPs are committed artifacts. Do not edit them by
hand. Use npm run clean:showcase-thumbnails only when intentionally
removing obsolete generated assets.

## Validation matrix

| Change | Required validation |
| --- | --- |
| Documentation or workflow only | Inspect the diff and run git diff --check. |
| TypeScript, shared behavior, or tests | Run the focused test, then npm run ci. |
| Topic Registry, metadata, or module path | Regenerate the Catalog Manifest, then run npm run ci. |
| New Topic without a preview, Hero Final Frame target change, or intentional Stage visual change | Manually generate only affected Topic previews, verify all previews, then run npm run ci. |
| Topic contract or architecture-only migration | Keep all showcase WebP checksums unchanged; verify the identity map, every focused and shared Topic contract test, every Topic URL, the regenerated Manifest, and npm run ci. |
| Topic filename, interface, Model ID, or non-visual metadata only | Do not capture previews; regenerate the Catalog Manifest when applicable, then run npm run ci. |
| Routing, Envelope, Stage, navigation, motion, or responsive visual behavior | Run npm run ci and npm run test:audit. |

npm run ci is the repository's standard non-browser gate: typecheck, build,
unit tests, and static-thumbnail verification. Keep GitHub Actions aligned to
this script instead of duplicating its subcommands.

Browser audits select Topics through model-neutral authoring requirements. Each
selected Topic's English and Chinese Hero Final Frame runs in Frozen mode with
the exact target resolution, no page or console errors, active content, no
Stage overflow, and a settled capture.

## Unified Topic migration execution

- The primary agent exclusively owns shared domain, Catalog, Registry,
  Manifest, loader, scripts, documentation, dependencies, and integration
  files. Topic workers touch only their assigned same-ID Topic implementation,
  focused test, optional CSS module, and WebP rename.
- Run at most four Topic migration workers concurrently. Give each worker no
  more than ten Topics, keep complete Style Groups together when practical,
  and never assign one Topic or companion family to two workers.
- Complete the shared contract and mechanical migration tooling before Topic
  waves. After every wave, validate its focused tests and identity mapping;
  the primary agent resolves integration failures instead of asking workers to
  edit shared seams.
- Keep local commits reviewable, but expose no partial old/new contract on the
  remote. After all fidelity and CI gates pass, push the atomic final state
  directly to main without a pull request.

## Public repository hygiene

This repository is public.

- Never commit secrets, tokens, deployment IDs, local absolute paths, .env
  files, .vercel state, build output, caches, Playwright reports, temporary
  captures, or unrelated generated files.
- The committed public/showcase WebPs and their Topic-ID-derived paths are the
  narrow exception for approved generated visual assets.
- Do not hotlink unreviewed external assets. Keep licenses, attribution, and
  source claims accurate when assets or research are added.
- Keep dependency and tooling changes minimal. Do not introduce formatters,
  linters, CI gates, or broad formatting changes without a current,
  task-specific reason.
