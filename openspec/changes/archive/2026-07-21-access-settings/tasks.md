## 1. Rust: access commands + native menu

- [x] 1.1 (GREEN) Add `access_status` (`claude --version` + `claude mcp list` → Slack status) and
  `test_mail_access` (osascript) commands in `commands/notes.rs`; register them in `lib.rs`.
- [x] 1.2 (GREEN) Add a native menu in `lib.rs` (`DailyQuick → Ajustes…`) emitting an `open-settings` event.

## 2. TS: access API + store

- [x] 2.1 (GREEN) Add `accessStatusSchema` + `accessStatus()` / `testMailAccess()` in `notes-api.ts`;
  `settingsOpen` + `setSettingsOpen` in the board store.

## 3. Settings panel

- [x] 3.1 (RED) In `src/components/settings/SettingsPanel.test.tsx`, assert: it shows Mail/Claude/Slack with
  their status when open; "Probar acceso" runs the Mail test and shows the result; closed → renders nothing.
- [x] 3.2 (GREEN) Implement `SettingsPanel` (listens for `open-settings`, loads `accessStatus`, tests Mail);
  wire it into the board; stub it in `Board.test.tsx`.

## 4. Verify

- [x] 4.1 Run `npm run verify:change` (DoD gate); the native menu + Rust commands are live-verified.
