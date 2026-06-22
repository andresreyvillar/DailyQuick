## Why

DailyQuick is a daily board for meeting notes and tasks; seeing the **day's calendar events** in the
header gives context while writing. This adds read-only Apple Calendar (EventKit) events for the
selected day.

## What Changes

- A `list_events(day_key)` Tauri command that returns the day's events from **Apple Calendar via
  EventKit** (read-only): title, start/end, all-day flag, calendar name.
- A `CalendarEvents` panel in the board header showing the selected day's events (with loading, empty,
  and permission-denied states).
- macOS calendar **permission** wiring (usage description + entitlement); first use prompts the user.

## Capabilities

### New Capabilities
- `calendar`: read-only listing of the selected day's Apple Calendar events, surfaced in the board.

### Modified Capabilities
<!-- None: consumes day key + history-navigation's selected day; storage untouched. -->

## Impact

- **New Rust**: a `calendar` module using `objc2` + `objc2-event-kit` (+ `objc2-foundation`, `block2`);
  a `list_events` command. New `StorageError::Calendar(String)` variant for access/denied errors.
- **New TS**: `listEvents(dayKey)` + `CalendarEvent` zod schema in `notes-api.ts`; `CalendarEvents`
  component in the day header.
- **macOS config**: `NSCalendarsFullAccessUsageDescription` (Info.plist / `tauri.conf.json` bundle) and
  the calendar entitlement so the app can request access.
- **Calendar = Apple Calendar / EventKit, read-only** (per project policy — never Google Calendar API).
- **Out of scope**: creating/editing events (read-only), reminders, recurring-event expansion nuances
  beyond what EventKit's predicate returns.

## Verification note

EventKit needs the macOS TCC **permission prompt** and a running app, which cannot be exercised in
jsdom or headless. The **frontend + command contract + the day-range computation** are unit-tested;
the **native fetch + permission flow** are verified manually via `npm run tauri dev` on the Mac
(checklist in tasks.md). This ships as a **draft PR** until that manual check passes.
