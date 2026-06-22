## Context

`ProjectColumn` recolors a project via a native `<input type="color">` in its header, calling the
store's `setColor`. The design replaces that with a curated palette of the six project accents (already
defined in `lib/accent-palette.ts` from the chip redesign) plus a custom-color escape hatch.

## Goals / Non-Goals

**Goals:** a reusable color control that offers the six accents as swatches and a custom-hex option;
the project recolor uses it; recolor still persists through the existing `setColor` path.

**Non-Goals:** editing the palette, applying it to the create-project form (later reuse), any backend
or storage change.

## Decisions

- **`components/ui/ColorPicker.tsx`** (reusable primitive): props `{ value, onChange, label }`. A
  swatch button (current color, `aria-label={label}`) toggles a popover (overlay + outside-click, same
  pattern as the event/column menus). The popover shows the six `ACCENTS` as swatch buttons
  (`aria-label={accent.name}`) that call `onChange(hex)` and close; the active color is highlighted. A
  "Personalizado" row holds a native `<input type="color" aria-label="Color personalizado">` whose
  change calls `onChange(hex)` — the any-hex escape hatch.
- **`ProjectColumn`**: replace the header's native color input with
  `<ColorPicker value={color} onChange={(hex) => void setColor(slug, hex)} label={\`Color de ${title}\`} />`.
  Keeping the `Color de <title>` label on the trigger preserves the control's accessible name.
- **Palette source**: reuse `ACCENTS` from `lib/accent-palette.ts` (single source of truth shared with
  the event chips).

## Risks / Trade-offs

- **Existing recolor test**: it drove the native input via a `change` event; it is updated to the new
  flow (open the control → pick an accent), asserting the same `setColor`/`write_note` persistence.
- **Popover clipping**: the column header has no `overflow:hidden`, so the popover is not clipped (same
  as the column's `⋯` menu).
