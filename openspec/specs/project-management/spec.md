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

