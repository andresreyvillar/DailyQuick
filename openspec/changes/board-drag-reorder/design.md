## Context

Project frames render in `Board` (flex/grid) from `projects` (ordered). Each note carries a frontmatter
`order`; `listDay` returns projects sorted by it. `deleteProject(slug)` already deletes one note with an
existing inline confirm in `ProjectColumn`. The gesture ("drag, hold ~1s, release outside the board")
is inherently pointer-based, so native HTML5 drag can't express the hold timer.

## Goals / Non-Goals

**Goals:**
- Reorder frames by dragging, persisting `order`.
- Delete by dragging off the board + hold + confirm.
- Keep the decision logic pure and unit-tested; no new dependency.

**Non-Goals:**
- Cross-day moves, multi-select drag, resize.
- A fancy drag preview.

## Decisions

**Pure helpers in `src/lib/board-reorder.ts`** (unit-tested): `moveItem(items, from, to)` (immutable move,
no-op on invalid/equal indices); `dropIndex(pointer, midpoints)` (target index from the pointer position
along the drag axis); `shouldDeleteOnDrop(insideBoard, heldMs)` = `!insideBoard && heldMs >= HOLD_TO_DELETE_MS`
(`HOLD_TO_DELETE_MS = 1000`).

**Store `reorderProject(from, to)`** applies `moveItem`, assigns each project `order = index + 1`, updates
the store, and persists via `writeNote` for each project (rewriting frontmatter order; body unchanged). A
no-op move writes nothing.

**Pointer wiring (thin glue, verified in dev).** A drag handle on the frame header captures the pointer;
`pointermove` tracks position (→ `dropIndex`, and whether the pointer is inside the board rect, and the
held time); `pointerup` resolves via the pure helpers: outside + held → set `pendingDeleteSlug` (shows a
`DeleteConfirm` dialog → `deleteProject`); otherwise `reorderProject(from, dropIndex)`.

**`DeleteConfirm` dialog** is a small reusable component (tested standalone: confirm fires `onConfirm`,
cancel fires `onCancel`), reused for the drag-delete.

## Risks / Trade-offs

- [Pointer glue isn't unit-testable in jsdom] → the decision logic (helpers), persistence (`reorderProject`),
  and confirm flow (`DeleteConfirm`) are unit-tested; the raw pointer tracking is verified live in `tauri dev`.
- [Reorder rewrites N notes] → few projects per day; acceptable, and body is the current store value.
