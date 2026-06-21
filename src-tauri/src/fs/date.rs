use chrono::NaiveDate;

use super::error::StorageError;

/// Canonical day key for a given date: `YYYY-MM-DD`.
pub fn day_key(date: NaiveDate) -> String {
    date.format("%Y-%m-%d").to_string()
}

/// Validate that `key` is a real, zero-padded `YYYY-MM-DD` date.
pub fn validate_key(key: &str) -> Result<(), StorageError> {
    match NaiveDate::parse_from_str(key, "%Y-%m-%d") {
        Ok(date) if day_key(date) == key => Ok(()),
        _ => Err(StorageError::InvalidKey(key.to_string())),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn formats_day_key() {
        let date = NaiveDate::from_ymd_opt(2026, 6, 21).unwrap();
        assert_eq!(day_key(date), "2026-06-21");
    }

    #[test]
    fn accepts_a_canonical_key() {
        assert!(validate_key("2026-06-21").is_ok());
    }

    #[test]
    fn rejects_non_padded_or_wrong_order() {
        assert!(matches!(
            validate_key("2026-6-1"),
            Err(StorageError::InvalidKey(_))
        ));
        assert!(matches!(
            validate_key("21-06-2026"),
            Err(StorageError::InvalidKey(_))
        ));
    }
}
