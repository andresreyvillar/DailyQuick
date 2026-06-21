## 1. Setup

- [x] 1.1 Install deps: `zustand` and Tailwind (`tailwindcss`, `@tailwindcss/vite`); split via CSS flexbox (no panels lib)
- [x] 1.2 Configure Tailwind (entry in `src/styles/`, import in `main.tsx`); verify build still passes
- [x] 1.3 Add a test helper to mock `notes-api` (`vi.mock`) returning canned `list_day`/`read_note`/`write_note`

## 2. Date header (Requirement: Show the current day with a prominent date)

- [x] 2.1 (RED) Test: header renders today's human-readable date and the board resolves day key via `todayKey()`
- [x] 2.2 (GREEN) Implement `src/components/board/DayHeader.tsx` using `date-key.ts` + `Intl.DateTimeFormat("es-ES")`
- [x] 2.3 (REFACTOR) Keep green

## 3. Board store (Requirements: Render a column per project; Toggle split orientation)

- [x] 3.1 (RED) Test: `loadDay(key)` calls `list_day` and stores project summaries in order
- [x] 3.2 (RED) Test: orientation defaults to vertical and is read from `localStorage` when present
- [x] 3.3 (GREEN) Implement `src/state/board-store.ts` (Zustand): `dayKey`, `projects`, `orientation`, `loadDay`, `setOrientation` (persist to `localStorage`)
- [x] 3.4 (REFACTOR) Keep green

## 4. Column rendering (Requirement: Render a column per project)

- [x] 4.1 (RED) Test: given `list_day` → `[oakmond(1), personal(2)]`, board renders columns in that order with titles
- [x] 4.2 (RED) Test: a column with color `#E54D2E` applies it as the header accent
- [x] 4.3 (GREEN) Implement `src/components/board/ProjectColumn.tsx` + `Board.tsx` (CSS flexbox split)
- [x] 4.4 (REFACTOR) Keep green

## 5. Toggle split orientation (Requirement: Toggle split orientation)

- [x] 5.1 (RED) Test: toggling switches the layout vertical ↔ horizontal
- [x] 5.2 (RED) Test: selected orientation is written to `localStorage` and restored on remount
- [x] 5.3 (GREEN) Implement `src/components/board/OrientationToggle.tsx` wired to the store
- [x] 5.4 (REFACTOR) Keep green

## 6. Empty state (Requirement: Empty day state)

- [x] 6.1 (RED) Test: `list_day` returns `[]` → empty-state message shown, no columns rendered
- [x] 6.2 (GREEN) Implement the empty state in `Board.tsx`
- [x] 6.3 (REFACTOR) Keep green

## 7. Inline editing + persist (Requirement: Inline note editing persists)

- [x] 7.1 (RED) Test: editing the body and advancing the debounce timer calls `write_note` with the new body
- [x] 7.2 (RED) Test: only the body changes — persisted note keeps title/color/order (frontmatter preserved)
- [x] 7.3 (RED) Test: pending edit is flushed on blur/unmount (no lost save)
- [x] 7.4 (GREEN) Implement the `<textarea>` placeholder editor + debounced save hook (`useDebouncedSave`)
- [x] 7.5 (REFACTOR) Keep green

## 8. Wire into the app

- [x] 8.1 (GREEN) Render `Board` from `src/App.tsx`; on mount `ensure_day(todayKey())` then `loadDay`
- [x] 8.2 (GREEN) Remove the scaffold demo UI (greet) from `App.tsx`
- [x] 8.3 (REFACTOR) Keep green

## 9. Definition-of-Done gate

- [x] 9.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 9.2 Confirm every spec scenario maps to at least one passing test
- [x] 9.3 Open/update the PR for this change; merge only when the gate is green
