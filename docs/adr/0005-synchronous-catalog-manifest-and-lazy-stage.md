---
status: accepted
date: 2026-07-11
---

# Use a synchronous Catalog manifest with lazy Stages

Catalog discovery data is available synchronously from a static manifest, while the Player loads only the selected Stage when needed. Each Topic Card uses a committed static WebP preview, so browsing does not require rendering Stage components.

## Consequences

Catalog browsing remains deterministic and lightweight, while Player loading stays scoped to the selected Topic. Intent and adjacency can warm the relevant Stage without making Stage loading a Catalog dependency.

The author-maintained two-dimensional TOPIC_REGISTRY is the sole ordering
source. Its outer arrays order Style Groups, each inner array contains Topics
of exactly one Style in Topic order, and its flattened order controls
sequential Player navigation. Generation derives the synchronous Catalog
Manifest, lazy RuntimeTopic Registry, and Stage loading map from this source;
none is a separately maintained order or registration surface.

Validation enforces complete bidirectional coverage: every Registry entry has
exactly one same-ID Topic module, focused test, and showcase WebP, while every
Topic module and companion file belongs to exactly one Registry entry. The
production Topic directory contains no unregistered drafts or orphaned tests,
CSS modules, or previews.

Because Topic IDs are globally unique and every preview is named
`{topic-id}.webp`, the application derives its showcase URL from Topic ID and
the application base URL. There is no generated Style-to-Topic thumbnail map
and no redundant thumbnail path in the Manifest; verification compares
Registry IDs and WebP basenames directly.

`defineTopic` validates local Topic structure during authoring imports, while
`validateTopicRegistry` enforces global identity, Style, Model ID,
two-dimensional grouping, and file-coverage invariants. Manifest generation
and CI fail rather than filling, normalizing, skipping, or downgrading invalid
data. Runtime consumes the validated Manifest; only genuine dynamic Stage load
failures use the recoverable Player error surface.
