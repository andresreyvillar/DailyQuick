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

const standup = {
  title: "Standup",
  start: "2026-06-22T09:00:00",
  end: "2026-06-22T09:15:00",
  all_day: false,
  calendar: "Work",
  calendar_id: "work",
};

const oakmond = {
  slug: "oakmond",
  frontmatter: { title: "Oakmond", color: "#E54D2E", order: 1 },
  body: "",
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: "2026-06-22", projects: [] });
  useCalendarStore.setState({ hidden: [] });
});

describe("CalendarEvents", () => {
  it("renders the day's events as chips", async () => {
    mockListEvents.mockResolvedValue([standup]);
    render(<CalendarEvents />);
    expect(await screen.findByText("Standup")).toBeInTheDocument();
  });

  it("shows the event time and title in the chip", async () => {
    mockListEvents.mockResolvedValue([standup]);
    render(<CalendarEvents />);
    expect(await screen.findByText("09:00")).toBeInTheDocument();
    expect(screen.getByText("Standup")).toBeInTheDocument();
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

  it("hides events from hidden calendars", async () => {
    useCalendarStore.setState({ hidden: ["bday"] });
    mockListEvents.mockResolvedValue([
      standup,
      { title: "Cumpleaños", start: "2026-06-22T00:00:00", end: "2026-06-23T00:00:00", all_day: true, calendar: "Birthdays", calendar_id: "bday" },
    ]);
    render(<CalendarEvents />);
    expect(await screen.findByText("Standup")).toBeInTheDocument();
    expect(screen.queryByText("Cumpleaños")).not.toBeInTheDocument();
  });

  it("opens the actions popover on chip click", async () => {
    mockListEvents.mockResolvedValue([standup]);
    render(<CalendarEvents />);
    fireEvent.click(await screen.findByRole("button", { name: "Acciones de Standup" }));
    expect(screen.getByText("Nuevo proyecto")).toBeInTheDocument();
    expect(screen.getByText("Añadir a un proyecto…")).toBeInTheDocument();
  });

  it("creates a project from the menu and shows a toast", async () => {
    const createProjectFromEvent = vi.fn().mockResolvedValue(undefined);
    useBoardStore.setState({ createProjectFromEvent });
    mockListEvents.mockResolvedValue([standup]);
    render(<CalendarEvents />);
    fireEvent.click(await screen.findByRole("button", { name: "Acciones de Standup" }));
    fireEvent.click(screen.getByText("Nuevo proyecto"));
    expect(createProjectFromEvent).toHaveBeenCalledWith(expect.objectContaining({ title: "Standup" }));
    expect(await screen.findByText(/Nuevo proyecto creado desde/)).toBeInTheDocument();
  });

  it("adds the event to a project via the submenu and shows a toast", async () => {
    const addEventToProject = vi.fn().mockResolvedValue(undefined);
    useBoardStore.setState({ addEventToProject, projects: [oakmond] });
    mockListEvents.mockResolvedValue([standup]);
    render(<CalendarEvents />);
    fireEvent.click(await screen.findByRole("button", { name: "Acciones de Standup" }));
    fireEvent.click(screen.getByText("Añadir a un proyecto…"));
    fireEvent.click(screen.getByText("Oakmond"));
    expect(addEventToProject).toHaveBeenCalledWith("oakmond", expect.objectContaining({ title: "Standup" }));
    expect(await screen.findByText(/añadido a "Oakmond"/)).toBeInTheDocument();
  });

  it("back returns to the root menu and outside click closes the popover", async () => {
    useBoardStore.setState({ projects: [oakmond] });
    mockListEvents.mockResolvedValue([standup]);
    render(<CalendarEvents />);
    fireEvent.click(await screen.findByRole("button", { name: "Acciones de Standup" }));
    fireEvent.click(screen.getByText("Añadir a un proyecto…"));
    fireEvent.click(screen.getByLabelText("Volver"));
    expect(screen.getByText("Nuevo proyecto")).toBeInTheDocument();

    fireEvent.click(document.querySelector(".inset-0") as Element);
    expect(screen.queryByText("Nuevo proyecto")).not.toBeInTheDocument();
  });
});
