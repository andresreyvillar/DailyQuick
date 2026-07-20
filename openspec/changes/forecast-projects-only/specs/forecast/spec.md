## MODIFIED Requirements

### Requirement: Read the day's forecast from the local cache
The system SHALL read the selected day's forecasted projects from a local, disposable cache at
`~/DailyQuick/.dailyquick/forecast.json`. The app SHALL NOT perform any network request or hold any
credentials to obtain forecast data; the cache is produced outside the app. A missing cache file, or a
day absent from the cache, SHALL yield an empty forecast (never an error). Each forecast entry has a
project code and a display name; forecasted hours are optional and the app does not depend on them.

#### Scenario: Return the projects forecast for a day
- **GIVEN** `~/DailyQuick/.dailyquick/forecast.json` lists, for `2026-07-20`, `Celonis` and `Duin`
- **WHEN** the app reads the forecast for `2026-07-20`
- **THEN** it returns those two projects with their names

#### Scenario: Entries without hours are valid
- **GIVEN** a `forecast.json` whose entries have `code` and `name` but no `hours`
- **WHEN** the app reads the forecast
- **THEN** it returns the entries without error

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
project name. When the day has no forecast, the strip SHALL show a quiet empty state rather than an error.

#### Scenario: Chips reflect the day's forecast
- **GIVEN** the forecast for the selected day has `Celonis` and `Duin`
- **WHEN** the board renders
- **THEN** a chip is shown for each, labeled with the project name

#### Scenario: Empty forecast shows a quiet state
- **GIVEN** the selected day has no forecast entries
- **WHEN** the board renders
- **THEN** the forecast strip shows a quiet "no forecast" state and no chips
