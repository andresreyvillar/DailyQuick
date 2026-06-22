## Context

`MarkdownEditor` wraps Milkdown Crepe (uncontrolled, `markdownUpdated` → `onChange`). Milkdown exposes
commands (`@milkdown/kit/preset/commonmark` + `gfm`) dispatched via `callCommand` through the React
`useInstance` handle. There is no command for task lists or links-without-a-URL, so those need bespoke
handling. Milkdown/ProseMirror cannot run under jsdom, so command effects are verified live.

## Goals / Non-Goals

**Goals:** a toolbar shown only when the editor is focused; full formatting set; activating a control
dispatches its command without stealing the editor's selection; link via an inline URL field.

**Non-Goals:** selection bubble toolbar, tables/images, editor-content theming.

## Decisions

- **Focus-within wrapper** (`MarkdownEditor`): a container wraps the `EditorToolbar` + `<Milkdown/>`
  and tracks focus with `onFocus`/`onBlur`, using `relatedTarget` containment so focus moving *within*
  the editor area (e.g. into the link field) keeps it "focused". The toolbar renders only when focused.
- **No-steal-focus controls**: every format button calls `onMouseDown={e => e.preventDefault()}` so the
  ProseMirror selection is preserved; the click still dispatches. The link field is a real `<input>`
  (it must take focus) but lives inside the focus-within container, so the toolbar stays visible while
  typing the URL.
- **`EditorToolbar`** (inside `MilkdownProvider`): `const [, getEditor] = useInstance()`; a `run(cmd, payload)`
  helper does `getEditor()?.action(callCommand(cmd.key, payload))`. Buttons: Negrita
  (`toggleStrongCommand`), Cursiva (`toggleEmphasisCommand`), Tachado (`toggleStrikethroughCommand`),
  H1–H3 (`wrapInHeadingCommand` 1/2/3), Viñetas (`wrapInBulletListCommand`), Numerada
  (`wrapInOrderedListCommand`), Cita (`wrapInBlockquoteCommand`), Código en línea
  (`toggleInlineCodeCommand`), Bloque de código (`createCodeBlockCommand`).
- **Task list (bespoke)**: `getEditor()?.action(ctx => …)` — run `wrapInBulletListCommand`, then set the
  `checked` attr (to `false`) on the `listItemSchema` nodes in the selection so they serialize as
  GFM `- [ ]` task items.
- **Link (inline field)**: the Enlace control toggles a small `<input aria-label="URL del enlace">`;
  confirming runs `callCommand(toggleLinkCommand.key, { href })` and refocuses the editor.
- **Styling**: toolbar uses theme tokens (`border-line-soft`, `bg-surface`, `text-muted`,
  `hover:bg-hover`), a thin row at the top of the editor body; each control has a Spanish `aria-label`.

## Risks / Trade-offs

- **jsdom can't run Milkdown** → unit tests cover toolbar visibility (the `visible` prop) and that each
  control dispatches an `action` on a mocked editor handle; command correctness (incl. the bespoke task
  list and link) is verified live. Flagged in the proposal.
- **Custom task-list command fragility** → relies on the GFM `listItemSchema` `checked` attr; if a
  Milkdown update changes it, only the task-list button is affected. Isolated.
- **Focus juggling** → the `relatedTarget` containment check keeps the toolbar from flickering when
  focus moves between the editor and the link field; format buttons never take focus.
