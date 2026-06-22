import { invoke } from "@tauri-apps/api/core";
import { z } from "zod";

/** Note metadata, mirrors the Rust `Frontmatter`. */
export const frontmatterSchema = z.object({
  title: z.string().min(1),
  color: z.string().nullable().optional(),
  order: z.number().int(),
  created: z.string().nullable().optional(),
});

/** A note: frontmatter + Markdown body. */
export const noteSchema = z.object({
  frontmatter: frontmatterSchema,
  body: z.string(),
});

/** Listing entry returned by `list_day` (no body). */
export const noteSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  color: z.string().nullable().optional(),
  order: z.number().int(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Note = z.infer<typeof noteSchema>;
export type NoteSummary = z.infer<typeof noteSummarySchema>;

/** Create the day folder for `key` (idempotent). */
export function ensureDay(key: string): Promise<void> {
  return invoke<void>("ensure_day", { key });
}

/** Write a project note for `key`/`slug`, validating the payload first. */
export function writeNote(key: string, slug: string, note: Note): Promise<void> {
  return invoke<void>("write_note", { key, slug, note: noteSchema.parse(note) });
}

/** Read a project note; rejects if the backend returns an unexpected shape. */
export async function readNote(key: string, slug: string): Promise<Note> {
  return noteSchema.parse(await invoke("read_note", { key, slug }));
}

/** List a day's notes, ordered by the backend. */
export async function listDay(key: string): Promise<NoteSummary[]> {
  return z.array(noteSummarySchema).parse(await invoke("list_day", { key }));
}

/** Create a project for `key` (title + color); returns its summary. */
export async function createProject(
  key: string,
  title: string,
  color: string,
): Promise<NoteSummary> {
  if (!title.trim()) throw new Error("title is required");
  return noteSummarySchema.parse(await invoke("create_project", { key, title, color }));
}

/** A single search result, mirrors the Rust `SearchHit`. */
export const searchHitSchema = z.object({
  day_key: z.string(),
  slug: z.string(),
  title: z.string(),
  snippet: z.string(),
});

export type SearchHit = z.infer<typeof searchHitSchema>;

/** Search all notes for `query`; a blank query returns no results without calling the backend. */
export async function search(query: string): Promise<SearchHit[]> {
  if (!query.trim()) return [];
  return z.array(searchHitSchema).parse(await invoke("search_notes", { query }));
}

/** A read-only calendar event, mirrors the Rust `CalendarEvent`. */
export const calendarEventSchema = z.object({
  title: z.string(),
  start: z.string(),
  end: z.string(),
  all_day: z.boolean(),
  calendar: z.string(),
  calendar_id: z.string(),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

/** List the day's Apple Calendar events (read-only). Rejects if access is denied. */
export async function listEvents(dayKey: string): Promise<CalendarEvent[]> {
  return z.array(calendarEventSchema).parse(await invoke("list_events", { key: dayKey }));
}

/** A calendar the user can toggle, mirrors the Rust `CalendarInfo`. */
export const calendarInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type CalendarInfo = z.infer<typeof calendarInfoSchema>;

/** List the user's Apple event calendars (read-only). */
export async function listCalendars(): Promise<CalendarInfo[]> {
  return z.array(calendarInfoSchema).parse(await invoke("list_calendars"));
}
