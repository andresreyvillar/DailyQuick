## MODIFIED Requirements

### Requirement: Choose a project color from the accent palette
The project color control SHALL present the six project accent colors as a palette to pick from, and
SHALL also offer a custom-color option for any other hex. The same palette control SHALL be used both
when creating a project and when editing an existing project's color. Picking a color applies it to
the project (at creation, as the project's initial color; when editing, persisted via the existing
recolor path).

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

#### Scenario: The create form uses the same palette control
- **GIVEN** the "new project" form is open
- **WHEN** the user opens the color control
- **THEN** the same six-accent palette (plus custom option) is offered as when editing a project
- **AND** the color the user picks is used as the new project's color on creation

## ADDED Requirements

### Requirement: Default a new project to an unused accent
When a project is created, the system SHALL pre-assign it the first palette accent that is not already
in use by the current day's projects, so distinct projects receive distinct accents without manual
recoloring. If all six accents are already in use, the system SHALL fall back to a deterministic accent
from the palette. This default is a starting point only — the user MAY override it before creating.

#### Scenario: New project defaults to the first unused accent
- **GIVEN** the board's projects use the accents `Azul` and `Teal`
- **WHEN** the user opens the "new project" form
- **THEN** the pre-selected color is `Verde` (the first palette accent not already in use)

#### Scenario: Empty board defaults to the first accent
- **GIVEN** the board has no projects
- **WHEN** the user opens the "new project" form
- **THEN** the pre-selected color is the first palette accent (`Azul`)

#### Scenario: All accents used falls back deterministically
- **GIVEN** the board's projects already use all six accents
- **WHEN** the user opens the "new project" form
- **THEN** the pre-selected color is a palette accent chosen deterministically (never empty)

#### Scenario: Project created from an event gets an unused accent
- **GIVEN** the board's projects use the accent `Azul`
- **WHEN** the user creates a project from a calendar event
- **THEN** the new project's color is the first palette accent not already in use (not a fixed color)

#### Scenario: Carry-over keeps the source color and only falls back to an unused accent
- **GIVEN** the previous day has a project `Oakmond` colored `Teal` and a project `Notes` with no color
- **WHEN** the user carries those projects over to a day whose projects use `Azul`
- **THEN** `Oakmond` keeps `Teal`
- **AND** `Notes` is assigned the first palette accent not already in use instead of a neutral gray
