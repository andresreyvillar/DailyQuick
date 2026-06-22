import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn() }));

import { invoke } from "@tauri-apps/api/core";
import {
  calendarEventSchema,
  calendarInfoSchema,
  createProject,
  noteSchema,
  search,
  searchHitSchema,
} from "./notes-api";

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

describe("searchHitSchema", () => {
  it("accepts a valid hit and rejects a malformed one", () => {
    expect(
      searchHitSchema.safeParse({ day_key: "2026-06-20", slug: "a", title: "A", snippet: "" }).success,
    ).toBe(true);
    expect(searchHitSchema.safeParse({ day_key: 1, slug: "a" }).success).toBe(false);
  });
});

describe("search", () => {
  it("invokes search_notes and returns parsed hits", async () => {
    mockInvoke.mockResolvedValue([
      { day_key: "2026-06-20", slug: "oakmond", title: "Oakmond", snippet: "x" },
    ]);
    const hits = await search("oak");
    expect(mockInvoke).toHaveBeenCalledWith("search_notes", { query: "oak" });
    expect(hits[0].slug).toBe("oakmond");
  });

  it("returns empty for a blank query without calling the backend", async () => {
    expect(await search("   ")).toEqual([]);
    expect(mockInvoke).not.toHaveBeenCalled();
  });
});

describe("calendarEventSchema", () => {
  it("accepts a valid event and rejects a malformed one", () => {
    expect(
      calendarEventSchema.safeParse({
        title: "Standup",
        start: "2026-06-22T09:00:00",
        end: "2026-06-22T09:15:00",
        all_day: false,
        calendar: "Work",
        calendar_id: "work",
      }).success,
    ).toBe(true);
    expect(calendarEventSchema.safeParse({ title: "x", all_day: "no" }).success).toBe(false);
  });
});

describe("calendarInfoSchema", () => {
  it("accepts a valid calendar and rejects a malformed one", () => {
    expect(calendarInfoSchema.safeParse({ id: "work", title: "Work" }).success).toBe(true);
    expect(calendarInfoSchema.safeParse({ id: 1 }).success).toBe(false);
  });
});
