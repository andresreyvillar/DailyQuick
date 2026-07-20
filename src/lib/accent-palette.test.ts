import { describe, expect, it } from "vitest";

import { ACCENTS, accentForKey, nextAccent } from "./accent-palette";

const PALETTE = ACCENTS.map((a) => a.hex);

describe("accent-palette", () => {
  it("accentForKey is deterministic and always returns a palette hex", () => {
    expect(accentForKey("work")).toBe(accentForKey("work"));
    expect(PALETTE).toContain(accentForKey("work"));
    expect(PALETTE).toContain(accentForKey("personal-123"));
    expect(PALETTE).toContain(accentForKey(""));
  });

  describe("nextAccent", () => {
    it("returns the first accent when none are used", () => {
      expect(nextAccent([])).toBe(ACCENTS[0].hex);
    });

    it("returns the first accent not already in use", () => {
      expect(nextAccent([ACCENTS[0].hex, ACCENTS[1].hex])).toBe(ACCENTS[2].hex);
    });

    it("matches accents case-insensitively", () => {
      expect(nextAccent(["#4f7fd6"])).toBe(ACCENTS[1].hex);
    });

    it("ignores non-palette colors (they consume no slot)", () => {
      expect(nextAccent(["#E54D2E"])).toBe(ACCENTS[0].hex);
    });

    it("falls back to a palette hex when all six are used", () => {
      expect(PALETTE).toContain(nextAccent(PALETTE));
    });
  });
});
