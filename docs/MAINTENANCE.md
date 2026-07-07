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

The audit builds the app, starts `npm run preview`, then checks stage rendering,
overflow, core navigation, pure mode, frozen mode, URL persistence, and overview
coverage.

## Adding Or Editing A Style

Read `docs/STYLE_AUTHORING_SPEC.md` before editing a style.

Each style or topic needs:

- A semantic kebab-case style ID and topic ID.
- A `.tsx` style module under `src/styles/`.
- Optional `.module.css` beside the style module.
- A focused `.test.tsx` beside the style module.
- A registry entry in `src/styles/registry.ts`
- Metadata returned by `getMetadata(language)`

Style components must render inside the fixed stage contract:

- Use `cqw` and `cqh` for stage content sizing.
- Keep all visual content inside the stage root.
- Suppress internal navigation when `isThumbnail` is true.
- Respect `reducedMotion`.
- Use absolute `onNavigate(scene, beat)` semantics.

## Updating Showcase Thumbnails

Overview cards use static images from `public/showcase`.

After replacing images:

1. Update `src/data/showcase-thumbnails.ts` if filenames change.
2. Run `npm run build`.
3. Run `npm run test:unit`.
4. Run `npm run test:audit` when visual coverage matters.

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

- The JavaScript and CSS bundles are large because all 49 styles are imported
  eagerly. Use dynamic imports or manual chunks before adding many more styles.
- The PRD is historical and may describe features differently from the current
  implementation. Prefer tests and current source when behavior differs.
- Playwright audit data includes hard-coded beat counts. Update
  `e2e/audit.spec.ts` when scene beat counts change.
