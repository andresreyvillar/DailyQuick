## 1. Setup

- [x] 1.1 Add Rust deps to `src-tauri/Cargo.toml`: `chrono`, a frontmatter/YAML parser, `thiserror`, and `tempfile` (dev) for tests
- [x] 1.2 Create module skeleton: `src-tauri/src/fs/mod.rs` (layout, frontmatter), `src-tauri/src/commands/notes.rs`; register modules in `lib.rs`
- [x] 1.3 Configure Vitest: `vitest.config.ts` + `src/test/setup.ts`; ensure `npm test` runs (passWithNoTests until tests land)
- [x] 1.4 Create `src/lib/` for pure TS helpers

## 2. Canonical date key (Requirement: Canonical date key)

- [x] 2.1 (RED) Rust test: date 21 Jun 2026 → key `2026-06-21`
- [x] 2.2 (RED) Rust test: `2026-6-1` and `21-06-2026` rejected with typed `InvalidKey`
- [x] 2.3 (GREEN) Implement `day_key(date)` + `validate_key(s)` in `fs` using `chrono`
- [x] 2.4 (RED) TS test in `src/lib/date-key.test.ts`: format today's date → `YYYY-MM-DD`
- [x] 2.5 (GREEN) Implement `src/lib/date-key.ts` (display/formatting only)
- [x] 2.6 (REFACTOR) De-duplicate, keep both suites green

## 3. Project slug (Requirement: Storage root and path layout)

- [x] 3.1 (RED) Rust test: `My Project!` → `my-project`; slug matches `^[a-z0-9-]+$`
- [x] 3.2 (RED) Rust test: empty/invalid title → typed `InvalidSlug`
- [x] 3.3 (GREEN) Implement `slugify(title)` and `validate_slug(s)`
- [x] 3.4 (REFACTOR) Clean up; keep green

## 4. Path resolution & safety (Requirements: Storage root and path layout; Disk access only through Tauri commands)

- [x] 4.1 (RED) Rust test: key `2026-06-21` + slug `oakmond` → `<root>/2026-06-21/oakmond.md` (root injected for tests)
- [x] 4.2 (RED) Rust test: traversal attempt (`../`, absolute, bad chars) is rejected before any path join
- [x] 4.3 (GREEN) Implement `note_path(root, key, slug)` + `day_dir(root, key)` with allowlist validation
- [x] 4.4 (GREEN) Resolve root via Tauri path API / `dirs` (injectable for tests), default `~/DailyQuick`
- [x] 4.5 (REFACTOR) Keep green

## 5. Frontmatter parse & serialize (Requirement: Frontmatter parse and serialize)

- [x] 5.1 (RED) Rust test: valid frontmatter + body → parse → re-serialize is semantically equal (lossless round-trip)
- [x] 5.2 (RED) Rust test: no frontmatter → defaults (title from slug, no color, order last), no panic
- [x] 5.3 (RED) Rust test: malformed YAML → typed `Parse` error, raw content preserved
- [x] 5.4 (GREEN) Implement parser + deterministic fixed-order serializer (`title`, `color`, `order`, `created`)
- [x] 5.5 (REFACTOR) Isolate parser behind one module boundary; keep green

## 6. Create day folder (Requirement: Create day folder on demand)

- [x] 6.1 (RED) Rust test: writing to a new day creates `<root>/<key>/` first; idempotent if it exists
- [x] 6.2 (RED) Rust test: existing folder + notes are preserved on reuse
- [x] 6.3 (GREEN) Implement `ensure_day(root, key)` (idempotent `create_dir_all`)
- [x] 6.4 (REFACTOR) Keep green

## 7. Write note atomically (Requirement: Write a project note)

- [x] 7.1 (RED) Rust test: write note → read back returns same frontmatter + body
- [x] 7.2 (RED) Rust test: a failing write leaves any existing file unchanged (atomicity)
- [x] 7.3 (GREEN) Implement `write_note` (serialize → temp file → rename); validate before replace
- [x] 7.4 (REFACTOR) Keep green

## 8. Read note (Requirement: Read a project note)

- [x] 8.1 (RED) Rust test: read existing note → typed struct (title/color/order/created/body)
- [x] 8.2 (RED) Rust test: read missing note → typed `NotFound` result (no crash)
- [x] 8.3 (GREEN) Implement `read_note`
- [x] 8.4 (REFACTOR) Keep green

## 9. List day (Requirement: List project notes for a day)

- [x] 9.1 (RED) Rust test: folder with `personal.md` (order 2) + `oakmond.md` (order 1) → `[oakmond, personal]`
- [x] 9.2 (RED) Rust test: missing day → empty list, folder NOT created
- [x] 9.3 (GREEN) Implement `list_day` (sort by order then title)
- [x] 9.4 (REFACTOR) Keep green

## 10. Tauri command boundary (Requirement: Disk access only through Tauri commands)

- [x] 10.1 (GREEN) Expose `#[tauri::command]` `ensure_day`, `write_note`, `read_note`, `list_day` in `commands/notes.rs`
- [x] 10.2 (GREEN) Register handlers in `lib.rs` `invoke_handler`; map domain errors to serializable typed errors
- [x] 10.3 (GREEN) Add `zod` schemas + typed wrappers in `src/lib/notes-api.ts` for the command payloads
- [x] 10.4 (RED) TS test: zod schema accepts a valid note payload and rejects a malformed one
- [x] 10.5 (REFACTOR) Keep green

## 11. Definition-of-Done gate

- [x] 11.1 Run `npm run verify:change` — `openspec validate --strict`, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 11.2 Confirm every spec scenario maps to at least one passing test
- [ ] 11.3 Open/update the PR for this change; merge only when the gate is green
