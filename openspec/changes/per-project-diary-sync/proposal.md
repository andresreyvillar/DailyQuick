## Why

The single global "Sincronizar diario" button syncs the whole day at once, blocks on the result, and
shows no progress — the user can't see what it finds in Slack/email or work while it runs.

## What Changes

- The sync moves to a **per-project button on each card**. Each project syncs independently.
- Sync is **asynchronous and non-blocking**: it starts a background `claude` run and returns immediately;
  the app stays usable and several projects can sync at once.
- **Live progress**: the run streams (`--output-format stream-json`) and each step is emitted as a Tauri
  event, so the card shows a live log of what it searches and finds in Slack/email.
- Sync is always for **today**.
- The global header sync button is removed.

Out of scope (a later phase): interactive curation — picking which ambiguous matches to keep before saving.

## Capabilities

### Modified Capabilities
- `project-diary`: the diary sync is per-project, asynchronous, streams live progress, and targets today.

## Impact

- Rust: replace `sync_diary` with `sync_project_diary(app, key, slug)` (spawns `claude` in stream-json,
  emits `diary-sync-progress` / `diary-sync-done` events; returns immediately).
- TS: `syncProjectDiary` in `notes-api.ts`; a new `ProjectSyncButton` (per card, live log) wired into
  `ProjectColumn`; the header `SyncDiaryButton` is removed.
