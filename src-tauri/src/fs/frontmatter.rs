use serde::{Deserialize, Serialize};

use super::error::StorageError;

/// Sentinel order for notes without an explicit `order` (sorts last).
pub const ORDER_LAST: i64 = i64::MAX;

/// Note metadata stored as YAML frontmatter.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Frontmatter {
    pub title: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,
    pub order: i64,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub created: Option<String>,
}

/// A parsed note: its frontmatter plus the Markdown body (without a trailing newline).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Note {
    pub frontmatter: Frontmatter,
    pub body: String,
}

/// Parse note content into frontmatter + body.
/// Missing frontmatter falls back to defaults (title from `default_title`, no color,
/// `default_order`). Malformed frontmatter returns a typed `Parse` error.
pub fn parse(content: &str, default_title: &str, default_order: i64) -> Result<Note, StorageError> {
    let mut lines = content.lines();
    if lines.next() == Some("---") {
        let mut yaml: Vec<&str> = Vec::new();
        let mut closed = false;
        for line in lines.by_ref() {
            if line == "---" {
                closed = true;
                break;
            }
            yaml.push(line);
        }
        if !closed {
            return Err(StorageError::Parse(
                "unterminated frontmatter block".to_string(),
            ));
        }
        let frontmatter = parse_fields(&yaml, default_title, default_order)?;
        let body: Vec<&str> = lines.collect();
        Ok(Note {
            frontmatter,
            body: body.join("\n"),
        })
    } else {
        Ok(Note {
            frontmatter: Frontmatter {
                title: default_title.to_string(),
                color: None,
                order: default_order,
                created: None,
            },
            body: content.to_string(),
        })
    }
}

/// Serialize a note to `---`-fenced frontmatter (fixed key order) + body.
pub fn serialize(note: &Note) -> String {
    let mut out = String::from("---\n");
    out.push_str(&format!("title: {}\n", quote(&note.frontmatter.title)));
    if let Some(color) = &note.frontmatter.color {
        out.push_str(&format!("color: {}\n", quote(color)));
    }
    out.push_str(&format!("order: {}\n", note.frontmatter.order));
    if let Some(created) = &note.frontmatter.created {
        out.push_str(&format!("created: {}\n", quote(created)));
    }
    out.push_str("---\n");
    if !note.body.is_empty() {
        out.push_str(&note.body);
        if !note.body.ends_with('\n') {
            out.push('\n');
        }
    }
    out
}

fn parse_fields(
    lines: &[&str],
    default_title: &str,
    default_order: i64,
) -> Result<Frontmatter, StorageError> {
    let mut title: Option<String> = None;
    let mut color: Option<String> = None;
    let mut order: Option<i64> = None;
    let mut created: Option<String> = None;

    for line in lines {
        if line.trim().is_empty() {
            continue;
        }
        let (key, value) = line
            .split_once(':')
            .ok_or_else(|| StorageError::Parse(format!("invalid frontmatter line: {line}")))?;
        let value = unquote(value.trim());
        match key.trim() {
            "title" => title = Some(value),
            "color" => color = Some(value),
            "order" => {
                order = Some(
                    value
                        .parse::<i64>()
                        .map_err(|_| StorageError::Parse(format!("invalid order: {value}")))?,
                )
            }
            "created" => created = Some(value),
            _ => {}
        }
    }

    Ok(Frontmatter {
        title: title.unwrap_or_else(|| default_title.to_string()),
        color,
        order: order.unwrap_or(default_order),
        created,
    })
}

fn unquote(value: &str) -> String {
    if value.len() >= 2 && value.starts_with('"') && value.ends_with('"') {
        value[1..value.len() - 1].replace("\\\"", "\"")
    } else {
        value.to_string()
    }
}

fn needs_quoting(value: &str) -> bool {
    value.is_empty()
        || value.starts_with(' ')
        || value.ends_with(' ')
        || value.contains(':')
        || value.contains('#')
        || value.contains('"')
}

fn quote(value: &str) -> String {
    if needs_quoting(value) {
        format!("\"{}\"", value.replace('"', "\\\""))
    } else {
        value.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> Note {
        Note {
            frontmatter: Frontmatter {
                title: "Oakmond".to_string(),
                color: Some("#E54D2E".to_string()),
                order: 1,
                created: Some("2026-06-21".to_string()),
            },
            // Canonical body carries no trailing newline.
            body: "# Tareas\n- [ ] algo".to_string(),
        }
    }

    #[test]
    fn lossless_round_trip() {
        let note = sample();
        let parsed = parse(&serialize(&note), "fallback", ORDER_LAST).unwrap();
        assert_eq!(parsed, note);
    }

    #[test]
    fn quotes_values_with_special_chars() {
        let serialized = serialize(&sample());
        assert!(serialized.contains("color: \"#E54D2E\""));
        assert!(serialized.contains("order: 1\n"));
    }

    #[test]
    fn missing_frontmatter_uses_defaults() {
        let parsed = parse("just a body\n", "oakmond", ORDER_LAST).unwrap();
        assert_eq!(parsed.frontmatter.title, "oakmond");
        assert_eq!(parsed.frontmatter.color, None);
        assert_eq!(parsed.frontmatter.order, ORDER_LAST);
        assert_eq!(parsed.body, "just a body\n");
    }

    #[test]
    fn malformed_frontmatter_is_reported() {
        let content = "---\nthis line has no colon\n---\nbody\n";
        assert!(matches!(
            parse(content, "x", 0),
            Err(StorageError::Parse(_))
        ));
    }
}
