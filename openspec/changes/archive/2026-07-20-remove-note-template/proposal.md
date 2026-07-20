## Why

The empty-project "Plantilla básica" prompt is unwanted — projects should open straight into a blank
editor. Separately, the grid layout overlaps frames vertically when a frame's content is taller than
the fixed row min-height.

## What Changes

- **Remove** the default template feature: the empty-state "Plantilla básica" prompt, `BASIC_TEMPLATE`,
  and the store's `applyTemplate`. Projects open directly into the editor.
- **Fix** the grid layout so frames size to their content (no vertical overlap).

## Capabilities

### Removed Capabilities
- `note-template`: the "seed an empty note from a template" behavior is removed.

## Impact

- Removed: `src/lib/note-template.ts` (+ test); `applyTemplate` in `src/state/board-store.ts` (+ test);
  the template prompt in `src/components/board/ProjectColumn.tsx` (+ its tests).
- Grid bugfix: `src/components/board/Board.tsx` — grid frames are content-sized (`self-start`, no fixed
  row min-height), so they no longer overlap.
- No on-disk contract or Tauri command changes.
