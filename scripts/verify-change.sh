#!/usr/bin/env bash
# DailyQuick — Definition-of-Done gate.
# Must be green before archiving an OpenSpec change (also run by the Husky pre-push hook).
set -euo pipefail

# Ensure the Rust toolchain is on PATH (rustup installs into ~/.cargo).
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

step() { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }

step "OpenSpec: validate --all --strict"
openspec validate --all --strict

step "TypeScript: tsc --noEmit"
npm run --silent typecheck

step "ESLint"
npm run --silent lint

step "Tests: vitest"
npm run --silent test

if command -v cargo >/dev/null 2>&1; then
  step "Rust: cargo test"
  ( cd src-tauri && cargo test --quiet )
  step "Rust: cargo clippy"
  ( cd src-tauri && cargo clippy --quiet )
else
  echo "ERROR: cargo not found — Rust checks cannot run" >&2
  exit 1
fi

printf '\n\033[1;32m✔ DoD gate passed\033[0m\n'
