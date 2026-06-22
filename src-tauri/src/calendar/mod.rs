//! Read-only Apple Calendar (EventKit) access for the selected day.

use chrono::{Days, NaiveDate, NaiveDateTime};
use serde::Serialize;

use crate::fs::StorageError;

#[cfg(target_os = "macos")]
mod eventkit;

/// A read-only calendar event for a day.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct CalendarEvent {
    pub title: String,
    pub start: String,
    pub end: String,
    pub all_day: bool,
    pub calendar: String,
}

/// Local day bounds `[00:00, next-day 00:00)` for a `YYYY-MM-DD` key.
pub fn day_bounds(key: &str) -> Result<(NaiveDateTime, NaiveDateTime), StorageError> {
    let date = NaiveDate::parse_from_str(key, "%Y-%m-%d")
        .map_err(|_| StorageError::InvalidKey(key.to_string()))?;
    let start = date.and_hms_opt(0, 0, 0).unwrap();
    let end = (date + Days::new(1)).and_hms_opt(0, 0, 0).unwrap();
    Ok((start, end))
}

/// List the selected day's events from Apple Calendar (read-only), ordered by start time.
pub fn list_events(key: &str) -> Result<Vec<CalendarEvent>, StorageError> {
    let (start, end) = day_bounds(key)?;
    #[cfg(target_os = "macos")]
    {
        eventkit::fetch_events(start, end)
    }
    #[cfg(not(target_os = "macos"))]
    {
        let _ = (start, end);
        Err(StorageError::Calendar(
            "calendar is only available on macOS".to_string(),
        ))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn computes_day_bounds() {
        let (start, end) = day_bounds("2026-06-22").unwrap();
        assert_eq!(
            start,
            NaiveDate::from_ymd_opt(2026, 6, 22).unwrap().and_hms_opt(0, 0, 0).unwrap()
        );
        assert_eq!(
            end,
            NaiveDate::from_ymd_opt(2026, 6, 23).unwrap().and_hms_opt(0, 0, 0).unwrap()
        );
    }

    #[test]
    fn rejects_a_bad_key() {
        assert!(matches!(day_bounds("nope"), Err(StorageError::InvalidKey(_))));
    }
}
