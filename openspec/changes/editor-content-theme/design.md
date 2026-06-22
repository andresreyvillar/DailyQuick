## Context

Crepe's frame theme defines its palette/fonts as `--crepe-color-*` / `--crepe-font-*` variables on the
`.milkdown` element. Our board chrome already has theme-aware tokens (`--color-*`, `--font-*`) that
change under `html[data-theme]`. Mapping Crepe's variables to ours retheme the editor content for free
across all themes. The project accent is per-column, so it is fed through a CSS variable on each editor.

## Goals / Non-Goals

**Goals:** editor background/text/headings/code/inline-code/borders follow the active theme; body in
sans, headings in the display font, code in mono; checked checkboxes / links / selection use the
project's accent.

**Non-Goals:** pixel-exact checkbox box geometry, the code-block filename header, syntax-highlight
palettes, a selection bubble toolbar.

## Decisions

- **One mapping block** in `styles/index.css`, at higher specificity than Crepe's `.milkdown` defaults:
  `#root .milkdown { … }` (id selector beats Crepe's class). It maps Crepe vars to our **theme-aware**
  tokens, so a single block covers every theme (the tokens already change under `html[data-theme]`):
  background→`--color-surface`, on-background/on-surface→`--color-body`, surface→`--color-field`,
  surface-low→`--color-line-soft`, on-surface-variant→`--color-muted`, outline→`--color-disabled`,
  hover→`--color-hover`, selected→`--color-line`, inline-code→`--color-body`;
  font-default→`--font-sans`, font-title→`--font-display`, font-code→`--font-mono`.
- **Heading color**: `#root .milkdown :is(h1,h2,h3,h4,h5,h6) { color: var(--color-strong); }`.
- **Per-project accent**: `MarkdownEditor` takes an `accent` prop and sets `--col-accent` on its
  wrapper. The mapping block reads it: `--crepe-color-primary: var(--col-accent, var(--color-strong));`
  (set on `#root .milkdown`, so it wins over Crepe's own `--crepe-color-primary` while inheriting the
  per-column `--col-accent`). The checked checkbox SVG (which Crepe fills with `--crepe-color-outline`)
  is overridden to the accent: `#root .milkdown …label-wrapper .checked svg { fill: var(--crepe-color-primary); }`.
- **`ProjectColumn`** passes `accent={accent}` to `MarkdownEditor`.

## Risks / Trade-offs

- **Not unit-testable**: Milkdown doesn't run under jsdom, so the theming is verified live; the unit
  test covers only the accent wiring (`ProjectColumn` → editor, via the stubbed editor exposing the
  accent). Consistent with the editor-toolbar slice.
- **Crepe internals**: the checkbox-fill override targets Crepe's `.label-wrapper .checked svg`; if a
  Crepe update renames it, only the checked-accent color regresses (graceful — falls back to outline).
- **`--col-accent` indirection**: setting the accent on the wrapper and reading it in `#root .milkdown`
  is required because Crepe re-declares `--crepe-color-primary` directly on `.milkdown` (a wrapper-level
  value alone would be shadowed).
