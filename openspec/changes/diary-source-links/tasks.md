## 1. Rust: read/write the sources config

- [x] 1.1 (RED) In `src-tauri/src/fs/diary_sources.rs`, tests: missing file → None; `set` then `read`
  returns the source; `set` updates one slug without dropping others.
- [x] 1.2 (GREEN) Implement `DiarySource { search_terms }`, `read_diary_source(root, slug)`,
  `set_diary_source(root, slug, source)` reading/writing `root/.dailyquick/diary-sources.json`; add
  `pub mod diary_sources;` to `fs/mod.rs`.
- [x] 1.3 (GREEN) Add `read_diary_source(slug)` / `set_diary_source(slug, source)` commands in
  `commands/notes.rs` and register them in `lib.rs`.

## 2. TS: diary-sources API

- [x] 2.1 (GREEN) Add `diarySourceSchema` (`searchTerms`) + `readDiarySource(slug)` / `setDiarySource(slug, source)`
  in `src/lib/notes-api.ts`.

## 3. UI: sources dialog + menu item

- [x] 3.1 (RED) In `src/components/diary/DiarySourcesDialog.test.tsx`, assert: the field defaults to the
  project title with no saved terms; it pre-fills saved terms; saving calls `setDiarySource` with the
  comma-parsed list.
- [x] 3.2 (GREEN) Implement `DiarySourcesDialog` (loads `readDiarySource`, one search-terms field defaulting
  to the title, save/cancel).
- [x] 3.3 (GREEN) Add a "Vincular fuentes" item to the `ProjectColumn` ⋯ menu that opens the dialog; stub
  the dialog in `ProjectColumn.test.tsx` and assert the menu item exists.

## 4. Producer

- [x] 4.1 Update the `/project-diary` skill to read `~/DailyQuick/.dailyquick/diary-sources.json` and search
  the per-project `searchTerms` in Apple Mail + Slack.

## 5. Verify

- [x] 5.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
