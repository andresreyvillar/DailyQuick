## REMOVED Requirements

### Requirement: Seed an empty note from a template
**Reason**: The empty-project template prompt is unwanted — projects should open directly into a blank
editor.
**Migration**: None. The prompt, `BASIC_TEMPLATE`, and the store's `applyTemplate` are removed; existing
notes are unaffected (they are plain Markdown on disk). Users type or paste their own structure.
