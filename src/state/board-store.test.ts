import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
}));

import { listDay, readNote, writeNote } from "../lib/notes-api";
import { loadOrientation, useBoardStore } from "./board-store";

const mockListDay = vi.mocked(listDay);
const mockReadNote = vi.mocked(readNote);
const mockWriteNote = vi.mocked(writeNote);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: null, projects: [], orientation: "vertical" });
});

describe("board store", () => {
  it("loadDay stores projects in the order returned by list_day", async () => {
    mockListDay.mockResolvedValue([
      { slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 },
      { slug: "personal", title: "Personal", color: null, order: 2 },
    ]);
    mockReadNote.mockImplementation(async (_key, slug) => ({
      frontmatter: { title: slug, color: null, order: 1 },
      body: `body-${slug}`,
    }));

    await useBoardStore.getState().loadDay("2026-06-21");

    const { projects, dayKey } = useBoardStore.getState();
    expect(dayKey).toBe("2026-06-21");
    expect(projects.map((p) => p.slug)).toEqual(["oakmond", "personal"]);
  });

  it("orientation defaults to vertical and persists to localStorage", () => {
    expect(loadOrientation()).toBe("vertical");
    useBoardStore.getState().setOrientation("horizontal");
    expect(localStorage.getItem("dailyquick:orientation")).toBe("horizontal");
    expect(loadOrientation()).toBe("horizontal");
    expect(useBoardStore.getState().orientation).toBe("horizontal");
  });

  it("toggleOrientation flips vertical <-> horizontal", () => {
    expect(useBoardStore.getState().orientation).toBe("vertical");
    useBoardStore.getState().toggleOrientation();
    expect(useBoardStore.getState().orientation).toBe("horizontal");
    useBoardStore.getState().toggleOrientation();
    expect(useBoardStore.getState().orientation).toBe("vertical");
  });

  it("persistBody writes the new body while preserving frontmatter", async () => {
    mockListDay.mockResolvedValue([
      { slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 },
    ]);
    mockReadNote.mockResolvedValue({
      frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-21" },
      body: "old",
    });
    await useBoardStore.getState().loadDay("2026-06-21");

    useBoardStore.getState().setBody("oakmond", "new body");
    await useBoardStore.getState().persistBody("oakmond");

    expect(mockWriteNote).toHaveBeenCalledWith("2026-06-21", "oakmond", {
      frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-21" },
      body: "new body",
    });
  });
});
