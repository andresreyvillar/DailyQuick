//! Read-only access to the disposable per-day diary cache at `~/DailyQuick/.dailyquick/diary/<day>.json`.
//! The app never fetches Mail/Slack itself — a Claude Code producer writes this cache. Missing file or
//! missing project is "no diary", not an error.

use std::collections::HashMap;
use std::io::ErrorKind;
use std::path::Path;

use serde::{Deserialize, Serialize};

use super::date::validate_key;
use super::error::StorageError;

/// One diary event: when it happened, where it came from, who, and what.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DiaryEvent {
    pub time: String,
    pub source: String,
    pub who: String,
    pub text: String,
}

/// A project's diary for a day: an AI summary plus the underlying events.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct DiaryEntry {
    pub summary: String,
    #[serde(default)]
    pub events: Vec<DiaryEvent>,
}

/// The cache file shape for one day (keyed by project slug). Unknown fields are ignored.
#[derive(Debug, Deserialize)]
struct DiaryFile {
    #[serde(default)]
    projects: HashMap<String, DiaryEntry>,
}

fn diary_path(root: &Path, day: &str) -> std::path::PathBuf {
    root.join(".dailyquick").join("diary").join(format!("{day}.json"))
}

/// A project's diary for `day`. Missing file or missing project → `None`; malformed JSON → `Parse`.
pub fn read_diary(root: &Path, day: &str, slug: &str) -> Result<Option<DiaryEntry>, StorageError> {
    validate_key(day)?;
    let content = match std::fs::read_to_string(diary_path(root, day)) {
        Ok(content) => content,
        Err(e) if e.kind() == ErrorKind::NotFound => return Ok(None),
        Err(e) => return Err(StorageError::Io(e.to_string())),
    };
    let mut file: DiaryFile =
        serde_json::from_str(&content).map_err(|e| StorageError::Parse(e.to_string()))?;
    Ok(file.projects.remove(slug))
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn write_cache(root: &Path, day: &str, json: &str) {
        let dir = root.join(".dailyquick").join("diary");
        std::fs::create_dir_all(&dir).unwrap();
        std::fs::write(dir.join(format!("{day}.json")), json).unwrap();
    }

    const SAMPLE: &str = r#"{
      "projects": {
        "duin": {
          "summary": "Abelardo pidió X; Lide comentó Y en #duin.",
          "events": [
            { "time": "10:12", "source": "mail", "who": "Abelardo", "text": "pide X" },
            { "time": "12:40", "source": "slack", "who": "Lide", "text": "comenta Y" }
          ]
        }
      }
    }"#;

    #[test]
    fn returns_a_projects_entry() {
        let root = tempdir().unwrap();
        write_cache(root.path(), "2026-07-20", SAMPLE);
        let entry = read_diary(root.path(), "2026-07-20", "duin").unwrap().unwrap();
        assert_eq!(entry.events.len(), 2);
        assert!(entry.summary.contains("Abelardo"));
        assert_eq!(entry.events[0].source, "mail");
    }

    #[test]
    fn missing_file_is_none() {
        let root = tempdir().unwrap();
        assert!(read_diary(root.path(), "2026-07-20", "duin").unwrap().is_none());
    }

    #[test]
    fn missing_project_is_none() {
        let root = tempdir().unwrap();
        write_cache(root.path(), "2026-07-20", SAMPLE);
        assert!(read_diary(root.path(), "2026-07-20", "oakmond").unwrap().is_none());
    }

    #[test]
    fn malformed_is_a_parse_error() {
        let root = tempdir().unwrap();
        write_cache(root.path(), "2026-07-20", "{ not json");
        assert!(matches!(
            read_diary(root.path(), "2026-07-20", "duin"),
            Err(StorageError::Parse(_))
        ));
    }

    #[test]
    fn invalid_key_is_rejected() {
        let root = tempdir().unwrap();
        assert!(read_diary(root.path(), "../etc", "duin").is_err());
    }
}
