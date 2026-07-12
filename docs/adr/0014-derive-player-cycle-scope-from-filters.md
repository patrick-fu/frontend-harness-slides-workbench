---
status: accepted
date: 2026-07-12
---

# Derive Player Cycle Scope from Filters

Use the same Band and Model Filters in Catalog and Player. In Player they
derive a Registry-ordered Cycle Scope for sequential cross-Topic movement from
transport, keyboard, mobile swipe, and Topic Switcher. Library Drawer, Command
Palette, search, and direct links remain global navigation surfaces.

Keep a directly selected out-of-scope Topic visible and preserve its internal
position navigation. Its next cross-Topic move enters the nearest matching
Topic in that direction. An empty Cycle Scope stops at the Topic boundary and
never broadens silently. Pure retains Filter query state but never crosses a
Topic boundary.

The Player Top Bar always exposes Filter editing. Active Filters replace that
entry with a persistent Cycle Scope Indicator showing selection and result
count, with clear and edit actions plus an out-of-scope warning. Filter edits
apply immediately through replace-state URL updates without redirecting the
selected Topic.
