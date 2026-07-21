## Why

Filling the diary today means running `/project-diary` in a Claude Code session by hand. A permanent
"Sincronizar" button in the app should trigger that on demand.

## What Changes

- A permanent **"Sincronizar diario"** button in the board header triggers a diary sync and, on success,
  reloads the diary panels. It shows progress and toasts the outcome.
- A `sync_diary(day)` Tauri command runs the Claude Code **`/project-diary`** producer headless (Slack +
  Apple Mail + AI live in Claude Code, not the app). **Best-effort**: it depends on the local `claude`
  CLI and its MCP/Mail setup; the app itself still performs no OAuth/AI.

## Capabilities

### Modified Capabilities
- `project-diary`: sync the diary from the app (delegating to the Claude Code producer).

## Impact

- Rust: `sync_diary(day)` command in `commands/notes.rs` (spawns `claude`), registered in `lib.rs`.
- TS: `syncDiary` in `notes-api.ts`; a `SyncDiaryButton` in the header; a `diaryNonce`/`refreshDiary` in
  the board store so `DiaryPanel` re-reads the cache after a sync.
- No on-disk contract change. (A native menu-bar entry for this + external-access config is a follow-up.)
