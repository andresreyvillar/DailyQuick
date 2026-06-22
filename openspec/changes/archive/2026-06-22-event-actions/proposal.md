## Why

Seeing the day's events is useful, but the user wants to *act* on them — especially meetings: turn a
meeting into a project to take notes/transcripts, or drop a meeting into an existing project as a
"post-it" block. This adds per-event actions to the calendar strip.

## What Changes

- Each event in the strip gets two actions:
  - **Create project from event** → a project for the current day with the event's **title** and a
    seeded Markdown body (date · time · calendar, plus `## Notas` / `## Transcripción` sections).
  - **Add event to a project** → pick an existing project; the event is appended to its note as a
    Markdown **block** ("post-it"), and that project's editor reflects it.
- Reuses the existing `create_project` + `write_note`; the seeded body and the event block are clean
  GFM. No new backend command.

## Capabilities

### New Capabilities
- `event-actions`: per-event actions to create a project from an event and to add an event into an
  existing project's note as a Markdown block.

### Modified Capabilities
<!-- None: consumes calendar (events), project-management (create_project / write_note), and the board. -->

## Impact

- **TS only**: pure helpers `eventProjectBody(event)` and `eventBlock(event)` (Markdown); board-store
  actions `createProjectFromEvent(event)` and `addEventToProject(slug, event)`; per-event action UI in
  `CalendarEvents`; a small **editor remount** signal so an open project editor shows an inserted block.
- **No native code, no new Tauri command** → fully unit-testable (no `tauri dev` gap).
- **Out of scope**: attendees/transcription capture, recurring-event handling, drag-and-drop, and
  editing an event (still read-only from the calendar).
