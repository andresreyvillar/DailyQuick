import type { CalendarEvent } from "./notes-api";

/** Keep only events whose calendar is not in the hidden set. */
export function visibleEvents(events: CalendarEvent[], hidden: string[]): CalendarEvent[] {
  const hiddenSet = new Set(hidden);
  return events.filter((event) => !hiddenSet.has(event.calendar_id));
}
