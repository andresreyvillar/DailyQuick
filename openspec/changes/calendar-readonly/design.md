## Context

The board shows a selected day (`history-navigation`). Adding the day's Apple Calendar events gives
context for meeting notes. Per project policy, the calendar source is **Apple Calendar via EventKit,
read-only** — never Google Calendar API.

## Goals / Non-Goals

**Goals:**
- A read-only `list_events(day_key)` command backed by EventKit, returning the day's events.
- A header panel showing the selected day's events with loading/empty/denied states.

**Non-Goals:** creating/editing events, reminders, multi-day/recurring expansion beyond EventKit's
predicate, and live refresh on external calendar changes.

## Decisions

- **EventKit via `objc2-event-kit`** (+ `objc2`, `objc2-foundation`, `block2`) in a Rust `calendar`
  module behind a `list_events` command (keeps the renderer free of native code; consistent with the
  storage layer). Rationale: native, read-only, no Google/GCP.
- **Permission**: call `requestFullAccessToEvents` (macOS 14+), bridging its completion handler to a
  blocking call via a channel; on denial return `StorageError::Calendar`. Requires
  `NSCalendarsFullAccessUsageDescription` in the bundle config and the calendar entitlement.
- **Day bounds**: a pure helper `day_bounds(key) -> (start_ts, end_ts)` (local `[00:00, +1d 00:00)`)
  computed with `chrono` — unit-tested independently of EventKit. EventKit builds its predicate from
  these via `NSDate`.
- **Event mapping**: `CalendarEvent { title, start, end, all_day, calendar }` (ISO-ish strings + bool);
  serialized to the renderer; validated with zod on the TS side.
- **Frontend**: a `CalendarEvents` component fetches `list_events(selectedDay)` and renders
  loading / list / empty / access-denied. Fully unit-tested with the command mocked.

## Testing strategy (and its limits)

EventKit needs the macOS TCC permission prompt + a running, entitled app — **not reproducible in
jsdom or headless cargo tests**. So:
- **Unit-tested**: `day_bounds` (pure), the `CalendarEvent` zod schema, and the `CalendarEvents`
  component (mocked `listEvents`: list / empty / denied states).
- **Compile-validated**: the `objc2-event-kit` usage is checked by `cargo` (build/clippy) — the gate
  ensures it compiles, not that it fetches.
- **Manual (`npm run tauri dev`)**: grant access → today's events appear; a no-event day → empty;
  deny access → the denied state shows. Listed in tasks §5; the gate cannot assert these.

## Risks / Trade-offs

- **Unverifiable native code** (no permission/runtime here) → isolate EventKit in one module; cargo
  ensures it compiles; ship as a **draft PR** with a manual-verification checklist. [Risk] the async
  permission bridge or objc2 calls are subtly wrong → Mitigation: keep the EventKit surface minimal
  and the day-bounds/mapping logic pure + tested, so only the thin native fetch needs on-device fixing.
- **Permission entitlement/usage-description missing** → app crashes on request; included in config and
  called out in the manual checklist.
- **Timezone** in day bounds → computed at local midnight via `chrono` (tested).
