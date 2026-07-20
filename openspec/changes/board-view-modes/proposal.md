## Why

The board only offers a vertical (columns) or horizontal (rows) split. For boards with several projects,
a grid view that wraps cards is a better overview, and the user wants to choose among more than two layouts.

## What Changes

- The board layout gains a third mode: **grid** (cards wrap in a responsive grid), alongside the
  existing columns (vertical) and rows (horizontal).
- The layout control becomes a **3-way selector** (columns / rows / grid) and the chosen mode persists.

## Capabilities

### Modified Capabilities
- `daily-board`: choose the board layout among columns, rows, and grid (was a 2-way vertical/horizontal toggle).

## Impact

- `src/state/board-store.ts`: extend the persisted `orientation` to `"vertical" | "horizontal" | "grid"`;
  `toggleOrientation` cycles through the three.
- `src/components/board/OrientationToggle.tsx`: a 3-way layout control.
- `src/components/board/Board.tsx`: render a CSS grid for the grid mode.
- No backend, on-disk, or dependency changes.
