use std::path::PathBuf;

use crate::fs::frontmatter::Note;
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
