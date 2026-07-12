---
status: accepted
date: 2026-07-12
---

# Use one Workbench Envelope

`src/envelope` owns the responsive Catalog and Player interface, including
headers, rail, transport, global controls, discovery surfaces, help, focus,
shortcuts, and font preloading. It consumes canonical Catalog identity and
order without recreating taxonomy, routing, Player Runtime, or Stage lifecycle;
narrow and wide layouts are presentations of this same Envelope.
