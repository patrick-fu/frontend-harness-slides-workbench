---
status: accepted
date: 2026-07-12
---

# Treat every Topic as an independent presentation

Treat every Topic as an independent presentation under one authoring and
registration contract. Model ID is exact provenance metadata only; it does not
define a Topic Set, version, schema, ordering, adapter, or runtime behavior.
This replaces the model-specific collection approach recorded in ADR-0002.

Topic identity, bilingual metadata, navigation, transitions, Evidence, Stage,
focused test, and companion assets remain Topic-owned. Contract and architecture
maintenance may change their wiring but must not silently redesign presentation
content or behavior.
