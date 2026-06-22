## 1. Accent palette (Requirement: Calendar events show as icon-tile chips)

- [x] 1.1 (RED) Test: `accentForKey(id)` is deterministic (same id → same hex) and always returns a palette hex
- [x] 1.2 (GREEN) Implement `src/lib/accent-palette.ts` (`ACCENTS` + `accentForKey`)
- [x] 1.3 (REFACTOR) Keep green

## 2. Icon-tile chip (Requirement: Calendar events show as icon-tile chips)

- [x] 2.1 (RED) Test: a chip renders its time and title in the new layout, keeps `aria-label="Acciones de <title>"`, and clicking it still opens the popover
- [x] 2.2 (GREEN) Restyle the chip in `CalendarEvents` (icon tile tinted via `accentForKey(calendar_id)`, two-line time/title, no `+`, popover anchor at `top-[44px]`)
- [x] 2.3 (GREEN) Add `--chip-radius` / `--chip-icon-radius` / `--chip-icon-shadow` / `--chip-icon-rot` to the `:root`, `bujo`, and `citrus` blocks in `styles/index.css`
- [x] 2.4 (REFACTOR) Existing CalendarEvents popover/toast tests still pass

## 3. Definition-of-Done gate

- [x] 3.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 3.2 Every spec scenario maps to a passing test
- [x] 3.3 Manual check via `npm run tauri dev`: event chips show calendar-icon tiles tinted per calendar; clicking opens the popover; tiles tilt/shadow in Bullet Journal
- [x] 3.4 Open the PR; merge when the gate is green AND the manual check passes
