//! Filesystem contract for DailyQuick: day folders, per-project Markdown files,
//! and frontmatter parse/serialize. The filesystem is the single source of truth.

pub mod date;
pub mod diary;
pub mod diary_sources;
pub mod error;
pub mod forecast;
pub mod frontmatter;
pub mod path;
pub mod search;
pub mod slug;
pub mod store;

pub use error::StorageError;
