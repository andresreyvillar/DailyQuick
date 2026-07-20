## Context

The template feature spans `note-template.ts` (`BASIC_TEMPLATE`), `board-store.applyTemplate`, and the
empty-state prompt in `ProjectColumn`. The grid layout (from `board-view-modes`) set each frame wrapper
`min-h-[260px]` with a `flex-1`/`h-full` inner, so a frame whose editor content exceeded 260px overflowed
its cell and overlapped the next row (`ProjectColumn` intentionally does not clip, to keep the slash menu visible).

## Goals / Non-Goals

**Goals:** remove the template feature cleanly; make grid frames size to content.

**Non-Goals:** changing the editor, columns/rows layouts, or the on-disk notes.

## Decisions

**Remove the template** — delete `note-template.ts` (+ test), `applyTemplate` (store type + impl + test),
and the `ProjectColumn` empty-state prompt (+ its tests). `isEmpty` becomes unused and is dropped.

**Grid sizes to content** — in grid mode the frame wrapper is `self-start` with no fixed min-height, and
the inner wrapper is not `flex-1` (so `ProjectColumn` reports its natural height). Columns/rows keep
`flex-1` + `h-full` (viewport-tall columns). Grid rows then auto-size and frames no longer overlap.

## Risks / Trade-offs

- [Grid frames with very long notes can be tall] → acceptable; grid is an overview and the canvas scrolls.
