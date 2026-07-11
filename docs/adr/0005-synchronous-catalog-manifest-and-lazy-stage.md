---
status: accepted
date: 2026-07-11
---

# Use a synchronous Catalog manifest with lazy Stages

Catalog discovery data is available synchronously from a static manifest, while the Player loads only the selected Stage when needed. Each Topic Card uses a committed static WebP preview, so browsing does not require rendering Stage components.

## Consequences

Catalog browsing remains deterministic and lightweight, while Player loading stays scoped to the selected Topic. Intent and adjacency can warm the relevant Stage without making Stage loading a Catalog dependency.
