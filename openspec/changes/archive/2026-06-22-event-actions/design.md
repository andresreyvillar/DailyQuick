## Context

`calendar-readonly` shows the day's events; `project-management` creates projects; the Milkdown editor
renders a project's Markdown body. This slice connects them: act on an event to spin up a project or
drop the event into an existing project — reusing the existing commands, no new backend.

## Goals / Non-Goals

**Goals:** from an event, (1) create a day project seeded with the event details + Notas/Transcripción;
(2) append the event to an existing project's note as a clean Markdown block; the open editor reflects it.

**Non-Goals:** attendee/transcription capture, recurring events, drag-and-drop, editing events.

## Decisions

- **Pure Markdown helpers** (`src/lib/event-markdown.ts`): `eventProjectBody(event)` (seeded body) and
  `eventBlock(event)` (the post-it block). Both emit standard GFM (a heading + a detail line + a
  blockquote/sections) — unit-tested, no editor-specific syntax.
- **Reuse existing commands, no new backend**:
  - `createProjectFromEvent(event)` (board-store): `create_project(dayKey, event.title, defaultColor)`
    → then `write_note` with `eventProjectBody(event)` → reload day. `AlreadyExists` surfaces to the UI.
  - `addEventToProject(slug, event)` (board-store): take the project's current body from the store,
    append `eventBlock(event)`, `write_note`, update the store.
- **Open-editor refresh**: the Milkdown editor is uncontrolled (loads body once, keyed by
  `${dayKey}:${slug}`). To reflect an externally-inserted block, the store keeps a per-project
  **revision counter** bumped on external writes; `ProjectColumn` keys the editor by
  `${dayKey}:${slug}:${rev}` so it remounts and reloads the new body. (Acceptable: external insert
  resets the editor; normal typing does not bump rev.)
- **UI**: each event in `CalendarEvents` gets two actions — a "New project" button and an "Add to
  project ▾" control listing the day's projects. Plain buttons with aria-labels for testability.

## Risks / Trade-offs

- **Editor remount on insert loses cursor/focus** → only happens on the explicit "add to project"
  action, not while typing; acceptable for dropping a post-it.
- **Duplicate project from the same event** → `create_project`'s `AlreadyExists` guard; surfaced.
- **No target projects yet** → the "Add to project" control is empty/disabled when the day has none.
- **Body formatting drift** (e.g. Crepe `<br />`) → the inserted block is plain GFM; any normalization
  is the existing rich-editor follow-up, not this slice.
