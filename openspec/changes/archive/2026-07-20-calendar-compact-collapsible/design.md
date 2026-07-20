## Context

`Board.tsx` renders two full-width bands under the header: the "Hoy" calendar band (`CalendarEvents` +
`CalendarFilter`) and the "Forecast" band (`ForecastProjects`), each `px-5 py-[9px]`. The board store
already persists UI prefs to `localStorage` (orientation, theme).

## Goals / Non-Goals

**Goals:**
- Reclaim vertical space: a denser context region and a collapse toggle.
- Persist the collapsed state like other UI prefs.

**Non-Goals:**
- Changing what the calendar/forecast strips show or how they work.
- A per-band collapse (the whole context region collapses as one).

## Decisions

**`contextCollapsed` in the board store**, persisted to `localStorage` key `dailyquick:context-collapsed`
(default expanded), with `toggleContext()` — mirrors `orientation`/`loadOrientation`. A `loadContextCollapsed()`
reader seeds initial state.

**Board renders a single compact context region.** The two bands move into one wrapper with tighter
padding (`py-1.5`) and a small collapse toggle (chevron) in the leading "Hoy" label row. When
`contextCollapsed`, the calendar + forecast content is not rendered; only a slim bar with the expand
toggle remains (so the control is always reachable). Compactness is padding/spacing only — no change to
the chip components.

## Risks / Trade-offs

- [Collapsed users miss new events/forecast] → Accepted: the expand control stays visible; state is the
  user's explicit choice and is easily reversed.
