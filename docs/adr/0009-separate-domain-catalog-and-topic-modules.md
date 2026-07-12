---
status: accepted
date: 2026-07-12
---

# Separate Domain, Catalog, and Topic modules

Keep stable contracts in `src/domain`, Catalog composition and loading in
`src/catalog`, flat same-ID presentation families in `src/topics`, and shared
contract tests in `src/testing`. `TopicDefinition` is the boundary between
Catalog and Stage; there is no Topic barrel, monolithic type module, legacy
Style implementation directory, forwarding layer, or dual Registry.
