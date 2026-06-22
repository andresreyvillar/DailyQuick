import { describe, expect, it } from "vitest";

import { BASIC_TEMPLATE } from "./note-template";

describe("note-template", () => {
  it("BASIC_TEMPLATE has a tasks checklist, a separator, and a notes section", () => {
    expect(BASIC_TEMPLATE).toContain("## Tareas");
    expect(BASIC_TEMPLATE).toContain("- [ ]");
    expect(BASIC_TEMPLATE).toContain("---");
    expect(BASIC_TEMPLATE).toContain("## Notas");
  });
});
