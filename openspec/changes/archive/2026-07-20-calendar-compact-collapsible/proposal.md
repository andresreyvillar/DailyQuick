## Why

The day-context region (the "Hoy" calendar events band + the "Forecast" band) takes two full-width
rows and a lot of vertical space above the board, even when the user just wants to focus on the notes.

## What Changes

- The calendar + forecast context region is **more compact** (denser padding/rows, smaller footprint).
- The region is **collapsible**: a toggle hides/shows it, and the collapsed state **persists** across
  reloads. Collapsed, only a slim bar with a show control remains, freeing vertical space for the board.

## Capabilities

### Modified Capabilities
- `daily-board`: add a collapsible, compact day-context region (calendar + forecast) whose collapsed
  state persists.

## Impact

- `src/state/board-store.ts`: a persisted `contextCollapsed` flag + toggle (same pattern as orientation).
- `src/components/board/Board.tsx`: wrap the calendar + forecast bands in a collapsible, compact region
  with a toggle.
- No on-disk contract, Tauri command, or dependency changes.
