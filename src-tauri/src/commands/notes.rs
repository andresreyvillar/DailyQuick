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

/// Reveal a project's note file in the macOS Finder (file selected). Read-only: resolves + validates
/// the path and reveals it via the opener plugin; `NotFound` if the note does not exist.
#[tauri::command]
pub fn reveal_note(app: tauri::AppHandle, key: String, slug: String) -> Result<(), StorageError> {
    use tauri_plugin_opener::OpenerExt;
    let target = store::note_path_for_reveal(&root()?, &key, &slug)?;
    app.opener()
        .reveal_item_in_dir(&target)
        .map_err(|e| StorageError::Io(format!("could not reveal in Finder: {e}")))
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
    let claude = crate::claude_cli::command()
        .and_then(|mut c| c.arg("--version").output().ok())
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string());

    let slack = crate::claude_cli::command()
        .and_then(|mut c| c.args(["mcp", "list"]).output().ok())
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

#[derive(Clone, serde::Serialize)]
struct SyncProgress {
    slug: String,
    message: String,
}

#[derive(Clone, serde::Serialize)]
struct SyncDone {
    slug: String,
    ok: bool,
}

/// Turn one `stream-json` line from `claude` into a short human-readable progress message (or None to skip).
fn summarize_stream_line(line: &str) -> Option<String> {
    let value: serde_json::Value = serde_json::from_str(line).ok()?;
    match value.get("type")?.as_str()? {
        "assistant" => {
            let content = value.get("message")?.get("content")?.as_array()?;
            let mut parts = Vec::new();
            for block in content {
                match block.get("type").and_then(|t| t.as_str()) {
                    Some("text") => {
                        let text = block.get("text").and_then(|t| t.as_str()).unwrap_or("").trim();
                        if !text.is_empty() {
                            parts.push(text.chars().take(240).collect::<String>());
                        }
                    }
                    Some("tool_use") => {
                        if let Some(name) = block.get("name").and_then(|n| n.as_str()) {
                            parts.push(format!("→ {name}"));
                        }
                    }
                    _ => {}
                }
            }
            (!parts.is_empty()).then(|| parts.join(" "))
        }
        "result" => value
            .get("result")
            .and_then(|r| r.as_str())
            .map(|r| r.chars().take(240).collect()),
        _ => None,
    }
}

/// Sync ONE project's diary for `key` (today) by running the Claude Code `project-diary` producer headless
/// in streaming mode, emitting each step as a `diary-sync-progress` event and a `diary-sync-done` at the end.
/// Returns immediately (non-blocking); the work runs on a background thread. Best-effort: depends on the
/// local `claude` CLI + MCP/Mail setup (Slack OAuth + AI live in Claude Code, not the app).
#[tauri::command]
pub fn sync_project_diary(
    app: tauri::AppHandle,
    key: String,
    slug: String,
) -> Result<(), StorageError> {
    use tauri::Emitter;

    crate::fs::date::validate_key(&key)?;
    let home = dirs::home_dir().ok_or_else(|| StorageError::Io("no home directory".to_string()))?;
    let prompt = format!(
        "Sincroniza SOLO el proyecto «{slug}» del diario de DailyQuick para HOY ({key}): ejecuta el skill \
         project-diary limitado a ese proyecto (usa sus searchTerms de ~/DailyQuick/.dailyquick/diary-sources.json, \
         o su título si no está), busca en Apple Mail y Slack, narra brevemente qué vas encontrando, y escribe \
         su entrada en ~/DailyQuick/.dailyquick/diary/{key}.json."
    );

    let mut cmd = crate::claude_cli::command()
        .ok_or_else(|| StorageError::Io("no se encontró el binario «claude»".to_string()))?;
    cmd.arg("-p")
        .arg(&prompt)
        .args(["--output-format", "stream-json", "--verbose"])
        .args(["--permission-mode", "acceptEdits"])
        .current_dir(&home)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null());
    let mut child = cmd
        .spawn()
        .map_err(|e| StorageError::Io(format!("no se pudo ejecutar «claude»: {e}")))?;

    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| StorageError::Io("no se pudo leer la salida de «claude»".to_string()))?;

    std::thread::spawn(move || {
        use std::io::BufRead;
        let reader = std::io::BufReader::new(stdout);
        for line in reader.lines().map_while(Result::ok) {
            if let Some(message) = summarize_stream_line(&line) {
                let _ = app.emit("diary-sync-progress", SyncProgress { slug: slug.clone(), message });
            }
        }
        let ok = child.wait().map(|status| status.success()).unwrap_or(false);
        let _ = app.emit("diary-sync-done", SyncDone { slug, ok });
    });

    Ok(())
}
