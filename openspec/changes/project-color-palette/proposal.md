## Why

A project's color is currently chosen with the native OS color picker (`<input type="color">`), which
is off-brand and lets the color drift anywhere. The design wants a curated **palette of the six project
accents** (Azul / Teal / Verde / Ámbar / Rosa / Violeta) for one-click, on-brand recoloring — while
still allowing a **custom color** for anyone who needs it.

## What Changes

- **`ColorPicker` UI primitive**: a swatch button (showing the current color) opens a popover with the
  six accent swatches; clicking one applies it. A "Personalizado" entry opens the native color input
  for any hex (the escape hatch). Overlay + outside-click closes it.
- **Project recolor uses it**: the `ProjectColumn` header's color dot becomes the `ColorPicker`,
  wired to the existing `setColor` action.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `project-management`: adds a "choose a project color from the accent palette (with a custom option)"
  requirement; the existing recolor persistence requirement is unchanged.

## Impact

- **Frontend only**: a new `components/ui/ColorPicker.tsx` (reuses `lib/accent-palette` `ACCENTS`),
  and `ProjectColumn` swapping its native color input for it. No backend, no storage change; recolor
  still persists via the existing `setColor` → `write_note` path. Unit-testable.
- **Out of scope**: applying the palette picker to the new-project creation form (a later, easy reuse),
  and adding/editing the palette itself.
