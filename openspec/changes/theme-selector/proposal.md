## Why

The board ships a single look (the "Nítido" light theme). The updated design adds a **theme selector**
with three finished looks — **Nítido**, **Bullet Journal**, and **Cítrico** — so the daily board can feel
clean-and-neutral, warm-and-handwritten, or fresh-and-colorful. Each theme is a coordinated set of design
tokens (neutrals, typography, radii, column-band borders) plus a little personality (paper-dot board,
washi-tape, an animated citrus strip). The user picks one; the choice persists.

## What Changes

- **Theme tokens**: the board's design tokens become themeable CSS variables. A `data-theme` attribute on
  the document root swaps the neutral palette, the display font + heading sizes, the corner radii, the
  column-band border (e.g. 2px dashed for Bullet Journal), and decoration variables.
- **Theme store**: a small Zustand store holds the active theme, persists it to `localStorage`, and applies
  `data-theme` to the document root (on load and on change).
- **Theme selector UI**: a header button shows the current theme's swatch and opens a popover listing the
  three themes (swatch + name); choosing one switches instantly. Same overlay/outside-click pattern as the
  event/column menus.
- **Personality (full fidelity)**: Bullet Journal uses the **Caveat** handwritten display font, a cream
  palette, a dotted-paper board background, and animated washi-tape on column headers; Cítrico adds an
  animated gradient strip under the header. Nítido is the current clean look (unchanged default).

## Capabilities

### New Capabilities
- `theming`: select among predefined visual themes; the choice persists and re-applies on launch.

### Modified Capabilities
<!-- None: this themes the existing board chrome; it does not change storage, the editor, or commands. -->

## Impact

- **Frontend only**: CSS variable sets in `styles/index.css` (+ Caveat font + keyframes); a `theme-store`;
  a `ThemeSelector` component in the header; token wiring in `DayHeader`, `ProjectColumn`, and `Board`.
  No backend, no Tauri command, no storage change → fully unit-testable.
- **Out of scope**: theming the Milkdown editor's *internal* content (checkboxes, code block) per theme
  (that is the tracked editor-content follow-up); a true dark mode (not yet designed); the focus-revealed
  formatting toolbar (the separate `editor-toolbar` slice).
