## MODIFIED Requirements

### Requirement: Sync the diary from the app
The app SHALL provide, on **each project card**, a control to sync that project's diary for **today**.
The sync SHALL be **asynchronous and non-blocking**: it starts a background run and returns immediately,
so the app stays usable and several projects can sync concurrently. While it runs, the app SHALL show
**live progress** (what it searches and finds in Slack/email), streamed from the run. On success it SHALL
reload that project's diary panel; on failure it SHALL report the error without crashing. The app SHALL
NOT perform Slack OAuth or AI synthesis itself — it delegates to the Claude Code `project-diary` producer,
so syncing is best-effort and depends on that being available locally.

#### Scenario: Per-project sync streams progress and refreshes on success
- **GIVEN** a project card
- **WHEN** the user activates its "Sincronizar diario"
- **THEN** a background sync of today for that project starts without blocking the app
- **AND** progress messages appear live on the card as it searches Slack/email
- **AND** on completion its diary panel re-reads the cache

#### Scenario: Projects sync independently
- **GIVEN** two project cards
- **WHEN** one is syncing
- **THEN** the app remains usable and the other card can be used or synced too

#### Scenario: A failed sync is reported
- **GIVEN** the producer cannot run (e.g. the `claude` CLI is unavailable)
- **WHEN** the user activates a project's "Sincronizar diario"
- **THEN** an error is shown on that card and the app keeps working
