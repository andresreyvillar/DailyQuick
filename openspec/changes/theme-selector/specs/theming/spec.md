## ADDED Requirements

### Requirement: Select a visual theme
The system SHALL let the user choose among the predefined themes `Nítido`, `Bullet Journal`, and `Cítrico`
from a selector in the header. Selecting a theme applies it to the whole board immediately.

#### Scenario: Switch the theme
- **GIVEN** the board is showing the default `Nítido` theme
- **WHEN** the user opens the theme selector and chooses `Bullet Journal`
- **THEN** the document root's `data-theme` becomes `bujo` and the board re-renders with that theme's tokens
- **AND** the selector reflects `Bullet Journal` as active

#### Scenario: Selector lists the three themes
- **GIVEN** the theme selector is opened
- **WHEN** its options are shown
- **THEN** exactly `Nítido`, `Bullet Journal`, and `Cítrico` are offered, each with its swatch
- **AND** clicking outside the selector closes it without changing the theme

### Requirement: Theme persists across launches
The system SHALL remember the selected theme and re-apply it when the app starts, defaulting to `Nítido`
when nothing is stored.

#### Scenario: Choice is remembered
- **GIVEN** the user selected `Cítrico`
- **WHEN** the theme is persisted
- **THEN** the stored theme is `citrus` and a fresh load applies `data-theme="citrus"` to the document root

#### Scenario: Default when nothing stored
- **GIVEN** no theme has been stored
- **WHEN** the app initializes the theme
- **THEN** the active theme is `Nítido` (`data-theme="nitido"`)

### Requirement: Themes are token-driven, not per-component overrides
Each theme SHALL be expressed as a coordinated set of CSS variables (neutral palette, display font and
heading sizes, radii, and column-band border) applied via the `data-theme` root attribute, so the board
chrome restyles from one source without bespoke per-component theme branches.

#### Scenario: One source of truth
- **GIVEN** a theme defines its tokens under its `data-theme` selector
- **WHEN** that theme is active
- **THEN** the header date, the column headers, and the board canvas all read those tokens (font, sizes,
  radii, band border, background) without component-level theme conditionals for color/typography
