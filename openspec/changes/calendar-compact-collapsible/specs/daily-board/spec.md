## ADDED Requirements

### Requirement: Collapsible, compact day-context region
The board SHALL present the day-context region (calendar events + forecast) compactly, and SHALL let
the user collapse and expand it with a toggle. The collapsed state SHALL persist across reloads. When
collapsed, the calendar and forecast content is hidden and a slim control to expand it remains.

#### Scenario: Collapse hides the context region
- **GIVEN** the day-context region is expanded, showing the calendar and forecast bands
- **WHEN** the user activates the collapse toggle
- **THEN** the calendar and forecast content is hidden and an expand control remains

#### Scenario: Expand restores the context region
- **GIVEN** the day-context region is collapsed
- **WHEN** the user activates the expand toggle
- **THEN** the calendar and forecast bands are shown again

#### Scenario: Collapsed state persists across reloads
- **GIVEN** the user collapsed the day-context region
- **WHEN** the app reloads
- **THEN** the region is still collapsed
