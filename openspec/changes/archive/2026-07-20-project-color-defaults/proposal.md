## Why

Creating a project uses a raw OS color input and a fixed blue default, while editing a project's
color uses the six-accent palette picker. This is inconsistent, and every new project lands on the
same blue — so a fresh board is a wall of identical accents unless the user recolors each one by hand.

## What Changes

- The "new project" form (`AddProjectButton`) uses the same accent-palette `ColorPicker` used to edit
  a project's color, instead of the raw `<input type="color">`.
- New projects are pre-assigned the first palette accent **not already in use** on the current day's
  board, so distinct projects get distinct colors automatically. This default applies to the `+`
  form's initial color and to projects created from a calendar event; carry-over keeps each source
  project's color and only falls back to an unused accent when the source had none.
- A pure `nextAccent(used: string[])` helper in `src/lib/accent-palette.ts` picks the first unused
  accent (deterministic fallback when all six are in use).

## Capabilities

### Modified Capabilities
- `project-management`: the color control at creation time uses the accent palette, and project
  creation defaults to an unused accent from that palette.

## Impact

- `src/lib/accent-palette.ts` — add `nextAccent`.
- `src/components/board/AddProjectButton.tsx` — use `ColorPicker`; seed the initial color with
  `nextAccent`.
- `src/state/board-store.ts` — `createProjectFromEvent` and the carry-over fallback use `nextAccent`.
- No on-disk contract, Tauri command, or dependency changes.
