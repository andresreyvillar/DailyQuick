# board-redesign Specification

## Purpose
TBD - created by archiving change board-redesign. Update Purpose after archive.
## Requirements
### Requirement: Event actions via a popover menu
Clicking a calendar event chip SHALL open a popover with the event's actions; only one event popover
is open at a time, and clicking outside closes it.

#### Scenario: Open the event menu
- **GIVEN** the day's events are shown as chips
- **WHEN** the user clicks an event chip
- **THEN** a popover opens showing "Nuevo proyecto" and "Añadir a…" actions for that event

#### Scenario: Clicking outside closes the menu
- **GIVEN** an event popover is open
- **WHEN** the user clicks outside it
- **THEN** the popover closes

### Requirement: Create a project from the event menu
The popover's "Nuevo proyecto" action SHALL create a project from the event and confirm with a toast.

#### Scenario: Create from the menu
- **GIVEN** an open event popover for "09:30 Daily standup"
- **WHEN** the user chooses "Nuevo proyecto"
- **THEN** a project is created from that event (via the existing create action)
- **AND** a confirmation toast is shown

### Requirement: Add the event to a project from the submenu
The popover's "Añadir a…" action SHALL open a submenu listing the day's projects; choosing one adds the
event to that project and confirms with a toast. A back control returns to the root menu.

#### Scenario: Add via the submenu
- **GIVEN** an open event popover and a project "Sprint 24" for the day
- **WHEN** the user chooses "Añadir a…" then selects "Sprint 24"
- **THEN** the event is added to "Sprint 24" (via the existing add action)
- **AND** a confirmation toast is shown

#### Scenario: Back returns to the root menu
- **GIVEN** the "Añadir a…" submenu is open
- **WHEN** the user activates the back control
- **THEN** the root menu ("Nuevo proyecto" / "Añadir a…") is shown again

### Requirement: Calendar events show as icon-tile chips
Each event in the calendar strip SHALL be presented as a chip with a rounded calendar-icon tile tinted
by a stable per-calendar color, and the event's time and title on two lines. The tile's color is
derived deterministically from the event's calendar id (same calendar → same color). Clicking the chip
still opens its actions popover; the chip presentation does not change the popover behavior.

#### Scenario: Chip shows the icon tile, time, and title
- **GIVEN** an event "09:30 Daily standup" on a calendar
- **WHEN** the calendar strip renders it
- **THEN** the chip shows a calendar-icon tile, the time `09:30`, and the title `Daily standup`

#### Scenario: Tile color is stable per calendar
- **GIVEN** two events on the same calendar and a third on a different calendar
- **WHEN** their chips render
- **THEN** the two same-calendar tiles use the same color and the color comes from the project accent palette

#### Scenario: Clicking the chip still opens the actions popover
- **GIVEN** an event chip
- **WHEN** the user clicks it
- **THEN** its actions popover opens (unchanged from before the restyle)

