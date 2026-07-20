import { describe, expect, it } from "vitest";

import type { NoteSummary } from "./notes-api";
import { recommendedFromRecent } from "./recommend";

const s = (slug: string, title: string, color: string | null = null): NoteSummary => ({
  slug,
  title,
  color,
  order: 0,
});

describe("recommendedFromRecent", () => {
  it("recommends a recent project not in forecast or board", () => {
    const rec = recommendedFromRecent([[s("duin", "Duin")]], [], []);
    expect(rec.map((r) => r.title)).toEqual(["Duin"]);
  });

  it("excludes projects already in the forecast", () => {
    const rec = recommendedFromRecent([[s("celonis", "Celonis")]], ["Celonis"], []);
    expect(rec).toEqual([]);
  });

  it("excludes projects already on the board", () => {
    const rec = recommendedFromRecent([[s("oakmond", "Oakmond")]], [], ["Oakmond"]);
    expect(rec).toEqual([]);
  });

  it("de-dupes across days, preserving most-recent-first order", () => {
    const rec = recommendedFromRecent(
      [[s("duin", "Duin"), s("paradores", "Paradores")], [s("duin", "Duin")]],
      [],
      [],
    );
    expect(rec.map((r) => r.title)).toEqual(["Duin", "Paradores"]);
  });

  it("matches exclusions case-insensitively", () => {
    const rec = recommendedFromRecent([[s("duin", "Duin")]], ["duin"], []);
    expect(rec).toEqual([]);
  });
});
