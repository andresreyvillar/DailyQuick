import { describe, expect, it } from "vitest";

import { ACCENTS, accentForKey } from "./accent-palette";

const PALETTE = ACCENTS.map((a) => a.hex);

describe("accent-palette", () => {
  it("accentForKey is deterministic and always returns a palette hex", () => {
    expect(accentForKey("work")).toBe(accentForKey("work"));
    expect(PALETTE).toContain(accentForKey("work"));
    expect(PALETTE).toContain(accentForKey("personal-123"));
    expect(PALETTE).toContain(accentForKey(""));
  });
});
