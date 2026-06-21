## 1. Setup

- [ ] 1.1 Add Rust deps to `src-tauri/Cargo.toml`: `chrono`, a frontmatter/YAML parser, `thiserror`, and `tempfile` (dev) for tests
- [ ] 1.2 Create module skeleton: `src-tauri/src/fs/mod.rs` (layout, frontmatter), `src-tauri/src/commands/notes.rs`; register modules in `lib.rs`
- [ ] 1.3 Configure Vitest: `vitest.config.ts` + `src/test/setup.ts`; ensure `npm test` runs (passWithNoTests until tests land)
- [ ] 1.4 Create `src/lib/` for pure TS helpers

## 2. Canonical date key (Requirement: Canonical date key)

- [ ] 2.1 (RED) Rust test: date 21 Jun 2026 → key `2026-06-21`
- [ ] 2.2 (RED) Rust test: `2026-6-1` and `21-06-2026` rejected with typed `InvalidKey`
- [ ] 2.3 (GREEN) Implement `day_key(date)` + `validate_key(s)` in `fs` using `chrono`
- [ ] 2.4 (RED) TS test in `src/lib/date-key.test.ts`: format today's date → `YYYY-MM-DD`
- [ ] 2.5 (GREEN) Implement `src/lib/date-key.ts` (display/formatting only)
- [ ] 2.6 (REFACTOR) De-duplicate, keep both suites green

## 3. Project slug (Requirement: Storage root and path layout)

- [ ] 3.1 (RED) Rust test: `My Project!` → `my-project`; slug matches `^[a-z0-9-]+$`
- [ ] 3.2 (RED) Rust test: empty/invalid title → typed `InvalidSlug`
- [ ] 3.3 (GREEN) Implement `slugify(title)` and `validate_slug(s)`
- [ ] 3.4 (REFACTOR) Clean up; keep green

## 4. Path resolution & safety (Requirements: Storage root and path layout; Disk access only through Tauri commands)

- [ ] 4.1 (RED) Rust test: key `2026-06-21` + slug `oakmond` → `<root>/2026-06-21/oakmond.md` (root injected for tests)
- [ ] 4.2 (RED) Rust test: traversal attempt (`../`, absolute, bad chars) is rejected before any path join
- [ ] 4.3 (GREEN) Implement `note_path(root, key, slug)` + `day_dir(root, key)` with allowlist validation
- [ ] 4.4 (GREEN) Resolve root via Tauri path API / `dirs` (injectable for tests), default `~/DailyQuick`
- [ ] 4.5 (REFACTOR) Keep green

## 5. Frontmatter parse & serialize (Requirement: Frontmatter parse and serialize)

- [ ] 5.1 (RED) Rust test: valid frontmatter + body → parse → re-serialize is semantically equal (lossless round-trip)
- [ ] 5.2 (RED) Rust test: no frontmatter → defaults (title from slug, no color, order last), no panic
- [ ] 5.3 (RED) Rust test: malformed YAML → typed `Parse` error, raw content preserved
- [ ] 5.4 (GREEN) Implement parser + deterministic fixed-order serializer (`title`, `color`, `order`, `created`)
- [ ] 5.5 (REFACTOR) Isolate parser behind one module boundary; keep green

## 6. Create day folder (Requirement: Create day folder on demand)

- [ ] 6.1 (RED) Rust test: writing to a new day creates `<root>/<key>/` first; idempotent if it exists
- [ ] 6.2 (RED) Rust test: existing folder + notes are preserved on reuse
- [ ] 6.3 (GREEN) Implement `ensure_day(root, key)` (idempotent `create_dir_all`)
- [ ] 6.4 (REFACTOR) Keep green

## 7. Write note atomically (Requirement: Write a project note)

- [ ] 7.1 (RED) Rust test: write note → read back returns same frontmatter + body
- [ ] 7.2 (RED) Rust test: a failing write leaves any existing file unchanged (atomicity)
- [ ] 7.3 (GREEN) Implement `write_note` (serialize → temp file → rename); validate before replace
- [ ] 7.4 (REFACTOR) Keep green

## 8. Read note (Requirement: Read a project note)

- [ ] 8.1 (RED) Rust test: read existing note → typed struct (title/color/order/created/body)
- [ ] 8.2 (RED) Rust test: read missing note → typed `NotFound` result (no crash)
- [ ] 8.3 (GREEN) Implement `read_note`
- [ ] 8.4 (REFACTOR) Keep green

## 9. List day (Requirement: List project notes for a day)

- [ ] 9.1 (RED) Rust test: folder with `personal.md` (order 2) + `oakmond.md` (order 1) → `[oakmond, personal]`
- [ ] 9.2 (RED) Rust test: missing day → empty list, folder NOT created
- [ ] 9.3 (GREEN) Implement `list_day` (sort by order then title)
- [ ] 9.4 (REFACTOR) Keep green

## 10. Tauri command boundary (Requirement: Disk access only through Tauri commands)

- [ ] 10.1 (GREEN) Expose `#[tauri::command]` `ensure_day`, `write_note`, `read_note`, `list_day` in `commands/notes.rs`
- [ ] 10.2 (GREEN) Register handlers in `lib.rs` `invoke_handler`; map domain errors to serializable typed errors
- [ ] 10.3 (GREEN) Add `zod` schemas + typed wrappers in `src/lib/notes-api.ts` for the command payloads
- [ ] 10.4 (RED) TS test: zod schema accepts a valid note payload and rejects a malformed one
- [ ] 10.5 (REFACTOR) Keep green

## 11. Definition-of-Done gate

- [ ] 11.1 Run `npm run verify:change` — `openspec validate --strict`, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [ ] 11.2 Confirm every spec scenario maps to at least one passing test
- [ ] 11.3 Open/update the PR for this change; merge only when the gate is green
