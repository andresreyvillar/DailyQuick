## 1. Remove the template feature

- [x] 1.1 Delete `src/lib/note-template.ts` and `src/lib/note-template.test.ts`.
- [x] 1.2 Remove `applyTemplate` (type + impl) from `src/state/board-store.ts` and its test in `board-store.test.ts`.
- [x] 1.3 Remove the empty-state "Plantilla básica" prompt (and now-unused `BASIC_TEMPLATE` import,
  `applyTemplate` hook, and `isEmpty`) from `ProjectColumn.tsx`, and drop its tests in `ProjectColumn.test.tsx`.

## 2. Fix grid overlap

- [x] 2.1 In `Board.tsx`, make grid frames content-sized: wrapper `self-start` without a fixed min-height,
  and the inner wrapper not `flex-1` in grid (columns/rows keep `flex-1`).

## 3. Verify

- [x] 3.1 Run `npm run verify:change` (DoD gate); confirm no dangling references and all tests pass.
