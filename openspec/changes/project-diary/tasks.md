## 1. Rust: read the diary cache

- [x] 1.1 (RED) In `src-tauri/src/fs/diary.rs`, tests: parse a fixture and return a project's entry;
  missing file → None; missing project → None; malformed JSON → `Parse`; invalid day key → error.
- [x] 1.2 (GREEN) Implement `DiaryEvent`, `DiaryEntry`, `read_diary(root, day, slug)` reading
  `root/.dailyquick/diary/<day>.json`; add `pub mod diary;` to `fs/mod.rs`.
- [x] 1.3 (GREEN) Add the `read_diary(key, slug)` command in `commands/notes.rs` and register it in `lib.rs`.

## 2. TS: diary API

- [x] 2.1 (GREEN) Add `diaryEntrySchema`/`diaryEventSchema` + `readDiary(day, slug)` in `src/lib/notes-api.ts`.

## 3. Diary panel

- [x] 3.1 (RED) In `src/components/diary/DiaryPanel.test.tsx`, assert: a panel with the summary + events
  renders when there is an entry; nothing renders when there is none.
- [x] 3.2 (GREEN) Implement `DiaryPanel` (loads via `readDiary` on day/slug change; read-only summary + events).
- [x] 3.3 (GREEN) Wire `DiaryPanel` into `ProjectColumn` (stub it in `ProjectColumn.test.tsx`).

## 4. Sample + producer (companion, outside the DoD gate)

- [x] 4.1 Add `docs/diary.sample.json` documenting the cache shape.
- [x] 4.2 Write the `/project-diary` producer (SKILL): Apple Mail (AppleScript) + Slack (MCP) per project,
  AI synthesis, write the cache. Note it needs live Automation permission + Slack auth.

## 5. Verify

- [x] 5.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
