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

/** Delete a project's note for `key`/`slug`. Rejects with `NotFound` if it does not exist. */
export function deleteNote(key: string, slug: string): Promise<void> {
  return invoke<void>("delete_note", { key, slug });
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

/** A forecasted project for a day, mirrors the Rust `ForecastProject`. */
export const forecastProjectSchema = z.object({
  code: z.string(),
  name: z.string(),
  hours: z.number().optional(),
  color: z.string().nullable().optional(),
});

export type ForecastProject = z.infer<typeof forecastProjectSchema>;

/** Read the day's forecasted projects from the local cache. Missing cache/day → empty (no error). */
export async function listForecast(dayKey: string): Promise<ForecastProject[]> {
  return z.array(forecastProjectSchema).parse(await invoke("read_forecast", { key: dayKey }));
}

/** A diary event, mirrors the Rust `DiaryEvent`. */
export const diaryEventSchema = z.object({
  time: z.string(),
  source: z.string(),
  who: z.string(),
  text: z.string(),
});

/** A project's diary for a day, mirrors the Rust `DiaryEntry`. */
export const diaryEntrySchema = z.object({
  summary: z.string(),
  events: z.array(diaryEventSchema).default([]),
});

export type DiaryEntry = z.infer<typeof diaryEntrySchema>;

/** Read a project's diary for a day from the local cache; `null` when there is none. */
export async function readDiary(dayKey: string, slug: string): Promise<DiaryEntry | null> {
  const raw = await invoke("read_diary", { key: dayKey, slug });
  return raw ? diaryEntrySchema.parse(raw) : null;
}

/** A project's diary sources: terms to search in Mail + Slack. Mirrors the Rust `DiarySource`. */
export const diarySourceSchema = z.object({
  searchTerms: z.array(z.string()).default([]),
});

export type DiarySource = z.infer<typeof diarySourceSchema>;

/** Read a project's saved diary sources; empty defaults when none are set. */
export async function readDiarySource(slug: string): Promise<DiarySource> {
  const raw = await invoke("read_diary_source", { slug });
  return raw ? diarySourceSchema.parse(raw) : { searchTerms: [] };
}

/** Persist a project's diary sources (consumed by the /project-diary producer). */
export function setDiarySource(slug: string, source: DiarySource): Promise<void> {
  return invoke<void>("set_diary_source", { slug, source });
}
