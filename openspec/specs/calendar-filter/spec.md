# calendar-filter Specification

## Purpose
TBD - created by archiving change calendar-filter. Update Purpose after archive.
## Requirements
### Requirement: List available calendars
The system SHALL list the user's Apple event calendars (id + title) so they can be toggled.

#### Scenario: Calendars are returned
- **GIVEN** calendar access is granted
- **WHEN** `list_calendars` is called
- **THEN** it returns each event calendar's id and title

### Requirement: Choose visible calendars (persisted)
The board SHALL let the user toggle each calendar's visibility; the choice SHALL persist across
reloads. With no stored choice, all calendars are visible.

#### Scenario: Hide a calendar
- **GIVEN** calendars "Work" and "Birthdays" are listed and both visible
- **WHEN** the user toggles "Birthdays" off
- **THEN** "Birthdays" is marked hidden

#### Scenario: Selection persists across reloads
- **GIVEN** the user hid "Birthdays"
- **WHEN** the app reloads
- **THEN** "Birthdays" remains hidden

#### Scenario: Default shows all
- **GIVEN** no stored visibility choice
- **WHEN** the picker renders
- **THEN** every calendar is visible

### Requirement: Events strip respects the selection
The events strip SHALL show only events whose calendar is currently visible.

#### Scenario: Hidden calendar's events are filtered out
- **GIVEN** events from "Work" (visible) and "Birthdays" (hidden)
- **WHEN** the strip renders
- **THEN** only the "Work" events are shown

