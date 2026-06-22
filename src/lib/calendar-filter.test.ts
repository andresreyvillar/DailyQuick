import { describe, expect, it } from "vitest";

import { visibleEvents } from "./calendar-filter";
import type { CalendarEvent } from "./notes-api";

function event(id: string, title: string): CalendarEvent {
  return { title, start: "", end: "", all_day: false, calendar: title, calendar_id: id };
}

describe("visibleEvents", () => {
  it("drops events whose calendar is hidden", () => {
    const events = [event("work", "Standup"), event("bday", "Cumpleaños")];
    expect(visibleEvents(events, ["bday"]).map((e) => e.title)).toEqual(["Standup"]);
  });

  it("returns all events when nothing is hidden", () => {
    const events = [event("work", "A"), event("bday", "B")];
    expect(visibleEvents(events, [])).toHaveLength(2);
  });
});
