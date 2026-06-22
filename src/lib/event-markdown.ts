import type { CalendarEvent } from "./notes-api";

// Read date/time straight from the local ISO string the backend emits ("YYYY-MM-DDTHH:MM:SS"),
// so the output is deterministic (no timezone/locale drift).
function isoDate(iso: string): string {
  return iso.slice(0, 10);
}

function isoTime(iso: string): string {
  return iso.slice(11, 16);
}

function detailLine(event: CalendarEvent): string {
  const when = event.all_day
    ? `${isoDate(event.start)} · todo el día`
    : `${isoDate(event.start)} · ${isoTime(event.start)}–${isoTime(event.end)}`;
  return `${when} · ${event.calendar}`;
}

/** Seeded Markdown body for a project created from an event. */
export function eventProjectBody(event: CalendarEvent): string {
  return [`🗓 ${detailLine(event)}`, "", "## Notas", "", "## Transcripción", ""].join("\n");
}

/** A "post-it" Markdown block for an event, to append to an existing project's note. */
export function eventBlock(event: CalendarEvent): string {
  return [`> **${event.title}**`, `> ${detailLine(event)}`, ""].join("\n");
}
