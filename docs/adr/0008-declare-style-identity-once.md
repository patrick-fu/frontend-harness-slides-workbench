---
status: accepted
date: 2026-07-12
---

# Declare Style identity once

Each Style has one canonical ID, bilingual name, and Band in an unordered Style definition map. Topics reference that identity through styleId instead of repeating Style fields in Topic metadata, preventing model-specific wording and classification from creating multiple public identities for the same Style.

## Considered Options

- Let every Topic repeat its Style ID, localized name, and Band.
- Derive Style identity from filenames or Registry position.

Repeated declarations drift, while inferred identity couples naming to storage or order.

## Consequences

Overview, Player, search, and navigation resolve Style identity through the canonical map. Topic metadata retains Topic-specific presentation data, and the two-dimensional Topic Registry remains the only source of Style Group and Topic order.
