import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
}));

import { createProject, listDay } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { AddProjectButton } from "./AddProjectButton";

const mockCreateProject = vi.mocked(createProject);
const mockListDay = vi.mocked(listDay);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: "2026-06-21", projects: [] });
  mockListDay.mockResolvedValue([]);
});

describe("AddProjectButton", () => {
  it("opens a form and creates a project with title + color", async () => {
    mockCreateProject.mockResolvedValue({ slug: "oakmond", title: "Oakmond", color: "#E54D2E", order: 0 });

    render(<AddProjectButton />);
    fireEvent.click(screen.getByRole("button", { name: "Nuevo proyecto" }));
    fireEvent.change(screen.getByLabelText("Título del proyecto"), { target: { value: "Oakmond" } });
    fireEvent.change(screen.getByLabelText("Color del proyecto"), { target: { value: "#e54d2e" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() =>
      expect(mockCreateProject).toHaveBeenCalledWith("2026-06-21", "Oakmond", "#e54d2e"),
    );
  });

  it("shows an error when creation fails", async () => {
    mockCreateProject.mockRejectedValue(new Error("invalid"));

    render(<AddProjectButton />);
    fireEvent.click(screen.getByRole("button", { name: "Nuevo proyecto" }));
    fireEvent.change(screen.getByLabelText("Título del proyecto"), { target: { value: "!!!" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });
});
