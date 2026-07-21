## Context

The diary's connectors live in Claude Code (Slack MCP OAuth, AI) and macOS (Apple Mail via AppleScript).
The app is offline and holds no credentials. The user wants a native menu-bar "Ajustes…" that opens a
status/action panel. Tauri v2 exposes a native menu API; the EventKit bridge sets precedent for native
commands that are live-verified rather than unit-tested.

## Goals / Non-Goals

**Goals:** a menu-opened panel showing each access's status + the actions the app can do (test Mail).

**Non-Goals:** in-app Slack OAuth or AI; storing any credentials.

## Decisions

**Native menu (Tauri v2).** In `lib.rs` `.setup()`, append a "DailyQuick" submenu with an "Ajustes…" item
to `Menu::default`, and in `on_menu_event` emit an `open-settings` event. `SettingsPanel` listens for it
(`@tauri-apps/api/event`) and opens.

**Honest, asymmetric actions.** `access_status` runs `claude --version` (CLI status) and `claude mcp list`
(parsed for the Slack line → connected / needs-auth / not-configured). `test_mail_access` runs a benign
`osascript` (`count of accounts`) that triggers the macOS Automation permission and returns granted/denied.
Slack is status-only + a note to run `/mcp` — the app cannot complete its OAuth.

**State via the board store.** `settingsOpen` + `setSettingsOpen`; the panel is always mounted (for the
menu listener) and returns null when closed.

## Risks / Trade-offs

- [`claude mcp list` output format could change] → parsing is defensive (falls back to "unknown"); status
  is informational only.
- [Native menu + subprocess commands aren't unit-testable] → the panel + its actions are unit-tested via
  mocked commands; the menu and Rust commands are verified live (like the EventKit bridge).
