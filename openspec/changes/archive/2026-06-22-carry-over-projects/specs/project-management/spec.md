## ADDED Requirements

### Requirement: Carry over the previous day's projects
The system SHALL let the user copy the previous day's projects into the day being viewed, creating the
same project columns (title, color, relative order) with empty bodies. Projects whose slug already
exists for the current day are skipped, so the action never overwrites existing notes.

#### Scenario: Copy the previous day's projects into an empty day
- **GIVEN** `2026-06-21` has projects `Oakmond` (`#E54D2E`) and `Personal` (`#3E63DD`), and `2026-06-22` has none
- **WHEN** the user carries over the previous day's projects while viewing `2026-06-22`
- **THEN** `2026-06-22` gains projects `Oakmond` and `Personal` with the same titles and colors
- **AND** each carried-over note has an empty body

#### Scenario: Existing projects are not overwritten
- **GIVEN** `2026-06-21` has `Oakmond` and `Personal`, and `2026-06-22` already has `Oakmond` with a non-empty body
- **WHEN** the user carries over the previous day's projects
- **THEN** the existing `Oakmond` note for `2026-06-22` is left unchanged
- **AND** only `Personal` is added to `2026-06-22`

#### Scenario: Nothing to copy
- **GIVEN** the previous day has no projects, or all of them already exist for the current day
- **WHEN** the carry-over control is evaluated
- **THEN** it is disabled and no notes are created
