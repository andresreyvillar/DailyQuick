## ADDED Requirements

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
