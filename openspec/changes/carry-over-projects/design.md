## Context

`project-management` already creates projects via the `create_project` command (derives the slug from
the title, appends `order = max+1`, writes an empty note) and `listDay(key)` lists a day's projects.
Carrying over the previous day's projects is just "list yesterday, create each for today" — no new
privileged surface is needed.

## Goals / Non-Goals

**Goals:** one action that recreates the previous day's project columns (title + color, empty body) for
the day being viewed, skipping any slug that already exists; a header control that disables itself when
there is nothing to copy.

**Non-Goals:** copying note content, merging into existing projects, picking a non-adjacent source day,
reordering.

## Decisions

- **`importPreviousDay()` store action** (frontend only): read `listDay(addDays(dayKey, -1))`; for each
  prior project, in order, skip it if its slug is already among the current day's projects, else call the
  existing `create_project(dayKey, title, color)` (color falls back to the neutral default when null);
  swallow a per-project `AlreadyExists`/invalid error so one bad entry never aborts the rest; finally
  `loadDay(dayKey)` once to refresh. Empty bodies come for free from `create_project`.
- **`CarryOverButton`** (header): reads `dayKey` + `projects` from the store and fetches the previous
  day's summaries with `listDay` in an effect keyed on `dayKey`. It computes the importable set
  (previous-day projects whose slug is not already present today) on each render and is **disabled** when
  that set is empty; clicking calls `importPreviousDay()`. After import, the store's `projects` grow, the
  importable set recomputes to empty, and the button disables — keeping the action idempotent.
- **Placement**: in the header's right cluster alongside the other controls (always present, per the
  chosen scope), so it works whether or not the day already has projects.

## Risks / Trade-offs

- **Order preservation**: `create_project` appends `order = max+1`, so creating the prior projects in
  their listed order reproduces the same relative order; exact numeric order values may differ but the
  on-screen order matches. Acceptable.
- **Stale previous-day fetch**: the button refetches the previous day only when `dayKey` changes; the
  importable set still recomputes from the store after an import (today's `projects` change), so the
  disabled state stays correct without an extra fetch.
- **Null color**: a prior project with no color is created with the neutral default, matching how a
  fresh project renders.
