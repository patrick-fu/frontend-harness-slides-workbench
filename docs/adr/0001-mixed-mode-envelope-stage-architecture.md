# ADR-0001: Mixed-Mode Envelope/Stage Architecture

## Status

Accepted — 2026-07-05

## Context

The frontend-harness-slides skill defines a "Viewport Trap" rule: all navigation, controls, and visual elements must live inside the fixed Stage so they scale with the slide and survive screenshot/PDF export. However, the Workbench is not a slide deck — it is a meta-application that showcases 48 independent slide styles.

If we apply the Viewport Trap to the Workbench itself, the sidebar, header, and bottom bar would all need to be inside the Stage (using `cqw`/`cqh`). This would:
- Make the sidebar scale down on mobile (unreadable)
- Prevent responsive behavior like mobile auto-collapse
- Confuse the boundary between "player chrome" and "slide content"
- Break iframe embedding where you want only the slide, not the player

## Decision

Adopt a **mixed-mode architecture**:

- **Envelope chrome** (header, sidebar, bottom bar, scene tabs): lives outside the Stage, uses `px`/`rem`, responsive to viewport via Tailwind breakpoints.
- **Style content + internal navigation**: lives inside the Stage, uses `cqw`/`cqh`, scales as a whole.
- **Pure Mode** (`&pure=1`): hides all Envelope chrome, leaving only the Stage. This satisfies the "slide only" use case for screenshots and iframe embedding.

Communication between Envelope and Style: the `onNavigate(scene, beat)` callback prop. The Envelope passes it to the Style; the Style's internal navigation calls it to request a scene/beat change. The Envelope updates URL state and re-renders.

## Consequences

### Positive
- Envelope can be properly responsive (mobile sidebar collapse, etc.)
- Clear separation of concerns: Workbench is a player, Styles are content
- Pure Mode provides the "clean slide only" view when needed
- Sub-agents building Styles don't need to know about Envelope layout

### Negative
- Two unit systems in the codebase (`px`/`rem` for chrome, `cqw`/`cqh` for styles) — must be disciplined about which is used where
- Scene tabs and bottom progress bar are NOT part of the slide — they won't appear in screenshots of the Stage alone. This is intentional (they are player controls), but means if we ever want "screenshot of slide with navigation", we need Pure Mode + the Style's own internal nav.

### Hard to reverse
This is a foundational architectural decision. Changing it later would mean rewriting either all Envelope components (to use `cqw`/`cqh` and live inside Stage) or restructuring the Stage/Envelope boundary. The cost is moderate but meaningful.
