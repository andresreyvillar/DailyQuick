## 1. Pure recommendation helper

- [x] 1.1 (RED) In `src/lib/recommend.test.ts`, test `recommendedFromRecent`: recommends a recent
  project not in forecast/board; excludes forecast matches; excludes board matches; de-dupes across days;
  preserves most-recent-first order.
- [x] 1.2 (GREEN) Implement `recommendedFromRecent(recentByDay, forecastNames, boardTitles)` in
  `src/lib/recommend.ts`.

## 2. Recommendation chips

- [x] 2.1 (RED) In `src/components/forecast/RecommendedProjects.test.tsx`, assert: a recent project not
  in forecast/board renders as a chip; a forecast/board match does not; clicking a chip calls
  `createProject`; no recommendations renders nothing.
- [x] 2.2 (GREEN) Implement `RecommendedProjects` (loads forecast + last-5-days via `listForecast`/`listDay`,
  computes via `recommendedFromRecent`, chips create via `createProject` with the recent color or `nextAccent`).
- [x] 2.3 (GREEN) Wire `RecommendedProjects` into the Forecast band in `Board.tsx` (stub it in `Board.test.tsx`).
- [x] 2.4 (REFACTOR) Match `ForecastProjects` chip conventions.

## 3. Verify

- [x] 3.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
