## Context

`project-management` covers create/rename/recolor; each project is a `.md` file under
`~/DailyQuick/<day>/`. There is no delete path yet — the renderer never touches disk, so removal needs
a new privileged command behind the Tauri boundary. Notes are irreplaceable (guardrail §9), so the
command must be narrow (one file) and the UI must confirm before calling it.

## Goals / Non-Goals

**Goals:** remove a single project's note for the current day from disk, drop its column from the
board, and require explicit confirmation in the UI. Touch nothing else on disk.

**Non-Goals:** trash/undo/recovery, bulk delete, reordering, deleting a whole day folder, the
formatting toolbar.

## Decisions

- **`fs::store::delete_note(root, key, slug)`** (new): resolve the path via the existing
  `fs::path::note_path` (which already validates the date key + slug and stays inside the day folder),
  then `std::fs::remove_file`. If the file is absent, return `StorageError::NotFound` (do not create or
  touch anything). It removes only the resolved `<slug>.md` — never the directory.
- **Command** `commands::notes::delete_note(key, slug) -> Result<(), StorageError>` mirrors the other
  note commands (resolves `default_root`, delegates to `fs::store`), registered in `lib.rs`'s
  `generate_handler!`.
- **TS wrapper** `deleteNote(key, slug): Promise<void>` in `notes-api` (typed `invoke`), matching the
  existing wrapper style.
- **Store** `deleteProject(slug)` (board-store): `await deleteNote(dayKey, slug)`, then set
  `projects` to those without that slug and remove the slug's entry from `revisions`. No full day
  reload needed — the removal is local and the file is already gone.
- **UI** (`ProjectColumn`): a "⋯" button in the header opens a small menu (same overlay/outside-click
  pattern as the event popover). The menu has one destructive item **Eliminar**; clicking it switches
  the menu to an inline confirm (`¿Eliminar "<title>"?` with **Eliminar** destructive + **Cancelar**).
  Confirm calls `deleteProject(slug)`; Cancelar/outside-click closes without deleting. The menu state
  is local to the column.

## Risks / Trade-offs

- **Irreversible delete** → mitigated by the inline confirm step; there is no trash by design (out of
  scope). The command deletes exactly one resolved file and never the directory.
- **Stale board state if the file was already gone** → `NotFound` surfaces; the store still removes
  the column from view (the project no longer exists on disk), so the UI converges to the truth.
- **Path traversal via slug** → reuses `note_path`, which validates the slug and confines the path to
  the day folder; no raw slug is joined to the filesystem.
