## Context

DailyQuick is a Tauri 2 app whose notes are plain `.md` files under `~/DailyQuick/<day>/<slug>.md`
(the source of truth). Each project frame has a `⋯` actions menu (`ProjectColumn.tsx`) already offering
`Vincular fuentes` and `Eliminar proyecto`. All privileged work lives behind `#[tauri::command]`
handlers in `src-tauri/src/commands/notes.rs`; path building/validation lives in `fs/path.rs`
(`note_path` rejects traversal). `tauri-plugin-opener` is already a dependency (Rust + JS) with
`opener:default` in `capabilities/default.json`.

## Goals / Non-Goals

**Goals:**
- One `⋯`-menu action that reveals the current project's `.md` in the macOS Finder, file selected.
- Reuse `tauri-plugin-opener`'s `reveal_item_in_dir`; keep the work behind the Tauri command boundary.
- Read-only and safe: never write/create/delete; never escape the storage root; typed error if missing.

**Non-Goals:**
- Opening the note in an external editor, or revealing the day folder itself (only the note file).
- Cross-platform file-manager behavior (the app targets macOS).
- Any change to the on-disk contract, frontmatter schema, SQLite cache, or capabilities file.

## Decisions

- **New command `reveal_note(app, key, slug)`** in `commands/notes.rs`. It resolves the path via a new
  `store::note_path_for_reveal(root, key, slug)` helper, then calls
  `app.opener().reveal_item_in_dir(path)` (from `tauri_plugin_opener::OpenerExt`).
- **`note_path_for_reveal` helper** in `fs/store.rs` (mirrors `delete_note`): `path::note_path(...)?`
  for validation + anti-traversal, then `NotFound` if the file is absent, else the `PathBuf`. This is
  the unit-testable seam — the actual Finder reveal is side-effecting and not unit-testable, so the
  command stays a thin wrapper over the tested helper + the plugin.
- **No capability change.** App-defined commands are permitted without an ACL entry (existing
  `read_note`, `write_note`, … have none), and calling the opener plugin from Rust is a direct call,
  not a gated IPC invoke. So `capabilities/default.json` is untouched.
- **Frontend uses the viewed `dayKey`** (`revealNote(dayKey, slug)`), so reveal works on past days
  too — deliberately different from the diary sync button, which is today-only.

## Risks / Trade-offs

- The file could be deleted between render and click → the command returns `NotFound` (no crash); the
  frame only shows when the note exists, so this is an edge case.
- `reveal_item_in_dir`'s error surface is platform-dependent; on the macOS target it maps to
  `StorageError::Io` with the plugin's message. Acceptable for a best-effort reveal.
