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
