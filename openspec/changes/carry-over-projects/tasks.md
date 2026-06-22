## 1. Carry-over store action (Requirement: Carry over the previous day's projects)

- [x] 1.1 (RED) Test: `importPreviousDay()` reads the previous day and calls `create_project(dayKey, title, color)` for each prior project, then reloads
- [x] 1.2 (RED) Test: a prior project whose slug already exists today is skipped (no `create_project` call for it; existing note untouched)
- [x] 1.3 (RED) Test: a per-project `AlreadyExists`/error does not abort the rest
- [x] 1.4 (GREEN) Implement `importPreviousDay` in `board-store.ts` (reuse `listDay` + `addDays` + `apiCreateProject`, default color when null, single `loadDay` at the end)
- [x] 1.5 (REFACTOR) Keep green

## 2. Header carry-over control (Requirement: Carry over the previous day's projects)

- [x] 2.1 (RED) Test: `CarryOverButton` is disabled when the previous day has no importable projects
- [x] 2.2 (RED) Test: when the previous day has projects not present today, the button is enabled and clicking calls `importPreviousDay`
- [x] 2.3 (GREEN) Implement `CarryOverButton` (fetch previous-day summaries on `dayKey`, compute importable set, disable when empty) and place it in the `Board` header
- [x] 2.4 (REFACTOR) Existing Board tests still pass

## 3. Definition-of-Done gate

- [x] 3.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 3.2 Every spec scenario maps to a passing test
- [x] 3.3 Manual check via `npm run tauri dev`: on an empty day, copy the previous day's projects; re-run is a no-op; existing projects are untouched
- [x] 3.4 Open the PR; merge when the gate is green AND the manual check passes
