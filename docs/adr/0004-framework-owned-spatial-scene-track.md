---
status: accepted
date: 2026-07-11
---

# Assign Scene lifecycle to SpatialSceneTrack

`SpatialSceneTrack` owns active and outgoing Scene residency, interruption,
cleanup, and reduced-motion fallback. Topics still choose transition
expression, but they do not create their own outgoing clones or lifecycle
timers, avoiding inconsistent behavior across presentations.
