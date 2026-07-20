import type { CalendarEvent, ForecastProject } from "./notes-api";

/** MIME key under which a dragged context chip stores its payload. */
export const DND_MIME = "application/x-dailyquick";

/** What a dragged context chip carries, so the board knows which project to create on drop. */
export type DragPayload =
  | { kind: "forecast"; project: ForecastProject }
  | { kind: "event"; event: CalendarEvent }
  | { kind: "recent"; title: string; color: string | null };

export function serializeDrag(payload: DragPayload): string {
  return JSON.stringify(payload);
}

/** Parse a drag payload; returns null for empty, invalid, or unknown-kind data. */
export function parseDrag(data: string): DragPayload | null {
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as DragPayload;
    if (parsed && (parsed.kind === "forecast" || parsed.kind === "event" || parsed.kind === "recent")) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
