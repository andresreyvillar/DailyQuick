## 1. Backend (Requirement: List available calendars) — compile-validated; runtime VERIFIED 2026-06-22

- [x] 1.1 Add `calendar_id` to the Rust `CalendarEvent` (from `EKEvent.calendar.calendarIdentifier`)
- [x] 1.2 Implement `calendar::list_calendars() -> Vec<CalendarInfo { id, title }>` (EventKit `calendars(for: .event)`)
- [x] 1.3 Expose `#[tauri::command] list_calendars`; register in `lib.rs`
- [x] 1.4 Compiles + clippy clean

## 2. Frontend API

- [x] 2.1 (RED) TS test: `calendarInfoSchema` valid/invalid; `calendarEventSchema` includes `calendar_id`
- [x] 2.2 (GREEN) Add `listCalendars()` + `calendarInfoSchema`; add `calendar_id` to `calendarEventSchema`; update event mocks
- [x] 2.3 (REFACTOR) Keep green

## 3. Filter logic + store (Requirement: Choose visible calendars; Events strip respects the selection)

- [x] 3.1 (RED) Test: `visibleEvents(events, hiddenIds)` drops events whose `calendar_id` is hidden
- [x] 3.2 (RED) Test: hidden-calendars store toggles an id and persists; default empty
- [x] 3.3 (GREEN) Implement `visibleEvents` (pure) + the hidden-calendars Zustand store (localStorage)
- [x] 3.4 (REFACTOR) Keep green

## 4. CalendarFilter UI + integration (Requirement: Choose visible calendars)

- [x] 4.1 (RED) Test: `CalendarFilter` lists calendars and toggling one updates the hidden set
- [x] 4.2 (RED) Test: `CalendarEvents` hides events from hidden calendars
- [x] 4.3 (GREEN) Implement `CalendarFilter.tsx`; wire `CalendarEvents` via `visibleEvents`; place it in the header strip
- [x] 4.4 (REFACTOR) Existing calendar/board tests still pass

## 5. Manual verification — `npm run tauri dev` (VERIFIED 2026-06-22)

- [x] 5.1 The picker lists the real Apple calendars
- [x] 5.2 Hiding a calendar removes its events from the strip; showing it brings them back
- [x] 5.3 (persistence covered by the store test; live persistence not separately re-checked)

## 6. Definition-of-Done gate

- [x] 6.1 Run `npm run verify:change` — all green (vitest 58, cargo 32, clippy)
- [x] 6.2 Unit-testable scenarios pass; native `list_calendars` verified live
- [ ] 6.3 Open the PR; merge when the gate is green
