import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
  search: vi.fn(),
  listEvents: vi.fn(),
}));

// Stub the Milkdown editor (ProseMirror can't render in jsdom).
vi.mock("../editor/MarkdownEditor", () => ({ MarkdownEditor: () => null }));
// Stub the calendar strip + filter (their own tests cover them; avoids native/async fetches here).
vi.mock("../calendar/CalendarEvents", () => ({ CalendarEvents: () => null }));
vi.mock("../calendar/CalendarFilter", () => ({ CalendarFilter: () => null }));
// Stub the forecast + recommendations strips (their own tests cover them; avoids async reads here).
vi.mock("../forecast/ForecastProjects", () => ({ ForecastProjects: () => null }));
vi.mock("../forecast/RecommendedProjects", () => ({ RecommendedProjects: () => null }));
// Stub the diary panel (rendered inside ProjectColumn; its own test covers it).
vi.mock("../diary/DiaryPanel", () => ({ DiaryPanel: () => null }));
// Stub the settings panel (its own test covers it; avoids the Tauri event listener here).
vi.mock("../settings/SettingsPanel", () => ({ SettingsPanel: () => null }));
// Stub the per-project sync button (its own test covers it; ProjectColumn renders it).
vi.mock("../diary/ProjectSyncButton", () => ({ ProjectSyncButton: () => null }));

import { listDay, readNote } from "../../lib/notes-api";
import { DND_MIME, serializeDrag } from "../../lib/board-dnd";
import { useBoardStore } from "../../state/board-store";
import { Board } from "./Board";

const mockListDay = vi.mocked(listDay);
const mockReadNote = vi.mocked(readNote);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: null, projects: [], orientation: "vertical", contextCollapsed: false });
});

async function seedTwoProjects() {
  mockListDay.mockResolvedValue([
    { slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 },
    { slug: "personal", title: "Personal", color: null, order: 2 },
  ]);
  mockReadNote.mockImplementation(async (_key, slug) => ({
    frontmatter: {
      title: slug === "oakmond" ? "Oakmond" : "Personal",
      color: slug === "oakmond" ? "#E54D2E" : null,
      order: slug === "oakmond" ? 1 : 2,
    },
    body: "",
  }));
  await useBoardStore.getState().loadDay("2026-06-21");
}

describe("Board", () => {
  it("renders one column per project, in order, with titles", async () => {
    await seedTwoProjects();
    render(<Board />);
    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.map((h) => h.textContent)).toEqual(["Oakmond", "Personal"]);
  });

  it("applies the project color as a header accent", async () => {
    await seedTwoProjects();
    render(<Board />);
    const header = screen.getByRole("heading", { level: 2, name: "Oakmond" }).closest("header");
    expect(header).toHaveAttribute("data-accent-color", "#E54D2E");
  });

  it("lays out the board as a grid in grid mode", async () => {
    await seedTwoProjects();
    useBoardStore.setState({ orientation: "grid" });
    render(<Board />);
    expect(screen.getByTestId("board-canvas")).toHaveClass("grid");
  });

  it("lays out the board as flex columns in vertical mode", async () => {
    await seedTwoProjects();
    render(<Board />);
    const canvas = screen.getByTestId("board-canvas");
    expect(canvas).toHaveClass("flex");
    expect(canvas).toHaveClass("flex-row");
  });

  it("shows an empty state and no columns when the day has no projects", () => {
    render(<Board />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("collapses and expands the day-context region", () => {
    render(<Board />);
    expect(screen.getByText("Forecast")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ocultar contexto del día" }));
    expect(screen.queryByText("Forecast")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mostrar contexto del día" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mostrar contexto del día" }));
    expect(screen.getByText("Forecast")).toBeInTheDocument();
  });

  it("creates a project when a forecast chip is dropped on the board", () => {
    const spy = vi.fn();
    useBoardStore.setState({ dayKey: "2026-07-20", projects: [], createProjectFromForecast: spy });
    render(<Board />);
    const data = serializeDrag({ kind: "forecast", project: { code: "DUI2601", name: "Duin" } });
    fireEvent.drop(screen.getByTestId("board-dropzone"), {
      dataTransfer: { getData: (t: string) => (t === DND_MIME ? data : "") },
    });
    expect(spy).toHaveBeenCalledWith({ code: "DUI2601", name: "Duin" });
  });

  it("creates a project when a chip is dropped over an existing project frame", async () => {
    await seedTwoProjects();
    const spy = vi.fn();
    useBoardStore.setState({ createProjectFromForecast: spy });
    render(<Board />);
    const frame = document.querySelector("[data-frame-index]");
    const data = serializeDrag({ kind: "forecast", project: { code: "DUI2601", name: "Duin" } });
    fireEvent.drop(frame as Element, {
      dataTransfer: { getData: (t: string) => (t === DND_MIME ? data : "") },
    });
    expect(spy).toHaveBeenCalledWith({ code: "DUI2601", name: "Duin" });
  });

  it("creates a project from an event when a calendar chip is dropped", () => {
    const spy = vi.fn();
    useBoardStore.setState({ dayKey: "2026-07-20", projects: [], createProjectFromEvent: spy });
    render(<Board />);
    const event = { title: "Daily", start: "2026-07-20T09:00:00", end: "2026-07-20T09:15:00", all_day: false, calendar: "Work", calendar_id: "work" };
    const data = serializeDrag({ kind: "event", event });
    fireEvent.drop(screen.getByTestId("board-dropzone"), {
      dataTransfer: { getData: (t: string) => (t === DND_MIME ? data : "") },
    });
    expect(spy).toHaveBeenCalledWith(event);
  });

  it("ignores an unrecognized drop", () => {
    const spy = vi.fn();
    useBoardStore.setState({ dayKey: "2026-07-20", projects: [], createProjectFromForecast: spy });
    render(<Board />);
    fireEvent.drop(screen.getByTestId("board-dropzone"), {
      dataTransfer: { getData: () => "garbage" },
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it("header shows the selected day's date", async () => {
    mockListDay.mockResolvedValue([]);
    await useBoardStore.getState().loadDay("2026-06-20");
    render(<Board />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("20 de junio");
    expect(heading).toHaveTextContent("2026");
  });
});
