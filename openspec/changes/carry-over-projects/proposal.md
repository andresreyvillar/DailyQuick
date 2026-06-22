## Why

Most days reuse the same set of projects as the day before (the same columns: "Reunión semanal",
"Sprint 24", …). Today, starting a new day means re-creating each project by hand. The user wants a
one-click way to **carry over the previous day's projects** into the current day — the same columns,
fresh (empty) pages.

## What Changes

- **Carry-over action**: a header control copies the **previous day's** projects into the day being
  viewed. It creates the same columns — same title, color, and relative order — with **empty bodies**
  (structure only, not the previous notes' content).
- **No overwrite**: any project whose slug already exists for the current day is **skipped**, so the
  action never clobbers existing notes. Re-running it is therefore idempotent.
- **Disabled when nothing to copy**: the control is disabled when the previous day has no projects (or
  all of them already exist today).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `project-management`: adds a "Carry over the previous day's projects" requirement (clone the prior
  day's project columns into the current day, empty bodies, skipping existing slugs).

## Impact

- **Frontend only — no new backend command.** Reuses `listDay(previousDay)` to read the prior day's
  projects and the existing `create_project` command (derives slug, appends order, writes an empty
  note) to recreate each one. A `importPreviousDay()` store action orchestrates it; a `CarryOverButton`
  in the header triggers it. Fully unit-testable.
- **Out of scope**: copying note **content** (tasks/notes carry-over is a separate idea), merging into
  existing projects, choosing a source day other than the immediately previous one, and reordering.
