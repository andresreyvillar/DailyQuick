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
The board SHALL let the user choose the layout among **columns** (vertical split), **rows** (horizontal
split), and **grid** (cards wrapped in a responsive grid), and SHALL persist the choice across reloads.

#### Scenario: Select a layout
- **GIVEN** the board is in the columns layout
- **WHEN** the user selects the grid layout from the control
- **THEN** the board switches to the grid layout

#### Scenario: Grid layout wraps the project cards
- **GIVEN** the board has several projects and the grid layout is selected
- **WHEN** the board renders
- **THEN** the project cards are laid out in a wrapping grid

#### Scenario: Layout persists across reloads
- **GIVEN** the user selected the grid layout
- **WHEN** the app reloads
- **THEN** the board restores the grid layout

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

### Requirement: Collapsible, compact day-context region
The board SHALL present the day-context region (calendar events + forecast) compactly, and SHALL let
the user collapse and expand it with a toggle. The collapsed state SHALL persist across reloads. When
collapsed, the calendar and forecast content is hidden and a slim control to expand it remains.

#### Scenario: Collapse hides the context region
- **GIVEN** the day-context region is expanded, showing the calendar and forecast bands
- **WHEN** the user activates the collapse toggle
- **THEN** the calendar and forecast content is hidden and an expand control remains

#### Scenario: Expand restores the context region
- **GIVEN** the day-context region is collapsed
- **WHEN** the user activates the expand toggle
- **THEN** the calendar and forecast bands are shown again

#### Scenario: Collapsed state persists across reloads
- **GIVEN** the user collapsed the day-context region
- **WHEN** the app reloads
- **THEN** the region is still collapsed

### Requirement: Create a project by dragging a chip onto the board
The board SHALL accept a forecast, calendar-event, or recent (recommended) chip dragged onto it and
create the corresponding project column, equivalent to clicking that chip. A forecast chip creates that
forecast project; a calendar-event chip creates a project seeded from the event; a recent chip re-adds
that project. A drop whose payload is unrecognized SHALL be ignored. Clicking a chip continues to work.

#### Scenario: Dropping a forecast chip creates its project
- **GIVEN** a forecast chip for `Duin` is dragged over the board
- **WHEN** it is dropped on the board area
- **THEN** a `Duin` project column is created on the current day

#### Scenario: Dropping a calendar-event chip creates a project from the event
- **GIVEN** a calendar-event chip is dragged over the board
- **WHEN** it is dropped on the board area
- **THEN** a project column is created seeded from that event

#### Scenario: An unrecognized drop is ignored
- **GIVEN** something other than a DailyQuick chip is dropped on the board
- **WHEN** the drop is handled
- **THEN** no project is created and no error occurs

