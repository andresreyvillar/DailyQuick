## ADDED Requirements

### Requirement: Keep the date and navigation controls in a stable position
The header SHALL render the selected day's date within a fixed-width slot so that the previous/today/
next controls do not change position when the day label changes length between days.

#### Scenario: The date occupies a fixed-width slot
- **GIVEN** the header for any selected day
- **WHEN** the board renders
- **THEN** the date is contained in a fixed-width slot, so the navigation controls that follow it keep
  the same position regardless of the day label's length

#### Scenario: Controls do not shift when navigating
- **GIVEN** the header shows a day with a short label
- **WHEN** the user navigates to a day with a longer label
- **THEN** the previous/today/next controls remain in the same horizontal position

### Requirement: Indicate whether the selected day is today, past, or future
The header SHALL make clear whether the selected day is today, a past day, or a future day. Today
SHALL be highlighted with a color accent and marked as today; a past or future day SHALL be visually
de-emphasized and SHALL show how far it is from today ("Ayer"/"Mañana" for one day, otherwise
"hace N días" / "en N días").

#### Scenario: Today is highlighted
- **GIVEN** the selected day is today
- **WHEN** the header renders
- **THEN** the date is shown with a color accent and a "Hoy" marker

#### Scenario: A past day shows how long ago it is
- **GIVEN** the selected day is three days before today
- **WHEN** the header renders
- **THEN** the date is de-emphasized and a "hace 3 días" indicator is shown

#### Scenario: A future day shows how far ahead it is
- **GIVEN** the selected day is two days after today
- **WHEN** the header renders
- **THEN** the date is de-emphasized and an "en 2 días" indicator is shown

#### Scenario: Adjacent days read naturally
- **GIVEN** the selected day is exactly one day before today
- **WHEN** the header renders
- **THEN** the indicator reads "Ayer"
- **AND** a day exactly one day after today reads "Mañana"

### Requirement: Compute a day's relation to today
The system SHALL compute, from two day keys, the whole-day offset between them and whether a day key
is today, in the past, or in the future, correct across month and year boundaries.

#### Scenario: Offset and relation for a past day
- **GIVEN** today is `2026-07-20` and the selected key is `2026-07-17`
- **WHEN** the relation is computed
- **THEN** the offset is `-3` and the relation is `past`

#### Scenario: Offset and relation for today
- **GIVEN** today is `2026-07-20` and the selected key is `2026-07-20`
- **WHEN** the relation is computed
- **THEN** the offset is `0` and the relation is `today`

#### Scenario: Offset across a month boundary
- **GIVEN** today is `2026-07-01` and the selected key is `2026-06-29`
- **WHEN** the offset is computed
- **THEN** the offset is `-2`
