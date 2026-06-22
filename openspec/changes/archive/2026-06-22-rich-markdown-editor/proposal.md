## Why

The board currently edits notes in a plain `<textarea>` placeholder. DailyQuick promises a
Notion-like rich editor whose content is still **clean Markdown on disk**. This slice replaces the
textarea with a WYSIWYG editor whose document model *is* Markdown, so formatting, checklists, and
code blocks round-trip faithfully to the `.md` files.

## What Changes

- Replace the `<textarea>` in `ProjectColumn` with a **Milkdown (Crepe)** editor — Notion-style
  WYSIWYG built on a real Markdown AST (remark/GFM).
- Render and edit headings, bold/italic, bullet/ordered lists, **task-list checkboxes**, quotes, and
  **fenced code blocks with syntax highlighting** (Crepe uses CodeMirror for code blocks).
- Editor edits flow out as **GFM Markdown** and are persisted via the existing `write_note`
  (debounced), preserving frontmatter — the on-disk format stays standard, agent-readable Markdown.

## Capabilities

### New Capabilities
- `rich-editor`: a Markdown-native WYSIWYG editor for the note body — rich rendering, GFM task lists,
  fenced code blocks, and faithful round-trip to clean Markdown persisted via `write_note`.

### Modified Capabilities
<!-- daily-board's "Inline note editing persists" requirement is unchanged at the spec level
     (edits still persist via write_note, frontmatter preserved); only its realization changes from
     a textarea to the rich editor. -->

## Impact

- **New deps**: `@milkdown/crepe` + `@milkdown/react` (and their peer `@milkdown/kit`/prosemirror deps).
- **New TS/React**: `src/components/editor/MarkdownEditor.tsx` (thin `value`/`onChange` wrapper around
  Crepe); `ProjectColumn` swaps the `<textarea>` for it. Crepe theme CSS imported.
- **Test setup**: add jsdom DOM-range mocks (`getClientRects`/`getBoundingClientRect`/`Range`) so the
  editor can mount under Vitest.
- **Out of scope**: collaboration/multiplayer, images/attachments, custom non-Markdown blocks
  (callouts), and per-project editor config.

## Verification note

The editor is ProseMirror-based; jsdom cannot faithfully drive its contenteditable. The **markdown
wiring** (edit → persist clean Markdown, frontmatter preserved) is unit-tested with the editor
mocked, plus a mount smoke test. The **rich rendering / checkbox toggle / code highlighting** must be
verified by running the app (`npm run tauri dev`) — see design.
