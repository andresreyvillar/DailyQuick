import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

import { invoke } from "@tauri-apps/api/core";
import { createProject, noteSchema } from "./notes-api";

const mockInvoke = vi.mocked(invoke);

beforeEach(() => {
  vi.clearAllMocks();
});

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

describe("createProject", () => {
  it("invokes create_project and returns the parsed summary", async () => {
    mockInvoke.mockResolvedValue({ slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 0 });

    const summary = await createProject("2026-06-21", "Oakmond", "#E54D2E");

    expect(mockInvoke).toHaveBeenCalledWith("create_project", {
      key: "2026-06-21",
      title: "Oakmond",
      color: "#E54D2E",
    });
    expect(summary.slug).toBe("oakmond");
  });

  it("rejects an empty title without calling the backend", async () => {
    await expect(createProject("2026-06-21", "   ", "#000000")).rejects.toThrow();
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});
