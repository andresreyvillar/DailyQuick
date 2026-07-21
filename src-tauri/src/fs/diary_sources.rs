//! Per-project diary source mapping at `~/DailyQuick/.dailyquick/diary-sources.json` — the search terms
//! (defaulting to the project title) the `/project-diary` producer uses to find the project's emails and
//! Slack messages. Set from the app; consumed by the producer.

use std::collections::HashMap;
use std::io::ErrorKind;
use std::path::Path;

use serde::{Deserialize, Serialize};

use super::error::StorageError;

/// A project's diary sources: the terms to search for in Apple Mail + Slack (default: the project title).
#[derive(Debug, Clone, Default, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiarySource {
    #[serde(default)]
    pub search_terms: Vec<String>,
}

fn sources_path(root: &Path) -> std::path::PathBuf {
    root.join(".dailyquick").join("diary-sources.json")
}

fn read_all(root: &Path) -> Result<HashMap<String, DiarySource>, StorageError> {
    match std::fs::read_to_string(sources_path(root)) {
        Ok(content) => serde_json::from_str(&content).map_err(|e| StorageError::Parse(e.to_string())),
        Err(e) if e.kind() == ErrorKind::NotFound => Ok(HashMap::new()),
        Err(e) => Err(StorageError::Io(e.to_string())),
    }
}

/// A project's saved sources, or `None` if none are set.
pub fn read_diary_source(root: &Path, slug: &str) -> Result<Option<DiarySource>, StorageError> {
    let mut all = read_all(root)?;
    Ok(all.remove(slug))
}

/// Set a project's sources, preserving other projects' entries.
pub fn set_diary_source(root: &Path, slug: &str, source: &DiarySource) -> Result<(), StorageError> {
    std::fs::create_dir_all(root.join(".dailyquick")).map_err(|e| StorageError::Io(e.to_string()))?;
    let mut all = read_all(root)?;
    all.insert(slug.to_string(), source.clone());
    let json = serde_json::to_string_pretty(&all).map_err(|e| StorageError::Parse(e.to_string()))?;
    std::fs::write(sources_path(root), json).map_err(|e| StorageError::Io(e.to_string()))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn missing_file_is_none() {
        let root = tempdir().unwrap();
        assert!(read_diary_source(root.path(), "duin").unwrap().is_none());
    }

    #[test]
    fn set_then_read_round_trips() {
        let root = tempdir().unwrap();
        let source = DiarySource { search_terms: vec!["Duin".into(), "RevOps Duin".into()] };
        set_diary_source(root.path(), "duin", &source).unwrap();
        assert_eq!(read_diary_source(root.path(), "duin").unwrap(), Some(source));
    }

    #[test]
    fn set_preserves_other_projects() {
        let root = tempdir().unwrap();
        set_diary_source(root.path(), "duin", &DiarySource { search_terms: vec!["Duin".into()] }).unwrap();
        set_diary_source(root.path(), "celonis", &DiarySource { search_terms: vec!["Celonis".into()] }).unwrap();
        assert_eq!(
            read_diary_source(root.path(), "duin").unwrap().unwrap().search_terms,
            vec!["Duin".to_string()]
        );
        assert_eq!(
            read_diary_source(root.path(), "celonis").unwrap().unwrap().search_terms,
            vec!["Celonis".to_string()]
        );
    }
}
