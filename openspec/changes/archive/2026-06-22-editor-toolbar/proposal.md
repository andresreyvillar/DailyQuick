## Why

Formatting in the Milkdown editor currently needs the slash menu or Markdown syntax. The user wants a
**formatting toolbar at the top of a project that appears when that project's editor has focus** — a
quick, always-in-reach set of formatting actions, hidden when the editor isn't focused to keep the
board calm.

## What Changes

- **Focus-revealed toolbar**: each project's editor gains a toolbar row at the top, shown only while
  that editor has focus. Clicking a control formats the current selection without losing focus
  (mousedown is prevented so the selection survives).
- **Full action set**: bold, italic, strikethrough; H1 / H2 / H3; bullet list, ordered list, task
  list; blockquote; inline code, code block; and link (via an inline URL field).
- The task-list and link controls use bespoke handling (Milkdown has no direct command for them): task
  list wraps the selection in a list and marks its items as checkboxes; link applies the link mark with
  the URL entered in the field.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `rich-editor`: adds a "focus-revealed formatting toolbar" requirement over the Milkdown editor.

## Impact

- **Frontend only**: `MarkdownEditor` is restructured to track editor focus (focus-within wrapper) and
  render the toolbar; a new `EditorToolbar` dispatches Milkdown commands via `callCommand`
  (`@milkdown/kit/preset/commonmark` + `gfm`) through the React `useInstance` editor handle, plus a
  custom task-list command and an inline link field.
- **Testing note**: Milkdown/ProseMirror does not run under jsdom, so command *correctness* is verified
  live (`npm run tauri dev`); unit tests cover toolbar visibility and that each control **dispatches**
  a command to the editor instance.
- **Out of scope**: a selection bubble toolbar, tables, images, and per-theme styling of the editor's
  internal content (the separate editor-content follow-up).
