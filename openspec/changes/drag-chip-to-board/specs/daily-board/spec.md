## ADDED Requirements

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
