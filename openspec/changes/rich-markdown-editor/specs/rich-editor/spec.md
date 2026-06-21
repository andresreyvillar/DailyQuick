## ADDED Requirements

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
