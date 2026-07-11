---
status: accepted
date: 2026-07-11
---

# Assign Scene lifecycle to SpatialSceneTrack

SpatialSceneTrack owns active and outgoing Scene lifecycle, interruption behavior, and reduced-motion fallback. Topics declare their scene content and transition choices without creating outgoing-scene clones, so every Topic follows the same lifecycle semantics.

## Considered Options

- Topic-owned outgoing clones and timers.

That option duplicates lifecycle logic and makes interruption and display-state behavior inconsistent.

## Consequences

Topics retain control of visual transition expression but not Scene residency or cleanup.
