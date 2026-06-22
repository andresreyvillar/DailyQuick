import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

import { listEvents } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { useCalendarStore } from "../../state/calendar-store";
import { CalendarEvents } from "./CalendarEvents";

const mockListEvents = vi.mocked(listEvents);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: "2026-06-22", projects: [] });
  useCalendarStore.setState({ hidden: [] });
});

describe("CalendarEvents", () => {
  it("renders the day's events", async () => {
    mockListEvents.mockResolvedValue([
      { title: "Standup", start: "2026-06-22T09:00:00", end: "2026-06-22T09:15:00", all_day: false, calendar: "Work", calendar_id: "work" },
    ]);
    render(<CalendarEvents />);
    expect(await screen.findByText("Standup")).toBeInTheDocument();
  });

  it("hides events from hidden calendars", async () => {
    useCalendarStore.setState({ hidden: ["bday"] });
    mockListEvents.mockResolvedValue([
      { title: "Standup", start: "2026-06-22T09:00:00", end: "2026-06-22T09:15:00", all_day: false, calendar: "Work", calendar_id: "work" },
      { title: "Cumpleaños", start: "2026-06-22T00:00:00", end: "2026-06-23T00:00:00", all_day: true, calendar: "Birthdays", calendar_id: "bday" },
    ]);
    render(<CalendarEvents />);
    expect(await screen.findByText("Standup")).toBeInTheDocument();
    expect(screen.queryByText("Cumpleaños")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no events", async () => {
    mockListEvents.mockResolvedValue([]);
    render(<CalendarEvents />);
    expect(await screen.findByText("Sin eventos.")).toBeInTheDocument();
  });

  it("shows a grant-access state when listing fails", async () => {
    mockListEvents.mockRejectedValue(new Error("denied"));
    render(<CalendarEvents />);
    await waitFor(() =>
      expect(screen.getByText(/Concede acceso al Calendario/)).toBeInTheDocument(),
    );
  });

  it("creates a project from an event", async () => {
    const createProjectFromEvent = vi.fn().mockResolvedValue(undefined);
    useBoardStore.setState({ createProjectFromEvent });
    mockListEvents.mockResolvedValue([
      { title: "Standup", start: "2026-06-22T09:00:00", end: "2026-06-22T09:15:00", all_day: false, calendar: "Work", calendar_id: "work" },
    ]);
    render(<CalendarEvents />);

    fireEvent.click(await screen.findByLabelText("Crear proyecto desde Standup"));
    expect(createProjectFromEvent).toHaveBeenCalledWith(expect.objectContaining({ title: "Standup" }));
  });

  it("adds an event to a chosen project", async () => {
    const addEventToProject = vi.fn().mockResolvedValue(undefined);
    useBoardStore.setState({
      addEventToProject,
      projects: [{ slug: "oakmond", frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1 }, body: "" }],
    });
    mockListEvents.mockResolvedValue([
      { title: "Standup", start: "2026-06-22T09:00:00", end: "2026-06-22T09:15:00", all_day: false, calendar: "Work", calendar_id: "work" },
    ]);
    render(<CalendarEvents />);

    const select = await screen.findByLabelText("Añadir Standup a un proyecto");
    fireEvent.change(select, { target: { value: "oakmond" } });
    expect(addEventToProject).toHaveBeenCalledWith("oakmond", expect.objectContaining({ title: "Standup" }));
  });
});
