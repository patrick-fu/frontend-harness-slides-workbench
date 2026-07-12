---
status: accepted
date: 2026-07-12
---

# Use one Workbench Envelope

`src/envelope` is the authoritative responsive interface around the Stage. It
owns the Catalog view and filters, Catalog and Player headers, Player rail and
transport, global controls and More menu, Library Drawer, Command Palette,
Controls Guide, modal focus behavior, global shortcuts, and Envelope font
preloading. `src/App.tsx` composes providers only.

Envelope surfaces consume canonical Style, Topic, Band, Model ID, and order
from the validated Catalog. Canonical Band order, labels, and grouping live in
`src/catalog/bands.ts`; Envelope code does not maintain another taxonomy or
ordering source. Player Runtime and Stage lifecycle remain outside Envelope.

Pure Mode removes all Envelope output without replacing or unmounting the
active Stage. Narrow and wide responsive variants are presentations of the
same Envelope behavior, not separate shell implementations.

The former `components/chrome` family and legacy layout Header, Sidebar,
TopicBar, BottomBar, and Bands paths are removed. A production reachability
test rejects those modules, imports, and obsolete shell vocabulary so dead
architecture cannot quietly return.
