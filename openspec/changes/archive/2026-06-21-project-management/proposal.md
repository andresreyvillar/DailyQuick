## Why

The board can render projects but there is no way to create them, so every new day opens empty.
Project management makes the board usable: create projects with the `+` button and customize each
project's title and color.

## What Changes

- A **`+` button** on the board to create a project for the current day (title + color).
- **Edit** an existing project's **title** (display name) and **color**.
- A new backend command **`create_project(key, title, color)`** that derives a filesystem-safe slug,
  assigns `order = max + 1`, and writes an empty note with frontmatter `title/color/order/created`.
- The board refreshes to show the created/updated project.

## Capabilities

### New Capabilities
- `project-management`: creating a project (`+` button, title, customizable color) and editing an
  existing project's title and color, persisted to its note frontmatter.

### Modified Capabilities
<!-- None: day-storage and daily-board are consumed as-is. The board gains create/edit affordances,
     but its existing requirements (render, toggle, empty state, edit) are unchanged. -->

## Impact

- **New Rust**: `create_project` command (uses `fs::slug` — removing its dead-code allowance — and
  `fs::store`); a new `StorageError::AlreadyExists` variant to prevent overwriting an existing slug.
- **New TS**: `createProject` wrapper + zod in `notes-api.ts`; board-store actions `createProject`,
  `setColor`, `rename`; UI for the `+` button / create form and inline title + color editing.
- **Consumes** `day-storage` (`write_note`, `list_day`) and integrates into `daily-board`.
- **Out of scope**: reordering projects, deleting projects (needs a delete command), and the rich
  editor — later slices.
