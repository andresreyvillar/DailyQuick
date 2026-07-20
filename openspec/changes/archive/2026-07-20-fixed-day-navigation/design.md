## Context

`DayHeader` takes a `date: Date` and renders an `<h1>` whose width tracks the day label, so the
sibling `DayNavigator` (‹ Hoy ›) shifts as the label length changes. `Board` composes them in a
`flex` row. Date math lives in `src/lib/date-key.ts` (`toDateKey`, `parseDateKey`, `addDays`,
`todayKey`). Theme tokens (including `--date-size`, which is much larger in `bujo`) live in
`src/styles/index.css` and swap under `html[data-theme]`.

## Goals / Non-Goals

**Goals:**
- Navigation controls stay pixel-stable across day changes.
- A clear, calm today/past/future cue that respects each theme.
- Keep the relation math pure and unit-tested.

**Non-Goals:**
- A date picker / calendar popover, or jumping to arbitrary dates.
- Changing the navigation actions themselves (prev/today/next already exist).

## Decisions

**`dayOffset(key, today?)` and `dayRelation(key, today?)` in `date-key.ts`.** `dayOffset` returns the
whole-day signed distance (`Math.round` of the ms difference between two local-midnight dates, so DST
never yields 23/25h drift). `dayRelation` maps the sign to `"today" | "past" | "future"`. `today`
defaults to `todayKey()` but is injectable so tests are not clock-dependent.

**`DayHeader` takes `dayKey: string`** (was `date`). It derives the display `Date` via `parseDateKey`
and the relation via `dayOffset`. The relative Spanish label ("Hoy"/"Ayer"/"Mañana"/"hace N días"/
"en N días") is formatted in the component from the offset — it is UI copy, and its output is covered
by `DayHeader` render tests rather than a separate lib function.

**Fixed slot via a theme token.** A `.date-slot` element wraps the date with `width: var(--date-slot)`
and `white-space: nowrap`. `--date-slot` is defined per theme (wider for `bujo`'s large Caveat date)
so the longest label fits without truncation; any slack is trailing space before the controls, never a
shift. The navigation controls stay outside the slot, so they never move.

**Today accent via `--date-accent`.** A per-theme token gives the "today" highlight a color that suits
each theme (blue for Nítido, warm for Bujo, violet for Cítrico). Today: accented date + a small "Hoy"
pill. Past/future: the date uses the muted token and a small neutral relative label.

_Alternative considered_: measure and reserve width in JS. Rejected — a CSS token is simpler,
theme-aware, and needs no layout measurement.

## Risks / Trade-offs

- [A fixed slot could truncate an unusually long label in a theme] → Mitigation: size `--date-slot`
  per theme for the worst-case Spanish label; `white-space: nowrap` plus generous width means slack,
  not truncation. Verified visually in `npm run tauri dev` across the three themes.
- [`DayHeader`'s prop change from `date` to `dayKey`] → Only two call sites (Board + its test); both
  updated in this slice.
