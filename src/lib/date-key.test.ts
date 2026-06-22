import { describe, expect, it } from "vitest";

import { addDays, parseDateKey, toDateKey, todayKey } from "./date-key";

describe("date-key", () => {
  it("formats a date as YYYY-MM-DD", () => {
    // Month is 0-indexed: 5 → June.
    expect(toDateKey(new Date(2026, 5, 21))).toBe("2026-06-21");
  });

  it("zero-pads month and day", () => {
    expect(toDateKey(new Date(2026, 0, 3))).toBe("2026-01-03");
  });

  it("todayKey matches the canonical format", () => {
    expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("parseDateKey", () => {
  it("round-trips with toDateKey", () => {
    expect(toDateKey(parseDateKey("2026-06-20"))).toBe("2026-06-20");
  });
});

describe("addDays", () => {
  it("rolls over forward across a month", () => {
    expect(addDays("2026-06-30", 1)).toBe("2026-07-01");
  });

  it("rolls over backward across a month", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("rolls over the year", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("steps within a month", () => {
    expect(addDays("2026-06-21", -1)).toBe("2026-06-20");
  });
});
