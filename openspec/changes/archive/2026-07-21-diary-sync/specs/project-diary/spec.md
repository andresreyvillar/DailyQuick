## ADDED Requirements

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
