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

All Topics follow one authoring and registration contract with a canonical bilingual title field and static bilingual Metadata. Public types use the Style, Topic, Stage, Catalog, and Runtime domain vocabulary directly, without legacy aliases. Model IDs are exact canonical provenance values exposed only through the modelId field, with no model alias, normalization, model-specific behavior, or separate ordering. Every Topic explicitly declares navigation, all four Scene transitions, and evidence as none, illustrative, facts, or mixed; factual and mixed Evidence own Sources, while illustrative and mixed Evidence own their bilingual boundary. Missing fields never imply protocol behavior. Each Topic module contains one module-local React component named TopicStage and default-exports one TopicDefinition; the component symbol carries no Topic, Style, Model, batch, ordinal, or version identity. Each Topic also has exactly one same-basename focused test that runs the shared Topic contract before preserving any Topic-specific assertions. Topic IDs are globally unique and stable across Style Groups, so Topic implementations, optional CSS, focused tests, and showcase WebPs are flat in their dedicated directories and use the Topic ID basename without Style, Model, batch, version, ordinal, or generated suffixes. Moving a Topic between Styles does not rename it or its files, and duplicate Topic IDs fail validation. Structural generation, batch, version, and rank language is removed from internal identifiers, comments, attributes, and tests while genuine presentation content remains unchanged. Topic Set fields, batch-specific adapters, redundant topic.topic naming, getMetadata functions, legacy type aliases, and Set-level protocol branches are removed. The migration is an atomic cutover: the final pushed state moves every Topic, Registry, Manifest, loader, and test to the new contract together and retains no defineStyleTopic API, compatibility alias, field adapter, or dual registration path.

The cutover changes description and wiring, not the presentation itself.
Stage-visible copy, values, sources, assets, typography, layout and CSS values;
Scene and Beat counts, order, and states; interaction, motion, and transition
behavior; and the factual meaning of Evidence remain unchanged. Renames,
contract fields, Catalog identity field names, and explicit declarations may
change only when they preserve those values, rendered behavior, and meaning.

Acceptance does not regenerate showcase screenshots. Every committed showcase
WebP remains byte-identical; Topic count, globally unique Topic ID, exact Model
ID, and Style membership retain a one-to-one pre/post mapping; existing bespoke
assertions remain; every Topic passes the shared contract and loads through its
URL without runtime errors; the Manifest is regenerated; and the complete CI
suite passes. Review rejects non-mechanical Stage JSX, visible-copy, or CSS
value changes.

Existing Topics with missing protocol fields are audited one by one. An
explicit navigation mode none means the Stage truly has no Internal
Navigation; visible navigation records its actual geometry, invocation, and
feedback; transitionScore records each of the four existing Scene edges; and
Evidence reflects the Topic's actual claims and boundaries. A blanket default
template may not be used to satisfy the contract.

An explicit MODEL_IDS registry defines exact allowed provenance values and the
ModelId type. Topic values are rejected rather than normalized when they do not
match. Catalog filters include only Model IDs used by TOPIC_REGISTRY and order
them by first Topic appearance; the allowlist itself does not define UI order,
and documentation does not freeze a changing Model or Topic count.

Model ID is unavailable to TopicStageProps and cannot select Stage content,
layout, motion, navigation, transitions, interfaces, adapters, loading, or
Player behavior. Only TopicDefinition, generated Catalog data, and Catalog
provenance display, search, or filtering consume modelId; static validation
rejects model-specific Stage branches.
