---
status: accepted
date: 2026-07-12
---

# Use one Player Runtime for presentation

Use one Player Runtime for Stage loading and retry, stale-result cancellation,
adjacent prefetch, fixed-canvas fitting, Pure and Frozen behavior, Evidence,
announcements, rotate guidance, and input arbitration. It consumes validated
Catalog and Navigation State, emits semantic intents, and leaves URL and
History policy to `src/navigation`.

Keyboard, Stage clicks, and coarse-pointer mobile gestures converge at this
boundary. Wheels, trackpads, mouse movement, modified input, interactive
descendants, cancelled touch, and recent-touch synthetic events must not create
extra movement.
