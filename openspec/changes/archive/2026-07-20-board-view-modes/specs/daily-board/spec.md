## MODIFIED Requirements

### Requirement: Toggle split orientation
The board SHALL let the user choose the layout among **columns** (vertical split), **rows** (horizontal
split), and **grid** (cards wrapped in a responsive grid), and SHALL persist the choice across reloads.

#### Scenario: Select a layout
- **GIVEN** the board is in the columns layout
- **WHEN** the user selects the grid layout from the control
- **THEN** the board switches to the grid layout

#### Scenario: Grid layout wraps the project cards
- **GIVEN** the board has several projects and the grid layout is selected
- **WHEN** the board renders
- **THEN** the project cards are laid out in a wrapping grid

#### Scenario: Layout persists across reloads
- **GIVEN** the user selected the grid layout
- **WHEN** the app reloads
- **THEN** the board restores the grid layout
