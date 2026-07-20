## Context

The forecast strip (`ForecastProjects`) lives in the board's Forecast band and creates project columns
on click. Projects for a day come from `listDay(key)` (`NoteSummary` = slug/title/color/order); day
keys are computed with `addDays`. `nextAccent` assigns an unused accent; `createProject(title, color)`
creates + reloads.

## Goals / Non-Goals

**Goals:**
- Recommend recent projects (last 5 days) not already forecast/on the board, with one-click add.
- Keep the selection logic pure and unit-tested.

**Non-Goals:**
- Ranking by frequency/recency beyond "most-recent day first, de-duplicated".
- Any backend change — everything derives from existing `listDay`.

## Decisions

**Pure `recommendedFromRecent(recentByDay, forecastNames, boardTitles)` in `src/lib/recommend.ts`.**
Takes the last-5-days summaries (most-recent first), the forecast project names, and the board's project
titles. De-dupes by title (case-insensitive), excludes anything already forecast or on the board,
preserves order. Returns `NoteSummary[]`.

**`RecommendedProjects` component** (in `components/forecast/`) loads, on `dayKey` change, `listForecast(dayKey)`
and `listDay` for `addDays(dayKey, -1..-5)`, reads the board's titles from the store, computes the list,
and renders chips beside the forecast. Clicking calls `createProject(title, color ?? nextAccent(usedColors))`
— reusing the recent color when present. Renders nothing when the list is empty.

**Placement:** rendered right after `ForecastProjects` in the Forecast band, with a subtle "Recientes"
label so it reads as distinct from the forecast.

## Risks / Trade-offs

- [5× `listDay` per day change] → cheap local reads; runs only when the day changes, like the forecast/calendar strips.
- [Title-based matching] → consistent with the forecast strip's own already-added check; slugs derive from titles.
