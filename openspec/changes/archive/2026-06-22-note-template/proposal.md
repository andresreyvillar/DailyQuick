## Why

Opening a brand-new project means staring at an empty editor. The design adds a **quick template** for
empty notes: a one-click "Plantilla básica" that seeds the note with a familiar starter structure
(a task checklist, a separator, and a notes section), so the user can start filling instead of
formatting.

## What Changes

- **Empty-note template prompt**: when a project's note body is empty, the column body shows
  "Proyecto en blanco. Empieza con una plantilla:" plus a **Plantilla básica** card. Clicking it seeds
  the note with the starter Markdown, and the editor loads it. The prompt disappears as soon as the
  note has any content (whether from the template or from typing).
- **Starter template**: `## Tareas` + three empty task items + `---` + `## Notas` — clean GFM.

## Capabilities

### New Capabilities
- `note-template`: seed an empty project note from a predefined starter template.

### Modified Capabilities
<!-- None -->

## Impact

- **Frontend only**: a pure `lib/note-template.ts` (the `BASIC_TEMPLATE` string), a store
  `applyTemplate(slug, markdown)` action (writes the note + bumps the editor revision so the Milkdown
  editor reloads, mirroring the event-block insert), and the prompt in `ProjectColumn`. Reuses the
  existing `write_note` path; no backend. Unit-testable.
- **Out of scope**: multiple template choices, a "reset/clear note" control (clearing a note is
  destructive — excluded per guardrail §9), and a slash-menu template insertion.
