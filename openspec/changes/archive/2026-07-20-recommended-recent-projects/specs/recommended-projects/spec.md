## ADDED Requirements

### Requirement: Recommend recent projects not already present
The system SHALL compute, from the projects seen across the previous 5 days, a recommendation list that
EXCLUDES any project already in today's forecast and any project already on the board. The list SHALL be
de-duplicated (a project appearing on several recent days is recommended once), preserving most-recent-first order.

#### Scenario: A recent project not in forecast or board is recommended
- **GIVEN** `Duin` appears in the last 5 days, is not in today's forecast, and is not on the board
- **WHEN** the recommendations are computed
- **THEN** `Duin` is recommended

#### Scenario: Projects already in the forecast are excluded
- **GIVEN** `Celonis` appears in the last 5 days and is also in today's forecast
- **WHEN** the recommendations are computed
- **THEN** `Celonis` is not recommended

#### Scenario: Projects already on the board are excluded
- **GIVEN** `Oakmond` appears in the last 5 days and already has a column on the board
- **WHEN** the recommendations are computed
- **THEN** `Oakmond` is not recommended

#### Scenario: A project on several recent days is recommended once
- **GIVEN** `Duin` appears on three of the last 5 days
- **WHEN** the recommendations are computed
- **THEN** `Duin` appears once in the recommendations

### Requirement: Show recommendations beside the forecast and add on click
The board SHALL display the recommendation chips beside the forecast chips, each labeled with the
project name. Clicking a recommendation SHALL create that project column, reusing its previous color
(or an unused accent if it had none). When there are no recommendations, no recommendation chips are shown.

#### Scenario: Recommendation chips render beside the forecast
- **GIVEN** there is at least one recommended project
- **WHEN** the board renders
- **THEN** a chip is shown for each recommendation, labeled with the project name

#### Scenario: Click creates the project column
- **GIVEN** a recommendation chip for `Duin`
- **WHEN** the user clicks it
- **THEN** a `Duin` project column is created on the current day

#### Scenario: No recommendations shows nothing
- **GIVEN** there are no recent projects to recommend
- **WHEN** the board renders
- **THEN** no recommendation chips are shown
