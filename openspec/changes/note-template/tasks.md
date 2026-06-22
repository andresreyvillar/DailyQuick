## 1. Template constant (Requirement: Seed an empty note from a template)

- [x] 1.1 (RED) Test: `BASIC_TEMPLATE` contains a `## Tareas` checklist, a `---` separator, and a `## Notas` section
- [x] 1.2 (GREEN) Implement `src/lib/note-template.ts` (`BASIC_TEMPLATE`)
- [x] 1.3 (REFACTOR) Keep green

## 2. Store apply action (Requirement: Seed an empty note from a template)

- [x] 2.1 (RED) Test: `applyTemplate(slug, markdown)` writes the note with the new body (frontmatter preserved), updates the project body, and bumps its editor revision
- [x] 2.2 (GREEN) Implement `applyTemplate` in `board-store.ts`
- [x] 2.3 (REFACTOR) Keep green

## 3. Empty-note prompt (Requirement: Seed an empty note from a template)

- [x] 3.1 (RED) Test: when the body is empty, `ProjectColumn` shows the "Plantilla básica" prompt; clicking it calls `applyTemplate` with `BASIC_TEMPLATE`
- [x] 3.2 (RED) Test: when the body has content, the prompt is not shown
- [x] 3.3 (GREEN) Render the template prompt in `ProjectColumn` (shown only when `body.trim() === ""`), wired to `applyTemplate`
- [x] 3.4 (REFACTOR) Existing ProjectColumn tests still pass

## 4. Definition-of-Done gate

- [x] 4.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 4.2 Every spec scenario maps to a passing test
- [x] 4.3 Manual check via `npm run tauri dev`: a new empty project shows the template prompt; applying it seeds Tareas/Notas and the editor loads it; typing hides the prompt
- [x] 4.4 Open the PR; merge when the gate is green AND the manual check passes
