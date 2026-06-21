# CLAUDE.md — DailyQuick

> **Status: greenfield.** The app shell has been scaffolded (Tauri 2 + React + Vite + TS).
> This file states the product vision, the agreed architecture, and the development workflow.
> Update it as the real structure lands.

---

## 1. Project Overview

DailyQuick is a **native macOS daily-notes app** (Apple Silicon) — a *daily board* organized by
project. Inspired by Day One, but instead of a single linear journal it opens a **blank page for
each new day with the date shown prominently**, split into **per-project columns** (vertical or
horizontal, chosen with a toggle). Each project has a customizable **title and color**, is created
with a **`+` button**, and its content is authored in a **Notion-like rich editor** while being
**stored as plain Markdown on disk**.

The purpose is a daily operating surface: pending tasks per project, meeting notes, and quick
annotations — always in view for today, with a **browsable history** of previous days. Because
every note is a clean `.md` file in a predictable folder layout, the notes double as **context for
coding agents** in their corresponding projects.

**Primary goals:**
- Frictionless daily capture: open the app → today's dated board is ready to type into.
- Markdown on disk is the **single source of truth**; the rich UI is a view over it.
- Native efficiency on Apple Silicon (small footprint, fast cold start).
- Read-only awareness of the day's calendar events for meeting-note context.

**Key constraints:**
- **Local-first.** No cloud backend, no account. Files live under `~/DailyQuick/`.
- **Markdown must stay clean and portable** — readable in any editor and usable as agent context.
- **Calendar = Apple Calendar (EventKit), read-only.** Never Google Calendar API / GCP
  (corporate Google Workspace policy). The corporate calendar appears only if the user added it to
  Apple Calendar.
- Solo project: prefer the option that ships a working app sooner over maximal purity.

---

## 2. Tech Stack

- **Shell**: Tauri 2 (Rust host + system `WKWebView`). Native `.app`, signable, ~10 MB, no bundled Chromium.
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS.
- **Editor**: BlockNote (Notion-style, block-based, on ProseMirror/TipTap) with native Markdown
  import/export. Code blocks rendered via CodeMirror 6 for real syntax highlighting.
- **Layout**: `react-resizable-panels` for the vertical/horizontal split board.
- **Client state**: Zustand (lightweight; revisit only if it proves insufficient).
- **Storage**: `.md` files on disk are the source of truth. Optional **SQLite** index
  (Tauri SQL plugin) as a *derived, disposable* cache for search and fast history navigation.
- **Calendar**: EventKit via `objc2-event-kit` (Rust) or a small Swift sidecar, exposed read-only.
- **Testing**: Vitest (frontend), `cargo test` (Rust). ESLint + `tsc` for static checks.
- **Toolchain**: Node ≥ 20, Rust stable, Xcode command-line tools (for EventKit linking).

---

## 3. Architecture

```
dailyQuick/
├── src/                       # React frontend (renderer / WebView)
│   ├── app/                   # App shell, providers, top-level layout
│   ├── components/
│   │   ├── editor/            # BlockNote wrapper + custom code block (CodeMirror 6)
│   │   ├── board/            # Daily board: columns/rows, split toggle, project tabs, "+" add
│   │   ├── calendar/          # Day header (date) + read-only EventKit events panel
│   │   └── ui/                # Primitives: buttons, color picker, menus
│   ├── features/              # Feature logic (orchestration, not presentation)
│   │   ├── day/               # Current-day load/create, layout state (split orientation)
│   │   ├── project/           # Project create/rename/color/order
│   │   ├── history/           # Browse previous days
│   │   └── search/            # Query the SQLite index
│   ├── lib/                   # Pure TS: blocks<->markdown, frontmatter, date keys
│   ├── state/                 # Zustand stores
│   ├── styles/                # Tailwind entry + design tokens
│   └── main.tsx
│
├── src-tauri/                 # Rust host (privileged side)
│   ├── src/
│   │   ├── lib.rs / main.rs
│   │   ├── commands/          # #[tauri::command] handlers exposed to the renderer
│   │   │   ├── notes.rs       # read/write/list .md, create day folders
│   │   │   ├── calendar.rs    # EventKit read-only bridge
│   │   │   └── index.rs       # optional SQLite index + search
│   │   ├── fs/                # File layout, frontmatter parse/serialize
│   │   └── calendar/          # EventKit integration
│   ├── capabilities/          # Tauri v2 permission scopes (fs, sql, calendar)
│   ├── tauri.conf.json
│   └── Cargo.toml
├── openspec/                  # Spec-driven dev layer (see §11)
├── scripts/verify-change.sh   # Definition-of-Done gate (see §11)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### On-disk data layout (the contract — most important part of the app)

```
~/DailyQuick/
├── 2026-06-21/                # one folder per day, key = YYYY-MM-DD
│   ├── oakmond.md             # one .md per project tab
│   ├── personal.md
│   └── .day.json              # per-day layout: split orientation, project order
├── 2026-06-20/
│   └── ...
└── .dailyquick/
    ├── settings.json          # project catalog + default colors, app settings
    └── index.sqlite           # DERIVED cache (search/history) — safe to delete & rebuild
```

Each `.md` carries frontmatter; the body is GFM Markdown (task lists, fenced code blocks):

```markdown
---
title: Oakmond
color: "#E54D2E"
order: 1
created: 2026-06-21
---

## Tareas
- [ ] ...
```

**Rules:**
- **The filesystem is the source of truth. SQLite is a cache** — never the authority. The app must
  work correctly if `index.sqlite` is deleted (rebuild on next launch).
- All privileged work (filesystem, calendar, SQLite) lives in `src-tauri` behind
  `#[tauri::command]`. The renderer never touches the disk directly — it calls commands.
- `src/lib/` holds **pure, testable** functions (Markdown↔blocks, frontmatter, date keys). No I/O,
  no React, no Tauri imports there.
- `components/` is presentational; `features/` orchestrates. New screens/flows go in `features/`.
- Project color/order is per-day truth in each file's frontmatter; `settings.json` is the catalog
  of known projects and their default color so a new day inherits sensible defaults.

---

## 4. Coding Conventions

- **Files**: `kebab-case.ts(x)`. React components in `PascalCase.tsx`. Rust modules `snake_case.rs`.
- **Identifiers, comments, commits, docs in English.** (App UI copy is Spanish — see §6.)
- **Types**: no `any`; explicit return types on exported functions; prefer `type`/discriminated
  unions over loose objects. Model the Markdown frontmatter and the Tauri command payloads as
  shared, validated types (e.g. zod) on the TS side.
- **Functions**: small, single-responsibility, early returns. Keep components lean — extract hooks.
- **Exports**: named exports (no default exports) except where a framework requires otherwise.
- **Rust**: keep commands thin; push logic into `fs/`, `calendar/`, `index` modules. Return typed
  errors (`thiserror`) serialized to the renderer; never `unwrap()` on I/O paths.
- **macOS shell note**: do not use GNU-only flags (e.g. `grep -oP`). Use `grep -E` or `perl`.
- **Comments**: explain *why*, not *what*. Do not add comments/docstrings to code you didn't change.

---

## 5. UI and Design Rules

- **Design language**: clean, calm, Notion-like — generous whitespace, content-first. The **date is
  the visual anchor** of each day's board.
- **Component base**: Tailwind + small in-house primitives (`components/ui/`). Avoid a heavy
  component framework; keep the bundle lean for fast WebView startup.
- **Board**: project columns separated by resizable dividers; a single toggle flips
  vertical ↔ horizontal split. Each project shows its title and color (accent on its header/tab).
- **Color**: per-project customizable accent; ensure sufficient contrast in both light and dark
  mode. Respect the system appearance (macOS light/dark) by default.
- **State visibility**: every interactive surface has clear hover / focus / disabled / loading /
  empty states. A brand-new day shows an inviting empty board, not a blank void.
- **Editor**: slash menu, checkboxes, callouts, headings, and a dedicated code block (CodeMirror 6)
  with language selection and copy button.
- **Accessibility**: full keyboard navigation; visible focus rings; respect reduced-motion.

---

## 6. Content Guidelines

- **App UI copy: Spanish** (the user's working language). Concise, plain, no jargon.
- **Dates** shown prominently and human-readable (e.g. "Sábado, 21 de junio de 2026"), with the
  `YYYY-MM-DD` key used internally for folders.
- **Code, technical docs, commits: English** (see §4).
- Keep microcopy short; prefer verbs ("Nuevo proyecto", "Hoy", "Ayer").

---

## 7. Testing and Quality Bar

Before considering a task complete:
- **Pure logic** (`src/lib/`, Rust `fs`/parsing): unit-tested. Round-trip Markdown↔blocks↔Markdown
  must be lossless for the supported feature set (headings, lists, task lists, code blocks, callouts).
- Happy path works; invalid/missing frontmatter is handled; a day folder with no files renders an
  empty board; deleting `index.sqlite` rebuilds cleanly.
- `tsc --noEmit` passes; ESLint clean; `cargo check`/`clippy` clean in `src-tauri`.
- No data-loss regressions — writes are the highest-risk path; verify the file on disk matches the
  editor after save.
- Do NOT add heavy test scaffolding for trivial changes.

---

## 8. File and Component Placement Rules

- New user-facing flow → `src/features/<feature>/`. Shared pure helpers → `src/lib/`.
- New privileged capability (disk/calendar/index) → a `#[tauri::command]` in `src-tauri/src/commands/`
  with logic in the matching module; expose a typed wrapper on the TS side.
- Reusable presentational pieces → `src/components/ui/`. Don't inline one-off styles that belong there.
- Tests live next to the unit they cover (`*.test.ts`) or under `src-tauri` for Rust.
- Prefer editing existing files over creating near-duplicates. **Do NOT create abstractions for
  one-off usage** — wait for the second real caller.

---

## 9. Guardrails — Do NOT Touch Without Explicit Request

- **Never break the on-disk contract.** The `~/DailyQuick/YYYY-MM-DD/<project>.md` layout, the
  frontmatter schema, and "filesystem is source of truth, SQLite is disposable cache" are load-bearing
  invariants. Changing them needs an explicit call-out and a migration note.
- **Never bypass the Tauri command boundary** to do disk/calendar I/O directly from the renderer.
- **Calendar stays read-only and EventKit-only.** Do not add write access, Google Calendar API, or
  any GCP dependency without explicit approval.
- **No cloud/account/telemetry/network calls** sneaking in — this is a local-first app by design.
- Treat user notes as **irreplaceable data**: any change to read/write/delete paths must be
  defensive (no destructive overwrite without the new content fully validated).
- Flag major architectural changes (new editor, dropping Tauri, schema changes) before implementing.

---

## 10. Commands

- **Install**: `npm install`
- **Dev (full app)**: `npm run tauri dev`
- **Dev (frontend only)**: `npm run dev`
- **Build (native .app)**: `npm run tauri build`
- **Typecheck**: `npx tsc --noEmit`
- **Lint**: `npm run lint`
- **Test (frontend)**: `npm test`
- **Rust check**: `cd src-tauri && cargo check && cargo clippy`
- **Rust test**: `cd src-tauri && cargo test`
- **DoD gate (run before archiving a change)**: `npm run verify:change`

---

## 11. Development Workflow — OpenSpec × TDD × DoD gate

All non-trivial work flows through **OpenSpec** (spec-driven) with **TDD** and a hard
**Definition-of-Done gate** before a change is archived. Specs live in `openspec/`.

Available `/opsx:` commands in this repo: **`explore`, `propose`, `apply`, `archive`** (this OpenSpec
profile has no separate `sync`/`verify` command — `archive` merges the deltas, and verification is
the DoD gate below). Author artifacts via the templates from `openspec instructions <artifact> --change <name>`.

### Per-change loop (one git branch + PR per spec)

```
0. /opsx:explore <idea>   (optional) clarify scope before committing
1. /opsx:propose <slice>  → openspec/changes/<slice>/ with:
     proposal.md           (why + scope in/out)
     specs/<capability>/spec.md (delta ADDED/MODIFIED/REMOVED + "#### Scenario" GIVEN/WHEN/THEN)
     design.md             (how: modules, Tauri commands, types)
     tasks.md              (TDD-ordered checklist)
   → git branch `spec/<slice>` + open a draft PR (one PR per spec)
2. /opsx:apply            → implement task by task: RED → GREEN → REFACTOR; push commits to the PR
3. npm run verify:change  → DoD gate (MUST be green; enforced by the Husky pre-push hook)
4. merge the PR once green → /opsx:archive merges the delta into openspec/specs (source of truth)
                             and moves the change to openspec/changes/archive/<date>-<slice>/
```

### Scenario → test mapping (the TDD anchor)

Every `#### Scenario:` with `GIVEN/WHEN/THEN` in a delta spec is an acceptance test. `tasks.md` is
written in TDD order, not implementation order:

```markdown
## 1. <Requirement area>
- [ ] 1.1 (RED) Test for scenario "<name>"
- [ ] 1.2 (GREEN) Minimal implementation to pass 1.1
- [ ] 1.3 (REFACTOR) Clean up; keep green
```

### Definition-of-Done gate (`scripts/verify-change.sh`, run as `npm run verify:change`)

A change may **not** be archived until all of these pass (also enforced by the Husky **pre-push** hook):

| Check | Command |
|-------|---------|
| Specs well-formed | `openspec validate --all --strict` |
| Types | `npm run typecheck` (`tsc --noEmit`) |
| Lint | `npm run lint` |
| Frontend tests (cover every scenario) | `npm test` (`vitest run`) |
| Rust tests + lint | `cd src-tauri && cargo test && cargo clippy` |

This gate is the same bar as the `/verify` skill and §7 — reuse it, don't duplicate. After implementing,
read the change's spec scenarios and confirm each maps to a passing test (manual verification step).

### Change backlog (vertical slices, risk-first)

0. `scaffold-tauri-react` — bootstrap (done)
1. `day-folder-storage` — on-disk contract: day folder, read/write/list `.md`, frontmatter ← **next**
2. `daily-board-layout` — blank dated page + per-project columns + V/H toggle
3. `project-management` — `+` button, title + color + order
4. `rich-markdown-editor` — BlockNote ↔ Markdown round-trip + CodeMirror code block
5. `history-navigation` — browse previous days
6. `calendar-readonly` — EventKit events in the day header
7. `search-index` *(optional)* — SQLite cache

### Git

- Route all git operations through the `git-specialist` agent.
- No AI-attribution trailers in commits (`Co-Authored-By`, etc.); never mention AI tools.
