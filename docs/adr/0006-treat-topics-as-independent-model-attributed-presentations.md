---
status: accepted
date: 2026-07-12
---

# Treat every Topic as an independent presentation

Every Topic is an independent presentation, and its Model ID records authoring provenance only. The Workbench does not use model batches or Topic Sets as domain identities and does not attach model-specific registration contracts, so provenance remains filterable without coupling content, URLs, schemas, naming, or authoring workflow to a generation batch.

## Considered Options

- Preserve model-specific Topic Sets and contracts.
- Treat Model ID as a collection identity.

Both make implementation conventions depend on which model authored a Topic.

## Consequences

All Topics follow one authoring and registration contract with a canonical bilingual title field. Each Topic module default-exports one TopicDefinition and has exactly one same-basename focused test that runs the shared Topic contract before preserving any Topic-specific assertions. Its implementation and optional CSS also use the Topic ID basename. Topic Set fields, batch-specific adapters, redundant topic.topic naming, and Set-level protocol branches are removed; Topic-specific content and behavior remain unchanged.
