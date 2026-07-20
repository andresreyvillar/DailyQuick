## 1. `nextAccent` helper

- [x] 1.1 (RED) In `src/lib/accent-palette.test.ts`, add tests for `nextAccent(used)`: first unused
  accent for a partial set; `Azul` for an empty set; case-insensitive match (`#4f7fd6` counts as
  `Azul` used); deterministic non-empty fallback when all six are used.
- [x] 1.2 (GREEN) Implement `nextAccent(used: string[]): string` in `src/lib/accent-palette.ts`.
- [x] 1.3 (REFACTOR) Tidy; keep pure and typed.

## 2. Create form uses the palette + unused default

- [x] 2.1 (RED) In `src/components/board/AddProjectButton.test.tsx`, assert the form renders the
  `ColorPicker` palette control (six accent swatches by name) and that the pre-selected color is the
  first accent not used by the current board projects (mock the store's projects).
- [x] 2.2 (GREEN) Replace the raw `<input type="color">` with `ColorPicker`; seed the initial color
  with `nextAccent` over the current projects' colors, recomputed when the form opens.
- [x] 2.3 (REFACTOR) Remove the now-unused `DEFAULT_COLOR`; keep the submit/reset flow intact.

## 3. Store creation paths default to an unused accent

- [x] 3.1 (RED) In `src/state/board-store.test.ts`, assert `createProjectFromEvent` uses the first
  unused accent (not the fixed `#3E63DD`), and that carry-over keeps a source project's color but
  assigns an unused accent to a source project that had no color.
- [x] 3.2 (GREEN) Use `nextAccent` in `createProjectFromEvent` and in the `importPreviousDay`
  missing-color fallback; remove the `EVENT_PROJECT_COLOR` constant.
- [x] 3.3 (REFACTOR) Keep the batch's accumulating used-set correct.

## 4. Verify

- [x] 4.1 Run `npm run verify:change` (DoD gate) and confirm each spec scenario maps to a passing test.
