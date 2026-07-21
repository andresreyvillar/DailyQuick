# project-diary Specification

## Purpose
TBD - created by archiving change project-diary. Update Purpose after archive.
## Requirements
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

### Requirement: Link a project's diary sources
The app SHALL let the user link a project to the diary from its actions menu by setting the **search
terms** used to find the project's emails (Apple Mail) and Slack messages. The terms SHALL default to
the project title and be editable (comma-separated aliases). The app SHALL persist them to a local config
`~/DailyQuick/.dailyquick/diary-sources.json` keyed by project slug, and SHALL NOT perform any network
request; the config is consumed by the external producer. Reading a project with no saved sources SHALL
yield empty defaults (never an error).

#### Scenario: The form defaults to the project title
- **GIVEN** project `duin` (title "Duin") has no saved sources
- **WHEN** the user opens "Vincular fuentes"
- **THEN** the search-terms field is pre-filled with "Duin"

#### Scenario: Save the search terms
- **WHEN** the user sets the terms `Duin, RevOps` for project `duin` and saves
- **THEN** `~/DailyQuick/.dailyquick/diary-sources.json` stores, under `duin`, the terms `["Duin", "RevOps"]`

#### Scenario: Reload shows the saved terms
- **GIVEN** project `duin` has saved terms
- **WHEN** the user opens "Vincular fuentes" again
- **THEN** the field is pre-filled with the saved terms (not just the title)

#### Scenario: The actions menu offers the option
- **GIVEN** a project's ⋯ actions menu is open
- **WHEN** it renders
- **THEN** a "Vincular fuentes" option is shown that opens the sources form

### Requirement: Sync the diary from the app
The app SHALL provide a permanent control to trigger a diary sync for the selected day. On success it
SHALL reload the diary panels; on failure it SHALL report the error without crashing. The app SHALL NOT
perform Slack OAuth or AI synthesis itself — it delegates to the Claude Code `/project-diary` producer,
so syncing is best-effort and depends on that being available locally.

#### Scenario: Sync triggers the producer and refreshes the panels
- **GIVEN** the board showing a day
- **WHEN** the user activates "Sincronizar diario"
- **THEN** the diary producer is run for that day
- **AND** on success the diary panels re-read the cache

#### Scenario: A failed sync is reported
- **GIVEN** the producer cannot run (e.g. the `claude` CLI is unavailable)
- **WHEN** the user activates "Sincronizar diario"
- **THEN** an error is shown and the app keeps working

