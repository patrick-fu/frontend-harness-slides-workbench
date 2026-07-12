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

Read the domain types, Registry entry, shared utilities, and nearest comparable
Topic before editing or adding a Topic.

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

## Envelope and Stage

- The Envelope owns Catalog and Player chrome, headers, rail, transport,
  global controls, More menu, Library Drawer, Command Palette, Controls Guide,
  global shortcuts, modal focus, responsive layout, and font preloading.
- The Stage is a fixed `1920×1080` canvas fitted with contain-style scaling. It
  is not reflowed or cropped for surrounding chrome.
- Stage content uses Stage-relative container-query units such as `cqw` and
  `cqh`, stays inside the Stage root, and does not use viewport layout units.
- A Topic communicates outward only through `TopicStageProps` and absolute
  `onNavigate(scene, beat)` destinations.
- Honor `isThumbnail` and `reducedMotion`. Thumbnail, reduced-motion, and
  Frozen paths must settle deterministically and disable layout motion.
- Pure removes Envelope output while keeping the active Stage mounted.
- Player touch gestures apply only to coarse-pointer mobile screens. Never map
  wheels, trackpads, or mouse movement to swipe navigation. Preserve guards for
  prevented, modified, non-primary, interactive-target, cancelled, and
  recent-touch synthetic input.

## Navigation and History

All shareable state uses query parameters, never URL fragments:

- `view=overview` selects Catalog; `view=lab` selects Player.
- `style` and `topic` select the canonical Topic destination.
- `scene` and `beat` select the metadata-defined presentation position.
- Repeated `band` and `model` values filter the Catalog.
- `lang`, `pure`, and `frozen` preserve language and display state.

Navigation callers dispatch semantic intents. They must not mutate query
strings directly or create a second movement helper.

- Resolve a known global Topic ID even when its Style query is stale; replace
  the Style with the Topic's current `styleId` without adding History.
- Preserve unknown filter values as unresolved criteria rather than silently
  broadening results.
- Clamp Scene and Beat against active Topic metadata.
- Entering or leaving Player creates History. Topic changes within Player,
  filters, position, language, display modes, and stale-Style repair replace
  the current entry.
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
