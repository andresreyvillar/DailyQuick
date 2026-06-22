## Why

The design iterates the calendar event chip from a "dot + time + title + `+`" pill into a more
scannable **icon-tile chip**: a rounded tile with a white calendar glyph, tinted per calendar, plus
the time and title on two lines. EventKit does not expose calendar colors to us (only id + title), so
the tint is a **stable color derived from the calendar id** drawn from the project accent palette.

## What Changes

- **Event chip restyle** (`CalendarEvents`): each chip becomes a fixed-width chip with a 24×24
  calendar-icon tile (tinted per calendar) and a two-line time/title; the trailing `+` is removed. The
  chip still opens the actions popover on click (behavior unchanged); the popover anchor moves down to
  match the taller chip.
- **Theme-driven tile shape**: new theme variables `--chip-radius`, `--chip-icon-radius`,
  `--chip-icon-shadow`, `--chip-icon-rot` (e.g. Bullet Journal tilts the tile and adds a soft shadow).
- **Shared accent palette**: a new `lib/accent-palette.ts` exports the six project accents and a pure
  `accentForKey(id)` that maps a calendar id to a stable accent — reused later by the project color
  palette picker.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `board-redesign`: adds an "icon-tile event chips" requirement (presentation of the calendar strip's
  event chips); the existing popover/create/add requirements are unchanged.

## Impact

- **Frontend only**: `lib/accent-palette.ts` (new, pure), `components/calendar/CalendarEvents.tsx`
  (chip markup), `styles/index.css` (chip theme vars). No backend, no behavior change to the event
  actions. Unit-testable.
- **Out of scope**: reading real Apple Calendar colors (would need an EventKit change), and any change
  to the popover actions themselves.
