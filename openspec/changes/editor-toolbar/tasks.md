## 1. EditorToolbar — visibility + command dispatch (Requirement: Focus-revealed formatting toolbar)

- [x] 1.1 (RED) Test: `EditorToolbar` renders nothing when `visible={false}` and the formatting controls when `visible={true}`
- [x] 1.2 (RED) Test: activating a control (Negrita, a heading, a list, code block) calls `getEditor().action` on the mocked editor handle (mock `@milkdown/react` `useInstance`)
- [x] 1.3 (RED) Test: format buttons set `onMouseDown` preventDefault (do not steal focus)
- [x] 1.4 (RED) Test: the link control reveals a URL field; confirming a URL calls `getEditor().action`
- [x] 1.5 (GREEN) Implement `src/components/editor/EditorToolbar.tsx` (buttons via `callCommand`, bespoke task-list action, inline link field)
- [x] 1.6 (REFACTOR) Keep green

## 2. Focus wiring in MarkdownEditor (Requirement: Focus-revealed formatting toolbar)

- [x] 2.1 (GREEN) Restructure `MarkdownEditor`: focus-within wrapper (`onFocus`/`onBlur` with `relatedTarget` containment) that renders `EditorToolbar` with `visible` = focused, above `<Milkdown/>`
- [x] 2.2 (REFACTOR) Existing ProjectColumn tests (which stub `MarkdownEditor`) still pass

## 3. Definition-of-Done gate

- [x] 3.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 3.2 Every spec scenario maps to a passing test (visibility + dispatch; command correctness verified live)
- [x] 3.3 Manual check via `npm run tauri dev`: focus an editor → toolbar appears; bold/italic/strike, H1–H3, lists, task list, quote, inline/code block, and link all work on the selection; blur hides the toolbar
- [x] 3.4 Open the PR; merge when the gate is green AND the manual check passes
