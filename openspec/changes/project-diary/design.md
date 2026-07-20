## Context

The diary sources (Apple Mail, Slack) are permissioned/remote; the app is offline-only. The forecast
slice established the pattern: an external producer writes a disposable cache under `.dailyquick/`, and
the app reads it (`fs::forecast` + `read_forecast` + a strip). The diary reuses that pattern per project.
`ProjectColumn` renders the frame; `fs::path::validate_key` guards day-key path components.

## Goals / Non-Goals

**Goals:**
- Render a per-project daily diary (summary + events) read-only atop the frame.
- App stays offline; cache is disposable; separate from the editable note (the user's sensitive-data choice).

**Non-Goals:**
- In-app Mail/Slack access, OAuth, or AI calls (all in the producer).
- Editing the diary from the app.

## Decisions

**Cache — per-day file `~/DailyQuick/.dailyquick/diary/<day>.json`:**
```json
{ "projects": { "duin": { "summary": "…", "events": [ {"time":"10:12","source":"mail","who":"Abelardo","text":"pide X"} ] } } }
```
Per-day files keep each small; keyed by project slug. A separate directory (not the note `.md`) honors
the "sensitive data in a separate read-only cache" decision. Derived + disposable, like the SQLite index.

**Rust `fs::diary` (pure) + a thin command.** `read_diary(root, day, slug) -> Option<DiaryEntry>`:
validates the day key, resolves `.dailyquick/diary/<day>.json`, returns `None` if the file is absent,
parses via serde_json (`Parse` on malformed), and returns `projects.remove(slug)` (None if absent).
`DiaryEntry { summary, events: Vec<DiaryEvent> }`, `DiaryEvent { time, source, who, text }`. Command
`read_diary(key, slug)` in `commands/notes.rs`, registered in `lib.rs`.

**`DiaryPanel` in `ProjectColumn`.** Loads `readDiary(dayKey, slug)` on change; renders a read-only panel
(summary + event lines) at the top of the frame body, or nothing when there is no entry. Slug is passed;
day comes from the store — mirrors the forecast components.

**Producer is out-of-app** (`/project-diary` companion skill): reads Apple Mail via AppleScript
(local, Automation permission) + Slack via MCP, filters per project (a project→{mailQuery, slackChannel}
mapping), synthesizes with AI, and writes the cache. Not part of the app DoD (needs live permissions).

## Risks / Trade-offs

- [Sensitive content on disk] → confined to the disposable `.dailyquick/diary/` cache, separate from the
  editable notes and their agent-context use (the user's explicit choice).
- [Producer needs live Apple Mail permission + Slack auth] → the app side is built + tested against a
  fixture now; the producer is verified in a live run.
