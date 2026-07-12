---
status: accepted
date: 2026-07-12
---

# Use one Publication Plan for generated artifacts

The validated Topic Catalog feeds one deterministic Publication Plan. The plan
owns the Stage-free Manifest projection, dynamic repository statistics,
Topic-ID preview destinations, manual capture targets, and model-neutral browser
audit cases. Manifest generation, Vite assets, preview verification, capture,
and browser audits consume that plan instead of deriving their own ordering or
Topic selections.

Publication planning is pure. Filesystem checks, Vite SSR loading, WebP
inspection, Playwright capture, and command-line parsing are adapters around
the plan. Generated textual artifacts must be byte-stable for the same Catalog.

Preview capture remains a manual operation. A caller selects one or more Topic
IDs with repeatable selectors or explicitly selects every Topic. Missing,
duplicate, unknown, or conflicting selectors fail before a browser, server, or
encoder starts. Partial capture writes only selected Topic-ID WebPs and never
cleans unrelated files; full capture and explicit cleanup are the only paths
that may remove orphaned WebPs. Build, CI, validation, Model ID changes, and
ordinary Manifest generation never invoke capture.
