## Context

A project's body is a Milkdown editor (uncontrolled, keyed by `${dayKey}:${slug}:${revision}` so an
external write reloads it — the same mechanism used to drop an event block). Seeding an empty note is
an external write: set the body, persist it, and bump the revision so the editor reloads.

## Goals / Non-Goals

**Goals:** offer a one-click starter template only while a note is empty; applying it seeds clean GFM
and the editor shows it; the prompt vanishes once the note has content.

**Non-Goals:** multiple templates, a destructive reset/clear, slash-menu insertion, backend changes.

## Decisions

- **`lib/note-template.ts`** (pure): `BASIC_TEMPLATE` = `## Tareas\n\n- [ ] \n- [ ] \n- [ ] \n\n---\n\n## Notas\n`.
- **Store `applyTemplate(slug, markdown)`**: find the project, `write_note` with the new body
  (frontmatter unchanged), then update `projects` and bump `revisions[slug]` — identical shape to
  `addEventToProject`, so the keyed editor remounts and loads the seeded body.
- **`ProjectColumn` prompt**: compute `isEmpty = project.body.trim() === ""`. When empty, render a
  template prompt above the (always-mounted) editor: a short "Proyecto en blanco…" line and a
  **Plantilla básica** card button (`aria-label="Plantilla básica"`) that calls
  `applyTemplate(slug, BASIC_TEMPLATE)`. The editor stays mounted below so the user can also just type;
  `setBody` updates `project.body` on the first keystroke, so the prompt hides immediately once there
  is content.

## Risks / Trade-offs

- **Editor remount on apply**: applying the template bumps the revision and remounts the editor (as
  with event inserts); acceptable since it happens on an empty note the user just chose to seed.
- **"Empty" definition**: `body.trim() === ""` treats whitespace-only as empty; the prompt then offers
  to seed, which overwrites only whitespace — safe.
- **No reset control**: clearing a filled note would be data loss; intentionally excluded (§9).
