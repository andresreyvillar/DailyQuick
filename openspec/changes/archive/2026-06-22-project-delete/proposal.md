## Why

A project column can be created, renamed, and recolored, but never removed — a mistyped or finished
project sticks to the board forever. The user wants to delete a project for the current day from a
small "⋯" menu on its column header. Because each project is an irreplaceable `.md` file on disk
(guardrail §9), the delete must be explicit and confirmed, and must touch nothing but that one file.

## What Changes

- **New backend command** `delete_note(day_key, slug)` — removes `~/DailyQuick/<day>/<slug>.md` and
  nothing else. Defensive: resolves strictly inside the day folder, never deletes the day folder or
  other files, and returns a typed `NotFound` error if the note is absent.
- **TS wrapper** `deleteNote(key, slug)` in `notes-api`.
- **Store action** `deleteProject(slug)` — calls `delete_note`, drops the project from board state,
  and clears its editor revision entry.
- **UI**: a "⋯" menu button on the `ProjectColumn` header opens a menu with a destructive **Eliminar**
  item; choosing it shows an inline confirmation (`¿Eliminar "X"?` → **Eliminar** / **Cancelar**).
  Nothing is deleted until the user confirms; an outside click closes the menu.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `project-management`: adds a "Delete a project" requirement (remove the day's note + column, with
  confirmation; other notes/days untouched).

## Impact

- **Native code**: a new `delete_note` Tauri command + a `delete` function in the `fs` module
  (reuses the existing day-folder path resolution and `StorageError`). Rust-unit-tested.
- **TS**: `deleteNote` wrapper; `deleteProject` store action; a per-column actions menu in
  `ProjectColumn` (menu + inline confirm). Vitest-covered.
- **Out of scope**: trash/undo or recovery, bulk delete, reordering, deleting an entire day folder,
  and the focus-revealed formatting toolbar (the next slice, `editor-toolbar`).
