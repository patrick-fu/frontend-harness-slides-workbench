# Frontend Harness Slides Workbench

[简体中文](README.zh-CN.md)

[![Styles](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ffrontend-harness-slides-workbench.vercel.app%2Fcatalog-stats.json&query=%24.styles&label=styles&color=1f6feb)](https://frontend-harness-slides-workbench.vercel.app)
[![Topics](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Ffrontend-harness-slides-workbench.vercel.app%2Fcatalog-stats.json&query=%24.topics&label=topics&color=8250df)](https://frontend-harness-slides-workbench.vercel.app)

A public React/Vite workbench for browsing independently designed slide experiences and presenting a selected Topic through a deterministic, URL-addressable player.

It is the live companion to the [Frontend Harness Slides skill](https://github.com/patrick-fu/frontend-harness-slides).

## Live demo

Explore the [live demo](https://frontend-harness-slides-workbench.vercel.app).

## Catalog and Player

- **Catalog** browses the collection with Band and Model ID filters; filters and language are shareable in the URL.
- **Player** opens a selected Style and Topic with scene and beat navigation across keyboard, pointer, and touch.

## Stage, Pure, and Frozen

- **Stage** renders each Topic on a fixed `1920×1080` canvas that scales predictably.
- **Pure** (`pure=1`) hides Workbench chrome and leaves the Stage.
- **Frozen** (`frozen=1`) disables animations and transitions for repeatable capture and review.

## URL queries

Append these query strings to the live-demo URL:

```text
?view=overview&band=minimal-keynote&model=GPT+5.5&lang=en
?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0
?view=lab&style=minimal-product-keynote&topic=product-keynote&scene=1&beat=0&pure=1&frozen=1
```

`scene` is one-based; `beat` is zero-based.

## Quick start

Requires Node.js 22.

```bash
nvm use
npm ci
npm run dev
```

## Validation

Run the repository checks first, then the browser audit:

```bash
npm run ci
npm run test:audit
```

## Documentation

- [Adding Topics](AGENTS.md#adding-topics) — guidance for adding one, several,
  or a full Model coverage of slide presentations.
- [AGENTS.md](AGENTS.md) — complete agent and maintenance guidance.
- [CONTEXT.md](CONTEXT.md) — shared domain glossary.
- [ADRs](docs/adr/) — architecture decision records.
- [SECURITY.md](SECURITY.md) — vulnerability reporting policy.

## Security

Report vulnerabilities according to [SECURITY.md](SECURITY.md).

## Third-party notices

The Stadium Wave Topic includes local copies of two [OpenMoji 16.0](https://openmoji.org/) color SVG assets designed by OpenMoji:

- `openmoji-person-standing.svg` — Unicode `U+1F9CD`
- `openmoji-person-raising-hand.svg` — Unicode `U+1F64B`

Source: [OpenMoji](https://openmoji.org/). Both files are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The local copies were optimized only for whitespace and numeric precision; their visual form is otherwise preserved. The Workbench changes poses with CSS transforms and combines the standing figure with an original seat outline. The two local SVGs remain under CC BY-SA 4.0.

## License

The Workbench code and original assets are available under the [MIT License](LICENSE). That license does not relicense the OpenMoji SVGs, which remain CC BY-SA 4.0.
