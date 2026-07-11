# Maintenance Guide

This guide covers routine project maintenance for the Workbench.

## Local Setup

Use Node.js 22:

```bash
nvm use
npm ci
```

Start the Vite dev server:

```bash
npm run dev
```

## Checks

Run the lightweight local gate:

```bash
npm run ci
```

Run the Playwright visual audit:

```bash
npm run test:audit
```

The audit builds the app, starts `npm run preview`, then checks Stage rendering,
overflow, Catalog coverage and filters, Player shell/navigation, Pure/Frozen
modes, reduced motion, responsive overlays, and query persistence.

## Adding Or Editing A Style

Read `docs/STYLE_AUTHORING_SPEC.md` before editing a style.

Each style or Topic needs:

- A semantic kebab-case style ID and topic ID.
- A `.tsx` style module under `src/styles/`.
- Optional `.module.css` beside the style module.
- A focused `.test.tsx` beside the style module.
- An authoring entry in `src/styles/catalog-source.ts`.
- Metadata returned by `getMetadata(language)`

After changing authoring entries, regenerate the runtime Catalog manifest:

```bash
node scripts/generate-catalog-manifest.mjs
```

The generated file is committed. `catalog-manifest.test.ts` detects drift.
Do not add eager Topic component imports to `src/styles/registry.ts`; the runtime
registry must retain one dynamic chunk per Topic.

Style components must render inside the fixed stage contract:

- Use `cqw` and `cqh` for stage content sizing.
- Keep all visual content inside the stage root.
- Suppress internal navigation when `isThumbnail` is true.
- Respect `reducedMotion`.
- Use absolute `onNavigate(scene, beat)` semantics.

## Updating Showcase Thumbnails

Overview cards use static images from `public/showcase`. Each Topic owns one
committed 1920×1080 English WebP. Regenerate them after changing a hero frame,
Topic identity, or registry order:

1. Run `npm run generate:showcase-thumbnails`.
2. Run `npm run verify:showcase-thumbnails`.
3. Review representative files in `public/showcase/`.
4. Run `npm run ci` and `npm run test:audit`.

The generator waits for `data-topic-ready="true"`, the English language,
loaded fonts, Pure Mode, Frozen Mode, and reduced motion before capture.

## URL And Capture Modes

Use query routes for stable captures:

```text
?view=lab&style=engineering-whiteboard-explainer&topic=from-prompt-to-patch&scene=1&beat=0&pure=1&frozen=1
```

- `pure=1` hides all Workbench chrome.
- `frozen=1` disables animations and transitions.

## Deployment

Production deploys through GitHub Actions and Vercel on pushes to `main`.

Required GitHub secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

The CI workflow runs typecheck, build, and unit tests before deployment.

## Known Maintenance Risks

- Synchronous bilingual metadata still makes the initial JavaScript chunk larger
  than Vite's 500 kB warning threshold. Topic Stage code and CSS are already
  split; metadata compression or segmentation is the next performance seam.
- The PRD is historical and may describe features differently from the current
  implementation. Prefer tests and current source when behavior differs.
- Playwright audit data includes hard-coded beat counts. Update
  `e2e/audit.spec.ts` when scene beat counts change.
