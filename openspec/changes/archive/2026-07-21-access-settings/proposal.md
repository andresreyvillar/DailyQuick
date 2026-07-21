## Why

The diary relies on external accesses (the `claude` CLI, the Slack MCP, Apple Mail) that live in Claude
Code / macOS, not the app. The user wants a place in the app — a native menu-bar entry — to see their
status and act where the app can.

## What Changes

- A native **"DailyQuick → Ajustes…"** menu-bar item opens an in-app **Ajustes · Accesos** panel.
- The panel shows the status of each access and offers the actions the app can actually perform:
  - **Apple Mail**: a "Probar acceso" button runs a test AppleScript that triggers the macOS Automation
    permission and reports granted/denied. (Actionable.)
  - **Claude Code (CLI)**: shows the detected version, or "No encontrado". (Status.)
  - **Slack (MCP)**: shows connected / needs-auth / not-configured, with a note to run `/mcp` in Claude
    Code — the app cannot complete Slack OAuth itself. (Status.)

## Capabilities

### New Capabilities
- `access-settings`: a menu-opened panel showing/acting on the diary's external accesses.

## Impact

- Rust: `access_status` / `test_mail_access` commands; a native menu (Tauri) in `lib.rs` emitting an
  `open-settings` event.
- TS: `accessStatus`/`testMailAccess` in `notes-api.ts`; `SettingsPanel` (listens for the menu event) +
  `settingsOpen` in the board store; wired into the board.
- No on-disk contract or credentials in the app.
