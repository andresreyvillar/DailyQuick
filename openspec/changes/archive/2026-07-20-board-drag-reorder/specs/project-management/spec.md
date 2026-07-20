## ADDED Requirements

### Requirement: Delete a project by dragging it off the board
The system SHALL let the user delete a project by dragging its frame, holding for about one second, and
releasing it outside the board area. The deletion SHALL be confirmed before it happens and SHALL reuse
the existing single-note delete. A release inside the board, or before the hold elapses, SHALL NOT delete.

#### Scenario: Drag off the board and hold triggers a confirmed delete
- **GIVEN** a project frame is dragged outside the board and held for at least one second
- **WHEN** it is released
- **THEN** a confirmation is shown
- **AND** confirming deletes that project's note and column

#### Scenario: Releasing inside the board does not delete
- **GIVEN** a project frame is dragged and released inside the board area
- **WHEN** the drop is resolved
- **THEN** the project is not deleted

#### Scenario: Releasing before the hold does not delete
- **GIVEN** a project frame is dragged outside the board but released before the hold elapses
- **WHEN** the drop is resolved
- **THEN** the project is not deleted

#### Scenario: Cancelling the confirmation keeps the project
- **GIVEN** the delete confirmation from the drag gesture is shown
- **WHEN** the user cancels
- **THEN** the project is not deleted and stays on the board
