import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
  deleteNote: vi.fn(),
}));

import { createProject, deleteNote, ensureDay, listDay, readNote, writeNote } from "../lib/notes-api";
import { todayKey } from "../lib/date-key";
import { loadOrientation, useBoardStore } from "./board-store";

const mockListDay = vi.mocked(listDay);
const mockReadNote = vi.mocked(readNote);
const mockWriteNote = vi.mocked(writeNote);
const mockEnsureDay = vi.mocked(ensureDay);
const mockCreateProject = vi.mocked(createProject);
const mockDeleteNote = vi.mocked(deleteNote);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: null, projects: [], orientation: "vertical", revisions: {} });
});

const meeting = {
  title: "Oakmond daily",
  start: "2026-06-22T09:00:00",
  end: "2026-06-22T09:15:00",
  all_day: false,
  calendar: "Work",
  calendar_id: "work",
};

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

  it("createProjectFromEvent creates a project with the seeded body then reloads", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-22");

    mockCreateProject.mockResolvedValue({ slug: "oakmond-daily", title: "Oakmond daily", color: "#3E63DD", order: 0 });
    mockListDay.mockResolvedValue([{ slug: "oakmond-daily", title: "Oakmond daily", color: "#3E63DD", order: 0 }]);
    mockReadNote.mockResolvedValue({ frontmatter: { title: "Oakmond daily", color: "#3E63DD", order: 0 }, body: "" });

    await useBoardStore.getState().createProjectFromEvent(meeting);

    expect(mockCreateProject).toHaveBeenCalledWith("2026-06-22", "Oakmond daily", "#3E63DD");
    const writeArgs = mockWriteNote.mock.calls[0];
    expect(writeArgs[0]).toBe("2026-06-22");
    expect(writeArgs[1]).toBe("oakmond-daily");
    expect(writeArgs[2].body).toContain("## Notas");
  });

  it("createProjectFromEvent surfaces AlreadyExists (no write)", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-22");
    mockCreateProject.mockRejectedValue({ kind: "AlreadyExists" });

    await expect(useBoardStore.getState().createProjectFromEvent(meeting)).rejects.toBeDefined();
    expect(mockWriteNote).not.toHaveBeenCalled();
  });

  it("addEventToProject appends a block, preserving content, and bumps the revision", async () => {
    mockListDay.mockResolvedValue([{ slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 }]);
    mockReadNote.mockResolvedValue({
      frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-22" },
      body: "# Tareas",
    });
    await useBoardStore.getState().loadDay("2026-06-22");

    await useBoardStore.getState().addEventToProject("oakmond", meeting);

    const writeArgs = mockWriteNote.mock.calls[mockWriteNote.mock.calls.length - 1];
    expect(writeArgs[2].body).toContain("# Tareas");
    expect(writeArgs[2].body).toContain("> **Oakmond daily**");
    expect(useBoardStore.getState().revisions.oakmond).toBe(1);
  });

  it("deleteProject deletes the note, drops the project, and clears its revision", async () => {
    mockListDay.mockResolvedValue([
      { slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 },
      { slug: "personal", title: "Personal", color: null, order: 2 },
    ]);
    mockReadNote.mockImplementation(async (_key, slug) => ({
      frontmatter: { title: slug, color: null, order: 1 },
      body: `body-${slug}`,
    }));
    await useBoardStore.getState().loadDay("2026-06-21");
    useBoardStore.setState({ revisions: { oakmond: 3, personal: 1 } });
    mockDeleteNote.mockResolvedValue(undefined);

    await useBoardStore.getState().deleteProject("oakmond");

    expect(mockDeleteNote).toHaveBeenCalledWith("2026-06-21", "oakmond");
    const { projects, revisions } = useBoardStore.getState();
    expect(projects.map((p) => p.slug)).toEqual(["personal"]);
    expect(revisions).toEqual({ personal: 1 });
  });
});
