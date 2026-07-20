## 1. Persisted collapse state

- [x] 1.1 (RED) In `src/state/board-store.test.ts`, assert `contextCollapsed` defaults to expanded,
  `toggleContext` flips it, and it persists to `localStorage` (`loadContextCollapsed` reads it back).
- [x] 1.2 (GREEN) Add `contextCollapsed`, `toggleContext`, and `loadContextCollapsed()` to the board
  store, persisted to `localStorage` (mirror the orientation pattern).

## 2. Compact, collapsible region in the board

- [x] 2.1 (RED) In `src/components/board/Board.test.tsx`, assert the context toggle collapses/expands
  the calendar+forecast region (e.g. the "Hoy"/"Forecast" labels are hidden when collapsed and shown
  when expanded).
- [x] 2.2 (GREEN) Wrap the calendar + forecast bands in one compact region with a collapse toggle
  driven by `contextCollapsed`; hide the content when collapsed, keeping the expand control.
- [x] 2.3 (REFACTOR) Tighten padding for the compact look; keep the chip components unchanged.

## 3. Verify

- [x] 3.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
