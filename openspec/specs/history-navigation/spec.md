# history-navigation Specification

## Purpose
TBD - created by archiving change history-navigation. Update Purpose after archive.
## Requirements
### Requirement: Navigate between days
The board SHALL let the user move to the previous or next day; on navigation it loads and shows the
selected day's notes and date. Viewing a day SHALL NOT create its folder.

#### Scenario: Go to the previous day
- **GIVEN** the board shows `2026-06-21`
- **WHEN** the user goes to the previous day
- **THEN** the board loads `2026-06-20` and the header shows it

#### Scenario: Go to the next day
- **GIVEN** the board shows `2026-06-20`
- **WHEN** the user goes to the next day
- **THEN** the board loads `2026-06-21`

#### Scenario: Viewing a day does not create its folder
- **GIVEN** no folder exists for `2026-06-15`
- **WHEN** the user navigates to it
- **THEN** the board shows an empty day and no folder is created (only saving an edit creates it)

### Requirement: Jump back to today
The board SHALL provide a way to return to today's board from any day.

#### Scenario: Return to today
- **GIVEN** the board shows a past day `2026-06-18`
- **WHEN** the user chooses "today"
- **THEN** the board loads today's day key

### Requirement: Header reflects the selected day
The date header SHALL show the date of the currently selected day, not always today.

#### Scenario: Header shows the selected day
- **GIVEN** the selected day is `2026-06-20`
- **WHEN** the board renders
- **THEN** the header shows "20 de junio de 2026"

### Requirement: Day-key arithmetic
The system SHALL compute adjacent day keys correctly across month and year boundaries.

#### Scenario: Rollover forward across a month
- **GIVEN** the key `2026-06-30`
- **WHEN** one day is added
- **THEN** the result is `2026-07-01`

#### Scenario: Rollover backward across a month
- **GIVEN** the key `2026-03-01`
- **WHEN** one day is subtracted
- **THEN** the result is `2026-02-28`

