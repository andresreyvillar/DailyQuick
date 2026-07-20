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

### Requirement: Choose a project color from the accent palette
The project color control SHALL present the six project accent colors as a palette to pick from, and
SHALL also offer a custom-color option for any other hex. The same palette control SHALL be used both
when creating a project and when editing an existing project's color. Picking a color applies it to
the project (at creation, as the project's initial color; when editing, persisted via the existing
recolor path).

#### Scenario: Palette offers the six accents
- **GIVEN** a project's color control
- **WHEN** the user opens it
- **THEN** the six accents (Azul, Teal, Verde, Ámbar, Rosa, Violeta) are offered as swatches
- **AND** clicking outside closes it without changing the color

#### Scenario: Picking an accent recolors the project
- **GIVEN** the color control is open for project `oakmond`
- **WHEN** the user picks the `Teal` accent
- **THEN** the project's color is set to that accent's hex and persisted

#### Scenario: A custom color is still possible
- **GIVEN** the color control is open
- **WHEN** the user chooses the custom option and sets a hex not in the palette
- **THEN** the project's color is set to that hex and persisted

#### Scenario: The create form uses the same palette control
- **GIVEN** the "new project" form is open
- **WHEN** the user opens the color control
- **THEN** the same six-accent palette (plus custom option) is offered as when editing a project
- **AND** the color the user picks is used as the new project's color on creation

### Requirement: Default a new project to an unused accent
When a project is created, the system SHALL pre-assign it the first palette accent that is not already
in use by the current day's projects, so distinct projects receive distinct accents without manual
recoloring. If all six accents are already in use, the system SHALL fall back to a deterministic accent
from the palette. This default is a starting point only — the user MAY override it before creating.

#### Scenario: New project defaults to the first unused accent
- **GIVEN** the board's projects use the accents `Azul` and `Teal`
- **WHEN** the user opens the "new project" form
- **THEN** the pre-selected color is `Verde` (the first palette accent not already in use)

#### Scenario: Empty board defaults to the first accent
- **GIVEN** the board has no projects
- **WHEN** the user opens the "new project" form
- **THEN** the pre-selected color is the first palette accent (`Azul`)

#### Scenario: All accents used falls back deterministically
- **GIVEN** the board's projects already use all six accents
- **WHEN** the user opens the "new project" form
- **THEN** the pre-selected color is a palette accent chosen deterministically (never empty)

#### Scenario: Project created from an event gets an unused accent
- **GIVEN** the board's projects use the accent `Azul`
- **WHEN** the user creates a project from a calendar event
- **THEN** the new project's color is the first palette accent not already in use (not a fixed color)

#### Scenario: Carry-over keeps the source color and only falls back to an unused accent
- **GIVEN** the previous day has a project `Oakmond` colored `Teal` and a project `Notes` with no color
- **WHEN** the user carries those projects over to a day whose projects use `Azul`
- **THEN** `Oakmond` keeps `Teal`
- **AND** `Notes` is assigned the first palette accent not already in use instead of a neutral gray

