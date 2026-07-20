## Context

Two color surfaces exist today and disagree: editing a project's color uses `ColorPicker` (the
six-accent palette + custom hex), while `AddProjectButton` uses a raw `<input type="color">` seeded
with a hardcoded `#4F7FD6`. Projects created from a calendar event hardcode `#3E63DD`
(`EVENT_PROJECT_COLOR`), and carry-over falls back to `#9aa0a9` when a source project has no color.
The accents live in `src/lib/accent-palette.ts` (`ACCENTS`, `accentForKey`).

## Goals / Non-Goals

**Goals:**
- One color control (`ColorPicker`) for both creating and editing a project.
- New projects auto-pick the first accent not already used on the board.
- Keep the picking logic a pure, unit-testable function.

**Non-Goals:**
- Changing the six-accent palette itself or the custom-color escape hatch.
- Reordering projects, or re-coloring existing projects automatically.
- Forecast integration (separate, deferred slice).

## Decisions

**`nextAccent(used: string[]): string` in `accent-palette.ts`.** Returns the first `ACCENTS[i].hex`
whose lowercased value is absent from the lowercased `used` set. When every accent is present, it
returns `ACCENTS[used.length % ACCENTS.length].hex` — deterministic, never empty, and (because the
used-set size grows) tends to spread repeats. Case-insensitive compare so `#4f7fd6` and `#4F7FD6`
match. Pure: no React, no store, no I/O — mirrors `accentForKey`.

**`AddProjectButton` seeds its color from `nextAccent`.** The component reads the current board's
project colors from the store and computes the default when the form opens (recomputed on open, not
just first mount, so it reflects projects added since). It renders `ColorPicker` instead of the raw
input, dropping the local `DEFAULT_COLOR` constant. The user can still override before submitting.

**Store creation paths use `nextAccent`.** `createProjectFromEvent` replaces the `EVENT_PROJECT_COLOR`
constant with `nextAccent(colors of get().projects)`. `importPreviousDay` keeps preserving each source
project's color, but its missing-color fallback becomes `nextAccent` over the colors accumulated so
far in the batch (source colors already assigned + those computed), instead of the neutral gray — so
a colorless carried-over project still lands on a distinct accent.

_Alternative considered_: compute the default inside the Rust `create_project` command. Rejected —
the "unused on the board" set is renderer state (the loaded day's projects), and the accent palette is
a frontend design token; pushing it into Rust would duplicate the palette and the board state.

## Risks / Trade-offs

- [Batch creation (carry-over) can still collide when the source itself repeats a color] → Accepted:
  carry-over's contract is to preserve source colors; `nextAccent` only improves the colorless
  fallback. Not worth reshuffling user-chosen colors.
- [`nextAccent` compares hex strings, so a custom non-palette color never matches an accent] → That is
  correct behavior: a custom color simply doesn't consume a palette slot for the "unused" check.
