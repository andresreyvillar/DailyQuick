# access-settings Specification

## Purpose
TBD - created by archiving change access-settings. Update Purpose after archive.
## Requirements
### Requirement: Access-settings panel
The app SHALL provide a settings panel, opened from a native menu-bar item, that shows the status of the
diary's external accesses (the Claude CLI and the Slack MCP) and lets the user test/grant Apple Mail
access. The app SHALL hold no credentials and SHALL NOT perform Slack OAuth itself. When closed, the
panel SHALL render nothing.

#### Scenario: The panel shows each access and its status
- **GIVEN** the settings panel is open
- **WHEN** the access status has loaded
- **THEN** it shows Apple Mail, Claude Code (with its version or "No encontrado"), and Slack (with its status)

#### Scenario: Testing Apple Mail reports the result
- **GIVEN** the settings panel is open
- **WHEN** the user activates "Probar acceso"
- **THEN** the app runs the Apple Mail access test and shows whether it was granted or denied

#### Scenario: Closed panel renders nothing
- **GIVEN** the settings panel is not open
- **WHEN** it renders
- **THEN** nothing is shown

