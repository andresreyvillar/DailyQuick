## ADDED Requirements

### Requirement: Delete a project
The system SHALL let the user delete a project from the current day. Deleting removes that project's
note file from disk and its column from the board. The deletion is confirmed before it happens and
affects only that one note — never the day folder, other projects, or other days.

#### Scenario: Delete removes the note and the column
- **GIVEN** the day `2026-06-22` has projects `oakmond` and `personal`
- **WHEN** the user confirms deleting `oakmond`
- **THEN** the file `~/DailyQuick/2026-06-22/oakmond.md` is removed from disk
- **AND** the `oakmond` column disappears from the board while `personal` remains

#### Scenario: Other days are untouched
- **GIVEN** a project `oakmond` exists for both `2026-06-22` and `2026-06-21`
- **WHEN** the user deletes `oakmond` from `2026-06-22`
- **THEN** only `~/DailyQuick/2026-06-22/oakmond.md` is removed and `2026-06-21/oakmond.md` still exists

#### Scenario: Deletion requires confirmation
- **GIVEN** a project column's actions menu is open
- **WHEN** the user clicks `Eliminar` but does not confirm
- **THEN** the note is not deleted and the column stays on the board
- **AND** choosing `Cancelar` or clicking outside closes the menu without deleting

#### Scenario: Deleting a missing note is reported
- **GIVEN** a slug whose note file does not exist for the day
- **WHEN** a delete is attempted for it
- **THEN** it fails with a typed `NotFound` error and no other file is affected
