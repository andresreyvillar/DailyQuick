## ADDED Requirements

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
