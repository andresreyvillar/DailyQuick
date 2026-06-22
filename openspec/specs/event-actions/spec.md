# event-actions Specification

## Purpose
TBD - created by archiving change event-actions. Update Purpose after archive.
## Requirements
### Requirement: Create a project from an event
The system SHALL let the user create a project for the current day from a calendar event. The project
uses the event's title and a seeded Markdown body containing the event's date, time, and calendar plus
empty "Notas" and "Transcripción" sections.

#### Scenario: Create from a meeting
- **GIVEN** an event "Oakmond daily" at 09:00 on calendar "Work" for `2026-06-22`
- **WHEN** the user creates a project from it
- **THEN** a project is created for `2026-06-22` titled "Oakmond daily" whose body includes the date/time/calendar and `## Notas` and `## Transcripción` headings
- **AND** the new project column appears on the board

#### Scenario: Duplicate is reported
- **GIVEN** a project created from that event already exists
- **WHEN** the user creates a project from the same event again
- **THEN** it fails with a typed `AlreadyExists` error and the existing project is not overwritten

### Requirement: Add an event to an existing project
The system SHALL let the user append a calendar event to an existing project's note as a Markdown
block ("post-it"), preserving the existing note content.

#### Scenario: Append an event block
- **GIVEN** a project "oakmond" with body `# Tareas`
- **WHEN** the user adds the event "Oakmond daily" (09:00, "Work") to it
- **THEN** the project's note keeps `# Tareas` and gains a Markdown block for the event (title + time + calendar)
- **AND** the project's editor reflects the inserted block

### Requirement: Event blocks are clean Markdown
Both the seeded project body and the appended event block SHALL be standard GFM Markdown (no
proprietary syntax), readable by any Markdown tool.

#### Scenario: Block is GFM
- **GIVEN** an event with a title, time, and calendar
- **WHEN** its Markdown block is generated
- **THEN** the output is standard GFM (e.g. a heading/quote with the event details), with no editor-specific syntax

