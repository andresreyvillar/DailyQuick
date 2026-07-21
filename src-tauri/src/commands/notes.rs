use std::path::PathBuf;

use crate::fs::diary::{self, DiaryEntry};
use crate::fs::diary_sources::{self, DiarySource};
use crate::fs::forecast::{self, ForecastProject};
use crate::fs::frontmatter::Note;
use crate::fs::search::{self, SearchHit};
use crate::fs::store::{self, NoteSummary};
use crate::fs::{path, StorageError};

fn root() -> Result<PathBuf, StorageError> {
    path::default_root()
}

#[tauri::command]
pub fn ensure_day(key: String) -> Result<(), StorageError> {
    store::ensure_day(&root()?, &key)?;
    Ok(())
}

#[tauri::command]
pub fn write_note(key: String, slug: String, note: Note) -> Result<(), StorageError> {
    store::write_note(&root()?, &key, &slug, &note)
}

#[tauri::command]
pub fn read_note(key: String, slug: String) -> Result<Note, StorageError> {
    store::read_note(&root()?, &key, &slug)
}

#[tauri::command]
pub fn list_day(key: String) -> Result<Vec<NoteSummary>, StorageError> {
    store::list_day(&root()?, &key)
}

#[tauri::command]
pub fn create_project(
    key: String,
    title: String,
    color: String,
) -> Result<NoteSummary, StorageError> {
    store::create_project(&root()?, &key, &title, &color)
}

#[tauri::command]
pub fn delete_note(key: String, slug: String) -> Result<(), StorageError> {
    store::delete_note(&root()?, &key, &slug)
}

#[tauri::command]
pub fn search_notes(query: String) -> Result<Vec<SearchHit>, StorageError> {
    search::search(&root()?, &query)
}

#[tauri::command]
pub fn list_events(key: String) -> Result<Vec<crate::calendar::CalendarEvent>, StorageError> {
    crate::calendar::list_events(&key)
}

#[tauri::command]
pub fn list_calendars() -> Result<Vec<crate::calendar::CalendarInfo>, StorageError> {
    crate::calendar::list_calendars()
}

#[tauri::command]
pub fn read_forecast(key: String) -> Result<Vec<ForecastProject>, StorageError> {
    forecast::read_forecast(&root()?, &key)
}

#[tauri::command]
pub fn read_diary(key: String, slug: String) -> Result<Option<DiaryEntry>, StorageError> {
    diary::read_diary(&root()?, &key, &slug)
}

#[tauri::command]
pub fn read_diary_source(slug: String) -> Result<Option<DiarySource>, StorageError> {
    diary_sources::read_diary_source(&root()?, &slug)
}

#[tauri::command]
pub fn set_diary_source(slug: String, source: DiarySource) -> Result<(), StorageError> {
    diary_sources::set_diary_source(&root()?, &slug, &source)
}

/// Status of the external accesses the diary depends on (for the Ajustes panel).
#[derive(serde::Serialize)]
pub struct AccessStatus {
    /// `claude --version`, or `None` if the CLI is not found.
    claude: Option<String>,
    /// Slack MCP: "connected" | "needs-auth" | "not-configured" | "unknown".
    slack: String,
}

#[tauri::command]
pub fn access_status() -> AccessStatus {
    let claude = std::process::Command::new("claude")
        .arg("--version")
        .output()
        .ok()
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string());

    let slack = std::process::Command::new("claude")
        .args(["mcp", "list"])
        .output()
        .ok()
        .map(|o| {
            let text = String::from_utf8_lossy(&o.stdout).to_lowercase();
            match text.lines().find(|l| l.contains("slack")) {
                None => "not-configured",
                Some(l) if l.contains("needs authentication") => "needs-auth",
                Some(l) if l.contains("connected") => "connected",
                Some(_) => "unknown",
            }
            .to_string()
        })
        .unwrap_or_else(|| "unknown".to_string());

    AccessStatus { claude, slack }
}

/// Test (and, on first use, trigger the macOS permission for) Apple Mail access via AppleScript.
#[tauri::command]
pub fn test_mail_access() -> Result<String, StorageError> {
    let output = std::process::Command::new("osascript")
        .arg("-e")
        .arg("tell application \"Mail\" to get the count of accounts")
        .output()
        .map_err(|e| StorageError::Io(format!("no se pudo ejecutar osascript: {e}")))?;
    if output.status.success() {
        let count = String::from_utf8_lossy(&output.stdout).trim().to_string();
        Ok(format!("Acceso concedido · {count} cuentas de correo"))
    } else {
        Err(StorageError::Io(format!(
            "acceso a Mail denegado o no disponible: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        )))
    }
}

/// Trigger a diary sync by running the Claude Code `project-diary` producer headless (Slack + Apple Mail
/// + AI live in Claude Code, not the app). Best-effort: depends on the local `claude` CLI + MCP/Mail setup.
#[tauri::command]
pub fn sync_diary(key: String) -> Result<String, StorageError> {
    crate::fs::date::validate_key(&key)?;
    let home = dirs::home_dir().ok_or_else(|| StorageError::Io("no home directory".to_string()))?;
    let prompt = format!(
        "Sincroniza el diario de DailyQuick para el día {key}: ejecuta el skill project-diary \
         (busca en Apple Mail y Slack los términos de ~/DailyQuick/.dailyquick/diary-sources.json, \
         por proyecto) y escribe ~/DailyQuick/.dailyquick/diary/{key}.json."
    );
    let output = std::process::Command::new("claude")
        .arg("-p")
        .arg(&prompt)
        .arg("--permission-mode")
        .arg("acceptEdits")
        .current_dir(&home)
        .output()
        .map_err(|e| StorageError::Io(format!("no se pudo ejecutar «claude»: {e}")))?;
    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).chars().take(400).collect())
    } else {
        Err(StorageError::Io(format!(
            "la sincronización falló: {}",
            String::from_utf8_lossy(&output.stderr).chars().take(300).collect::<String>()
        )))
    }
}
