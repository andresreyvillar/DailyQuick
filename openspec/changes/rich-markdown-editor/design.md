## Context

The note body is edited in a `<textarea>` placeholder (from `daily-board`). DailyQuick needs a
Notion-like rich editor that still keeps **clean Markdown on disk**. BlockNote was the original pick,
but its Markdown conversion is officially lossy (it recommends JSON for durability and has gaps
parsing task-list checkboxes) — at odds with the app's core invariant. We switch to **Milkdown
(Crepe)**, whose document model *is* Markdown (remark/GFM), so the round-trip is faithful.

## Goals / Non-Goals

**Goals:**
- WYSIWYG editing whose output is standard GFM Markdown persisted via the existing `write_note`.
- Task-list checkboxes and fenced code blocks (CodeMirror) round-trip losslessly.
- Keep the disk contract unchanged (one `.md` per project; frontmatter preserved).

**Non-Goals:**
- Collaboration/multiplayer, images/attachments, custom non-Markdown blocks (callouts).
- Replacing the storage layer or changing the frontmatter schema.

## Decisions

- **Milkdown Crepe via `@milkdown/react`.** Crepe is the batteries-included editor (slash menu,
  toolbar, GFM, CodeMirror code blocks). Rationale: Notion-like UX out of the box on a Markdown model.
- **`MarkdownEditor` is a thin, effectively uncontrolled wrapper**: `props = { value: string (initial
  Markdown), onChange: (md: string) => void }`. It instantiates Crepe once with `defaultValue = value`
  and emits Markdown via the listener (`markdownUpdated`). It does NOT re-feed `value` on every change
  (that would fight the editor / jump the cursor). Switching project/day **remounts** it via a React
  `key` (`${dayKey}:${slug}`) so the new body loads cleanly.
- **Persistence reuses the existing path**: `onChange(md)` → `setBody(slug, md)` → `useDebouncedSave`
  → `write_note` (frontmatter preserved). No store/contract changes; that logic is already tested.
- **Code blocks**: use Crepe's built-in CodeMirror-backed code block (language + highlighting). No
  separate CodeMirror wiring.

## Testing strategy (and its limits)

Milkdown/Crepe is ProseMirror-based; **jsdom cannot faithfully drive its contenteditable**, so not
every scenario maps to a jsdom unit test:
- **Unit-tested** (the disk-contract-critical part): mock `MarkdownEditor` in `ProjectColumn` tests and
  assert `onChange(md)` → debounced `write_note` with the new body + unchanged frontmatter ("edits
  persist clean Markdown"). This is the same wiring pattern already used for the textarea.
- **Smoke-tested**: render the real `MarkdownEditor` under Vitest (with DOM-range mocks in
  `src/test/setup.ts`) and assert it mounts without throwing.
- **Manually verified by running the app** (`npm run tauri dev`): rich rendering, checkbox toggling,
  and code highlighting — the scenarios that need a real browser engine. These are called out in
  `tasks.md`; the DoD gate cannot assert them.

## Risks / Trade-offs

- **Can't fully unit-test the editor** → cover the persistence wiring + a mount smoke test; the rest is
  manual `tauri dev` verification (documented). [Risk] runtime editor bugs slip past the gate →
  Mitigation: explicit manual-verification checklist before merge.
- **Re-render/cursor loops if treated as controlled** → keep it uncountrolled + remount-by-key.
- **Crepe CSS/bundle size** → acceptable; it's the native macOS WebView, lazy-loaded with the editor.
- **GFM checkbox quirks** (upstream has had bugs) → assert the Markdown round-trip for `- [ ]`/`- [x]`
  during manual verification; if Crepe misbehaves, fall back to the Milkdown kit + `preset-gfm`.
