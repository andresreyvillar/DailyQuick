## 1. Rust: streaming per-project sync

- [x] 1.1 (GREEN) Replace `sync_diary` with `sync_project_diary(app, key, slug)` in `commands/notes.rs`
  (spawn `claude` stream-json; background thread emits `diary-sync-progress`/`diary-sync-done`;
  `summarize_stream_line` helper); update the handler registration in `lib.rs`.

## 2. TS: per-project sync API + button

- [x] 2.1 (GREEN) Replace `syncDiary` with `syncProjectDiary(day, slug)` in `notes-api.ts`.
- [x] 2.2 (RED) In `src/components/diary/ProjectSyncButton.test.tsx`, assert: click starts a sync for
  today with the slug; a matching `diary-sync-progress` event appends to the log (other slugs ignored);
  a successful `diary-sync-done` bumps `diaryNonce`.
- [x] 2.3 (GREEN) Implement `ProjectSyncButton` (per card, listens for the events, live log); wire it into
  `ProjectColumn`; remove the global `SyncDiaryButton` + header wiring; stub in `ProjectColumn.test`/`Board.test`.

## 3. Verify

- [x] 3.1 Run `npm run verify:change` (DoD gate); the streaming Rust command is verified live.
