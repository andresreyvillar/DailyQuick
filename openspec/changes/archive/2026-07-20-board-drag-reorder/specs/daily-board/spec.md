## ADDED Requirements

### Requirement: Reorder project frames by dragging
The board SHALL let the user reorder project frames by dragging one to a new position, and SHALL persist
the new order by updating each project's frontmatter `order`, so the order is restored on reload.

#### Scenario: Reordering persists the new order
- **GIVEN** the day has projects `[A, B, C]` in that order
- **WHEN** the user moves `C` to the front
- **THEN** the board shows `[C, A, B]`
- **AND** each project's note is rewritten so its frontmatter `order` matches the new position

#### Scenario: A no-op move changes nothing
- **GIVEN** the day has projects `[A, B, C]`
- **WHEN** a frame is dropped at its own position
- **THEN** the order is unchanged and no note is rewritten
