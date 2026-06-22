## Context

`calendar-readonly` shows the day's events from every synced calendar. Users need to scope the strip
to the calendars they care about. This adds calendar listing + a persisted visibility filter, reusing
the existing EventKit access (already granted) and the events strip.

## Goals / Non-Goals

**Goals:** list the Apple event calendars; toggle each one's visibility (persisted, default all
visible); the strip shows only visible calendars' events.

**Non-Goals:** per-day selection, calendar colors, reminders calendars, server/cloud sync of the
choice.

## Decisions

- **`list_calendars()` (EventKit)**: `EKEventStore.calendars(for: .event)` → `[{ id:
  calendarIdentifier, title }]`. Access is already granted by `list_events`; `calendars` is a sync
  property, so no async-permission bridge is needed here.
- **`calendar_id` on `CalendarEvent`**: from `EKEvent.calendar.calendarIdentifier` — filter by id, not
  title (titles can collide).
- **Store HIDDEN ids** in `localStorage` (not visible ids) so newly added calendars are visible by
  default. A small store: `hiddenCalendars: Set<string>`, `toggle(id)`, persisted.
- **Client-side filtering**: `CalendarEvents` fetches all events (as today) and filters with a pure
  helper `visibleEvents(events, hiddenIds)`. Keeps the backend unchanged beyond the additive
  `calendar_id`, and makes the filter logic unit-testable.
- **UI**: a `CalendarFilter` button in the header → popover with a checkbox per calendar (from
  `list_calendars`), toggling the hidden set.

## Testing strategy

- **Unit-tested**: `visibleEvents` helper, the hidden-calendars store (toggle + persistence), the
  `CalendarFilter` component (lists calendars, toggles), and `CalendarEvents` filtering (mocked APIs).
- **Compile-validated**: `list_calendars` + `calendar_id` (objc2) via `cargo`.
- **Manual (`tauri dev`)**: the picker lists the real calendars; hiding one removes its events; the
  choice persists. (Lower risk than #9; access already works.)

## Risks / Trade-offs

- **`list_calendars` native call unverifiable here** → compile-validated + short manual check; isolated
  in the calendar module. [Risk] wrong objc2 call → only this one sync call needs on-device confirm.
- **Title collisions** → filter by `calendar_id`, not title.
- **New calendars appearing** → storing hidden ids means they default to visible (sensible).
