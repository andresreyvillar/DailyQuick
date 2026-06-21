use super::error::StorageError;

/// Derive a filesystem-safe slug (`[a-z0-9-]+`) from a project title.
// Part of the day-storage contract (spec: "slug is derived for the filename");
// wired into the UI by the upcoming `project-management` slice.
#[allow(dead_code)]
pub fn slugify(title: &str) -> Result<String, StorageError> {
    let mut slug = String::new();
    let mut pending_dash = false;
    for ch in title.chars() {
        if ch.is_ascii_alphanumeric() {
            if pending_dash && !slug.is_empty() {
                slug.push('-');
            }
            pending_dash = false;
            slug.push(ch.to_ascii_lowercase());
        } else {
            pending_dash = true;
        }
    }
    if slug.is_empty() {
        return Err(StorageError::InvalidSlug(title.to_string()));
    }
    Ok(slug)
}

/// Validate that `slug` matches `^[a-z0-9-]+$` (no path separators, dots, or uppercase).
pub fn validate_slug(slug: &str) -> Result<(), StorageError> {
    if !slug.is_empty() && slug.chars().all(|c| matches!(c, 'a'..='z' | '0'..='9' | '-')) {
        Ok(())
    } else {
        Err(StorageError::InvalidSlug(slug.to_string()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn slugifies_a_title() {
        let slug = slugify("My Project!").unwrap();
        assert_eq!(slug, "my-project");
        assert!(validate_slug(&slug).is_ok());
    }

    #[test]
    fn rejects_empty_or_symbol_only_title() {
        assert!(matches!(slugify(""), Err(StorageError::InvalidSlug(_))));
        assert!(matches!(slugify("***"), Err(StorageError::InvalidSlug(_))));
    }

    #[test]
    fn validates_charset() {
        assert!(validate_slug("oakmond").is_ok());
        assert!(matches!(
            validate_slug("../etc"),
            Err(StorageError::InvalidSlug(_))
        ));
        assert!(matches!(
            validate_slug("Bad Slug"),
            Err(StorageError::InvalidSlug(_))
        ));
    }
}
