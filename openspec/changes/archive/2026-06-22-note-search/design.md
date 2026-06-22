## Context

The app has a growing set of day folders with per-project `.md` notes. Users need to find content
across days. The storage layer (`fs`) already parses notes; `history-navigation` already navigates to
a day. Search ties them together.

## Goals / Non-Goals

**Goals:**
- Case-insensitive search across all notes' titles and bodies, returning day/project/snippet hits.
- Results ordered most-recent-day first; opening a hit navigates to that day.

**Non-Goals (deferred):**
- A persistent SQLite/FTS index (premature for personal-scale data — see Decisions).
- Fuzzy ranking, project/date filters, in-note match highlighting.

## Decisions

- **Scan-based search in Rust** (`fs::search::search(root, query)`): iterate the day folders (dir
  names passing `date::validate_key`, which skips `.dailyquick`), parse each `<slug>.md` via
  `fs::frontmatter`, and keep those whose lowercased title or body contains the lowercased query.
  Rationale: simple, correct, dependency-free, and reuses the tested parser. **The SQLite index from
  the architecture is deferred** — for a personal daily journal the corpus is small; a scan is fast
  enough, and adding a bundled-SQLite crate now is premature optimization (Simplicity First). It can
  be introduced later as a disposable cache without changing this command's contract.
- **Snippet** = the first body line containing the query (trimmed, truncated to ~120 chars); empty
  when only the title matched.
- **Ordering**: day key descending (lexicographic works for `YYYY-MM-DD`), then title.
- **Empty/whitespace query → empty results** (don't scan).
- **Frontend**: a `SearchPanel` (input + results list) in the board header calls the `search` command
  (debounced); clicking a hit calls the existing store `goToDay(day_key)`. No new store state beyond
  what `history-navigation` provides.

## Risks / Trade-offs

- **Scan cost grows with history size** → acceptable at personal scale; documented as the reason the
  SQLite index is deferred, and the command contract won't change if we add it later.
- **Reads every note per search** → fine for modest data; the frontend debounces input so we don't
  scan on every keystroke.
- **Non-day directories** (e.g. `.dailyquick`) → skipped via `date::validate_key`.
