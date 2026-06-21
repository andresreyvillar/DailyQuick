## Context

DailyQuick stores every note as a plain Markdown file on disk; this layout is the single source of
truth and the app's highest-risk surface (a bad write means lost user data). This change builds that
foundation before any UI exists, so later slices (board, projects, editor) sit on a stable,
well-tested contract. All privileged I/O runs in the Rust host (`src-tauri`) behind Tauri commands;
the renderer only ever calls those commands.

## Goals / Non-Goals

**Goals:**
- A tested filesystem contract: resolve paths, create the day folder, write/read/list notes.
- Lossless frontmatter parse/serialize with safe defaults for missing fields.
- A single privileged I/O boundary (Tauri commands) with typed errors and payloads.
- Path safety: reject crafted date keys / slugs that could escape `~/DailyQuick/`.

**Non-Goals:**
- No UI, no board, no editor (later slices).
- No SQLite index, no search, no calendar.
- No rename/delete of notes yet (additive write/read/list only).
- The root path is fixed at `~/DailyQuick/` (no user-configurable location yet).

## Decisions

- **I/O lives in Rust, behind commands.** Rationale: native filesystem access, one privileged
  boundary to audit, and easy unit testing against a `tempdir`. Alternative (File System Access API
  in the webview) was rejected — unreliable on macOS and breaks the "commands are the only I/O"
  guardrail.
- **Atomic writes (temp file + rename).** A note is written to `<file>.tmp` then `rename`d over the
  target, so an interrupted or failed write never leaves a partial/corrupt file. Alternative
  (in-place write) risks truncation on crash.
- **Hand-rolled frontmatter serializer for the 4 known fields.** Parsing uses a frontmatter/YAML
  reader; serialization emits a deterministic, fixed-order block (`title`, `color`, `order`,
  `created`). Rationale: stable, diff-friendly round-trips and independence from churn in the Rust
  YAML crate ecosystem. Alternative (generic YAML serialize) gives nondeterministic key order.
- **`chrono` for date keys.** Canonical `YYYY-MM-DD` formatting/validation. The TS side gets a small
  `date-key.ts` for display only; parsing/serialization stays authoritative in Rust.
- **Path safety by allowlist.** Date keys must match `^\d{4}-\d{2}-\d{2}$`; slugs must match
  `^[a-z0-9-]+$`. Anything else is rejected before touching the filesystem.
- **Typed errors.** Rust returns `thiserror` variants (`NotFound`, `InvalidKey`, `InvalidSlug`,
  `Parse`, `Io`) serialized to the renderer; the renderer validates payloads with `zod`.

## Risks / Trade-offs

- **Data loss on write** → atomic temp+rename; validate content before replacing; never `unwrap()` on
  I/O paths.
- **Path traversal via crafted slug/date** → strict allowlist regex validation before any path join.
- **YAML crate instability** → deterministic hand-rolled serializer for the known fields; parser is
  isolated behind one module so it can be swapped.
- **HOME resolution under sandbox** → resolve the root via Tauri's path API / `dirs`, not a hardcoded
  string, so tests can inject a temp root.
- **Round-trip fidelity** → "semantically equal" (same fields + body), not byte-identical; documented
  so tests assert on parsed equality, not raw bytes.
