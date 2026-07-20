## 1. Three-way layout in the store

- [x] 1.1 (RED) In `src/state/board-store.test.ts`, update/extend: `orientation` accepts `grid`;
  `toggleOrientation` cycles `vertical → horizontal → grid → vertical`; the choice persists.
- [x] 1.2 (GREEN) Extend `Orientation` to `"vertical" | "horizontal" | "grid"`; make `loadOrientation`
  accept the three (default `vertical`); make `toggleOrientation` cycle through the three.

## 2. Board grid rendering

- [x] 2.1 (RED) In `src/components/board/Board.test.tsx`, assert the board uses a grid layout when
  `orientation` is `grid` (e.g. the canvas has the grid class) and flex otherwise.
- [x] 2.2 (GREEN) Render `board-canvas` as a CSS grid for `grid`; keep flex-row/flex-col for columns/rows.

## 3. Three-way layout control

- [x] 3.1 (RED) In `src/components/board/OrientationToggle.test.tsx`, assert selecting the grid segment
  sets the grid layout (and the existing columns/rows segments still work).
- [x] 3.2 (GREEN) Add a grid segment to `OrientationToggle` (segmented control now has columns/rows/grid).

## 4. Verify

- [x] 4.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
