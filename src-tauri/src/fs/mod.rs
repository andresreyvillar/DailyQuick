//! Filesystem contract for DailyQuick: day folders, per-project Markdown files,
//! and frontmatter parse/serialize. The filesystem is the single source of truth.

pub mod date;
pub mod error;
pub mod frontmatter;
pub mod path;
pub mod slug;
pub mod store;

pub use error::StorageError;
