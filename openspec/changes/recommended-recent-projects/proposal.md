## Why

The forecast strip shows the projects planned for today, but a user often also wants to keep working on
projects they touched in the last few days that aren't in today's forecast. Re-adding them means
retyping the name and picking a color.

## What Changes

- Beside the forecast chips, show **recommended** chips: projects seen in the **previous 5 days** that
  are **not** already in today's forecast and **not** already on the board.
- Clicking a recommended chip creates that project column, reusing its previous color (or an unused
  accent if it had none) — mirroring the forecast/calendar create flow.
- When there is nothing to recommend, no recommendation chips are shown.

## Capabilities

### New Capabilities
- `recommended-projects`: surface recent projects (last 5 days) not in today's forecast/board and let
  the user add them with one click.

## Impact

- `src/lib/recommend.ts`: a pure `recommendedFromRecent(...)` (dedupe + exclude forecast/board).
- `src/components/forecast/RecommendedProjects.tsx`: the recommendation chips, wired into the board's
  Forecast band.
- Reuses `listDay`, `listForecast`, `createProject`, and `nextAccent`. No backend or on-disk changes.
