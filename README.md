# Frontend Harness Slides Workbench

🎬 Companion live demo for
[frontend-harness-slides](https://github.com/patrick-fu/frontend-harness-slides).

This project turns the `frontend-harness-slides` style catalog into a live,
browsable, presenter-ready experience. It is the place to inspect the styles,
compare their visual DNA, and capture deterministic slide frames.

🚀 Live demo:

https://frontend-harness-slides-workbench.vercel.app

## What It Shows

✨ 49 independent slide styles, 146 Topics
Each Topic is one exact slide deck with its own Model ID, scenes, beats,
metadata, navigation, animation, and visual language.

🧭 Catalog + Player shell
Browse every Topic in one responsive Catalog, filter by Category and Model ID,
then open the Player with Library, search, scene/beat controls, keyboard input,
pointer zones, and mobile touch gestures.

🖼️ Stable 16:9 stage  
Every style renders inside a fixed `1920x1080` stage and scales predictably for
desktop, mobile, screenshots, and PDF-oriented capture flows.

🧪 Capture-friendly modes  
Use pure mode to hide Workbench chrome and frozen mode to disable animation for
deterministic visual review.

## Architecture

The project uses a mixed Envelope/Stage architecture.

- Envelope: Catalog header/filter chrome and Player rail/top bar/transport. It
  uses responsive browser UI units.
- Stage: fixed `1920x1080` slide canvas. It is scaled with CSS transforms and
  passes stable container-query units to every style.
- Style: isolated slide implementation. It receives `BespokeStyleProps` and
  exports `getMetadata(language)`.

Important source files:

- `src/App.tsx`: app shell and URL state wiring.
- `src/components/LabView.tsx`: stage rendering and presenter navigation.
- `src/components/OverviewView.tsx`: public gallery and filtering.
- `src/styles/catalog-source.ts`: eager authoring source used by protocol checks.
- `src/styles/catalog-manifest.generated.ts`: generated synchronous Catalog data.
- `src/styles/registry.ts`: runtime metadata plus lazy per-Topic Stage loaders.
- `src/types.ts`: style props and metadata contract.
- `docs/STYLE_AUTHORING_SPEC.md`: rules for adding or editing styles.

## URL Format

The app uses query-string routing so every captured frame has a stable URL.

```text
?view=overview
?view=overview&band=minimal-keynote&model=GPT+5.6+Sol&lang=en
?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0
?view=lab&style=engineering-whiteboard-explainer&topic=from-prompt-to-patch&scene=3&beat=1&pure=1&frozen=1
```

Useful flags:

- `pure=1`: hide Workbench chrome and show only the stage.
- `frozen=1`: disable animations and transitions for deterministic capture.
- repeated `band` and `model`: multi-select Catalog filters.
- `lang=en|zh`: shareable language override.

## Development

Use Node.js 22.

```bash
nvm use
npm ci
npm run dev
```

Common checks:

```bash
npm run typecheck
npm run build
npm run test:unit
npm run test:audit
npm run ci
npm run generate:showcase-thumbnails
npm run verify:showcase-thumbnails
```

`npm run test:audit` runs Playwright against the production-style preview
server defined in `playwright.config.ts`.

`npm run ci` also checks the generated Catalog manifest and all 146 committed
English WebP thumbnails. Topic Stage code and CSS are loaded only when opened or
prefetched; the Catalog does not eagerly load slide components.

## Repository Status

The repository is public, but the package remains marked `"private": true` to
prevent accidental npm publication. It is an app/demo repository, not an npm
library package.

## Documentation

- `PRD.md`: product and architecture requirements.
- `CONTEXT.md`: decision log and current state.
- `ACCEPTANCE.md`: validation report and known risks.
- `docs/MAINTENANCE.md`: maintenance playbook.
- `docs/adr/0001-mixed-mode-envelope-stage-architecture.md`: architecture ADR.
