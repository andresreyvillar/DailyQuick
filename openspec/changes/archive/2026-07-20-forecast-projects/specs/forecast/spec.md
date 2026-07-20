## ADDED Requirements

### Requirement: Read the day's forecast from the local cache
The system SHALL read the selected day's forecasted projects from a local, disposable cache at
`~/DailyQuick/.dailyquick/forecast.json`. The app SHALL NOT perform any network request or hold any
credentials to obtain forecast data; the cache is produced outside the app. A missing cache file, or a
day absent from the cache, SHALL yield an empty forecast (never an error). Each forecast entry has a
project code, a display name, and forecasted hours for that day.

#### Scenario: Return the projects forecast for a day
- **GIVEN** `~/DailyQuick/.dailyquick/forecast.json` lists, for `2026-07-20`, `Oakmond` (6.5h) and `Celonis` (1h)
- **WHEN** the app reads the forecast for `2026-07-20`
- **THEN** it returns those two projects with their names and hours

#### Scenario: Missing cache file yields an empty forecast
- **GIVEN** no `forecast.json` exists under `.dailyquick/`
- **WHEN** the app reads the forecast for any day
- **THEN** it returns an empty list and does not error

#### Scenario: A day absent from the cache yields an empty forecast
- **GIVEN** a `forecast.json` that has entries only for `2026-07-20`
- **WHEN** the app reads the forecast for `2026-07-21`
- **THEN** it returns an empty list

#### Scenario: A malformed cache is reported, not fatal to notes
- **GIVEN** a `forecast.json` that is not valid JSON
- **WHEN** the app reads the forecast
- **THEN** it fails with a typed parse error and no note data is affected

### Requirement: Show the day's forecast as chips
The board SHALL display the selected day's forecast projects as a strip of chips, each showing the
project name and its forecasted hours. When the day has no forecast, the strip SHALL show a quiet
empty state rather than an error.

#### Scenario: Chips reflect the day's forecast
- **GIVEN** the forecast for the selected day has `Oakmond` (6.5h) and `Celonis` (1h)
- **WHEN** the board renders
- **THEN** a chip is shown for each, labeled with the project name and its hours

#### Scenario: Empty forecast shows a quiet state
- **GIVEN** the selected day has no forecast entries
- **WHEN** the board renders
- **THEN** the forecast strip shows a quiet "no forecast" state and no chips

### Requirement: Create a project from a forecast chip
Clicking a forecast chip SHALL create a project column for that project on the current day, assigning
an accent not already in use on the board (mirroring the calendar-event flow). A chip whose project
already exists for the day SHALL be indicated as already added and SHALL NOT create a duplicate.

#### Scenario: Click creates a project column
- **GIVEN** a forecast chip for `Oakmond` and no `oakmond` project on the day
- **WHEN** the user clicks the chip
- **THEN** an `Oakmond` project column is created on the current day with an unused accent

#### Scenario: Already-present project is not duplicated
- **GIVEN** a forecast chip for `Oakmond` and an existing `oakmond` project on the day
- **WHEN** the forecast strip renders
- **THEN** the `Oakmond` chip is shown as already added and clicking it does not create a duplicate
