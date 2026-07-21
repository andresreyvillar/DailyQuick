## Context

The diary is offline in the app: it reads a cache the external `/project-diary` producer writes (Slack via
MCP + Apple Mail via AppleScript + AI — none of which the app can do). The user wants an in-app button to
run that on demand. `DiaryPanel` reads the cache on `[dayKey, slug]`.

## Goals / Non-Goals

**Goals:** a permanent sync button that runs the producer and refreshes the panels.

**Non-Goals:** in-app Slack OAuth / AI; a native menu-bar entry + external-access config (follow-up).

## Decisions

**`sync_diary(day)` runs `claude` headless.** The command spawns `claude -p "<sync prompt>"
--permission-mode acceptEdits` in the user's home dir; it runs the `project-diary` skill (which does the
Slack/Mail/AI work and writes the cache) and returns stdout, or a typed error if `claude` is missing or
exits non-zero. This is the only way to keep the app offline while still offering a sync — the real
connectors live in Claude Code. It is inherently environment-dependent (MCP scope, Mail permission,
headless Slack auth), so it is best-effort and verified live, not unit-tested (like the EventKit bridge).

**Refresh via a store nonce.** After a successful sync the store bumps `diaryNonce`; `DiaryPanel` includes
it in its effect deps, so all panels re-read the cache without a day change.

**`SyncDiaryButton`** in the header shows progress (spinner), toasts the outcome, and is disabled while syncing.

## Risks / Trade-offs

- [Headless `claude` may not reach Slack (interactive OAuth) or Mail (TCC) → partial/failed sync] → surfaced
  as an error toast; the manual `/project-diary` path remains. Verified live with the user.
- [Spawning `claude` couples the app to a local Claude Code install] → accepted for this personal tool.
