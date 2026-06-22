use serde::Serialize;

/// Typed storage errors, serialized to the renderer as `{ kind, message }`.
#[derive(Debug, thiserror::Error, Serialize)]
#[serde(tag = "kind", content = "message")]
pub enum StorageError {
    #[error("invalid date key: {0}")]
    InvalidKey(String),
    #[error("invalid project slug: {0}")]
    InvalidSlug(String),
    #[error("note not found")]
    NotFound,
    #[error("project already exists: {0}")]
    AlreadyExists(String),
    #[error("frontmatter parse error: {0}")]
    Parse(String),
    #[error("calendar error: {0}")]
    Calendar(String),
    #[error("io error: {0}")]
    Io(String),
}
