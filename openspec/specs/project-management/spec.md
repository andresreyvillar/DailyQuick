# project-management Specification

## Purpose
TBD - created by archiving change project-management. Update Purpose after archive.
## Requirements
### Requirement: Create a project
The system SHALL let the user create a project for the current day with a title and a color. The
project is persisted as a new note and appears on the board.

#### Scenario: Create with title and color
- **GIVEN** the board for `2026-06-21`
- **WHEN** the user creates a project titled `Oakmond` with color `#E54D2E`
- **THEN** a note is written for that day with a slug derived from the title, the given title and color, and an empty body
- **AND** the new project column appears on the board

#### Scenario: Slug derived from the title
- **GIVEN** a new project titled `My Project!`
- **WHEN** it is created
- **THEN** its note filename slug is `my-project`

#### Scenario: Order appends after existing projects
- **GIVEN** the day already has projects whose maximum `order` is `2`
- **WHEN** a new project is created
- **THEN** the new project's `order` is `3`

#### Scenario: Invalid title is rejected
- **GIVEN** a title that yields an empty slug (e.g. `!!!`)
- **WHEN** the user attempts to create it
- **THEN** creation fails with a typed error and no note is written

#### Scenario: Duplicate slug is rejected
- **GIVEN** a project with slug `oakmond` already exists for the day
- **WHEN** the user creates another project that slugifies to `oakmond`
- **THEN** creation fails with a typed `AlreadyExists` error and the existing note is not overwritten

### Requirement: Customize a project's color
The system SHALL let the user change a project's color, persisting it to the note frontmatter without
altering the body.

#### Scenario: Change color
- **GIVEN** a project with color `#E54D2E` and a non-empty body
- **WHEN** the user sets its color to `#3E63DD`
- **THEN** the note frontmatter color becomes `#3E63DD` and the body is unchanged

### Requirement: Rename a project
The system SHALL let the user change a project's display title, persisting it to frontmatter; the
filename slug stays stable.

#### Scenario: Rename keeps the slug
- **GIVEN** a project with slug `oakmond` and title `Oakmond`
- **WHEN** the user renames it to `Oakmond HQ`
- **THEN** the frontmatter title becomes `Oakmond HQ` and the file remains `oakmond.md`

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

