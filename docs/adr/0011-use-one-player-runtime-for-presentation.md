---
status: accepted
date: 2026-07-12
---

# Use one Player Runtime for presentation

The Player uses one Runtime boundary that consumes validated Catalog access,
semantic Navigation State, the active language and motion preference, and
Envelope requests. The Runtime does not parse URLs or write History. It emits
Navigation Intents and leaves URL and History policy to `src/navigation`.

The Runtime owns selected Stage loading, stale-result cancellation, retry,
adjacent prefetch requests, explicit unavailable/loading/ready/error states,
fixed-canvas fitting, Pure and Frozen presentation, Envelope-owned Evidence,
Topic announcements, rotate guidance, and Player input arbitration. Topic
Stages retain absolute internal navigation and `SpatialSceneTrack` retains
Scene lifecycle ownership.

Keyboard, Stage clicks, and touch gestures converge at the Runtime boundary.
Interactive descendants retain native behavior. Prevented, modified,
non-primary, recent-touch synthetic, and cancelled inputs cannot create an
extra movement. Horizontal and vertical gestures are enabled only for a
coarse-pointer mobile screen query; wheels, trackpads, and mouse movement are
not gesture inputs.

The Stage remains a fixed `1920×1080` canvas fitted with contain-style scaling.
Pure removes Envelope chrome and Frozen settles temporal behavior without
changing Topic identity, Scene, Beat, or composition. Production lazy loading
and deterministic in-memory loading exercise the same Runtime interface.
