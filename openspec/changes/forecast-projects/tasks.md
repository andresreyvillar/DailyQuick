## 1. Rust: read the forecast cache

- [x] 1.1 (RED) In `src-tauri/src/fs/forecast.rs`, add tests: parse a fixture and return a day's
  entries; missing file → empty; missing day → empty; malformed JSON → `Parse` error; invalid key → error.
- [x] 1.2 (GREEN) Implement `ForecastProject` + `read_forecast(root, key)` reading
  `root/.dailyquick/forecast.json`; add `pub mod forecast;` to `fs/mod.rs`.
- [x] 1.3 (GREEN) Add the `read_forecast(day)` command in `commands/notes.rs` and register it in `lib.rs`.
- [x] 1.4 (REFACTOR) Keep the parse pure; command stays thin.

## 2. TS: forecast API + store

- [x] 2.1 (RED) In `src/state/board-store.test.ts`, assert `createProjectFromForecast` creates a project
  with the forecast name and the first unused accent, then reloads.
- [x] 2.2 (GREEN) Add `forecastProjectSchema` + `listForecast(day)` in `src/lib/notes-api.ts` and
  `createProjectFromForecast(fp)` in `src/state/board-store.ts`.
- [x] 2.3 (REFACTOR) Reuse `nextAccent`; keep types explicit.

## 3. UI: forecast strip

- [x] 3.1 (RED) In `src/components/forecast/ForecastProjects.test.tsx`, assert: chips render with name +
  hours for the day's forecast; an empty forecast shows the quiet state; clicking a chip calls
  `createProjectFromForecast`; a chip whose project already exists is disabled.
- [x] 3.2 (GREEN) Implement `ForecastProjects` (loads via `listForecast` on dayKey change; chips; click
  → create + toast; already-present → disabled) and wire it into `Board.tsx`'s "Hoy" band.
- [x] 3.3 (REFACTOR) Factor shared chip styling minimally; match `CalendarEvents` conventions.

## 4. Producer + sample (companion, outside the DoD gate)

- [x] 4.1 Add a sample `forecast.json` fixture used by the Rust/TS tests and documented as the cache shape.
- [x] 4.2 Write the `/forecast` producer step (SKILL) that fills the cache from the MCP (filter by
  `projects-map.json` userEmail, map code→name, sum today's hours). Note it needs a live authenticated MCP.

## 5. Verify

- [x] 5.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
