## 1. Backend delete (Requirement: Delete a project — disk side)

- [x] 1.1 (RED) Rust test in `fs/store.rs`: `delete_note` removes only `<slug>.md` for the day (a sibling project in the same day and the same slug in another day both remain)
- [x] 1.2 (RED) Rust test: `delete_note` on an absent note returns `StorageError::NotFound` and creates/touches nothing
- [x] 1.3 (GREEN) Implement `fs::store::delete_note(root, key, slug)` using `fs::path::note_path` + `remove_file`
- [x] 1.4 (GREEN) Add `#[tauri::command] delete_note(key, slug)` in `commands/notes.rs` and register it in `lib.rs` `generate_handler!`
- [x] 1.5 (REFACTOR) `cargo clippy` clean; keep green

## 2. TS wrapper + store action (Requirement: Delete a project — board side)

- [x] 2.1 (RED) Test: `deleteProject(slug)` calls `deleteNote(dayKey, slug)`, removes the project from `projects`, and clears its `revisions` entry; siblings remain
- [x] 2.2 (GREEN) Add `deleteNote(key, slug)` to `notes-api` and `deleteProject(slug)` to `board-store`
- [x] 2.3 (REFACTOR) Keep green

## 3. Column actions menu + confirm (Requirement: Delete a project — confirmation)

- [x] 3.1 (RED) Test: the "⋯" button opens a menu showing a destructive `Eliminar` item
- [x] 3.2 (RED) Test: clicking `Eliminar` shows an inline confirm; nothing is deleted yet
- [x] 3.3 (RED) Test: confirming calls `deleteProject(slug)`; `Cancelar` / outside-click closes without calling it
- [x] 3.4 (GREEN) Add the actions menu + inline confirm to `ProjectColumn` (overlay/outside-click like the event popover)
- [x] 3.5 (REFACTOR) Existing ProjectColumn/Board tests still pass

## 4. Definition-of-Done gate

- [x] 4.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 4.2 Every spec scenario maps to a passing test
- [ ] 4.3 Manual check via `npm run tauri dev`: delete a project, confirm the column disappears and the `.md` is gone; cancel leaves it
- [ ] 4.4 Open the PR; merge when the gate is green AND the manual check passes
