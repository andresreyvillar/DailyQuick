## ADDED Requirements

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
