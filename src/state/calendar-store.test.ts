import { beforeEach, describe, expect, it } from "vitest";

import { useCalendarStore } from "./calendar-store";

beforeEach(() => {
  localStorage.clear();
  useCalendarStore.setState({ hidden: [] });
});

describe("calendar store", () => {
  it("defaults to nothing hidden", () => {
    expect(useCalendarStore.getState().hidden).toEqual([]);
  });

  it("toggles a calendar id and persists it", () => {
    useCalendarStore.getState().toggle("bday");
    expect(useCalendarStore.getState().hidden).toEqual(["bday"]);
    expect(JSON.parse(localStorage.getItem("dailyquick:hidden-calendars") ?? "[]")).toEqual(["bday"]);

    useCalendarStore.getState().toggle("bday");
    expect(useCalendarStore.getState().hidden).toEqual([]);
  });
});
