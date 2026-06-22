## ADDED Requirements

### Requirement: List the selected day's calendar events
The system SHALL list the events of a given day from Apple Calendar (EventKit), read-only, returning
each event's title, start, end, all-day flag, and calendar name, ordered by start time.

#### Scenario: Events for a day are returned
- **GIVEN** the user has granted calendar access and has events on `2026-06-22`
- **WHEN** `list_events("2026-06-22")` is called
- **THEN** it returns those events with title/start/end/all-day/calendar, ordered by start time

#### Scenario: A day with no events
- **GIVEN** calendar access is granted and `2026-06-22` has no events
- **WHEN** `list_events("2026-06-22")` is called
- **THEN** it returns an empty list

#### Scenario: Access denied
- **GIVEN** the user has denied calendar access
- **WHEN** `list_events` is called
- **THEN** it returns a typed calendar-access error (the UI shows a "grant access" state, not a crash)

### Requirement: Day-range bounds are correct
The system SHALL query events within the local day `[00:00, next-day 00:00)` for the given key.

#### Scenario: Bounds for a day
- **GIVEN** the key `2026-06-22`
- **WHEN** the day bounds are computed
- **THEN** the start is local `2026-06-22 00:00` and the end is local `2026-06-23 00:00`

### Requirement: Show events in the board header
The board SHALL show the selected day's events in a calendar panel, with loading, empty, and
access-denied states.

#### Scenario: Events render in the header
- **GIVEN** `list_events` returns two events for the selected day
- **WHEN** the board header renders
- **THEN** both events are shown with their title and time

#### Scenario: Access-denied state
- **GIVEN** `list_events` returns a calendar-access error
- **WHEN** the panel renders
- **THEN** it shows a message prompting the user to grant calendar access (no crash)
