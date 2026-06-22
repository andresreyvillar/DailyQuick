## 1. Design tokens

- [x] 1.1 Add a Tailwind `@theme` block in `src/styles/index.css`: neutral palette + project-accent helpers, and Public Sans / JetBrains Mono (`@import` + fallbacks)
- [x] 1.2 Verify build (`npm run build`) still bundles cleanly

## 2. Chrome restyle (no logic change)

- [x] 2.1 `DayHeader` — date anchor (18/600), muted year
- [x] 2.2 `DayNavigator` — `‹` / `Hoy` pill / `›` (keep aria-labels)
- [x] 2.3 `SearchPanel` — field input + lupa icon + placeholder "Buscar en todas las notas…"
- [x] 2.4 `AddProjectButton` — dark "+ Nuevo proyecto" pill
- [x] 2.5 `OrientationToggle` → segmented control (two icon buttons; stable aria-labels) + update its test
- [x] 2.6 `CalendarFilter` — calendar-icon "Calendarios" button
- [x] 2.7 `Board` — sunken canvas, gap/padding per spec
- [x] 2.8 `ProjectColumn` — accent-tinted header (color-mix from the hex) + dot + ⋯, white body

## 3. Event chips + popover + toast (Requirements: popover menu / create / add / back)

- [x] 3.1 (RED) Test: clicking an event chip opens the popover (root: "Nuevo proyecto" / "Añadir a…")
- [x] 3.2 (RED) Test: "Nuevo proyecto" calls `createProjectFromEvent` and shows a toast
- [x] 3.3 (RED) Test: "Añadir a…" → submenu lists the day's projects; choosing one calls `addEventToProject` and shows a toast
- [x] 3.4 (RED) Test: back returns to the root menu; outside-click closes the popover
- [x] 3.5 (GREEN) Rework `CalendarEvents` into chips + a popover state machine (`root`/`submenu`, single open, overlay) + a transient toast; reuse the existing store actions
- [x] 3.6 (REFACTOR) Keep green; update the existing CalendarEvents tests to the chip/popover flow

## 4. Definition-of-Done gate

- [x] 4.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 4.2 Every behavioral spec scenario maps to a passing test
- [ ] 4.3 Manual visual check via `npm run tauri dev` against the mockup (tokens, spacing, hover/focus, popover, toast)
- [ ] 4.4 Open the PR; merge when the gate is green AND the visual check passes

## 5. Follow-ups (tracked, not in this slice)

- [ ] 5.1 Theme the editor's internal content (Milkdown/Crepe checkboxes + code block) to the handoff
- [ ] 5.2 Dark mode (once designed)
