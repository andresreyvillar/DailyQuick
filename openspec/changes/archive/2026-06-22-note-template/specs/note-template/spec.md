## ADDED Requirements

### Requirement: Seed an empty note from a template
When a project's note body is empty, the system SHALL offer a "Plantilla básica" that seeds the note
with a starter structure — a task checklist, a separator, and a notes section — as clean GFM. The
offer is shown only while the note is empty; once the note has content it is not shown. Applying the
template writes the note and the editor reflects the seeded content.

#### Scenario: Empty note offers the template
- **GIVEN** a project whose note body is empty
- **WHEN** its column renders
- **THEN** a "Plantilla básica" template prompt is shown in the column body

#### Scenario: Applying the template seeds the note
- **GIVEN** the template prompt is shown for project `oakmond`
- **WHEN** the user picks "Plantilla básica"
- **THEN** the note body is set to the starter template (a `## Tareas` checklist, a `---` separator, and a `## Notas` section) and persisted
- **AND** the editor reloads to show the seeded content

#### Scenario: A non-empty note does not show the prompt
- **GIVEN** a project whose note body already has content
- **WHEN** its column renders
- **THEN** the template prompt is not shown
