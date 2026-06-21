## Why

DailyQuick needs its first interactive surface: opening the app should show **today's dated board**
with a column per project, turning the storage contract into something the user actually works in.

## What Changes

- Render the current day with its **date shown prominently**.
- Show **one column per project** present in today's folder (via `list_day`), in stored order, each
  with its title and color accent.
- A **toggle to switch the split** between vertical (side-by-side) and horizontal (stacked); the
  choice persists across reloads.
- **Inline plain-text editing** of a project's note body, persisted via `write_note` (debounced).
  This is a placeholder — the rich Notion-style editor replaces it in a later slice.
- An **empty state** when the day has no projects yet.

## Capabilities

### New Capabilities
- `daily-board`: the current-day board UI — prominent date header, per-project columns sourced from
  `day-storage`, a split-orientation toggle, an empty state, and inline plain-text editing persisted
  via the storage commands.

### Modified Capabilities
<!-- None: the day-storage capability is consumed unchanged. -->

## Impact

- **New TS/React**: `src/components/board/`, `src/features/day/`, a Zustand store in `src/state/`,
  wired into `src/App.tsx`.
- **Consumes** existing day-storage commands via `src/lib/notes-api.ts` (`list_day`, `read_note`,
  `write_note`, `ensure_day`) and the day key from `src/lib/date-key.ts`.
- **New deps**: `zustand` (state); **Tailwind CSS** for styling. The split uses CSS flexbox
  (drag-resizable dividers deferred to a later enhancement).
- **Depends on** `day-folder-storage` being merged (storage commands must exist).
- **Out of scope**: project creation / color / reorder (`project-management`), rich editor and code
  blocks (`rich-markdown-editor`), history navigation, calendar.
