## ADDED Requirements

### Requirement: Choose a project color from the accent palette
The project color control SHALL present the six project accent colors as a palette to pick from, and
SHALL also offer a custom-color option for any other hex. Picking a color applies it to the project
(persisted via the existing recolor path).

#### Scenario: Palette offers the six accents
- **GIVEN** a project's color control
- **WHEN** the user opens it
- **THEN** the six accents (Azul, Teal, Verde, Ámbar, Rosa, Violeta) are offered as swatches
- **AND** clicking outside closes it without changing the color

#### Scenario: Picking an accent recolors the project
- **GIVEN** the color control is open for project `oakmond`
- **WHEN** the user picks the `Teal` accent
- **THEN** the project's color is set to that accent's hex and persisted

#### Scenario: A custom color is still possible
- **GIVEN** the color control is open
- **WHEN** the user chooses the custom option and sets a hex not in the palette
- **THEN** the project's color is set to that hex and persisted
