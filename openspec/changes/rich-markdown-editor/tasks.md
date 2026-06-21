## 1. Setup

- [x] 1.1 Install `@milkdown/crepe` and `@milkdown/react` (7.21.2); typecheck passes
- [x] 1.2 Import Crepe theme CSS (`theme/common/style.css` + `theme/frame.css`) in the editor module
- [x] 1.3 Component tests mock `MarkdownEditor` (ProseMirror can't run in jsdom); the wrapper itself is validated by `tsc` + manual run (§4)

## 2. MarkdownEditor wrapper (Requirement: Render and edit the note body as rich Markdown)

- [x] 2.1 Implement `src/components/editor/MarkdownEditor.tsx`: Crepe via `@milkdown/react`, props `{ value, onChange }`, `markdownUpdated` listener, uncontrolled (init once with `value`)
- [x] 2.2 Validate the Crepe/Milkdown API via `tsc` (typed usage of `new Crepe`, `editor.config`, `listenerCtx.markdownUpdated`, `useEditor`); runtime behavior covered by §4
- [x] 2.3 (REFACTOR) Keep green

## 3. Integrate into ProjectColumn (Requirement: Edits persist as clean Markdown)

- [x] 3.1 Replace the `<textarea>` with `<MarkdownEditor>`; remount per note via `key={`${dayKey}:${slug}`}`; `onChange(md)` → `setBody` + debounced `persistBody`; flush on unmount (via the hook)
- [x] 3.2 (RED) Update `ProjectColumn.test` to mock `MarkdownEditor` (stub exposing `onChange`); assert an edit triggers debounced `write_note` with the new body + unchanged frontmatter
- [x] 3.3 (GREEN) Wiring test passes
- [x] 3.4 (REFACTOR) Other board tests pass (`Board.test` mocks the editor; no more textarea)

## 4. Manual verification — `npm run tauri dev` (jsdom cannot cover these; REQUIRED before merge)

- [ ] 4.1 Existing Markdown (heading, list, bold) renders as formatted content, not raw syntax
- [ ] 4.2 Toggling a task-list checkbox writes `- [x]` to the `.md` on disk (and back)
- [ ] 4.3 A fenced code block keeps its language + highlighting and round-trips to fenced Markdown
- [ ] 4.4 Inspect a saved `.md`: body is standard GFM Markdown (no proprietary syntax), frontmatter intact
- [ ] 4.5 No typing lag / cursor jumps (confirms the uncontrolled + remount-by-key approach holds)

## 5. Definition-of-Done gate

- [x] 5.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 5.2 Unit-testable scenarios pass (persist clean Markdown, frontmatter preserved); rendering scenarios deferred to §4
- [ ] 5.3 PR opened; **merge only after the gate is green AND the §4 manual checks pass**
