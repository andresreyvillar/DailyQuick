## 1. Drag payload (pure)

- [x] 1.1 (RED) In `src/lib/board-dnd.test.ts`, test `serializeDrag`/`parseDrag` round-trip for
  forecast/event/recent, and that `parseDrag` returns `null` for empty, garbage, and unknown-kind input.
- [x] 1.2 (GREEN) Implement `DND_MIME`, `DragPayload`, `serializeDrag`, `parseDrag` in `src/lib/board-dnd.ts`.

## 2. Board drop zone

- [x] 2.1 (RED) In `src/components/board/Board.test.tsx`, assert that dropping a forecast payload on the
  board drop zone dispatches `createProjectFromForecast`, and an unrecognized drop does nothing.
- [x] 2.2 (GREEN) Wrap the board area in a drop zone (`data-testid="board-dropzone"`, `onDragOver`
  preventDefault, `onDrop` parses + dispatches to the create actions).
- [x] 2.3 (REFACTOR) Keep the dispatch small and typed.

## 3. Draggable chips

- [x] 3.1 (GREEN) Make forecast, recent, and calendar-event chips `draggable`, writing their payload on
  `dragStart` via `serializeDrag`.
- [x] 3.2 (REFACTOR) Ensure click still works alongside drag (mousedown/click unaffected).

## 4. Verify

- [x] 4.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
