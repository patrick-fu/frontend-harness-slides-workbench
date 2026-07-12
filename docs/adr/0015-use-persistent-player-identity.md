---
status: accepted
date: 2026-07-12
---

# Use persistent Player identity

Keep one persistent Identity Badge for the active Style, Topic, and exact
Model ID. The Workbench Envelope owns it, anchors it to the top-left of the
Stage Matte rather than the scaled Stage, and hides it in Pure. It is visually
small, faint, translucent, and motionless while retaining a `44px` touch
target.

Use the Badge as the only Player Topic Switcher entry. Open an anchored dialog
on wide screens and a Bottom Sheet on narrow screens, limited to the active
Cycle Scope from ADR-0014.

This supersedes only the transient visual cross-Topic announcement aspect of
ADR-0011 and extends the Envelope responsibilities in ADR-0012. Player Runtime
retains a screen-reader-only polite live region for the latest changed Style,
Topic, and Model ID.
