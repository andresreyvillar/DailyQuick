## Why

The date header is the board's visual anchor, but the day-navigation controls shift horizontally as
the day label changes length (a short "Lunes, 20 de julio" vs a long "Miércoles, 23 de septiembre"),
so the arrows jump under the cursor when moving between days. There is also no cue for whether the
day you are viewing is today, a past day, or a future day.

## What Changes

- The date renders in a **fixed-width slot** so the previous/today/next controls stay in the exact
  same position when navigating between days.
- The header **indicates the selected day's relation to today**: today is highlighted with a color
  accent (a "Hoy" marker); a past or future day is de-emphasized and shows how far it is
  ("Ayer"/"Mañana", "hace N días"/"en N días").
- A pure `dayOffset` / `dayRelation` helper in `src/lib/date-key.ts` computes the relation from the
  day keys.

## Capabilities

### Modified Capabilities
- `history-navigation`: add a stable date/control position and a today/past/future indicator to the
  day header.

## Impact

- `src/lib/date-key.ts` — add `dayOffset` and `dayRelation`.
- `src/components/board/DayHeader.tsx` — take the day key, render the fixed slot + relation treatment.
- `src/components/board/Board.tsx` — pass the day key to `DayHeader`.
- `src/styles/index.css` — `--date-slot` width and `--date-accent` tokens (per theme) + slot utility.
- No on-disk contract, Tauri command, or dependency changes.
