import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
}));

import { createProject, ensureDay, listDay, readNote, writeNote } from "../lib/notes-api";
import { todayKey } from "../lib/date-key";
import { loadOrientation, useBoardStore } from "./board-store";

const mockListDay = vi.mocked(listDay);
const mockReadNote = vi.mocked(readNote);
const mockWriteNote = vi.mocked(writeNote);
const mockEnsureDay = vi.mocked(ensureDay);
const mockCreateProject = vi.mocked(createProject);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: null, projects: [], orientation: "vertical" });
});

async function seedOakmond() {
  mockListDay.mockResolvedValue([
    { slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 },
  ]);
  mockReadNote.mockResolvedValue({
    frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-21" },
    body: "keep",
  });
  await useBoardStore.getState().loadDay("2026-06-21");
}

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
    await seedOakmond();
    useBoardStore.getState().setBody("oakmond", "new body");
    await useBoardStore.getState().persistBody("oakmond");
    expect(mockWriteNote).toHaveBeenCalledWith("2026-06-21", "oakmond", {
      frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-21" },
      body: "new body",
    });
  });

  it("createProject calls the backend then reloads the day", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-21");

    mockCreateProject.mockResolvedValue({ slug: "new", title: "New", color: "#fff", order: 0 });
    mockListDay.mockResolvedValue([{ slug: "new", title: "New", color: "#fff", order: 0 }]);
    mockReadNote.mockResolvedValue({ frontmatter: { title: "New", color: "#fff", order: 0 }, body: "" });

    await useBoardStore.getState().createProject("New", "#fff");

    expect(mockCreateProject).toHaveBeenCalledWith("2026-06-21", "New", "#fff");
    expect(useBoardStore.getState().projects.map((p) => p.slug)).toEqual(["new"]);
  });

  it("setColor persists the new color and updates the store", async () => {
    await seedOakmond();
    await useBoardStore.getState().setColor("oakmond", "#3E63DD");
    expect(mockWriteNote).toHaveBeenCalledWith("2026-06-21", "oakmond", {
      frontmatter: { title: "Oakmond", color: "#3E63DD", order: 1, created: "2026-06-21" },
      body: "keep",
    });
    expect(useBoardStore.getState().projects[0].frontmatter.color).toBe("#3E63DD");
  });

  it("rename persists the new title and keeps the slug", async () => {
    await seedOakmond();
    await useBoardStore.getState().rename("oakmond", "Oakmond HQ");
    expect(mockWriteNote).toHaveBeenCalledWith("2026-06-21", "oakmond", {
      frontmatter: { title: "Oakmond HQ", color: "#E54D2E", order: 1, created: "2026-06-21" },
      body: "keep",
    });
    expect(useBoardStore.getState().projects[0].slug).toBe("oakmond");
    expect(useBoardStore.getState().projects[0].frontmatter.title).toBe("Oakmond HQ");
  });

  it("goToPreviousDay loads the previous day", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-21");
    mockListDay.mockClear();

    await useBoardStore.getState().goToPreviousDay();

    expect(mockListDay).toHaveBeenCalledWith("2026-06-20");
    expect(useBoardStore.getState().dayKey).toBe("2026-06-20");
  });

  it("goToNextDay loads the next day", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-20");
    mockListDay.mockClear();

    await useBoardStore.getState().goToNextDay();

    expect(mockListDay).toHaveBeenCalledWith("2026-06-21");
    expect(useBoardStore.getState().dayKey).toBe("2026-06-21");
  });

  it("goToToday loads today's key", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-10");
    mockListDay.mockClear();

    await useBoardStore.getState().goToToday();

    expect(mockListDay).toHaveBeenCalledWith(todayKey());
  });

  it("navigation does not create a folder (no ensure_day / write_note)", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-21");

    await useBoardStore.getState().goToPreviousDay();

    expect(mockEnsureDay).not.toHaveBeenCalled();
    expect(mockWriteNote).not.toHaveBeenCalled();
  });
});
