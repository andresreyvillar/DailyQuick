# rich-editor Specification

## Purpose
TBD - created by archiving change rich-markdown-editor. Update Purpose after archive.
## Requirements
### Requirement: Render and edit the note body as rich Markdown
The editor SHALL render the note body as formatted WYSIWYG content (headings, bold/italic,
bullet/ordered lists, quotes) and let the user edit it, with the document model being Markdown.

#### Scenario: Existing Markdown renders as formatted content
- **GIVEN** a note body with a `## heading`, a bullet list, and **bold** text
- **WHEN** the editor loads that body
- **THEN** it shows a styled heading, a rendered list, and bold text (not raw Markdown syntax)

### Requirement: Task-list checkboxes round-trip to GFM
The editor SHALL render GFM task-list items as interactive checkboxes and persist their state back as
`- [ ]` / `- [x]` Markdown.

#### Scenario: Toggling a checkbox updates the Markdown
- **GIVEN** the body contains `- [ ] tarea`
- **WHEN** the user checks that item
- **THEN** the Markdown produced by the editor contains `- [x] tarea`

### Requirement: Fenced code blocks with syntax highlighting
The editor SHALL render fenced code blocks with a selectable language and syntax highlighting, and
round-trip them to fenced Markdown.

#### Scenario: Code block preserves language and content
- **GIVEN** a fenced code block ` ```ts ` with `const x = 1;`
- **WHEN** it is loaded and then re-serialized
- **THEN** the output is a fenced block tagged `ts` containing `const x = 1;`

### Requirement: Edits persist as clean Markdown
The editor's output SHALL be standard GFM Markdown (no editor-proprietary syntax) and SHALL be
persisted via `write_note` (debounced), preserving the note's frontmatter.

#### Scenario: An edit persists clean Markdown with frontmatter intact
- **GIVEN** a loaded note with frontmatter `title`/`color`/`order`
- **WHEN** the user edits the content and the debounce elapses
- **THEN** `write_note` is called with the new GFM-Markdown body and the unchanged frontmatter

#### Scenario: No proprietary syntax leaks to disk
- **GIVEN** typical formatting (heading, bold, list, task list, fenced code)
- **WHEN** the body is serialized for saving
- **THEN** the output is standard GFM Markdown readable by any Markdown tool

### Requirement: Focus-revealed formatting toolbar
The Markdown editor SHALL show a formatting toolbar at its top while it has focus, and hide it when it
does not. The toolbar SHALL offer bold, italic, strikethrough, headings (H1–H3), bullet list, ordered
list, task list, blockquote, inline code, code block, and link. Activating a control dispatches the
corresponding command to the editor without losing the editor's selection; the link control takes a
URL from an inline field.

#### Scenario: Toolbar is shown only while the editor is focused
- **GIVEN** a project editor that does not have focus
- **WHEN** the board renders it
- **THEN** the formatting toolbar is not shown
- **AND** when the editor gains focus the toolbar appears with the formatting controls

#### Scenario: A formatting control dispatches its command
- **GIVEN** the focused editor's toolbar
- **WHEN** the user activates a control (e.g. Negrita, a heading, a list, or code block)
- **THEN** the corresponding command is dispatched to the editor instance
- **AND** the editor keeps its selection (the control does not steal focus)

#### Scenario: Inserting a link via the URL field
- **GIVEN** the toolbar's link control
- **WHEN** the user activates it, enters a URL, and confirms
- **THEN** the link command is dispatched to the editor with that URL

### Requirement: Editor content follows the theme and the project accent
The editor's content SHALL adopt the active theme's palette and fonts (background, body text, headings,
code, inline code, and borders), with body text in the sans font, headings in the theme's display font,
and code in the monospace font. Each project's editor SHALL use that project's accent color for its
checked task checkboxes, links, selection, and focus outline.

#### Scenario: The editor is given the project's accent
- **GIVEN** a project whose color is `#E54D2E`
- **WHEN** its column renders the editor
- **THEN** the editor is given `#E54D2E` as its accent (used for checked checkboxes, links, and selection)

#### Scenario: Editor content adopts the active theme
- **GIVEN** the board is in a given theme
- **WHEN** an editor renders its content
- **THEN** its background, text, headings, and code colors/fonts come from that theme's tokens
- _(CSS over Milkdown; verified live — Milkdown does not run under jsdom)_

