## Context

The board chrome is already styled with Tailwind v4 `@theme` tokens (`--color-surface`, `--color-strong`,
…) for the single "Nítido" light look. The design adds two more finished themes (`bujo`, `citrus`) plus a
selector. Tailwind v4 compiles color utilities to `var(--color-…)`, so overriding those variables under a
`data-theme` root attribute restyles the whole tree from one place — no per-component theme branches.

## Goals / Non-Goals

**Goals:** three selectable themes (Nítido / Bullet Journal / Cítrico) expressed as CSS-variable sets on a
`data-theme` root; a persisted choice re-applied on launch; a header selector; full personality (Caveat
font + dotted paper + washi-tape for bujo, animated citrus strip for citrus).

**Non-Goals:** theming the Milkdown editor's internal content (checkboxes/code — the editor-content
follow-up), a true dark mode, and the formatting toolbar (separate slice).

## Decisions

- **Theme as data attribute + CSS variables.** `styles/index.css` keeps the `@theme` block as the `nitido`
  defaults and adds `html[data-theme="bujo"]` / `html[data-theme="citrus"]` blocks that override the color
  tokens **and** a small set of non-color theme vars: `--font-display`, `--date-size`, `--date-weight`,
  `--col-title-size`, `--section-head-size`, `--radius-col`, `--col-shadow`, `--band-border-width`,
  `--band-border-style`, `--board-image`. `html[data-theme]` (specificity 0,1,1) reliably beats the
  `@theme`/`:root` defaults. Add the **Caveat** font to the Google Fonts import and the `floatY` /
  `citrusSlide` keyframes.
- **Token-driven wiring (no per-component color/type conditionals).** Add a few utility classes in
  `index.css` that read the vars — `.board-date`, `.col-title`, `.section-head` (font/size), `.col-card`
  (`--radius-col` + `--col-shadow`), `.col-band` (`--band-border-width/style`), `.board-canvas`
  (`--board-image`) — and apply them in `DayHeader`, `ProjectColumn`, and `Board`. The column-band tint
  stays computed from the project hex via `color-mix`; only its border **width/style** comes from the theme.
- **Theme store** (`src/state/theme-store.ts`, mirrors `loadOrientation`): `theme: 'nitido'|'bujo'|'citrus'`,
  `setTheme(t)` persists to `localStorage["dailyquick:theme"]` and sets `document.documentElement.dataset.theme`;
  `loadTheme()` reads storage (default `nitido`). The app shell calls a one-time apply on init.
- **ThemeSelector** (`src/components/board/ThemeSelector.tsx`): a header button showing the active theme's
  swatch → popover (overlay + outside-click, like the event/column menus) listing the three themes
  (swatch + name); choosing one calls `setTheme`. Lives in the header's right cluster.
- **Decorations are conditional elements, not tokens.** `Board` renders the animated citrus strip only when
  `theme === 'citrus'`; `ProjectColumn` renders the animated washi-tape only when `theme === 'bujo'`; the
  dotted paper is just `--board-image` on `.board-canvas`. These read the theme store directly (decoration,
  not color/typography).

## Risks / Trade-offs

- **Tailwind var override** — if a color utility ever inlined its value instead of `var(--color-…)`, the
  override would no-op; verified by `npm run build` + the live check. Mitigated by `html[data-theme]`
  specificity.
- **Caveat legibility at body sizes** — bujo uses Caveat only for display text (date/titles/section heads),
  never for note body or mono, keeping notes readable.
- **Band border fidelity** — arbitrary project colors mean the bujo "dashed saturated" band border is the
  `color-mix` border at `--band-border-width/style`, close to but not pixel-identical to the mockup's fixed
  demo accents; acceptable for a generalized palette.
