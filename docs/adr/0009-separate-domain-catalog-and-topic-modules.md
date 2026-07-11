---
status: accepted
date: 2026-07-12
---

# Separate Domain, Catalog, and Topic modules

The Workbench separates stable domain contracts, Catalog composition, Topic
implementations, and test support. `src/domain` owns Topic, Style, Model, and
Evidence contracts; `src/catalog` owns Style definitions, the ordered Topic
Registry, generated Manifest, runtime Registry, and lazy Topic loader;
`src/topics` contains only flat same-ID Topic implementation families; and
`src/testing` owns the reusable Topic contract test.

## Considered Options

- Keep all domain types in one `src/types.ts` file.
- Keep Catalog infrastructure and Topic implementations together.
- Export every Topic through a barrel module.

These options widen the interface, mix authoring with runtime composition, and
make it easier to load every Stage eagerly.

## Consequences

`TopicDefinition` is the single interface between Catalog composition and a
Topic Stage. There is no `src/topics` barrel: build-time Catalog generation may
import definitions through the authoring Registry, while runtime Stage access
uses the lazy loader. Topic files remain movable and independently testable,
and domain vocabulary no longer depends on a monolithic catch-all types module.
The migration removes `src/styles` after relocating its real responsibilities;
no forwarding module, old-path re-export, or empty compatibility directory
remains.

During the migration, the primary agent alone owns shared seams and
integration. At most four Topic workers run concurrently, each with no more
than ten disjoint Topic families and complete Style Groups kept together when
practical. Topic waves begin after the shared contract and mechanical tooling,
receive focused validation after each wave, and reach `main` only as the final
fully validated atomic state without a pull request.
