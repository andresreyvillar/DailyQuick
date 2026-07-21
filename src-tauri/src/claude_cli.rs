//! Locate the external `claude` CLI and build a `Command` for it.
//!
//! A macOS `.app` launched from Finder/Launchpad inherits only a minimal PATH
//! (`/usr/bin:/bin:/usr/sbin:/sbin`) — not the user's shell PATH — so a plain `Command::new("claude")`
//! fails in the bundled app even though it works under `tauri dev`. We therefore probe the well-known
//! install locations (nvm, the official local install, Homebrew) and, as a last resort, ask the login
//! shell where `claude` is. The resolved binary is spawned with an augmented PATH so anything it needs
//! (e.g. `node`, alongside it in the nvm bin dir) also resolves.

use std::path::{Path, PathBuf};
use std::process::Command;

/// Ordered candidate paths for the `claude` binary, most-preferred first. `path_env` is the current
/// PATH (colon-separated) if any; `home` is the user's home directory.
fn candidates(home: &Path, path_env: Option<&str>) -> Vec<PathBuf> {
    let mut out: Vec<PathBuf> = Vec::new();

    // 1. Whatever is on the current PATH (covers `tauri dev`, Homebrew, etc.).
    if let Some(path) = path_env {
        for dir in path.split(':').filter(|d| !d.is_empty()) {
            out.push(Path::new(dir).join("claude"));
        }
    }

    // 2. The official per-user local install.
    out.push(home.join(".claude/local/claude"));

    // 3. nvm: ~/.nvm/versions/node/<version>/bin/claude — probe newest version first.
    let nvm = home.join(".nvm/versions/node");
    if let Ok(entries) = std::fs::read_dir(&nvm) {
        let mut versions: Vec<PathBuf> = entries.flatten().map(|e| e.path()).collect();
        versions.sort();
        versions.reverse();
        for v in versions {
            out.push(v.join("bin/claude"));
        }
    }

    // 4. Common global locations.
    out.push(PathBuf::from("/opt/homebrew/bin/claude"));
    out.push(PathBuf::from("/usr/local/bin/claude"));
    out.push(home.join(".local/bin/claude"));

    out
}

/// The first candidate that exists as a file.
fn first_existing(candidates: &[PathBuf]) -> Option<PathBuf> {
    candidates.iter().find(|p| p.is_file()).cloned()
}

/// Last-resort: ask the user's login shell (which loads nvm in e.g. `.zshrc`) for the `claude` path.
fn resolve_via_login_shell() -> Option<PathBuf> {
    let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/zsh".to_string());
    let output = Command::new(shell)
        .args(["-ilc", "command -v claude"])
        .output()
        .ok()?;
    if !output.status.success() {
        return None;
    }
    let path = PathBuf::from(String::from_utf8_lossy(&output.stdout).trim());
    path.is_file().then_some(path)
}

/// Locate the `claude` CLI binary, or `None` if it cannot be found.
pub fn resolve() -> Option<PathBuf> {
    let home = dirs::home_dir()?;
    let path_env = std::env::var("PATH").ok();
    first_existing(&candidates(&home, path_env.as_deref())).or_else(resolve_via_login_shell)
}

/// PATH to run `claude` with: its own dir (so a co-located `node` resolves) + common locations +
/// whatever PATH we already have.
fn augmented_path(bin: &Path) -> String {
    let mut dirs: Vec<String> = Vec::new();
    if let Some(parent) = bin.parent() {
        dirs.push(parent.to_string_lossy().into_owned());
    }
    for d in ["/opt/homebrew/bin", "/usr/local/bin", "/usr/bin", "/bin"] {
        dirs.push(d.to_string());
    }
    if let Ok(existing) = std::env::var("PATH") {
        dirs.push(existing);
    }
    dirs.join(":")
}

/// A `Command` for the resolved `claude` binary with an augmented PATH, or `None` if `claude` is not
/// found. Callers add their own args.
pub fn command() -> Option<Command> {
    let bin = resolve()?;
    let mut cmd = Command::new(&bin);
    cmd.env("PATH", augmented_path(&bin));
    Some(cmd)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    fn touch(path: &Path) {
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, "").unwrap();
    }

    #[test]
    fn path_env_candidates_come_first() {
        let home = tempdir().unwrap();
        let list = candidates(home.path(), Some("/a:/b"));
        assert_eq!(list[0], PathBuf::from("/a/claude"));
        assert_eq!(list[1], PathBuf::from("/b/claude"));
    }

    #[test]
    fn finds_claude_installed_via_nvm() {
        let home = tempdir().unwrap();
        let claude = home.path().join(".nvm/versions/node/v20.19.4/bin/claude");
        touch(&claude);
        let found = first_existing(&candidates(home.path(), None));
        assert_eq!(found, Some(claude));
    }

    #[test]
    fn probes_newest_nvm_version_first() {
        let home = tempdir().unwrap();
        touch(&home.path().join(".nvm/versions/node/v18.20.0/bin/claude"));
        touch(&home.path().join(".nvm/versions/node/v20.19.4/bin/claude"));
        let found = first_existing(&candidates(home.path(), None)).unwrap();
        assert!(found.to_string_lossy().contains("v20.19.4"));
    }

    #[test]
    fn none_when_claude_is_absent() {
        let home = tempdir().unwrap();
        assert_eq!(first_existing(&candidates(home.path(), Some("/nonexistent"))), None);
    }

    #[test]
    fn augmented_path_leads_with_the_binary_dir() {
        let path = augmented_path(Path::new("/Users/x/.nvm/versions/node/v20/bin/claude"));
        assert!(path.starts_with("/Users/x/.nvm/versions/node/v20/bin:"));
    }
}
