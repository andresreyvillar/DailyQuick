## Why

The board works but looks plain (default Tailwind grays). We now have a hi-fi design handoff (light
mode) defining a full visual system and the board's look + interactions. This applies that design to
the real app and upgrades the per-event actions into a cleaner popover + toast.

## What Changes

- Introduce the **design tokens** from the handoff (neutral palette, project-accent system,
  typography, spacing, radii, elevation) as Tailwind theme tokens.
- Restyle the chrome to spec: **header** (date anchor, `‹ Hoy ›` nav, search field, dark
  "+ Nuevo proyecto", V/H **segmented control**), **calendar strip** (eyebrow + event **chips** +
  "Calendarios"), **board canvas**, and **project columns** (accent-**tinted** header + dot + ⋯).
- Replace the inline per-event actions with a **popover menu** opened from an event chip: "Nuevo
  proyecto" and "Añadir a…" (submenu of the day's projects), plus a **confirmation toast**.

## Capabilities

### New Capabilities
<!-- None new — this restyles existing capabilities. The one behavioral change (event popover + toast)
     is captured under `board-redesign` so it has testable scenarios. -->
- `board-redesign`: event actions are reached via a per-event popover menu (root + "Añadir a…"
  submenu) and confirmed with a transient toast.

### Modified Capabilities
<!-- event-actions is realized through the new popover UI; its behaviors (create-from-event,
     add-to-project) are unchanged — only the affordance and a toast change. Kept additive here. -->

## Impact

- **CSS**: `src/styles/index.css` gains a Tailwind `@theme` block (tokens + Public Sans / JetBrains Mono).
- **Restyle (no logic change)**: `DayHeader`, `DayNavigator`, `SearchPanel`, `AddProjectButton`,
  `OrientationToggle` (→ segmented), `CalendarFilter`, `Board`, `ProjectColumn` (accent-tinted header,
  derived from each project's hex via `color-mix`).
- **CalendarEvents**: event chips + a popover action menu (+ submenu) + a toast; the store actions
  (`createProjectFromEvent`, `addEventToProject`) are reused unchanged.
- **Deferred (follow-up)**: theming the editor's *internal* content (Milkdown/Crepe checkboxes + code
  blocks) — that's Crepe CSS overriding, done separately. Dark mode is not designed yet.
