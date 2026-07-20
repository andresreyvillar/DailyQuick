## Why

Each project frame should read like a diary of what happened that day — the emails and Slack messages
about that project, synthesized so the day's context is visible at the top of the frame. The sources
(Apple Mail, Slack) are remote/permissioned, so the app must stay offline: a Claude Code producer
gathers + synthesizes, and the app renders a local, disposable cache (the forecast pattern).

## What Changes

- The app reads a **local, disposable** diary cache `~/DailyQuick/.dailyquick/diary/<day>.json` and, for
  each project frame, shows a read-only **"Diario"** panel at the top: an AI summary of the day plus the
  underlying events (time · source · who · text). No diary → no panel. **No network/credentials in the app.**
- A companion Claude Code step `/project-diary` produces the cache from **Apple Mail** (AppleScript, local)
  and **Slack** (MCP), filtered per project and synthesized with AI. (Built separately; needs a live run.)

## Capabilities

### New Capabilities
- `project-diary`: read a per-project daily diary from the local cache and render it read-only atop the frame.

## Impact

- Rust: `src-tauri/src/fs/diary.rs` (parse + per-project lookup), a `read_diary` command, `lib.rs` registration.
- TS: `readDiary` + zod types in `src/lib/notes-api.ts`; `src/components/diary/DiaryPanel.tsx` wired into `ProjectColumn`.
- Companion (outside the app repo): the `/project-diary` producer + a project→sources mapping.
- No on-disk note-contract change; `diary/<day>.json` is a derived, disposable cache under `.dailyquick/`.
