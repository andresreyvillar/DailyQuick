## Context

The `forecast-projects` slice shipped chips showing "name + hours" and required `hours` on every cache
entry. Verifying against the real Forecast MCP (`get_time_assignments_weekly_summary`) revealed the
data is a **weekly** rollup per (user, project), not daily — e.g. week of 2026-07-20: Duin 2, Celonis 5,
JRB 10, Paradores 5 (weekly hours). The user only needs the project list to create columns; a weekly
number rendered as a day chip is misleading.

## Goals / Non-Goals

**Goals:**
- Chips show the project name only.
- The cache no longer requires `hours` (optional), so producers may omit it.

**Non-Goals:**
- Removing `hours` from the cache format entirely (kept optional/forward-compatible).
- Changing how the cache is produced or the create-from-forecast behavior.

## Decisions

**`hours` optional end to end.** Rust `ForecastProject.hours: Option<f64>` (`#[serde(default)]`),
zod `hours: z.number().optional()`. The `ForecastProjects` component drops the hours sub-label and
renders only the name. The producer/sample may still include `hours` (ignored by the app).

_Alternative_: distribute weekly hours across weekdays to fake a daily figure — rejected as invented
data the source does not provide.

## Risks / Trade-offs

- [Existing caches with `hours` present] → still parse (optional field accepts present or absent).
- [Spec scenarios previously asserted hours on the chip] → updated in this delta to name-only.
