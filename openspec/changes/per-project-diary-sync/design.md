## Context

The diary-sync slice added a single global `sync_diary(day)` command (blocking `claude` run, whole day,
no progress) + a header `SyncDiaryButton`. The user wants per-project, non-blocking sync with live
visibility of what's found, today only.

## Goals / Non-Goals

**Goals:** per-project sync; async/non-blocking; live streamed progress; today only.

**Non-Goals:** interactive curation of ambiguous matches (later phase); syncing arbitrary days.

## Decisions

**`sync_project_diary(app, key, slug)`** replaces `sync_diary`. It spawns `claude -p "<per-project, today
prompt>" --output-format stream-json --verbose --permission-mode acceptEdits`, takes stdout, and returns
immediately. A background thread reads stdout line-by-line, turns each stream-json event into a short
message (`summarize_stream_line`: assistant text + tool names + final result), and emits
`diary-sync-progress { slug, message }`; on exit it emits `diary-sync-done { slug, ok }`. Multiple
projects → multiple independent subprocesses/threads; the command never blocks the UI thread.

**`ProjectSyncButton`** (per card, in `ProjectColumn`) listens for the two events filtered by its slug,
shows a spinner + a live log while running, and calls `refreshDiary()` on a successful done. It targets
`todayKey()` regardless of the viewed day.

**Removals:** the global header `SyncDiaryButton` and the `sync_diary` command/`syncDiary` wrapper.

_Testing_: the button + event handling are unit-tested (mocked `listen`/`invoke`); the streaming Rust
command is verified live (not unit-tested, like the EventKit bridge).

## Risks / Trade-offs

- [stream-json format drift] → `summarize_stream_line` is defensive (unparseable/unknown lines are skipped).
- [Headless `claude` may not reach Slack/Mail] → surfaced as progress/`done{ok:false}`; the user refines
  terms (Vincular fuentes) and re-syncs.
