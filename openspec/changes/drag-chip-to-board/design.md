## Context

Context chips live in `ForecastProjects`, `RecommendedProjects`, and `CalendarEvents`, and create
projects via store actions (`createProjectFromForecast`, `createProject`, `createProjectFromEvent`).
The board renders either an empty state or the `board-canvas` column grid.

## Goals / Non-Goals

**Goals:**
- Drag a context chip onto the board to create its project — no new dependency.
- Keep the click behavior intact.

**Non-Goals:**
- Reordering columns or drag-to-delete (separate slices).
- A custom drag preview / animation.

## Decisions

**Native HTML5 drag-and-drop + a typed payload.** `src/lib/board-dnd.ts` defines a discriminated
`DragPayload` (`forecast` | `event` | `recent`), a `DND_MIME` constant, and pure `serializeDrag`/
`parseDrag` (parse returns `null` for empty/garbage/unknown-kind). Chips set `draggable` and, on
`dragStart`, write `serializeDrag(payload)` to `dataTransfer` under `DND_MIME`.

**One drop zone in the board.** A wrapper around the empty-state/`board-canvas` gets
`onDragOver=preventDefault` (to allow drop) and `onDrop` that parses the payload and dispatches:
`forecast → createProjectFromForecast`, `event → createProjectFromEvent`,
`recent → createProject(title, color ?? nextAccent(...))`. An unparseable payload is a no-op.

_Alternative_: a DnD library (dnd-kit). Rejected for this slice — native DnD covers drag-to-create with
zero dependencies; the richer library, if needed, can come with the reorder/drag-to-delete slice.

## Risks / Trade-offs

- [HTML5 DnD ergonomics vary] → acceptable for a create gesture; the click path remains the primary one.
- [Payload carries the full event/forecast object] → small JSON in `dataTransfer`; fine.
