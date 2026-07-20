## Why

The user wants today's forecasted hours per project (from the internal CloudDistrict Forecast MCP,
the same source `/timesheet` uses) visible on the board and clickable to spin up a project column —
just like calendar events. The Forecast service is an OAuth-protected MCP, so the app cannot call it
directly without becoming an OAuth client and breaking its local-first/no-network invariant (§9).

## What Changes

- The app reads a **local, disposable** cache `~/DailyQuick/.dailyquick/forecast.json` (produced
  outside the app by a Claude Code step that already has the MCP authenticated) and shows a **Forecast
  strip** of the selected day's projects, each as a chip (name + hours).
- Clicking a forecast chip **creates a project column** for that project (unused accent), mirroring
  the calendar-event → project flow. Chips whose project already exists today are shown as already added.
- A read-only Tauri command `read_forecast(day)` returns the day's forecast entries; a missing file or
  missing day yields an empty list (never an error). **No network, no credentials in the app** — the
  filesystem stays the source of truth and the cache is safe to delete.

Out of scope (intentionally): the app performing OAuth / calling the MCP itself; writing or refreshing
the cache from the app; forecast for arbitrary date ranges beyond what the cache contains.

## Capabilities

### New Capabilities
- `forecast`: read the day's forecasted projects/hours from the local cache and create project columns
  from them.

## Impact

- Rust: new `src-tauri/src/fs/forecast.rs` (parse + per-day filter), a `read_forecast` command, and its
  registration in `lib.rs`.
- TS: `listForecast` + zod type in `src/lib/notes-api.ts`; `createProjectFromForecast` in the board
  store; a new `src/components/forecast/ForecastProjects.tsx` strip wired into the board's "Hoy" band.
- Companion (outside the app repo): a `/forecast` producer step that writes the cache from the MCP.
- No change to the on-disk note contract; `forecast.json` is a new **derived, disposable** cache file
  under `.dailyquick/` (same status as the SQLite index).
