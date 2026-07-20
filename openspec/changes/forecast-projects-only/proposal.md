## Why

Verifying the forecast feature against the real Forecast MCP showed the source gives **weekly** hours
per project, not daily, and the user only needs the **list of forecast projects** to create columns —
the hours are noise on the chip. Showing a weekly number as "6.5h" on a day chip is misleading.

## What Changes

- The forecast chip shows **only the project name** (no hours).
- Forecasted `hours` becomes **optional** in the cache contract, so a cache without hours is valid and
  the app never depends on them.

## Capabilities

### Modified Capabilities
- `forecast`: chips show the project name only; `hours` is optional in the cache.

## Impact

- Rust: `ForecastProject.hours` becomes `Option<f64>`.
- TS: `forecastProjectSchema.hours` becomes optional; `ForecastProjects` drops the hours sub-label.
- `docs/forecast.sample.json` and the `/forecast` producer keep `hours` (harmless, ignored) but the
  app no longer requires or displays it.
- No on-disk note-contract change; `forecast.json` stays a derived, disposable cache.
