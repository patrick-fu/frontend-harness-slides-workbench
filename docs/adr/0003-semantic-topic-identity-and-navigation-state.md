---
status: accepted
date: 2026-07-11
---

# Address Topics by semantic identity

A Topic is identified by the stable pairing of its Style and semantic Topic ID, and query-addressable Navigation State resolves to that identity plus its viewing context. This lets links, direct navigation, and History refer to meaningful destinations instead of mutable ordinals or component instances.

## Consequences

Entering the Player from the Catalog and changing surfaces create History destinations. Filters, presentation position, display-state changes, and sequential cycling update the current destination so Catalog Return remains useful.

Topic IDs are globally unique and stable across all Style Groups even though
the public address retains both Style and Topic ID. Authoring tools, filenames,
and showcase assets may therefore select a Topic by Topic ID alone. Moving a
Topic to another Style does not rename the Topic or its files, and duplicate
Topic IDs fail validation instead of receiving generated suffixes or aliases.
The unified-contract migration preserves every existing Topic ID and renames
its module and companion assets to that ID rather than inventing new IDs from
legacy filenames, component names, or titles.

Query resolution uses the globally unique Topic ID as its lookup key while the
canonical public URL retains the Topic's current Style ID. A stale or
mismatched Style query is replaced with TopicDefinition.styleId through
replaceState without adding History, so links survive Style reassignment and
the application cannot retain an inconsistent Style/Topic state. An unknown
Topic ID, not a Style mismatch, produces Not Found.
