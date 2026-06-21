## Context

`daily-board` renders the projects in a day's folder but offers no way to create or customize them,
so a new day is always empty. This slice adds project creation and title/color editing, building on
the `day-storage` commands and integrating into the existing board.

## Goals / Non-Goals

**Goals:**
- Create a project for the current day (title + color) via a `+` button.
- Edit an existing project's title (display) and color.
- Keep slug/order rules authoritative in the Rust storage layer.

**Non-Goals:**
- Reordering projects (drag/move) and deleting projects (needs a delete command) — later slices.
- The rich editor (still the `<textarea>` placeholder from `daily-board`).

## Decisions

- **New backend command `create_project(key, title, color)`**. It slugifies the title
  (`fs::slug::slugify`, whose dead-code allowance is removed), computes `order = max(existing) + 1`
  via `fs::store::list_day`, and writes an empty note with frontmatter `title/color/order` and
  `created = key`. It returns the new `NoteSummary`. Rationale: filename/slug/order derivation is a
  storage concern and stays in Rust (single source of truth); the renderer never derives filenames.
- **Collision safety**: `create_project` errors with a new `StorageError::AlreadyExists` if the slug
  already exists for the day, so a create never overwrites an existing note. Alternative (auto-suffix
  the slug) rejected as surprising.
- **Recolor / rename reuse `write_note`** (no new command). The board store already holds each
  project's full frontmatter, so it builds the updated note (changed color or title, same body) and
  calls `write_note`. The slug — the filename — is immutable; rename changes only the display title.
- **Frontend**: board-store gains `createProject(title, color)`, `setColor(slug, color)`,
  `rename(slug, title)`; after a create, the store reloads the day (to pick up the new order). UI: an
  `AddProjectButton` with an inline form (text input + `<input type="color">`), and inline title +
  color controls on each `ProjectColumn` header.

## Risks / Trade-offs

- **Slug collision / overwrite** → `AlreadyExists` error; the UI surfaces it instead of clobbering.
- **Empty/symbol-only title** → `slugify` returns `InvalidSlug`; the create form shows the error and
  writes nothing.
- **Color value** → constrained to the native color picker's hex output; stored as-is, used only as
  an accent (consistent with `daily-board`).
- **Refresh cost after create** → a full `loadDay` reload is simplest and cheap at this scale;
  optimize later only if needed.
