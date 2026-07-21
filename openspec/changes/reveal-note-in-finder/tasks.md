## 1. Resolve the note path for reveal (Rust)
- [x] 1.1 (RED) Add tests in `fs/store.rs` for `note_path_for_reveal`: an existing note returns its
      absolute path (`<root>/<day>/<slug>.md`); a missing note returns `NotFound`; a traversal slug/key
      returns a typed error. (Scenarios: "Existing note resolves to its file path", "Missing note is
      reported", "Reveal stays within the storage root".)
- [x] 1.2 (GREEN) Implement `note_path_for_reveal(root, key, slug)` in `fs/store.rs` — reuse
      `path::note_path` for validation, return `NotFound` when the file is absent, else the `PathBuf`.

## 2. reveal_note Tauri command
- [x] 2.1 (GREEN) Add `#[tauri::command] reveal_note(app, key, slug)` in `commands/notes.rs` using
      `store::note_path_for_reveal` + `app.opener().reveal_item_in_dir(...)`; register it in `lib.rs`.
      (Thin wrapper over the tested helper + the plugin; covered by `cargo build`/`clippy`.)

## 3. Frontend wrapper
- [x] 3.1 (RED) Test in `src/lib/notes-api.test.ts` that `revealNote(key, slug)` invokes `reveal_note`
      with `{ key, slug }`.
- [x] 3.2 (GREEN) Add `revealNote(key, slug)` to `src/lib/notes-api.ts`.

## 4. Actions-menu integration
- [x] 4.1 (RED) Test in `ProjectColumn.test.tsx` that opening the `⋯` menu and clicking
      `Mostrar en Finder` calls `revealNote(dayKey, slug)` with the viewed day key. (Scenario: "Reveal
      from the actions menu".)
- [x] 4.2 (GREEN) Add the `Mostrar en Finder` menu item to `ProjectColumn.tsx` (above `Vincular
      fuentes`); on click, close the menu and call `revealNote(dayKey, slug)`.

## 5. Verify
- [x] 5.1 Run `npm run verify:change` (DoD gate) green and confirm each spec scenario maps to a passing test.
