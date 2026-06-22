## 1. Accent wiring (Requirement: Editor content follows the theme and the project accent)

- [x] 1.1 (RED) Test: `ProjectColumn` passes the project's accent to `MarkdownEditor` (stub exposes the accent)
- [x] 1.2 (GREEN) Add an `accent` prop to `MarkdownEditor` that sets `--col-accent` on its wrapper; `ProjectColumn` passes `accent`
- [x] 1.3 (REFACTOR) Keep green

## 2. Crepe variable mapping (Requirement: Editor content follows the theme and the project accent)

- [x] 2.1 (GREEN) In `styles/index.css`, add `#root .milkdown { … }` mapping Crepe's `--crepe-color-*` / `--crepe-font-*` to our theme tokens + `--crepe-color-primary: var(--col-accent, var(--color-strong))`
- [x] 2.2 (GREEN) Add the heading-color rule and the checked-checkbox accent fill rule
- [x] 2.3 Verify `npm run build` bundles cleanly

## 3. Definition-of-Done gate

- [x] 3.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 3.2 The accent-wiring scenario maps to a passing test; the theme scenario is verified live
- [x] 3.3 Manual check via `npm run tauri dev`: editor content (bg, text, headings, code) matches each theme; headings use Caveat in Bullet Journal; checked checkboxes use the project accent
- [x] 3.4 Open the PR; merge when the gate is green AND the manual check passes
