//! Read-only access to the disposable forecast cache at `~/DailyQuick/.dailyquick/forecast.json`.
//! The app never fetches forecast data itself — a Claude Code step (with the Forecast MCP
//! authenticated) writes this cache. A missing file or missing day is an empty forecast, not an error.

use std::collections::HashMap;
use std::io::ErrorKind;
use std::path::Path;

use serde::{Deserialize, Serialize};

use super::date::validate_key;
use super::error::StorageError;

/// One forecast entry for a day: a project code and display name. Hours are optional (the app shows
/// only the name; the source rolls up weekly, so a per-day figure would be misleading).
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ForecastProject {
    pub code: String,
    pub name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub hours: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
}

/// The cache file shape. Unknown top-level fields (e.g. `generatedAt`, `userEmail`) are ignored.
#[derive(Debug, Deserialize)]
struct ForecastFile {
    #[serde(default)]
    days: HashMap<String, Vec<ForecastProject>>,
}

/// The forecast cache path under `root`.
fn forecast_path(root: &Path) -> std::path::PathBuf {
    root.join(".dailyquick").join("forecast.json")
}

/// Forecast entries for `key`. Missing file or missing day → empty; malformed JSON → `Parse`.
pub fn read_forecast(root: &Path, key: &str) -> Result<Vec<ForecastProject>, StorageError> {
    validate_key(key)?;
    let content = match std::fs::read_to_string(forecast_path(root)) {
        Ok(content) => content,
        Err(e) if e.kind() == ErrorKind::NotFound => return Ok(Vec::new()),
        Err(e) => return Err(StorageError::Io(e.to_string())),
    };
    let file: ForecastFile =
        serde_json::from_str(&content).map_err(|e| StorageError::Parse(e.to_string()))?;
    Ok(file.days.get(key).cloned().unwrap_or_default())
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    fn write_cache(root: &Path, json: &str) {
        std::fs::create_dir_all(root.join(".dailyquick")).unwrap();
        std::fs::write(forecast_path(root), json).unwrap();
    }

    const SAMPLE: &str = r#"{
      "generatedAt": "2026-07-20T08:00:00Z",
      "userEmail": "andres.rey@clouddistrict.com",
      "days": {
        "2026-07-20": [
          { "code": "ILA2404", "name": "Oakmond", "hours": 6.5 },
          { "code": "HAN2602", "name": "Celonis", "hours": 1.0 }
        ]
      }
    }"#;

    #[test]
    fn returns_the_days_projects() {
        let root = tempdir().unwrap();
        write_cache(root.path(), SAMPLE);
        let projects = read_forecast(root.path(), "2026-07-20").unwrap();
        assert_eq!(projects.len(), 2);
        assert_eq!(projects[0].name, "Oakmond");
        assert_eq!(projects[0].hours, Some(6.5));
        assert_eq!(projects[1].code, "HAN2602");
    }

    #[test]
    fn entries_without_hours_parse() {
        let root = tempdir().unwrap();
        write_cache(
            root.path(),
            r#"{ "days": { "2026-07-20": [ { "code": "DUI2601", "name": "Duin" } ] } }"#,
        );
        let projects = read_forecast(root.path(), "2026-07-20").unwrap();
        assert_eq!(projects.len(), 1);
        assert_eq!(projects[0].name, "Duin");
        assert_eq!(projects[0].hours, None);
    }

    #[test]
    fn missing_file_is_empty() {
        let root = tempdir().unwrap();
        assert!(read_forecast(root.path(), "2026-07-20").unwrap().is_empty());
    }

    #[test]
    fn missing_day_is_empty() {
        let root = tempdir().unwrap();
        write_cache(root.path(), SAMPLE);
        assert!(read_forecast(root.path(), "2026-07-21").unwrap().is_empty());
    }

    #[test]
    fn malformed_json_is_a_parse_error() {
        let root = tempdir().unwrap();
        write_cache(root.path(), "{ not json");
        assert!(matches!(
            read_forecast(root.path(), "2026-07-20"),
            Err(StorageError::Parse(_))
        ));
    }

    #[test]
    fn invalid_key_is_rejected() {
        let root = tempdir().unwrap();
        write_cache(root.path(), SAMPLE);
        assert!(read_forecast(root.path(), "../etc").is_err());
    }
}
