import { describe, expect, it } from "vitest";

import { toDateKey, todayKey } from "./date-key";

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
