## 1. Date-key helpers (Requirement: Day-key arithmetic)

- [x] 1.1 (RED) Tests in `date-key.test.ts`: `addDays("2026-06-30", 1)` → `2026-07-01`; `addDays("2026-03-01", -1)` → `2026-02-28`; `addDays("2026-12-31", 1)` → `2027-01-01`
- [x] 1.2 (RED) Test: `parseDateKey("2026-06-20")` round-trips to `2026-06-20`
- [x] 1.3 (GREEN) Implement `parseDateKey` (local midnight from Y/M/D parts) and `addDays` in `date-key.ts`
- [x] 1.4 (REFACTOR) Keep green

## 2. Board store navigation (Requirements: Navigate between days; Jump back to today)

- [x] 2.1 (RED) Test: `goToPreviousDay()` from `2026-06-21` calls `list_day("2026-06-20")` and sets `dayKey`
- [x] 2.2 (RED) Test: `goToNextDay()` from `2026-06-20` loads `2026-06-21`
- [x] 2.3 (RED) Test: `goToToday()` loads `todayKey()`
- [x] 2.4 (RED) Test: navigation does NOT call `ensure_day` or `write_note`
- [x] 2.5 (GREEN) Implement `goToDay`/`goToPreviousDay`/`goToNextDay`/`goToToday` (reuse `loadDay`)
- [x] 2.6 (REFACTOR) Keep green

## 3. DayNavigator component (Requirement: Navigate between days; Jump back to today)

- [x] 3.1 (RED) Test: clicking "previous"/"today"/"next" loads the matching day
- [x] 3.2 (GREEN) Implement `src/components/board/DayNavigator.tsx` (prev / today / next buttons, aria-labels)
- [x] 3.3 (REFACTOR) Keep green

## 4. Board integration (Requirement: Header reflects the selected day)

- [x] 4.1 (RED) Test: with `dayKey = 2026-06-20`, the board header shows "20 de junio de 2026"
- [x] 4.2 (GREEN) `Board` passes `parseDateKey(dayKey)` to `DayHeader` and renders `<DayNavigator>` in the header
- [x] 4.3 (REFACTOR) Existing board tests still pass

## 5. Definition-of-Done gate

- [x] 5.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 5.2 Every spec scenario maps to a passing test
- [ ] 5.3 Open the PR for this change; merge only when the gate is green
