## Why

Today you add a project from a forecast/calendar/recent chip by clicking it. Dragging the chip onto the
board is a more direct, spatial gesture for "put this project here".

## What Changes

- Forecast, calendar-event, and recent (recommended) chips become **draggable**.
- The **board area is a drop target**: dropping a chip on it creates the corresponding project column —
  a forecast chip creates that forecast project, a calendar chip creates a project seeded from the
  event, a recent chip re-adds that project. Clicking still works as before.

## Capabilities

### Modified Capabilities
- `daily-board`: create a project by dragging a context chip (forecast / calendar event / recent) onto
  the board.

## Impact

- `src/lib/board-dnd.ts`: a typed drag payload + `serializeDrag`/`parseDrag` (pure).
- `src/components/forecast/ForecastProjects.tsx`, `.../RecommendedProjects.tsx`,
  `src/components/calendar/CalendarEvents.tsx`: make chips draggable.
- `src/components/board/Board.tsx`: a drop zone that dispatches to the existing create actions.
- No backend, on-disk, or dependency changes (native HTML5 drag-and-drop).
