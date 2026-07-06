# Frontend Harness Slides Workbench

Public demo workbench for the Frontend Harness Slides style system.

The app is a gallery and presenter shell for 48 independent slide styles. Each
style is a self-contained React component with its own scenes, beats, metadata,
fonts, navigation, animation, and visual language. The Workbench provides the
outer chrome: overview, filtering, sidebar navigation, stage scaling, keyboard
navigation, pure mode, frozen mode, and visual audit coverage.

Production:

https://frontend-harness-slides-workbench.vercel.app

## Architecture

The project uses a mixed Envelope/Stage architecture.

- Envelope: app chrome such as header, sidebar, version bar, bottom bar, and
  overview cards. It uses responsive browser UI units.
- Stage: fixed `1920x1080` slide canvas. It is scaled with CSS transforms and
  passes stable container-query units to every style.
- Style: isolated slide implementation. It receives `BespokeStyleProps` and
  exports `getMetadata(language)`.

Important source files:

- `src/App.tsx`: app shell and URL state wiring.
- `src/components/LabView.tsx`: stage rendering and presenter navigation.
- `src/components/OverviewView.tsx`: public gallery and filtering.
- `src/styles/registry.ts`: authoritative list of all styles and versions.
- `src/types.ts`: style props and metadata contract.
- `docs/STYLE_AUTHORING_SPEC.md`: rules for adding or editing styles.

## URL Format

The app uses hash routing so static hosting can serve every view from one file.

```text
#view=overview
#view=lab&style=01&version=v1&scene=1&beat=0
#view=lab&style=33&version=v1&scene=3&beat=1&pure=1&frozen=1
```

Useful flags:

- `pure=1`: hide Workbench chrome and show only the stage.
- `frozen=1`: disable animations and transitions for deterministic capture.

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
```

`npm run test:audit` runs Playwright against the production-style preview
server defined in `playwright.config.ts`.

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
