## Why

The diary needs to know, per project, which Slack channel and which emails belong to it. Today that
mapping only exists as a hand-edited producer config file — there's no way to set it from the app.

## What Changes

- Each project's ⋯ actions menu gains **"Vincular fuentes"**, opening a small form to set the **search
  terms** the diary uses to find the project's emails (Apple Mail) and Slack messages. The terms default
  to the **project title** and are editable (comma-separated aliases).
- The app persists the mapping to `~/DailyQuick/.dailyquick/diary-sources.json` (keyed by project slug),
  which the `/project-diary` producer reads. No network in the app — it only writes a local config file.

## Capabilities

### Modified Capabilities
- `project-diary`: configure a project's diary sources (Slack channel + mail filters) from the app.

## Impact

- Rust: `src-tauri/src/fs/diary_sources.rs` (read/write the per-slug map), `read_diary_source` /
  `set_diary_source` commands, `lib.rs` registration.
- TS: `readDiarySource` / `setDiarySource` + zod types in `notes-api.ts`; a `DiarySourcesDialog` opened
  from the `ProjectColumn` ⋯ menu.
- Companion: `/project-diary` reads the config from `~/DailyQuick/.dailyquick/diary-sources.json`.
- No on-disk note-contract change; `diary-sources.json` is a small local config under `.dailyquick/`.
