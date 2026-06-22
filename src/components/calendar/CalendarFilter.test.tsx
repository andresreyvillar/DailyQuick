import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({ listCalendars: vi.fn() }));

import { listCalendars } from "../../lib/notes-api";
import { useCalendarStore } from "../../state/calendar-store";
import { CalendarFilter } from "./CalendarFilter";

const mockListCalendars = vi.mocked(listCalendars);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useCalendarStore.setState({ hidden: [] });
  mockListCalendars.mockResolvedValue([
    { id: "work", title: "Work" },
    { id: "bday", title: "Birthdays" },
  ]);
});

describe("CalendarFilter", () => {
  it("lists calendars and toggles a calendar's visibility", async () => {
    render(<CalendarFilter />);
    fireEvent.click(screen.getByRole("button", { name: "Filtrar calendarios" }));

    const work = await screen.findByLabelText("Work");
    expect(work).toBeChecked();

    fireEvent.click(work);
    expect(useCalendarStore.getState().hidden).toContain("work");
  });
});
