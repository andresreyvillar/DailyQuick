## ADDED Requirements

### Requirement: Reveal a project's note in Finder
The system SHALL let the user reveal a project's Markdown file in the macOS Finder from the project
frame's actions menu, with the file selected. Revealing is read-only — it never creates, modifies, or
deletes anything on disk. The action targets the note for the day currently being viewed, so it works
for past days as well, not only today. If the note file does not exist, the action SHALL fail with a
typed `NotFound` error and nothing SHALL be opened. Path resolution SHALL reuse the existing note-path
validation so a reveal can never escape the storage root.

#### Scenario: Reveal from the actions menu
- **GIVEN** a project column for `oakmond` whose actions menu is open while viewing `2026-06-21`
- **WHEN** the user clicks `Mostrar en Finder`
- **THEN** the app reveals that project's note by invoking the reveal command with the viewed day key `2026-06-21` and the slug `oakmond`
- **AND** the actions menu closes

#### Scenario: Existing note resolves to its file path
- **GIVEN** a day folder containing `oakmond.md`
- **WHEN** the reveal path for `oakmond` on that day is resolved
- **THEN** it returns the absolute path to `<root>/<day>/oakmond.md`

#### Scenario: Missing note is reported
- **GIVEN** a day and slug whose note file does not exist
- **WHEN** a reveal is attempted for it
- **THEN** it fails with a typed `NotFound` error and nothing is revealed

#### Scenario: Reveal stays within the storage root
- **GIVEN** a slug or day key containing path traversal (e.g. `../etc`)
- **WHEN** a reveal path is resolved
- **THEN** it is rejected with a typed error and no path outside the storage root is produced
