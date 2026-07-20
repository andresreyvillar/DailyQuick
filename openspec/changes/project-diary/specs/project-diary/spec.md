## ADDED Requirements

### Requirement: Read a project's daily diary from the local cache
The system SHALL read a project's diary for a day from a local, disposable cache at
`~/DailyQuick/.dailyquick/diary/<day>.json`. The app SHALL NOT perform any network request or hold any
credentials for it; the cache is produced outside the app. A missing cache file, or a project absent from
that day's cache, SHALL yield no diary (never an error). A diary entry has a summary and a list of events
(each with a time, source, who, and text).

#### Scenario: Return a project's diary for a day
- **GIVEN** `diary/2026-07-20.json` has an entry for `duin` with a summary and two events
- **WHEN** the app reads the diary for `2026-07-20` / `duin`
- **THEN** it returns that entry with its summary and events

#### Scenario: Missing cache yields no diary
- **GIVEN** no `diary/<day>.json` exists
- **WHEN** the app reads the diary for any day/project
- **THEN** it returns no diary and does not error

#### Scenario: A project absent from the day yields no diary
- **GIVEN** a `diary/2026-07-20.json` with an entry only for `duin`
- **WHEN** the app reads the diary for `2026-07-20` / `oakmond`
- **THEN** it returns no diary

#### Scenario: A malformed cache is reported, not fatal to notes
- **GIVEN** a `diary/<day>.json` that is not valid JSON
- **WHEN** the app reads the diary
- **THEN** it fails with a typed parse error and no note data is affected

### Requirement: Show the diary atop the project frame
Each project frame SHALL show its day's diary as a read-only panel at the top: the summary and the list
of events. When there is no diary for that project/day, no panel SHALL be shown.

#### Scenario: The diary panel renders the summary and events
- **GIVEN** the selected day's diary for a project has a summary and events
- **WHEN** the frame renders
- **THEN** a read-only "Diario" panel shows the summary and each event

#### Scenario: No diary shows no panel
- **GIVEN** the selected day/project has no diary entry
- **WHEN** the frame renders
- **THEN** no diary panel is shown
