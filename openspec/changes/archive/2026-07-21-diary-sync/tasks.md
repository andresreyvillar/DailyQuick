## 1. Rust: sync command

- [x] 1.1 (GREEN) Add `sync_diary(key)` in `commands/notes.rs` (validate key; spawn `claude -p …
  --permission-mode acceptEdits` in the home dir; return stdout or a typed error); register it in `lib.rs`.

## 2. Refresh plumbing

- [x] 2.1 (GREEN) Add `diaryNonce` + `refreshDiary()` to the board store; make `DiaryPanel` depend on
  `diaryNonce`.

## 3. Sync button

- [x] 3.1 (RED) In `src/components/diary/SyncDiaryButton.test.tsx`, assert: clicking calls `syncDiary(day)`
  and bumps `diaryNonce` on success; shows an error toast (no bump) on failure.
- [x] 3.2 (GREEN) Add `syncDiary` to `notes-api.ts`; implement `SyncDiaryButton` (progress + toast); wire it
  into the board header.

## 4. Verify

- [x] 4.1 Run `npm run verify:change` (DoD gate); the Rust command is best-effort/live-verified (not unit-tested).
