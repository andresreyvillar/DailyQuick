## 1. Relation helpers (pure)

- [x] 1.1 (RED) In `src/lib/date-key.test.ts`, add tests for `dayOffset(key, today)` (past `-3`,
  today `0`, future `+2`, month-boundary `-2`) and `dayRelation(key, today)` (`past`/`today`/`future`).
- [x] 1.2 (GREEN) Implement `dayOffset` and `dayRelation` (with `DayRelation` type) in
  `src/lib/date-key.ts`.
- [x] 1.3 (REFACTOR) Keep pure; `today` defaults to `todayKey()`.

## 2. Header: fixed slot + relation treatment

- [x] 2.1 (RED) In `src/components/board/DayHeader.test.tsx`, switch to the `dayKey` prop and assert:
  the date renders in a fixed-width slot element (`data-testid="date-slot"`); today shows a "Hoy"
  marker; a past day (`addDays(todayKey(), -3)`) shows "hace 3 días"; a future day
  (`addDays(todayKey(), 2)`) shows "en 2 días"; one day back reads "Ayer"; one day ahead "Mañana".
- [x] 2.2 (GREEN) Change `DayHeader` to take `dayKey`, derive the date + offset, render the fixed slot,
  the accent/"Hoy" treatment for today, and the de-emphasized relative label for past/future.
- [x] 2.3 (GREEN) Update `Board.tsx` to pass `dayKey` (default `todayKey()`), and add the
  `--date-slot`, `--date-accent` tokens (per theme) + the `.date-slot` utility in `src/styles/index.css`.
- [x] 2.4 (REFACTOR) Confirm `Board.test.tsx`'s "header shows the selected day's date" still passes.

## 3. Verify

- [x] 3.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
