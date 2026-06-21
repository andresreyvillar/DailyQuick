## 1. Backend: create_project command (Requirement: Create a project)

- [x] 1.1 (RED) Rust test: `create_project(root, key, "Oakmond", "#E54D2E")` writes `oakmond.md` with title/color, empty body, `created = key`
- [x] 1.2 (RED) Rust test: title `My Project!` → slug `my-project`
- [x] 1.3 (RED) Rust test: with existing max order 2 → new project gets order 3 (empty day → order 0)
- [x] 1.4 (RED) Rust test: title `!!!` (empty slug) → typed `InvalidSlug`, nothing written
- [x] 1.5 (RED) Rust test: existing slug → typed `AlreadyExists`, existing note not overwritten
- [x] 1.6 (GREEN) Add `StorageError::AlreadyExists`; implement `fs::store::create_project` (slugify + order + collision check + write); remove `slugify` dead-code allowance
- [x] 1.7 (GREEN) Expose `#[tauri::command] create_project` in `commands/notes.rs`; register in `lib.rs`
- [x] 1.8 (REFACTOR) Keep green

## 2. Frontend API (Requirement: Create a project)

- [x] 2.1 (RED) TS test: `createProject` invokes the backend for valid input and rejects an empty title
- [x] 2.2 (GREEN) Add `createProject(key, title, color)` wrapper + zod result schema in `notes-api.ts`
- [x] 2.3 (REFACTOR) Keep green

## 3. Board store actions (Requirements: Create / Customize color / Rename)

- [x] 3.1 (RED) Test: `createProject(title, color)` calls `create_project` then reloads the day
- [x] 3.2 (RED) Test: `setColor(slug, color)` calls `write_note` with the new color, same body/title/order
- [x] 3.3 (RED) Test: `rename(slug, title)` calls `write_note` with the new title, same slug/body/color/order
- [x] 3.4 (GREEN) Implement `createProject`, `setColor`, `rename` in `board-store.ts`
- [x] 3.5 (REFACTOR) Keep green

## 4. Create UI (Requirement: Create a project)

- [x] 4.1 (RED) Test: clicking `+` opens a form; submitting title + color calls the store `createProject`
- [x] 4.2 (RED) Test: an invalid title surfaces the error and does not create
- [x] 4.3 (GREEN) Implement `src/components/board/AddProjectButton.tsx` (inline form: text + `<input type="color">`); place it in the board header
- [x] 4.4 (REFACTOR) Keep green

## 5. Edit UI (Requirements: Customize color / Rename)

- [x] 5.1 (RED) Test: changing the column's color control calls `setColor`
- [x] 5.2 (RED) Test: editing the column title calls `rename` and keeps the slug
- [x] 5.3 (GREEN) Add inline color `<input type="color">` + editable title to the `ProjectColumn` header
- [x] 5.4 (REFACTOR) Keep green

## 6. Definition-of-Done gate

- [x] 6.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 6.2 Confirm every spec scenario maps to at least one passing test
- [x] 6.3 Open/update the PR for this change; merge only when the gate is green
