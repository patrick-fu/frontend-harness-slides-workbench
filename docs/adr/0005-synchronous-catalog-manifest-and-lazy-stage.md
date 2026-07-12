---
status: accepted
date: 2026-07-11
---

# Use a synchronous Catalog manifest with lazy Stages

Serve Catalog identity and metadata from a generated synchronous Manifest, but
load a Stage only when the Player needs it. Committed Topic-ID WebPs supply
previews, so discovery stays deterministic and lightweight without importing
or rendering every presentation.

Generation must fail on invalid or incomplete Registry coverage rather than
normalizing, skipping, or repairing Topics at runtime.
