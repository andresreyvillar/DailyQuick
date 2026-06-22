import { describe, expect, it } from "vitest";

import { eventBlock, eventProjectBody } from "./event-markdown";
import type { CalendarEvent } from "./notes-api";

const meeting: CalendarEvent = {
  title: "Oakmond daily",
  start: "2026-06-22T09:00:00",
  end: "2026-06-22T09:15:00",
  all_day: false,
  calendar: "Work",
  calendar_id: "work",
};

describe("eventProjectBody", () => {
  it("seeds the body with details and Notas/Transcripción sections", () => {
    const body = eventProjectBody(meeting);
    expect(body).toContain("2026-06-22 · 09:00–09:15 · Work");
    expect(body).toContain("## Notas");
    expect(body).toContain("## Transcripción");
  });
});

describe("eventBlock", () => {
  it("produces a GFM blockquote with title + details", () => {
    const block = eventBlock(meeting);
    expect(block).toContain("> **Oakmond daily**");
    expect(block).toContain("> 2026-06-22 · 09:00–09:15 · Work");
  });

  it("handles all-day events", () => {
    const block = eventBlock({ ...meeting, all_day: true });
    expect(block).toContain("todo el día");
  });
});
