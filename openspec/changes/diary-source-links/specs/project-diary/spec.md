## ADDED Requirements

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
