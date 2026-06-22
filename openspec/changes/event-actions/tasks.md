## 1. Markdown helpers (Requirement: Event blocks are clean Markdown)

- [ ] 1.1 (RED) Test: `eventProjectBody(event)` → GFM body with date/time/calendar + `## Notas` + `## Transcripción`
- [ ] 1.2 (RED) Test: `eventBlock(event)` → a GFM block (title + time + calendar), no proprietary syntax
- [ ] 1.3 (GREEN) Implement `src/lib/event-markdown.ts` (`eventProjectBody`, `eventBlock`)
- [ ] 1.4 (REFACTOR) Keep green

## 2. Board store actions (Requirements: Create a project from an event; Add an event to an existing project)

- [ ] 2.1 (RED) Test: `createProjectFromEvent(event)` calls `create_project` then `write_note` with the seeded body, then reloads
- [ ] 2.2 (RED) Test: `createProjectFromEvent` surfaces `AlreadyExists` (no overwrite)
- [ ] 2.3 (RED) Test: `addEventToProject(slug, event)` appends `eventBlock` to the project body via `write_note`, preserving existing content
- [ ] 2.4 (RED) Test: an external insert bumps the project's editor revision (so the editor remounts)
- [ ] 2.5 (GREEN) Implement `createProjectFromEvent`, `addEventToProject`, and a per-project `revision` in `board-store.ts`
- [ ] 2.6 (REFACTOR) Keep green

## 3. Editor remount wiring (Requirement: Add an event to an existing project)

- [ ] 3.1 (GREEN) `ProjectColumn` keys the editor by `${dayKey}:${slug}:${rev}` so an external insert reloads the body
- [ ] 3.2 (REFACTOR) Existing ProjectColumn tests still pass

## 4. Per-event actions UI (Requirements: Create a project from an event; Add an event to an existing project)

- [ ] 4.1 (RED) Test: clicking "New project" on an event calls `createProjectFromEvent`
- [ ] 4.2 (RED) Test: "Add to project" lists the day's projects and choosing one calls `addEventToProject(slug, event)`
- [ ] 4.3 (RED) Test: a create error surfaces a message (no crash)
- [ ] 4.4 (GREEN) Add the per-event actions to `CalendarEvents` (buttons + project picker)
- [ ] 4.5 (REFACTOR) Existing calendar/board tests still pass

## 5. Definition-of-Done gate

- [ ] 5.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [ ] 5.2 Every spec scenario maps to a passing test
- [ ] 5.3 Open the PR; merge when the gate is green
