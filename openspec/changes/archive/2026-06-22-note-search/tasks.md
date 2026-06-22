## 1. Backend search (Requirement: Search notes by content and title; Results ordered by recency)

- [x] 1.1 (RED) Rust test: body match returns a hit with day/slug + snippet
- [x] 1.2 (RED) Rust test: case-insensitive
- [x] 1.3 (RED) Rust test: title-only match
- [x] 1.4 (RED) Rust test: no match → empty; empty/whitespace query → empty (no scan)
- [x] 1.5 (RED) Rust test: ordered `[2026-06-20, 2026-06-18]`
- [x] 1.6 (RED) Rust test: non-day dirs (`.dailyquick`) skipped
- [x] 1.7 (GREEN) Implement `fs/search.rs` `search(root, query) -> Vec<SearchHit>`
- [x] 1.8 (GREEN) Expose `#[tauri::command] search_notes`; register in `lib.rs`
- [x] 1.9 (REFACTOR) Keep green

## 2. Frontend API (Requirement: Search notes by content and title)

- [x] 2.1 (RED) TS test: `searchHitSchema` accepts a valid hit and rejects a malformed one; `search` blank query returns `[]` without invoking
- [x] 2.2 (GREEN) Add `search(query)` wrapper + `searchHitSchema` in `notes-api.ts`
- [x] 2.3 (REFACTOR) Keep green

## 3. SearchPanel component (Requirements: Search; Open a result)

- [x] 3.1 (RED) Test: typing (after debounce) calls `search` and renders the hits
- [x] 3.2 (RED) Test: clicking a result calls `goToDay` with the hit's day key
- [x] 3.3 (RED) Test: blank query renders no results and does not call `search`
- [x] 3.4 (GREEN) Implement `src/components/board/SearchPanel.tsx` (debounced input + results, wired to `search` + `goToDay`)
- [x] 3.5 (REFACTOR) Keep green

## 4. Board integration

- [x] 4.1 (GREEN) Render `<SearchPanel>` in the board header
- [x] 4.2 (REFACTOR) Existing board tests still pass

## 5. Definition-of-Done gate

- [x] 5.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 5.2 Every spec scenario maps to a passing test
- [ ] 5.3 Open the PR for this change; merge only when the gate is green
