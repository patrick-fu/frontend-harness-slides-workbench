---
status: accepted
date: 2026-07-12
---

# Use Registry position as the only Topic order

The Workbench uses one two-dimensional Topic registry as the sole ordering authority. The outer array orders Style Groups and each inner array orders Topics of one Style; flattening that structure produces Catalog and sequential Player order. A Topic declares its own Style identity but no ordinal, rank, primary or secondary tier, or version.

## Considered Options

- Use a flat Topic array with a separate Style-contiguity validator.
- Store explicit order, priority, tier, or version fields on each Topic.

Both distribute ordering authority and allow encoded ordinals to drift from the rendered sequence.

## Consequences

Each inner array must contain one Style and each Style may appear in only one inner array. Moving an inner array changes Style order; moving an entry inside it changes Topic order. The generated manifest preserves the flattened Registry order, filters preserve the relative order of matches, and Topic filenames, IDs, metadata, and module exports remain free of ordering semantics.
