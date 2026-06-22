## Context

`CalendarEvents` already renders the day's events as chips that open an actions popover. The design
iterates the chip's look into an icon-tile chip. EventKit gives us only the calendar id + title (no
color), so the per-calendar tint is derived, not real.

## Goals / Non-Goals

**Goals:** an icon-tile chip (calendar glyph, per-calendar tint, two-line time/title) that keeps the
existing popover behavior; theme-driven tile shape; a shared accent palette reused by the upcoming
color picker.

**Non-Goals:** real Apple Calendar colors, any change to the popover actions, real time formatting
changes.

## Decisions

- **`lib/accent-palette.ts`** (pure): `ACCENTS` = the six project accents (`Azul #4F7FD6`, `Teal
  #2F9AA8`, `Verde #3A9D6B`, `Ámbar #C08A2E`, `Rosa #CF6470`, `Violeta #8A76D4`) and
  `accentForKey(id)` — a small deterministic string hash → `ACCENTS[hash % 6].hex`, so a calendar id
  always maps to the same accent. Reused by `project-color-palette`.
- **Chip markup** (`CalendarEvents`): a fixed-width chip (`rounded-[var(--chip-radius)]`) containing a
  24×24 tile (`rounded-[var(--chip-icon-radius)]`, `backgroundColor: accentForKey(event.calendar_id)`,
  `boxShadow: var(--chip-icon-shadow)`, `transform: rotate(var(--chip-icon-rot))`) with a white
  calendar SVG, then a two-line column (mono time, truncated title). The trailing `+` is removed; the
  chip keeps `aria-label="Acciones de <title>"` and the same click-to-open-popover handler. The popover
  anchor moves to `top-[44px]` to clear the taller chip.
- **Theme vars**: add `--chip-radius`, `--chip-icon-radius`, `--chip-icon-shadow`, `--chip-icon-rot` to
  the `:root` defaults (nitido: `8px / 5px / none / 0deg`) and the `bujo` (`9px / 6px / soft shadow /
  -4deg`) and `citrus` (`10px / 7px / none / 0deg`) blocks in `index.css`.

## Risks / Trade-offs

- **Derived (not real) calendar colors**: distinct, stable, on-brand, but won't match the user's Apple
  Calendar color exactly. Accepted (real colors deferred; would need EventKit work).
- **Existing CalendarEvents tests**: the chip keeps its `aria-label` and title/time text and the
  popover flow, so the popover/toast tests stay green; only the chip's internal markup changes.
