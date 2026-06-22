## Why

The events strip shows events from **all** synced calendars (work, colleagues' birthdays, personal…).
Users want to choose which calendars are visible — e.g. show only Work and hide birthdays.

## What Changes

- A `list_calendars` command returning the user's Apple **event calendars** (id + title).
- Each event exposes its **`calendar_id`** so events can be matched to a calendar reliably.
- A **calendar picker** in the board header to toggle each calendar on/off; the choice **persists**, and
  the events strip shows only events from visible calendars. New calendars are visible by default.

## Capabilities

### New Capabilities
- `calendar-filter`: list the available Apple calendars and let the user choose which are visible
  (persisted); the day's events strip respects that selection.

### Modified Capabilities
<!-- calendar: events gain an additive `calendar_id` field used for filtering (no behavior removed). -->

## Impact

- **Rust**: a `list_calendars` command (EventKit `calendarsForEntityType(.event)`); add `calendar_id`
  to `CalendarEvent` (EKEvent → `calendar.calendarIdentifier`).
- **TS**: `listCalendars` + `calendarInfoSchema`; add `calendar_id` to `calendarEventSchema`; a
  `CalendarFilter` component + a persisted store of hidden calendar ids; `CalendarEvents` filters.
- **Verification**: filtering logic + UI + persistence are unit-tested; the two native calls
  (`list_calendars`, `calendar_id`) are compile-validated and confirmed with a short `tauri dev`
  check (lower risk than #9 — access is already granted; `calendars` is a sync property). Draft PR.
- **Out of scope**: per-day calendar selection, calendar colors, reminders calendars.
