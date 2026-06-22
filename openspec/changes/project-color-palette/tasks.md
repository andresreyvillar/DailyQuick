## 1. ColorPicker primitive (Requirement: Choose a project color from the accent palette)

- [x] 1.1 (RED) Test: opening `ColorPicker` shows the six accents; clicking outside closes it
- [x] 1.2 (RED) Test: picking an accent calls `onChange` with that accent's hex and closes
- [x] 1.3 (RED) Test: the custom color input calls `onChange` with an arbitrary hex
- [x] 1.4 (GREEN) Implement `src/components/ui/ColorPicker.tsx` (swatch trigger + popover with `ACCENTS` swatches + custom native input, overlay/outside-click)
- [x] 1.5 (REFACTOR) Keep green

## 2. Wire into ProjectColumn (Requirement: Choose a project color from the accent palette)

- [x] 2.1 (RED) Update the ProjectColumn recolor test: open the color control → pick an accent → `setColor` persists via `write_note`
- [x] 2.2 (GREEN) Replace the native color input in `ProjectColumn` with `ColorPicker` wired to `setColor`
- [x] 2.3 (REFACTOR) Existing ProjectColumn tests still pass

## 3. Definition-of-Done gate

- [x] 3.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 3.2 Every spec scenario maps to a passing test
- [x] 3.3 Manual check via `npm run tauri dev`: the project color dot opens a 6-accent palette; picking one recolors; the custom option still allows any hex
- [x] 3.4 Open the PR; merge when the gate is green AND the manual check passes
