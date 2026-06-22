use std::fs;
use std::path::Path;

use serde::Serialize;

use super::date::validate_key;
use super::error::StorageError;
use super::frontmatter::{self, ORDER_LAST};

/// A single search result.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct SearchHit {
    pub day_key: String,
    pub slug: String,
    pub title: String,
    pub snippet: String,
}

/// Search the title and body of every note under `root` for `query` (case-insensitive).
/// Returns hits ordered by day key descending, then title. An empty/whitespace query yields no
/// results (no scan). Non-day directories (e.g. `.dailyquick`) are skipped.
pub fn search(root: &Path, query: &str) -> Result<Vec<SearchHit>, StorageError> {
    let needle = query.trim().to_lowercase();
    if needle.is_empty() || !root.exists() {
        return Ok(Vec::new());
    }

    let mut hits = Vec::new();
    for day in fs::read_dir(root).map_err(|e| StorageError::Io(e.to_string()))? {
        let day = day.map_err(|e| StorageError::Io(e.to_string()))?;
        let day_path = day.path();
        if !day_path.is_dir() {
            continue;
        }
        let day_key = day.file_name().to_string_lossy().to_string();
        if validate_key(&day_key).is_err() {
            continue;
        }
        for file in fs::read_dir(&day_path).map_err(|e| StorageError::Io(e.to_string()))? {
            let file = file.map_err(|e| StorageError::Io(e.to_string()))?;
            let path = file.path();
            if path.extension().and_then(|e| e.to_str()) != Some("md") {
                continue;
            }
            let Some(slug) = path.file_stem().and_then(|s| s.to_str()) else {
                continue;
            };
            let content =
                fs::read_to_string(&path).map_err(|e| StorageError::Io(e.to_string()))?;
            let note = frontmatter::parse(&content, slug, ORDER_LAST)?;
            let title = note.frontmatter.title;
            let matches = title.to_lowercase().contains(&needle)
                || note.body.to_lowercase().contains(&needle);
            if !matches {
                continue;
            }
            let snippet = note
                .body
                .lines()
                .find(|line| line.to_lowercase().contains(&needle))
                .map(|line| line.trim().chars().take(120).collect::<String>())
                .unwrap_or_default();
            hits.push(SearchHit {
                day_key: day_key.clone(),
                slug: slug.to_string(),
                title,
                snippet,
            });
        }
    }

    hits.sort_by(|a, b| b.day_key.cmp(&a.day_key).then_with(|| a.title.cmp(&b.title)));
    Ok(hits)
}

#[cfg(test)]
mod tests {
    use super::super::frontmatter::{Frontmatter, Note};
    use super::super::store::write_note;
    use super::*;
    use tempfile::tempdir;

    fn note(title: &str, body: &str) -> Note {
        Note {
            frontmatter: Frontmatter {
                title: title.to_string(),
                color: None,
                order: 1,
                created: None,
            },
            body: body.to_string(),
        }
    }

    #[test]
    fn finds_by_body_with_snippet() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-20", "oakmond", &note("Oakmond", "reunión con Oakmond")).unwrap();
        let hits = search(root.path(), "oakmond").unwrap();
        assert_eq!(hits.len(), 1);
        assert_eq!(hits[0].day_key, "2026-06-20");
        assert_eq!(hits[0].slug, "oakmond");
        assert!(hits[0].snippet.to_lowercase().contains("oakmond"));
    }

    #[test]
    fn case_insensitive() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-20", "personal", &note("Personal", "")).unwrap();
        assert_eq!(search(root.path(), "personal").unwrap().len(), 1);
    }

    #[test]
    fn matches_title_only() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-20", "oakmond", &note("Oakmond", "")).unwrap();
        assert_eq!(search(root.path(), "oak").unwrap().len(), 1);
    }

    #[test]
    fn no_match_and_empty_query() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-20", "oakmond", &note("Oakmond", "body")).unwrap();
        assert!(search(root.path(), "zzz").unwrap().is_empty());
        assert!(search(root.path(), "   ").unwrap().is_empty());
    }

    #[test]
    fn orders_recent_first() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-18", "a", &note("A", "find me")).unwrap();
        write_note(root.path(), "2026-06-20", "b", &note("B", "find me")).unwrap();
        let days: Vec<String> = search(root.path(), "find")
            .unwrap()
            .into_iter()
            .map(|h| h.day_key)
            .collect();
        assert_eq!(days, vec!["2026-06-20", "2026-06-18"]);
    }

    #[test]
    fn skips_non_day_directories() {
        let root = tempdir().unwrap();
        write_note(root.path(), "2026-06-20", "oakmond", &note("Oakmond", "find me")).unwrap();
        std::fs::create_dir_all(root.path().join(".dailyquick")).unwrap();
        std::fs::write(root.path().join(".dailyquick").join("notes.md"), "find me").unwrap();
        let hits = search(root.path(), "find").unwrap();
        assert_eq!(hits.len(), 1);
        assert_eq!(hits[0].slug, "oakmond");
    }
}
