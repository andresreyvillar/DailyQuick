## Why

Project frames can't be rearranged, and deleting one means opening its menu. Direct manipulation —
dragging a frame to reorder it, and dragging it off the board to delete it — is faster and more spatial.

## What Changes

- **Reorder** project frames by dragging: the new order is persisted by rewriting each note's
  frontmatter `order`.
- **Delete by gesture**: dragging a frame, holding for ~1s, and releasing it **outside the board** asks
  for confirmation and, on confirm, deletes that project (reusing the existing delete path). Releasing
  inside the board, or before the hold, just reorders/cancels — never deletes without confirmation.

## Capabilities

### Modified Capabilities
- `daily-board`: reorder frames by dragging (persisted).
- `project-management`: delete a project via the drag-off-board gesture (with confirmation).

## Impact

- `src/lib/board-reorder.ts`: pure `moveItem`, `dropIndex`, `shouldDeleteOnDrop` (+ `HOLD_TO_DELETE_MS`).
- `src/state/board-store.ts`: `reorderProject(from, to)` persisting new `order` to frontmatter.
- `src/components/board/Board.tsx` / `ProjectColumn.tsx`: pointer-based drag handle, drop resolution,
  and a delete-confirm dialog. Native pointer events — no new dependency.
