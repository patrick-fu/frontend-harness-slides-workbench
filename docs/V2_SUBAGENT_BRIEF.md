# Curated v2 Sub-Agent Brief

Use this brief for each independent v2 style worker.

## Mission

Build one curated `v2` style version for Frontend Harness Slides Workbench. The
version must feel like a new authored presentation, not a remix of v1.

## Allowed Inputs

- `docs/STYLE_AUTHORING_SPEC.md`
- `docs/STYLE_TRANSITION_PLAN.md`
- `docs/V2_ASSIGNMENT_MATRIX.md`
- This file
- `src/types.ts`
- `src/styles/version.ts`
- `src/styles/SpatialSceneTrack.tsx`
- `src/hooks/useFLIP.ts`
- The assigned Design DNA file under
  `/Users/patrickfu/.agents/skills/frontend-harness-slides/references/style/`

## Forbidden Inputs

Do not read existing v1 style implementation files:

- `src/styles/[0-9][0-9]-*.tsx`
- `src/styles/[0-9][0-9]-*.module.css`
- style-specific v1 tests

Shared protocol tests may be read only when debugging a public contract failure.
Never copy v1 layout, content, CSS structure, transition state, or navigation.

## Design Board Step

Before coding, create one temporary design-board image with GPT-Image-2 or the
available image generation tool.

Requirements:

- One image contains five 16:9 scene thumbnails in a single board.
- It must show the assigned topic, style-specific visual language, navigation
  treatment, and rough motion states.
- Store it under
  `/tmp/frontend-harness-slides-v2-design-boards/{styleId}/`.
- Do not commit it.
- Do not use it as a runtime image or text source.

## Implementation Contract

- Create a new version module and optional CSS module for the assigned style.
- Export `defineStyleVersion({ id: "v2", topic: { en, zh }, model: "GPT-5.5", ... })`.
- Keep all visible slide text bilingual through `language: "en" | "zh"`.
- Render exactly five scenes.
- Use `SpatialSceneTrack` with `transitionMap`.
- Pass `reducedMotion={reducedMotion || isThumbnail}` to the track.
- Hide internal navigation in thumbnail mode.
- Keep all stage dimensions in `cqw`/`cqh`; do not use `px`, `vw`, `vh`, `rem`,
  or `em` for style-internal sizing.
- For multi-beat scenes, choose `motion` or `reserved`, expose the data
  attributes required by `STYLE_AUTHORING_SPEC.md`, and avoid hard layout jumps.
- Use DOM/SVG/CSS for slide content. Do not rasterize whole slides.

## Quality Gate

The style is not done until:

- English and Chinese render without overflow.
- The scene navigator matches the assigned metaphor.
- The five scenes have different compositions but one coherent style system.
- Edge transitions follow the assignment matrix.
- Reduced motion and thumbnail mode are stable.
- Protocol tests and relevant audits pass after integration.
