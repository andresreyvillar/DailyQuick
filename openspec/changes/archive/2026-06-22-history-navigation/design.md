## Context

`daily-board` always loads today via `App` on mount. The board store already has `loadDay(key)` and
`dayKey`. History navigation reuses these: it just changes *which* key is current and re-loads. No new
backend command is needed — `list_day` returns an empty list for days with no folder, so viewing a day
never creates one (only `write_note` does, when an edit is saved).

## Goals / Non-Goals

**Goals:**
- Move to previous/next day and back to today from the board header.
- The board (and its date header) reflect the selected day.
- Correct day-key arithmetic across month/year boundaries.

**Non-Goals:**
- Date-picker / calendar jump, keyboard shortcuts, search (later slices).
- Read-only past days — editing any day stays allowed (same persistence path).

## Decisions

- **Pure date helpers in `date-key.ts`**: `parseDateKey(key)` → `Date` (local midnight via Y/M/D
  parts) and `addDays(key, n)` → key (construct `new Date(y, m-1, d + n)`, reformat with `toDateKey`).
  Rationale: building from parts avoids the UTC-parse pitfall of `new Date("YYYY-MM-DD")` (which is
  UTC midnight and can shift a day in negative offsets); day stepping at local midnight is robust.
- **Store actions** `goToPreviousDay` / `goToNextDay` = `loadDay(addDays(dayKey, ∓1))`; `goToToday` =
  `loadDay(todayKey())`; `goToDay(key)` = `loadDay(key)`. They reuse the existing `loadDay` (which
  sets `dayKey` and fetches notes). No `ensureDay` on navigation — viewing must not create folders.
- **Header** stays prop-driven (`DayHeader date={...}`); `Board` passes `parseDateKey(dayKey)` so the
  header shows the selected day. Keeps `DayHeader` unit-testable in isolation.
- **`DayNavigator`** component (prev / today / next buttons) wired to the store, placed in the board
  header next to the date.

## Risks / Trade-offs

- **Timezone/DST in date math** → construct dates from Y/M/D parts at local midnight (not UTC string
  parsing); unit-tested across month boundaries.
- **Navigating to empty days** → shows the existing empty state; expected.
- **No folder on view** → guaranteed by reusing `list_day` (which never creates) and not calling
  `ensureDay` during navigation; covered by a store test asserting `ensureDay`/`write_note` are not
  called on navigation.
