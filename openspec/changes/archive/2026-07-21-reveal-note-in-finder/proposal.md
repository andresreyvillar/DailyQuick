## Why

Markdown on disk is DailyQuick's source of truth, and the folder layout (`~/DailyQuick/<day>/<slug>.md`)
doubles as context for coding agents. When working in a project frame, the user often wants to jump to
the actual file on disk — to open the day folder, copy the path, or hand it to another tool. Today there
is no way to get from a frame to its `.md`; the user has to find it manually in Finder.

## What Changes

- Add a **"Mostrar en Finder"** action to each project frame's `⋯` actions menu that reveals that
  project's note file in the macOS Finder (with the file selected).
- Add a read-only Tauri command `reveal_note(key, slug)` that resolves the note's on-disk path and
  reveals it via the already-present `tauri-plugin-opener`. It never creates, modifies, or deletes.

## Capabilities

### Modified Capabilities
- `project-management`: adds a new project-frame action to reveal the project's note file in the Finder.

## Impact

- **Rust**: new `#[tauri::command] reveal_note` in `src-tauri/src/commands/notes.rs` + a
  `note_path_for_reveal` helper in `src-tauri/src/fs/store.rs`; registered in `src-tauri/src/lib.rs`.
  Reuses `tauri-plugin-opener` (already a dependency) — **no capability/permission changes** (app
  commands are allowed by default and the reveal is a Rust-side plugin call, not a gated IPC call).
- **TS**: new `revealNote(key, slug)` wrapper in `src/lib/notes-api.ts`; a menu item in
  `src/components/board/ProjectColumn.tsx`.
- **No change** to the on-disk contract, the frontmatter schema, or the SQLite cache. Read-only.
- macOS-only (matches the app's target); the reveal uses the viewed day's key, so it works for past
  days too (not restricted to today, unlike the diary sync).
