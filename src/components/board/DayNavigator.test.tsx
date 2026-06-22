import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
}));

import { listDay } from "../../lib/notes-api";
import { todayKey } from "../../lib/date-key";
import { useBoardStore } from "../../state/board-store";
import { DayNavigator } from "./DayNavigator";

const mockListDay = vi.mocked(listDay);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  mockListDay.mockResolvedValue([]);
  useBoardStore.setState({ dayKey: "2026-06-21", projects: [], orientation: "vertical" });
});

describe("DayNavigator", () => {
  it("goes to the previous day", async () => {
    render(<DayNavigator />);
    fireEvent.click(screen.getByRole("button", { name: "Día anterior" }));
    await waitFor(() => expect(mockListDay).toHaveBeenCalledWith("2026-06-20"));
  });

  it("goes to the next day", async () => {
    render(<DayNavigator />);
    fireEvent.click(screen.getByRole("button", { name: "Día siguiente" }));
    await waitFor(() => expect(mockListDay).toHaveBeenCalledWith("2026-06-22"));
  });

  it("jumps to today", async () => {
    useBoardStore.setState({ dayKey: "2026-06-10" });
    render(<DayNavigator />);
    fireEvent.click(screen.getByRole("button", { name: "Hoy" }));
    await waitFor(() => expect(mockListDay).toHaveBeenCalledWith(todayKey()));
  });
});
