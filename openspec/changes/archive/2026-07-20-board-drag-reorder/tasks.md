## 1. Pure drag helpers

- [x] 1.1 (RED) In `src/lib/board-reorder.test.ts`, test `moveItem` (moves; no-op on equal/invalid) and
  `shouldDeleteOnDrop` (outside + held ≥1s only).
- [x] 1.2 (GREEN) Implement `HOLD_TO_DELETE_MS`, `moveItem`, `shouldDeleteOnDrop` in
  `src/lib/board-reorder.ts` (drop target index resolved from the DOM via `elementFromPoint`).

## 2. Persisted reorder in the store

- [x] 2.1 (RED) In `src/state/board-store.test.ts`, assert `reorderProject(from, to)` reorders the
  projects and rewrites each note's frontmatter `order`, and that a no-op move writes nothing.
- [x] 2.2 (GREEN) Implement `reorderProject` (moveItem + order=index+1 + `writeNote` per project).

## 3. Delete-confirm dialog

- [x] 3.1 (RED) In `src/components/board/DeleteConfirm.test.tsx`, assert confirm calls `onConfirm` and
  cancel calls `onCancel`.
- [x] 3.2 (GREEN) Implement a reusable `DeleteConfirm` dialog.

## 4. Pointer drag wiring (glue)

- [x] 4.1 (GREEN) Add a drag handle to the frame header and pointer handlers in `Board`/`ProjectColumn`
  that resolve a drop via the pure helpers: outside+held → `DeleteConfirm` → `deleteProject`; else
  `reorderProject`. Board exposes its rect for the inside/outside test.
- [x] 4.2 (REFACTOR) Keep the handler thin; the logic lives in the helpers/store.

## 5. Verify

- [x] 5.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test
  (pointer wiring verified live in `tauri dev`).
