## 1. Theme store (Requirement: Theme persists across launches; Select a visual theme)

- [x] 1.1 (RED) Test: `loadTheme()` defaults to `nitido` and reads a stored theme from `localStorage`
- [x] 1.2 (RED) Test: `setTheme("citrus")` persists `citrus` and sets `document.documentElement.dataset.theme` to `citrus`
- [x] 1.3 (GREEN) Implement `src/state/theme-store.ts` (`Theme` type, `loadTheme`, `useThemeStore` with `theme` + `setTheme`)
- [x] 1.4 (REFACTOR) Keep green

## 2. Theme token sets (Requirement: Themes are token-driven)

- [x] 2.1 (GREEN) In `styles/index.css`: add the `Caveat` font to the import, the `floatY` / `citrusSlide` keyframes, the non-color theme vars at root (nitido defaults), and `html[data-theme="bujo"]` / `html[data-theme="citrus"]` overrides (neutrals + font/sizes + radii + band border + board image)
- [x] 2.2 (GREEN) Add var-reading utility classes: `.board-date`, `.col-title`, `.section-head`, `.col-card`, `.col-band`, `.board-canvas`
- [x] 2.3 Verify `npm run build` bundles cleanly (Tailwind compiles, var overrides win)

## 3. Theme selector UI (Requirement: Select a visual theme)

- [x] 3.1 (RED) Test: `ThemeSelector` opens a popover listing exactly Nítido / Bullet Journal / Cítrico
- [x] 3.2 (RED) Test: choosing a theme calls `setTheme` with the right key; outside-click closes without changing
- [x] 3.3 (GREEN) Implement `src/components/board/ThemeSelector.tsx` (swatch button + popover, overlay/outside-click) and place it in the header
- [x] 3.4 (REFACTOR) Keep green

## 4. Wire tokens + decorations (Requirement: Themes are token-driven; Select a visual theme)

- [x] 4.1 (GREEN) Apply `.board-date` in `DayHeader`, `.col-title` + `.col-card` + `.col-band` in `ProjectColumn`, `.board-canvas` in `Board`
- [x] 4.2 (GREEN) Decorations: citrus animated strip in `Board` when `theme==="citrus"`; washi-tape in `ProjectColumn` when `theme==="bujo"`
- [x] 4.3 (GREEN) Apply the persisted theme on app init (call into the theme store from the app shell)
- [x] 4.4 (REFACTOR) Existing DayHeader/ProjectColumn/Board tests still pass

## 5. Definition-of-Done gate

- [x] 5.1 Run `npm run verify:change` — OpenSpec validate, `tsc`, `lint`, `vitest`, `cargo test`, `cargo clippy` all green
- [x] 5.2 Every spec scenario maps to a passing test
- [x] 5.3 Manual check via `npm run tauri dev`: switch all three themes (palette, fonts, radii, decorations) and confirm the choice persists across a reload
- [x] 5.4 Open the PR; merge when the gate is green AND the manual check passes
