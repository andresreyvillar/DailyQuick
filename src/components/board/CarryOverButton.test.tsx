import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
  deleteNote: vi.fn(),
}));

import { listDay } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { CarryOverButton } from "./CarryOverButton";

const mockListDay = vi.mocked(listDay);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ dayKey: "2026-06-22", projects: [] });
});

describe("CarryOverButton", () => {
  it("is disabled when the previous day has no importable projects", async () => {
    mockListDay.mockResolvedValue([]);
    render(<CarryOverButton />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Copiar proyectos del día anterior" })).toBeDisabled(),
    );
    expect(mockListDay).toHaveBeenCalledWith("2026-06-21");
  });

  it("enables and calls importPreviousDay when the previous day has new projects", async () => {
    const importPreviousDay = vi.fn();
    useBoardStore.setState({ importPreviousDay });
    mockListDay.mockResolvedValue([{ slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 1 }]);
    render(<CarryOverButton />);

    const button = screen.getByRole("button", { name: "Copiar proyectos del día anterior" });
    await waitFor(() => expect(button).toBeEnabled());

    fireEvent.click(button);
    expect(importPreviousDay).toHaveBeenCalled();
  });
});
