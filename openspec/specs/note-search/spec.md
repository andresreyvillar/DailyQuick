# note-search Specification

## Purpose
TBD - created by archiving change note-search. Update Purpose after archive.
## Requirements
### Requirement: Search notes by content and title
The system SHALL search the title and body of every note across all days for a query
(case-insensitive) and return matching hits with the day key, project slug, project title, and a
snippet.

#### Scenario: Find a note by body text
- **GIVEN** a note on `2026-06-20` whose body contains `reunión con Oakmond`
- **WHEN** the user searches for `oakmond`
- **THEN** the results include that day/project with a snippet of the matching line

#### Scenario: Search is case-insensitive
- **GIVEN** a note whose title is `Personal`
- **WHEN** the user searches for `personal`
- **THEN** that note is in the results

#### Scenario: Match in the title
- **GIVEN** a note titled `Oakmond` with an empty body
- **WHEN** the user searches for `oak`
- **THEN** that note is in the results

#### Scenario: No matches
- **GIVEN** no note contains `zzz`
- **WHEN** the user searches for `zzz`
- **THEN** the results are empty

#### Scenario: Empty query
- **GIVEN** any notes exist
- **WHEN** the user searches for an empty or whitespace-only query
- **THEN** the results are empty (no search is run)

### Requirement: Results ordered by recency
Search results SHALL be ordered by day key descending (most recent first), then by project title.

#### Scenario: Recent days first
- **GIVEN** matching notes on `2026-06-18` and `2026-06-20`
- **WHEN** the user searches
- **THEN** the `2026-06-20` hit appears before the `2026-06-18` hit

### Requirement: Open a result
The system SHALL let the user open a search result, navigating the board to that result's day.

#### Scenario: Click a result navigates to its day
- **GIVEN** a search result for `2026-06-18`
- **WHEN** the user opens it
- **THEN** the board navigates to `2026-06-18`

