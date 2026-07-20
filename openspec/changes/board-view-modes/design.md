## Context

`board-store` persists `orientation: "vertical" | "horizontal"` (localStorage `dailyquick:orientation`)
with `toggleOrientation` (2-way). `Board` maps it to `flex-row`/`flex-col`; `OrientationToggle` flips it.

## Goals / Non-Goals

**Goals:**
- A third `grid` layout; a 3-way persisted selector.

**Non-Goals:**
- Reordering or resizing cards (separate slice).
- Per-column internal scroll (existing follow-up).

## Decisions

**Extend `orientation` to `"vertical" | "horizontal" | "grid"`** (keep the field/key names to avoid a
rename ripple). `loadOrientation` accepts the three values (default `vertical`); `toggleOrientation`
cycles `vertical → horizontal → grid → vertical`. A stored legacy value still loads; an unknown value
falls back to `vertical`.

**Board grid rendering.** For `grid`, render `board-canvas` as a CSS grid
(`repeat(auto-fill, minmax(300px, 1fr))`, `content-start`) with each project wrapper given a min height
so cards are usable; columns/rows keep the current flex layout (`flex-row`/`flex-col`, cards `flex-1`).

**`OrientationToggle` becomes a 3-way control** — a single button that cycles and shows the current
layout (icon + accessible name), or three segmented options. Its accessible name reflects the next/current layout.

## Risks / Trade-offs

- [Grid cards clip long notes (no per-column scroll yet)] → known limitation; grid is an overview layout,
  and the per-column scroll follow-up will address it.
- [\"grid\" as an `orientation` value reads oddly] → accepted for minimal churn; it's an internal field name.
