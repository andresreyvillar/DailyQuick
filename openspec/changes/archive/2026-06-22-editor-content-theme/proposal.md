## Why

The board chrome restyles per theme (Nítido / Bullet Journal / Cítrico), but the Milkdown editor's
*content* still uses Crepe's default palette and fonts — so notes look out of place, especially in
Bullet Journal (cream paper) and Cítrico (violet tint). This themes the editor's internal content to
the active theme and makes checkboxes/links use each project's accent color.

## What Changes

- **Editor palette + fonts follow the theme**: Crepe's internal CSS variables (`--crepe-color-*`,
  `--crepe-font-*`) are mapped to our theme tokens, so the editor background, body text, headings, code
  blocks, inline code, and borders match the active theme. Body text stays in the sans font; headings
  use the theme's display font (Caveat in Bullet Journal); code stays monospace.
- **Per-project accent**: each editor uses its project's accent color for checked task checkboxes,
  links, the text selection, and the focus outline (via a per-column CSS variable).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `rich-editor`: adds an "editor content follows the theme and the project accent" requirement.

## Impact

- **Frontend only**: a `#root .milkdown { … }` mapping block in `styles/index.css` (Crepe vars → our
  theme-aware tokens, one block covers all themes), a heading-color + checked-checkbox rule, and a
  `--col-accent` CSS variable set per editor. `MarkdownEditor` gains an `accent` prop; `ProjectColumn`
  passes the project's accent.
- **Testing note**: the theming is CSS over Milkdown (which can't run under jsdom), so visual
  correctness is verified live; the unit test covers the accent wiring (`ProjectColumn` → editor).
- **Out of scope**: pixel-exact checkbox box geometry (`--check-radius`/border) and the mockup's code
  block "filename · language" header chrome — deeper restyles, tracked separately.
