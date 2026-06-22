## Why

The board only ever shows today. DailyQuick promises a **browsable history** so the user can see what
was done on previous days (and edit past entries). This adds day-to-day navigation.

## What Changes

- Navigate to the **previous / next day** and **jump back to today** from the board header.
- The board **loads and displays the selected day** (its notes and date), not only today.
- The date header reflects the **selected** day, not always today.
- Pure day-key arithmetic (`addDays`) + key↔Date parsing in `date-key.ts`.

## Capabilities

### New Capabilities
- `history-navigation`: browse to other days (previous / next / today); the board loads the selected
  day's notes and the header shows its date.

### Modified Capabilities
<!-- None at the spec level: daily-board still renders "the current day"; navigation just changes
     which day is current. Viewing a day never creates a folder; editing+saving still does. -->

## Impact

- **New TS**: `addDays` / `parseDateKey` in `src/lib/date-key.ts`; board-store actions `goToDay`,
  `goToPreviousDay`, `goToNextDay`, `goToToday`; a `DayNavigator` component; `Board` passes the
  selected day's date to `DayHeader` and renders the navigator.
- **Consumes** existing `list_day` / `read_note` — no new backend command. Navigating does NOT create
  day folders (only editing + `write_note` does).
- **Out of scope**: a date-picker / calendar jump, keyboard shortcuts, and search — later slices.
