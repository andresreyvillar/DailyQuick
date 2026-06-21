use std::fs;
use std::path::{Path, PathBuf};

use serde::Serialize;

use super::error::StorageError;
use super::frontmatter::{self, Frontmatter, Note, ORDER_LAST};
use super::path;
use super::slug;

/// Lightweight listing entry for a day's notes (no body).
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct NoteSummary {
    pub slug: String,
    pub title: String,
    pub color: Option<String>,
    pub order: i64,
}

/// Create the day folder for `key` if missing (idempotent). Returns the folder path.
pub fn ensure_day(root: &Path, key: &str) -> Result<PathBuf, StorageError> {
    let dir = path::day_dir(root, key)?;
    fs::create_dir_all(&dir).map_err(|e| StorageError::Io(e.to_string()))?;
    Ok(dir)
}

/// Write a project note atomically (temp file + rename).
/// Path validation runs before any write, so a failed write never corrupts an existing file.
pub fn write_note(root: &Path, key: &str, slug: &str, note: &Note) -> Result<(), StorageError> {
    let target = path::note_path(root, key, slug)?;
    let content = frontmatter::serialize(note);
    ensure_day(root, key)?;
    let tmp = target.with_file_name(format!("{slug}.md.tmp"));
    fs::write(&tmp, content.as_bytes()).map_err(|e| StorageError::Io(e.to_string()))?;
    fs::rename(&tmp, &target).map_err(|e| StorageError::Io(e.to_string()))?;
    Ok(())
}

/// Read a project note. Returns `NotFound` if the file does not exist.
pub fn read_note(root: &Path, key: &str, slug: &str) -> Result<Note, StorageError> {
    let target = path::note_path(root, key, slug)?;
    match fs::read_to_string(&target) {
        Ok(content) => frontmatter::parse(&content, slug, ORDER_LAST),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Err(StorageError::NotFound),
        Err(e) => Err(StorageError::Io(e.to_string())),
    }
}

/// List the project notes in a day's folder, ordered by `order` then `title`.
/// A missing day returns an empty list and does NOT create the folder.
pub fn list_day(root: &Path, key: &str) -> Result<Vec<NoteSummary>, StorageError> {
    let dir = path::day_dir(root, key)?;
    if !dir.exists() {
        return Ok(Vec::new());
    }
    let mut notes = Vec::new();
    for entry in fs::read_dir(&dir).map_err(|e| StorageError::Io(e.to_string()))? {
        let entry = entry.map_err(|e| StorageError::Io(e.to_string()))?;
        let file = entry.path();
        if file.extension().and_then(|e| e.to_str()) != Some("md") {
            continue;
        }
        let Some(slug) = file.file_stem().and_then(|s| s.to_str()) else {
            continue;
        };
        let content = fs::read_to_string(&file).map_err(|e| StorageError::Io(e.to_string()))?;
        let note = frontmatter::parse(&content, slug, ORDER_LAST)?;
        notes.push(NoteSummary {
            slug: slug.to_string(),
            title: note.frontmatter.title,
            color: note.frontmatter.color,
            order: note.frontmatter.order,
        });
    }
    notes.sort_by(|a, b| a.order.cmp(&b.order).then_with(|| a.title.cmp(&b.title)));
    Ok(notes)
}

/// Create a new project note for `key`: derive a slug from `title`, append after existing
/// projects (`order = max + 1`), and write an empty note. Fails with `AlreadyExists` if the slug
/// is already present, so a create never overwrites an existing note.
pub fn create_project(
    root: &Path,
    key: &str,
    title: &str,
    color: &str,
) -> Result<NoteSummary, StorageError> {
    let slug = slug::slugify(title)?;
    if path::note_path(root, key, &slug)?.exists() {
        return Err(StorageError::AlreadyExists(slug));
    }
    let order = list_day(root, key)?
        .iter()
        .map(|n| n.order)
        .filter(|&o| o != ORDER_LAST)
        .max()
        .map(|m| m + 1)
        .unwrap_or(0);
    let note = Note {
        frontmatter: Frontmatter {
            title: title.to_string(),
            color: Some(color.to_string()),
            order,
            created: Some(key.to_string()),
        },
        body: String::new(),
    };
    write_note(root, key, &slug, &note)?;
    Ok(NoteSummary {
        slug,
        title: title.to_string(),
        color: Some(color.to_string()),
        order,
    })
}

#[cfg(test)]
mod tests {
    use super::super::frontmatter::Frontmatter;
    use super::*;
    use tempfile::tempdir;

    fn note(title: &str, order: i64, body: &str) -> Note {
        Note {
            frontmatter: Frontmatter {
                title: title.to_string(),
                color: None,
                order,
                created: None,
            },
            body: body.to_string(),
        }
    }

    #[test]
    fn write_creates_day_folder_then_reads_back() {
        let root = tempdir().unwrap();
        let n = note("Oakmond", 1, "# Tareas");
        assert!(!root.path().join("2026-06-22").exists());
        write_note(root.path(), "2026-06-22", "oakmond", &n).unwrap();
        assert!(root.path().join("2026-06-22").is_dir());
        let read = read_note(root.path(), "2026-06-22", "oakmond").unwrap();
        assert_eq!(read, n);
    }

    #[test]
    fn ensure_day_is_idempotent_and_preserves_notes() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-22", "oakmond", &note("Oakmond", 1, "x")).unwrap();
        ensure_day(root.path(), "2026-06-22").unwrap();
        let read = read_note(root.path(), "2026-06-22", "oakmond").unwrap();
        assert_eq!(read.body, "x");
    }

    #[test]
    fn failed_write_leaves_existing_file_unchanged() {
        let root = tempdir().unwrap();
        write_note(
            root.path(),
            "2026-06-21",
            "oakmond",
            &note("Oakmond", 1, "original"),
        )
        .unwrap();
        let result = write_note(
            root.path(),
            "2026-06-21",
            "bad slug",
            &note("X", 2, "new content"),
        );
        assert!(matches!(result, Err(StorageError::InvalidSlug(_))));
        let read = read_note(root.path(), "2026-06-21", "oakmond").unwrap();
        assert_eq!(read.body, "original");
    }

    #[test]
    fn read_missing_note_returns_not_found() {
        let root = tempdir().unwrap();
        assert!(matches!(
            read_note(root.path(), "2026-06-21", "ghost"),
            Err(StorageError::NotFound)
        ));
    }

    #[test]
    fn list_day_orders_by_order_then_title() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-21", "personal", &note("Personal", 2, "")).unwrap();
        write_note(root.path(), "2026-06-21", "oakmond", &note("Oakmond", 1, "")).unwrap();
        let listed = list_day(root.path(), "2026-06-21").unwrap();
        let slugs: Vec<&str> = listed.iter().map(|n| n.slug.as_str()).collect();
        assert_eq!(slugs, vec!["oakmond", "personal"]);
    }

    #[test]
    fn list_missing_day_is_empty_and_creates_nothing() {
        let root = tempdir().unwrap();
        let listed = list_day(root.path(), "2026-06-21").unwrap();
        assert!(listed.is_empty());
        assert!(!root.path().join("2026-06-21").exists());
    }

    #[test]
    fn create_project_writes_metadata_and_empty_body() {
        let root = tempdir().unwrap();
        let summary = create_project(root.path(), "2026-06-21", "Oakmond", "#E54D2E").unwrap();
        assert_eq!(summary.slug, "oakmond");
        let read = read_note(root.path(), "2026-06-21", "oakmond").unwrap();
        assert_eq!(read.frontmatter.title, "Oakmond");
        assert_eq!(read.frontmatter.color.as_deref(), Some("#E54D2E"));
        assert_eq!(read.frontmatter.created.as_deref(), Some("2026-06-21"));
        assert_eq!(read.body, "");
    }

    #[test]
    fn create_project_slugifies_the_title() {
        let root = tempdir().unwrap();
        let summary = create_project(root.path(), "2026-06-21", "My Project!", "#000000").unwrap();
        assert_eq!(summary.slug, "my-project");
    }

    #[test]
    fn create_project_appends_order_after_existing() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-21", "a", &note("A", 2, "")).unwrap();
        let summary = create_project(root.path(), "2026-06-21", "Beta", "#111111").unwrap();
        assert_eq!(summary.order, 3);
    }

    #[test]
    fn create_project_first_gets_order_zero() {
        let root = tempdir().unwrap();
        let summary = create_project(root.path(), "2026-06-21", "First", "#222222").unwrap();
        assert_eq!(summary.order, 0);
    }

    #[test]
    fn create_project_rejects_empty_slug_title() {
        let root = tempdir().unwrap();
        assert!(matches!(
            create_project(root.path(), "2026-06-21", "!!!", "#333333"),
            Err(StorageError::InvalidSlug(_))
        ));
    }

    #[test]
    fn create_project_rejects_duplicate_slug() {
        let root = tempdir().unwrap();
        create_project(root.path(), "2026-06-21", "Oakmond", "#E54D2E").unwrap();
        let again = create_project(root.path(), "2026-06-21", "Oakmond", "#000000");
        assert!(matches!(again, Err(StorageError::AlreadyExists(_))));
        let read = read_note(root.path(), "2026-06-21", "oakmond").unwrap();
        assert_eq!(read.frontmatter.color.as_deref(), Some("#E54D2E"));
    }
}
