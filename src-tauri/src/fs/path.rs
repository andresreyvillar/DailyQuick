use std::path::{Path, PathBuf};

use super::date::validate_key;
use super::error::StorageError;
use super::slug::validate_slug;

/// Directory for a given day under `root`. Validates the key before joining.
pub fn day_dir(root: &Path, key: &str) -> Result<PathBuf, StorageError> {
    validate_key(key)?;
    Ok(root.join(key))
}

/// File path for a project's note on a given day. Validates key + slug before joining.
pub fn note_path(root: &Path, key: &str, slug: &str) -> Result<PathBuf, StorageError> {
    validate_key(key)?;
    validate_slug(slug)?;
    Ok(root.join(key).join(format!("{slug}.md")))
}

/// Default storage root: `~/DailyQuick`.
pub fn default_root() -> Result<PathBuf, StorageError> {
    dirs::home_dir()
        .map(|home| home.join("DailyQuick"))
        .ok_or_else(|| StorageError::Io("could not resolve home directory".to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn builds_the_note_path() {
        let root = Path::new("/tmp/root");
        let path = note_path(root, "2026-06-21", "oakmond").unwrap();
        assert_eq!(path, Path::new("/tmp/root/2026-06-21/oakmond.md"));
    }

    #[test]
    fn rejects_traversal_before_joining() {
        let root = Path::new("/tmp/root");
        assert!(note_path(root, "2026-06-21", "../etc").is_err());
        assert!(note_path(root, "../2026", "oakmond").is_err());
        assert!(note_path(root, "2026-06-21", "a/b").is_err());
        assert!(day_dir(root, "..").is_err());
    }
}
