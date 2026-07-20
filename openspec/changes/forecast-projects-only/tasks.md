## 1. Cache: hours optional

- [x] 1.1 (RED) In `src-tauri/src/fs/forecast.rs`, add a test: a cache whose entries omit `hours`
  parses and returns the entries.
- [x] 1.2 (GREEN) Make `ForecastProject.hours` an `Option<f64>` with `#[serde(default)]`.

## 2. Chip shows name only

- [x] 2.1 (RED) In `src/components/forecast/ForecastProjects.test.tsx`, drop the hours assertions and
  assert the chip shows the name and no hours text; keep empty/click/already-added cases.
- [x] 2.2 (GREEN) Make `forecastProjectSchema.hours` optional in `notes-api.ts`; remove the hours
  sub-label from `ForecastProjects` (render only the name).
- [x] 2.3 (REFACTOR) Drop the now-unused `hoursLabel` helper.

## 3. Sample + producer

- [x] 3.1 Update `docs/forecast.sample.json` to reflect real weekly projects (hours kept but optional)
  and the `/forecast` producer note (chips show names; hours optional).

## 4. Verify

- [x] 4.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
