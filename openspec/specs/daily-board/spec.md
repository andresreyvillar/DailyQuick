# daily-board Specification

## Purpose
TBD - created by archiving change daily-board-layout. Update Purpose after archive.
## Requirements
### Requirement: Show the current day with a prominent date
The board SHALL display today's date prominently, using the canonical `YYYY-MM-DD` day key for
storage and a human-readable form for display.

#### Scenario: Today's date is shown
- **GIVEN** the app opens on 21 June 2026
- **WHEN** the board renders
- **THEN** the header shows the date prominently and the board uses day key `2026-06-21` for storage

### Requirement: Render a column per project
The board SHALL render one column for each project note returned by `list_day`, in the returned
order, showing the project title and its color accent.

#### Scenario: Columns reflect the day's projects in order
- **GIVEN** `list_day` returns `oakmond` (order 1) then `personal` (order 2)
- **WHEN** the board renders
- **THEN** two columns appear in the order `[oakmond, personal]`, each labeled with its title

#### Scenario: Column shows the project color accent
- **GIVEN** a project note with color `#E54D2E`
- **WHEN** its column renders
- **THEN** the column header uses that color as its accent

### Requirement: Toggle split orientation
The board SHALL let the user switch between a vertical and a horizontal split, and SHALL persist the
choice across reloads.

#### Scenario: Switch orientation
- **GIVEN** the board is in the vertical split
- **WHEN** the user activates the orientation toggle
- **THEN** the board re-lays out horizontally

#### Scenario: Orientation persists across reloads
- **GIVEN** the user selected the horizontal split
- **WHEN** the app reloads
- **THEN** the board restores the horizontal orientation

### Requirement: Empty day state
When the day has no projects, the board SHALL show an empty state rather than a blank void.

#### Scenario: No projects yet
- **GIVEN** `list_day` returns an empty list for today
- **WHEN** the board renders
- **THEN** an empty-state message is shown and no project columns are rendered

### Requirement: Inline note editing persists
The board SHALL let the user edit a project's note body inline and SHALL persist changes via
`write_note` (debounced), preserving the note's frontmatter.

#### Scenario: Edited body is persisted
- **GIVEN** a project column showing a note body
- **WHEN** the user edits the body and the debounce interval elapses
- **THEN** `write_note` is called for that project with the new body

#### Scenario: Frontmatter is preserved on edit
- **GIVEN** a note with title `Oakmond`, color `#E54D2E`, order `1`
- **WHEN** only the body is edited and saved
- **THEN** the persisted note keeps its title, color, and order unchanged

