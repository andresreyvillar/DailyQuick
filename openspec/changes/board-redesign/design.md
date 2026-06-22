## Context

A hi-fi light-mode handoff (`design_handoff_dailyquick_tablero/README.md`) defines DailyQuick's visual
system + board look + the per-event action popover. This slice recreates it in React + Tailwind over
the existing components, changing styling and the event-action affordance — not the underlying logic.

## Goals / Non-Goals

**Goals:** apply the design tokens + restyle the chrome and columns to spec; replace inline event
actions with a popover menu (+ submenu) and a confirmation toast.

**Non-Goals (deferred):** theming the editor's internal content (Milkdown/Crepe checkboxes + code
blocks) — a separate Crepe-CSS follow-up; and dark mode (not designed yet).

## Decisions

- **Tokens via Tailwind v4 `@theme`** in `src/styles/index.css`: neutral palette (`surface`,
  `surface-sunken`, `surface-subtle`, `field`, `border`, `border-soft`, `text-strong`, `text`,
  `text-muted`, `text-faint`, …) as `--color-*` so utilities (`bg-surface-sunken`, `text-text-faint`)
  generate. Fonts: Public Sans (UI) + JetBrains Mono (mono) via a Google Fonts `@import`, with system
  fallbacks.
- **Project accent is a free hex** (from the color picker), not one of the 6 named accents. Derive the
  tinted column header at runtime with `color-mix`: header `background: color-mix(in srgb, <accent> 8%,
  white)`, bottom border `color-mix(in srgb, <accent> 22%, white)`, dot = solid accent. This gives the
  "expressive but contained" look for any color. (WKWebView supports `color-mix`.)
- **Component restyle map** (logic unchanged): `DayHeader` (18/600 date, muted year) · `DayNavigator`
  (`‹` / `Hoy` pill / `›`, keep aria-labels) · `SearchPanel` (field input, lupa icon) ·
  `AddProjectButton` (dark pill) · `OrientationToggle` → **segmented control** (two icon buttons;
  aria-labels for testability) · `CalendarFilter` (calendar-icon button) · `Board` (sunken canvas,
  gap/padding) · `ProjectColumn` (accent-tinted header + dot + ⋯, white body).
- **CalendarEvents → chips + popover**: each event is a chip (dot + mono time + title + "+"). Clicking a
  chip opens a popover with a small state machine: `root` ("Nuevo proyecto" / "Añadir a…") and
  `submenu` (project list + back). One open at a time (`openEventKey`), a full-area overlay closes on
  outside click. Selecting an action calls the existing store actions and shows a **toast**
  (`{ message }`, auto-dismiss ~2600ms). Replaces the current inline button + select.

## Testing strategy

- **Unit-tested (behavior)**: popover open on chip click; outside-click closes; "Nuevo proyecto" calls
  `createProjectFromEvent` + shows toast; "Añadir a…" → submenu → choose calls `addEventToProject` +
  toast; back returns to root. Update `CalendarEvents.test` to the chip/popover flow and
  `OrientationToggle.test` to the segmented control's aria-labels. Other component tests keep their
  aria-labels (DayNavigator/Search/AddProject/CalendarFilter/DayHeader/Board) so they stay green.
- **Visual fidelity** (tokens, spacing, colors, hover/focus) is **verified live via `npm run tauri
  dev`** against the mockup — the gate can't assert pixels.

## Risks / Trade-offs

- **Restyle breaks selector-based tests** → keep stable `aria-label`s / roles / the `empty-state`
  testid and `h2` titles; update only the tests whose interaction genuinely changed (events, toggle).
- **Accent tint from arbitrary hex** → `color-mix` derivation; acceptable and consistent.
- **Pixel drift** → close-to-spec now, confirmed and tweaked in the live check.
