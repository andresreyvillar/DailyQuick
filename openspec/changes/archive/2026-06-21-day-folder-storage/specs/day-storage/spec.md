## ADDED Requirements

### Requirement: Storage root and path layout
The system SHALL store all notes as Markdown files under the root directory `~/DailyQuick/`, where
each day is a folder named with its `YYYY-MM-DD` date key and each project is a file
`<project-slug>.md` inside that folder.

#### Scenario: Resolve note path for a project on a date
- **GIVEN** the date key `2026-06-21` and project slug `oakmond`
- **WHEN** the storage resolves the note path
- **THEN** the path is `~/DailyQuick/2026-06-21/oakmond.md`

#### Scenario: Project slug is filesystem-safe
- **GIVEN** a project title `My Project!`
- **WHEN** a slug is derived for the filename
- **THEN** the slug is lowercase, hyphenated, and contains only `[a-z0-9-]` (e.g. `my-project`)

### Requirement: Create day folder on demand
The system SHALL create the day folder for a given date key if it does not exist, and SHALL be
idempotent when the folder already exists.

#### Scenario: First note of a new day
- **GIVEN** no folder exists for date key `2026-06-22`
- **WHEN** a note is written for that day
- **THEN** the folder `~/DailyQuick/2026-06-22/` is created before the file is written

#### Scenario: Existing day folder is reused
- **GIVEN** the folder for `2026-06-22` already exists with notes
- **WHEN** another note is written for that day
- **THEN** the existing folder is reused and the existing notes are preserved

### Requirement: Write a project note
The system SHALL write a project note as UTF-8 Markdown with serialized frontmatter, replacing the
file content atomically (write to a temporary file, then rename).

#### Scenario: Persist note content and metadata
- **GIVEN** a note with title `Oakmond`, color `#E54D2E`, order `1`, and body `# Tareas`
- **WHEN** the note is written for date `2026-06-21`
- **THEN** reading `~/DailyQuick/2026-06-21/oakmond.md` returns the same frontmatter and body

#### Scenario: Failed write does not corrupt existing file
- **GIVEN** an existing valid note on disk
- **WHEN** a write fails midway (e.g. validation or I/O error)
- **THEN** the on-disk file is left unchanged

### Requirement: Read a project note
The system SHALL read a project note and return its parsed frontmatter and Markdown body, and SHALL
report a missing note as a typed result rather than an error.

#### Scenario: Read an existing note
- **GIVEN** a note file exists for `2026-06-21` / `oakmond`
- **WHEN** the note is read
- **THEN** its title, color, order, created date, and body are returned

#### Scenario: Read a missing note
- **GIVEN** no note file exists for `2026-06-21` / `ghost`
- **WHEN** the note is read
- **THEN** the system returns a typed "not found" result and does not crash

### Requirement: List project notes for a day
The system SHALL list the project notes present in a day's folder, ordered by the `order`
frontmatter field and then by title.

#### Scenario: List notes in order
- **GIVEN** a day folder containing `personal.md` (order 2) and `oakmond.md` (order 1)
- **WHEN** the day's notes are listed
- **THEN** the result is `[oakmond, personal]` in that order

#### Scenario: Empty or missing day
- **GIVEN** a date key whose folder does not exist
- **WHEN** the day's notes are listed
- **THEN** an empty list is returned and the folder is NOT created

### Requirement: Frontmatter parse and serialize
The system SHALL parse YAML frontmatter (`title`, `color`, `order`, `created`) and serialize it back
losslessly; missing fields SHALL fall back to safe defaults without error.

#### Scenario: Lossless round-trip
- **GIVEN** a Markdown string with valid frontmatter and a body
- **WHEN** it is parsed and then re-serialized
- **THEN** the output is semantically equal to the input (same fields and body)

#### Scenario: Missing frontmatter uses defaults
- **GIVEN** a Markdown string with no frontmatter
- **WHEN** it is parsed
- **THEN** defaults are applied (title derived from slug, no color, order placed last) and parsing does not throw

#### Scenario: Malformed frontmatter is reported
- **GIVEN** a Markdown string with invalid YAML frontmatter
- **WHEN** it is parsed
- **THEN** a typed parse error is returned and the raw content is preserved

### Requirement: Disk access only through Tauri commands
The renderer SHALL access storage exclusively through Tauri commands; no filesystem path is read or
written from the web layer directly.

#### Scenario: Commands are the only I/O surface
- **GIVEN** the renderer needs to read or write a note
- **WHEN** it performs the operation
- **THEN** it calls a `#[tauri::command]` (`read_note`, `write_note`, `list_day`, `ensure_day`) and receives typed data

### Requirement: Canonical date key
The system SHALL use `YYYY-MM-DD` as the canonical day key and SHALL reject malformed keys.

#### Scenario: Compute a valid key
- **GIVEN** the date 21 June 2026
- **WHEN** its day key is computed
- **THEN** the key is `2026-06-21`

#### Scenario: Reject an invalid key
- **GIVEN** the string `2026-6-1` or `21-06-2026`
- **WHEN** it is validated as a day key
- **THEN** validation fails with a typed error
