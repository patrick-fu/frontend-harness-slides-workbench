# AGENTS.md

Instructions for coding agents working in this repository.

## Project Role

This is a public React/Vite demo workbench for 49 independent slide styles.
Treat it as an app/demo repository, not an npm library package. Keep
`"private": true` unless the task explicitly changes npm publishing intent.

Do not use this file as product documentation. `README.md` is the human-facing
project entry. This file is for agent behavior, maintenance rules, and source
of truth ordering.

## Source Of Truth

Use current source and tests before historical docs.

Priority order:

1. Existing source and tests.
2. `CONTEXT.md` current-state notes and decisions.
3. `docs/STYLE_AUTHORING_SPEC.md` for style work.
4. `docs/adr/0001-mixed-mode-envelope-stage-architecture.md` for architecture.
5. `PRD.md` and `TASKS.md` as historical intent, not guaranteed current truth.

The current URL contract uses query-string routing with style and topic slugs:

```text
?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0
```

## Architecture Rules

Respect the Envelope/Stage split.

- Envelope chrome lives outside the stage and may use normal responsive UI
  units: `px`, `rem`, Tailwind breakpoints.
- Stage content is fixed at `1920x1080` and scaled with CSS transforms.
- Style internals must use container-query units such as `cqw` and `cqh`, not
  viewport units.
- Style components communicate with the shell only through
  `BespokeStyleProps` and `onNavigate(scene, beat)`.
- `onNavigate(scene, beat)` is absolute navigation, not relative next/prev.

Important files:

- `src/types.ts`: style contract.
- `src/styles/registry.ts`: authoritative style/topic registry.
- `src/components/LabView.tsx`: stage mounting and presenter navigation.
- `src/components/OverviewView.tsx`: gallery and filtering.
- `src/data/showcase-thumbnails.ts`: overview thumbnail mapping.
- `e2e/audit.spec.ts`: Playwright visual/navigation audit data.

## Style Work

Before adding or editing a style, read `docs/STYLE_AUTHORING_SPEC.md`.

Each style or topic normally has:

- A semantic kebab-case style ID and topic ID.
- A `.tsx` style module under `src/styles/`.
- Optional `.module.css` beside the style module.
- A focused `.test.tsx` beside the style module.
- A registry entry in `src/styles/registry.ts`

Registry array order is the only ordering system. Do not introduce numeric
sequence IDs or v1/v2 compatibility routing. Existing legacy filenames may keep
numeric prefixes, but new style IDs and topic IDs should be semantic slugs.

Style requirements:

- Render all scenes and beats declared by metadata.
- Keep visual content inside the stage root.
- Suppress internal navigation when `isThumbnail` is true.
- Respect `reducedMotion`.
- Keep `getMetadata("en")` and `getMetadata("zh")` structurally aligned.
- Update `e2e/audit.spec.ts` hard-coded beat counts if beat counts change.

Overview cards use static images from `public/showcase`; do not reintroduce
live stage thumbnail rendering unless the task explicitly asks for it and
performance is addressed.

## Commands

Use Node.js 22.

```bash
nvm use
npm ci
npm run dev
```

Validation commands:

```bash
npm run typecheck
npm run build
npm run test:unit
npm run ci
npm run test:audit
```

Default validation:

- Documentation-only changes: no test required unless scripts or examples
  changed.
- TypeScript/source changes: run `npm run ci`.
- Navigation, stage, style, thumbnail, or visual behavior changes: run
  `npm run ci` and `npm run test:audit`.

## Public Repository Hygiene

This repository is public.

Do not commit:

- Local absolute paths from a developer machine.
- Vercel deployment IDs, org IDs, project IDs, tokens, or preview secrets.
- `.env*`, `.vercel/`, build outputs, Playwright reports, or generated cache
  files.
- Screenshots or exports unless the task explicitly calls for committed
  assets.

The package is MIT licensed. Keep `LICENSE`, `package.json`, and public docs
consistent if licensing changes.

## Dependency And Tooling Changes

Avoid adding new tooling unless it solves a current problem.

- Do not add ESLint, Prettier, formatters, or new CI gates casually.
- Do not mass-format unrelated files.
- If adding dependencies, explain why existing React/Vite/TypeScript tooling
  is insufficient.
- Keep GitHub Actions aligned with package scripts instead of duplicating raw
  commands.

## Git And Worktrees

Work in a feature branch or worktree. The repository ignores `worktrees/` for
local worktree directories.

Before committing:

1. Check `git status --short --branch`.
2. Stage only files relevant to the task.
3. Run the validation command appropriate to the change.
4. Use an English commit message with a plain-sentence subject and bullet body.

For personal project commits, use:

```bash
git -c user.name="Patrick Fu" -c user.email="paaatrickfu@gmail.com" commit
```

## Documentation Boundaries

Keep documentation roles separate:

- `README.md`: polished public overview and quick start.
- `AGENTS.md`: agent instructions and maintenance guardrails.
- `docs/MAINTENANCE.md`: human maintainer playbook.
- `CONTEXT.md`: decision log and project history.
- `ACCEPTANCE.md`: validation snapshot.

Do not bury product-facing explanation in `AGENTS.md`. Do not turn `README.md`
into an internal task log.
