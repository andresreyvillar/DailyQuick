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
