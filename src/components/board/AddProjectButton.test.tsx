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
  it("opens a form and creates a project with a title and a picked accent", async () => {
    mockCreateProject.mockResolvedValue({ slug: "oakmond", title: "Oakmond", color: "#2F9AA8", order: 0 });

    render(<AddProjectButton />);
    fireEvent.click(screen.getByRole("button", { name: "Nuevo proyecto" }));
    fireEvent.change(screen.getByLabelText("Título del proyecto"), { target: { value: "Oakmond" } });
    fireEvent.click(screen.getByLabelText("Color del proyecto"));
    fireEvent.click(screen.getByRole("button", { name: "Teal" }));
    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() =>
      expect(mockCreateProject).toHaveBeenCalledWith("2026-06-21", "Oakmond", "#2F9AA8"),
    );
  });

  it("offers the six-accent palette in the create form", () => {
    render(<AddProjectButton />);
    fireEvent.click(screen.getByRole("button", { name: "Nuevo proyecto" }));
    fireEvent.click(screen.getByLabelText("Color del proyecto"));

    for (const name of ["Azul", "Teal", "Verde", "Ámbar", "Rosa", "Violeta"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("defaults the new project to the first unused accent", async () => {
    useBoardStore.setState({
      dayKey: "2026-06-21",
      projects: [
        { slug: "a", frontmatter: { title: "A", color: "#4F7FD6", order: 0 }, body: "" },
        { slug: "b", frontmatter: { title: "B", color: "#2F9AA8", order: 1 }, body: "" },
      ],
    });
    mockCreateProject.mockResolvedValue({ slug: "c", title: "C", color: "#3A9D6B", order: 2 });

    render(<AddProjectButton />);
    fireEvent.click(screen.getByRole("button", { name: "Nuevo proyecto" }));
    fireEvent.change(screen.getByLabelText("Título del proyecto"), { target: { value: "C" } });
    fireEvent.click(screen.getByRole("button", { name: "Crear" }));

    await waitFor(() =>
      expect(mockCreateProject).toHaveBeenCalledWith("2026-06-21", "C", "#3A9D6B"),
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
