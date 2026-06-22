## Why

With a growing history of daily notes, the user needs to **find** things ("where did I write about
X?"). This adds search across all notes, with results that jump to the matching day.

## What Changes

- Search the body and title of every note across all days for a query (case-insensitive).
- Results show the day, project title, and a matching snippet, most-recent day first.
- Clicking a result navigates to that day (reuses `history-navigation`'s `goToDay`).

## Capabilities

### New Capabilities
- `note-search`: full-text-ish search across all notes (title + body), returning day/project/snippet
  hits ordered by recency.

### Modified Capabilities
<!-- None: consumes day-storage (reads .md) and history-navigation (goToDay) as-is. -->

## Impact

- **New Rust**: `fs/search.rs` — scans day folders, parses each note, filters by query; a `search`
  Tauri command. Reuses `fs::frontmatter`/`date`/`path` (no new crate).
- **New TS**: `search` wrapper + `SearchHit` zod schema in `notes-api.ts`; a `SearchPanel` component in
  the board header; clicking a hit calls the existing `goToDay`.
- **Out of scope / deferred**: a persistent **SQLite/FTS index**. For personal-scale data a direct
  scan is simple, correct, and dependency-free (Simplicity First); the SQLite cache from the
  architecture is a future optimization if the corpus grows large. Also out: fuzzy ranking, filters
  by project/date, and highlighting within the opened note.
