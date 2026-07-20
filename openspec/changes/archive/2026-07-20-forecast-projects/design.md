## Context

Forecast data lives behind an OAuth-protected internal MCP (`https://forecast-app.cdsysops.com/mcp`,
device-flow OAuth, scopes `mcp:read`), the same source `/timesheet` uses via the Claude Code MCP
client. A shipped Tauri app cannot call MCP tools and adding an in-app OAuth client would break the
local-first / no-network invariant (§9). The app already treats `.dailyquick/` as the home for
derived, disposable caches (the SQLite index). Calendar events are the UX to mirror
(`CalendarEvents.tsx` + `createProjectFromEvent`), and `nextAccent` (from the previous slice) assigns
unused accents.

## Goals / Non-Goals

**Goals:**
- Surface today's forecast projects on the board and let a click create a project column.
- Keep the app fully offline: it only reads a local JSON cache.
- Reuse the existing accent + create-project machinery.

**Non-Goals:**
- In-app OAuth / MCP calls / network of any kind.
- Writing or refreshing the cache from the app (a separate Claude Code producer does that).
- Reconciling hours or timesheet logic — DailyQuick only shows names + hours and creates columns.

## Decisions

**Cache contract — `~/DailyQuick/.dailyquick/forecast.json`:**
```json
{
  "generatedAt": "2026-07-20T08:00:00Z",
  "userEmail": "andres.rey@clouddistrict.com",
  "days": {
    "2026-07-20": [ { "code": "ILA2404", "name": "Oakmond", "hours": 6.5 } ]
  }
}
```
Keyed by day so navigation shows the right day; the app reads `days[dayKey]`. Extra top-level fields
are ignored (forward-compatible). It is a **derived, disposable cache** — same status as the SQLite
index; deleting it just empties the strip.

**Rust: `fs::forecast` (pure) + a thin command.** `forecast::read_forecast(root, key)` validates the
key, resolves `root/.dailyquick/forecast.json`, returns `Ok(vec![])` if the file is absent, parses via
serde_json (`Parse` error on malformed JSON), and returns `days.get(key)` cloned (empty if absent).
`ForecastProject { code, name, hours, color: Option<String> }` (serde, camel-free field names match the
JSON). Command `read_forecast(day)` in `commands/notes.rs`, registered in `lib.rs`. No new crates.

**TS/UI mirrors the calendar strip.** `listForecast(day)` + a zod `forecastProjectSchema` in
`notes-api.ts`. `createProjectFromForecast(fp)` in the board store computes `nextAccent` over current
project colors and calls the existing create path (empty body — the empty-template prompt then guides
the user). A `ForecastProjects` component loads on `dayKey` change and renders chips (name + `Xh`);
a chip whose slug already exists is rendered disabled ("añadido"); otherwise clicking it creates the
column and toasts. Placed in the board's "Hoy" band beside the calendar strip.

**Producer is out-of-app.** A `/forecast` Claude Code step calls the MCP, filters by
`projects-map.json → forecast.userEmail`, maps code→name, sums the day's allocation → hours, and writes
the cache. Documented as a companion; not part of the app's DoD gate (needs a live, authenticated MCP).

_Alternatives considered_: in-app device-flow OAuth + MCP client (rejected — large, duplicates Claude
Code's OAuth, and breaks §9); reusing Claude Code's stored token (rejected — brittle, audience-bound,
a security smell).

## Risks / Trade-offs

- [Cache goes stale / must be refreshed externally] → Accepted: forecast changes rarely intra-day; the
  strip reflects whatever the last producer run wrote, and an absent/old cache degrades to empty, not
  broken. The producer can piggyback on `/timesheet`.
- [Exact MCP output shape is unknown in this session (MCP not connected)] → The app contract
  (`forecast.json`) is defined independently and unit-tested with a fixture; the producer maps MCP →
  this shape and is verified when run against a live MCP.
- [Cache key must be a valid day key] → `read_forecast` validates the key before use, like the note paths.
