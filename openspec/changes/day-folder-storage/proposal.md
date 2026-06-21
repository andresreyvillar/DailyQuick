## Why

The on-disk Markdown layout is DailyQuick's single source of truth and its highest-risk surface
(silent data loss would be unacceptable). Establishing the day-folder + project-file contract — and
its frontmatter parsing — before any UI de-risks every later slice that reads or writes notes.

## What Changes

- Introduce the `~/DailyQuick/` root and the `YYYY-MM-DD/<project-slug>.md` layout.
- Create the day folder on demand for a given date key.
- Read, write, and list the project `.md` files inside a day folder.
- Parse and serialize the note frontmatter (`title`, `color`, `order`, `created`) losslessly.
- Expose this strictly through Tauri commands; the renderer never touches the disk directly.

## Capabilities

### New Capabilities
- `day-storage`: the filesystem contract for day folders, per-project Markdown files, and
  frontmatter parse/serialize — exposed to the renderer via Tauri commands.

### Modified Capabilities
<!-- None: this is the first capability. -->

## Impact

- **New Rust**: `src-tauri/src/fs/` (layout + frontmatter), `src-tauri/src/commands/notes.rs`.
- **New TS**: `src/lib/date-key.ts`, `src/lib/frontmatter.ts` (pure helpers, unit-tested).
- **New deps**: Rust `chrono` (date keys) and a frontmatter crate (e.g. `gray_matter`); TS `zod`
  (already installed) for validating command payloads.
- **No UI** in this change. Consumed later by `daily-board-layout` and `project-management`.
