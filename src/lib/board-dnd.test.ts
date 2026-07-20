import { describe, expect, it } from "vitest";

import { parseDrag, serializeDrag, type DragPayload } from "./board-dnd";

describe("board-dnd", () => {
  it("round-trips a forecast payload", () => {
    const p: DragPayload = { kind: "forecast", project: { code: "DUI2601", name: "Duin" } };
    expect(parseDrag(serializeDrag(p))).toEqual(p);
  });

  it("round-trips an event payload", () => {
    const p: DragPayload = {
      kind: "event",
      event: { title: "Daily", start: "2026-07-20T09:00:00", end: "2026-07-20T09:15:00", all_day: false, calendar: "Work", calendar_id: "work" },
    };
    expect(parseDrag(serializeDrag(p))).toEqual(p);
  });

  it("round-trips a recent payload", () => {
    const p: DragPayload = { kind: "recent", title: "Duin", color: "#3A9D6B" };
    expect(parseDrag(serializeDrag(p))).toEqual(p);
  });

  it("returns null for empty, garbage, or unknown-kind data", () => {
    expect(parseDrag("")).toBeNull();
    expect(parseDrag("not json")).toBeNull();
    expect(parseDrag(JSON.stringify({ kind: "other" }))).toBeNull();
  });
});
