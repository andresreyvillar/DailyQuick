import { describe, expect, it } from "vitest";

import { noteSchema } from "./notes-api";

describe("noteSchema", () => {
  it("accepts a valid note payload", () => {
    const valid = {
      frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-21" },
      body: "# Tareas",
    };
    expect(noteSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a note without optional color/created", () => {
    const valid = { frontmatter: { title: "Oakmond", order: 1 }, body: "" };
    expect(noteSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a malformed note payload", () => {
    const invalid = { frontmatter: { title: "", order: "first" }, body: 123 };
    expect(noteSchema.safeParse(invalid).success).toBe(false);
  });
});
