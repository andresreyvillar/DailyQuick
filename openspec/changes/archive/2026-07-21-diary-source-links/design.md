## Context

The diary producer (`/project-diary`) needs a per-project map of sources. The app already owns
`.dailyquick/` caches (forecast, diary). `ProjectColumn`'s ⋯ menu holds the delete action and its inline
confirm. Privileged fs work goes through `#[tauri::command]`s reading/writing under `~/DailyQuick`.

## Goals / Non-Goals

**Goals:** set a project's Slack channel + mail filters from the app; persist for the producer to read.

**Non-Goals:** validating that the channel/emails exist; fetching Mail/Slack in the app; a global settings screen.

## Decisions

**Config file `~/DailyQuick/.dailyquick/diary-sources.json`** (app-owned, so the app writes within its own
root rather than Claude Code's dir). Shape (keyed by slug, camelCase):
`{ "duin": { "searchTerms": ["Duin", "RevOps Duin"] } }`. The producer searches these terms in Apple Mail
+ Slack. `/project-diary` is updated to read this path.

**Rust `fs::diary_sources`** with `read_diary_source(root, slug) -> Option<DiarySource>` and
`set_diary_source(root, slug, source)` (read-modify-write the whole map; create `.dailyquick/` on write;
missing file → empty). `DiarySource { search_terms: Vec<String> }` (`serde(rename_all = "camelCase")`).
Two thin commands.

**UI: `DiarySourcesDialog`** (modal like `DeleteConfirm`) opened from a new "Vincular fuentes" ⋯-menu item.
It loads `readDiarySource(slug)`, shows one field of comma-separated search terms **pre-filled with the
project title** (or saved terms), and on save calls `setDiarySource` with the parsed list.

## Risks / Trade-offs

- [Free-text filters can be imprecise] → acceptable; the producer applies them and the user can refine.
- [Slug rename would orphan a config entry] → rename keeps the slug stable (existing invariant), so the mapping stays valid.
