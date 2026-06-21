## Context

This is DailyQuick's first UI slice. It renders the current day's board on top of the already-built
`day-storage` contract (Tauri commands surfaced through `src/lib/notes-api.ts`). No new privileged
capability is added; the renderer only calls existing commands.

## Goals / Non-Goals

**Goals:**
- A current-day board: prominent date, one column per project (from `list_day`), V/H split toggle.
- Inline plain-text editing persisted via `write_note`, preserving frontmatter.
- A clear empty state, and orientation that survives reloads.

**Non-Goals:**
- Project creation / color editing / reorder (`project-management`).
- Rich Notion-style editing, slash menu, code blocks (`rich-markdown-editor`) — a `<textarea>`
  placeholder stands in for now.
- History navigation (other days), calendar, search.

## Decisions

- **State via Zustand** (`src/state/board-store.ts`): holds the active day key, the loaded project
  summaries + bodies, and the split orientation. Rationale: small, test-friendly, no boilerplate.
- **Split via CSS flexbox** (`flex-row` for vertical/side-by-side columns, `flex-col` for
  horizontal/stacked rows), driven by the store's `orientation`. Rationale: the spec only requires
  switching the split direction, not drag-to-resize; flexbox needs no dependency and no
  `ResizeObserver` shim in tests. **Drag-resizable dividers are deferred** to a later enhancement
  (then revisit a panels library).
- **Orientation persisted in `localStorage`** (a global UI preference), not in storage. Rationale:
  avoids adding a new storage command this slice; per-day layout (`.day.json`) is deferred to
  `project-management`. Alternative (persist per day) rejected as out of scope here.
- **Placeholder editor = `<textarea>`** bound to the note body, with **debounced save** (~500 ms)
  calling `write_note` with the unchanged frontmatter + new body. Save is **flushed on blur/unmount**
  so pending edits are not lost. The rich editor swaps in for the textarea in a later slice.
- **Day key from `date-key.ts`** (`todayKey()`); display uses `Intl.DateTimeFormat` (es-ES).
- **Testing**: React Testing Library + Vitest, with `notes-api` mocked (`vi.mock`) so the board is
  tested without a Tauri runtime.

## Risks / Trade-offs

- **Save races / lost edits** → single in-flight save per project, debounce + flush on blur/unmount.
- **Debounce loss on app close** → flush on unmount; accept a tiny window as the placeholder editor.
- **Color contrast of accents (light/dark)** → use the color only as an accent (border/label), never
  as text background, so contrast stays acceptable; revisit with the design system later.
- **Empty board with no creation affordance** → expected this slice (creation is `project-management`);
  the empty state explains it. Tests seed projects via the mocked `list_day`.
