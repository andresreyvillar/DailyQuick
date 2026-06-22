## 1. Day bounds (Requirement: Day-range bounds are correct)

- [x] 1.1 (RED) Rust test: `day_bounds("2026-06-22")` → local `2026-06-22 00:00` start, `2026-06-23 00:00` end
- [x] 1.2 (GREEN) Implement pure `day_bounds(key) -> (start, end)` (chrono, local midnight)
- [x] 1.3 (REFACTOR) Keep green

## 2. EventKit backend (Requirement: List the selected day's calendar events) — compile-validated; runtime is §5

- [x] 2.1 Add deps: `objc2`, `objc2-foundation`, `objc2-event-kit`, `block2` (macOS target)
- [x] 2.2 Add `StorageError::Calendar(String)` for access/denied errors
- [x] 2.3 Implement `calendar::eventkit::fetch_events`: request full access (completion-handler bridge), predicate from `day_bounds`, fetch + map events (title/start/end/all_day/calendar), sorted; denied → `Calendar` error
- [x] 2.4 Compiles + clippy clean (`cargo build`/`test`/`clippy`) — runtime NOT verifiable here (§5)
- [x] 2.5 Expose `#[tauri::command] list_events`; register in `lib.rs`
- [x] 2.6 Add `NSCalendarsFullAccessUsageDescription` (`src-tauri/Info.plist`) so the app can request access

## 3. Frontend API (Requirement: List the selected day's calendar events)

- [x] 3.1 (RED) TS test: `calendarEventSchema` accepts a valid event and rejects a malformed one
- [x] 3.2 (GREEN) Add `listEvents(dayKey)` + `calendarEventSchema` in `notes-api.ts`
- [x] 3.3 (REFACTOR) Keep green

## 4. CalendarEvents component (Requirement: Show events in the board header)

- [x] 4.1 (RED) Test: renders the events returned by `listEvents`
- [x] 4.2 (RED) Test: empty day → empty state; access error → grant-access state (no crash)
- [x] 4.3 (GREEN) Implement `src/components/calendar/CalendarEvents.tsx` (loading/list/empty/denied)
- [x] 4.4 (GREEN) Render it in the board header
- [x] 4.5 (REFACTOR) Existing board tests still pass

## 5. Manual verification — `npm run tauri dev` (TCC permission + runtime; REQUIRED before merge)

- [ ] 5.1 First run prompts for calendar access; granting shows today's events in the header
- [ ] 5.2 A day with no events shows the empty state
- [ ] 5.3 Denying access shows the "grant access" state (no crash)
- [ ] 5.4 Event titles/times match Apple Calendar for the selected day; navigating days updates events

## 6. Definition-of-Done gate

- [x] 6.1 Run `npm run verify:change` — all green (compile-validates EventKit; runtime is §5)
- [x] 6.2 Unit-testable scenarios pass (day bounds, schema, component states); native fetch deferred to §5
- [ ] 6.3 Draft PR opened; **merge only after the gate is green AND the §5 manual checks pass**
