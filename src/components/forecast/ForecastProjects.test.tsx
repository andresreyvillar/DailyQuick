import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listForecast: vi.fn(),
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
}));

import { createProject, listDay, listForecast } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { ForecastProjects } from "./ForecastProjects";

const mockListForecast = vi.mocked(listForecast);
const mockListDay = vi.mocked(listDay);
const mockCreateProject = vi.mocked(createProject);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ dayKey: "2026-07-20", projects: [] });
  mockListDay.mockResolvedValue([]);
});

describe("ForecastProjects", () => {
  it("renders a chip per forecast project with name and hours", async () => {
    mockListForecast.mockResolvedValue([
      { code: "ILA2404", name: "Oakmond", hours: 6.5 },
      { code: "HAN2602", name: "Celonis", hours: 1 },
    ]);
    render(<ForecastProjects />);
    expect(await screen.findByText("Oakmond")).toBeInTheDocument();
    expect(screen.getByText("Celonis")).toBeInTheDocument();
    expect(screen.getByText("6.5h")).toBeInTheDocument();
    expect(screen.getByText("1h")).toBeInTheDocument();
  });

  it("shows a quiet empty state when there is no forecast", async () => {
    mockListForecast.mockResolvedValue([]);
    render(<ForecastProjects />);
    expect(await screen.findByText("Sin forecast.")).toBeInTheDocument();
  });

  it("creates a project with an unused accent when a chip is clicked", async () => {
    mockListForecast.mockResolvedValue([{ code: "ILA2404", name: "Oakmond", hours: 6.5 }]);
    mockCreateProject.mockResolvedValue({ slug: "oakmond", title: "Oakmond", color: "#4F7FD6", order: 0 });
    render(<ForecastProjects />);
    fireEvent.click(await screen.findByRole("button", { name: "Crear proyecto Oakmond" }));
    await waitFor(() =>
      expect(mockCreateProject).toHaveBeenCalledWith("2026-07-20", "Oakmond", "#4F7FD6"),
    );
  });

  it("disables a chip whose project already exists on the board", async () => {
    useBoardStore.setState({
      dayKey: "2026-07-20",
      projects: [{ slug: "oakmond", frontmatter: { title: "Oakmond", color: "#4F7FD6", order: 0 }, body: "" }],
    });
    mockListForecast.mockResolvedValue([{ code: "ILA2404", name: "Oakmond", hours: 6.5 }]);
    render(<ForecastProjects />);
    expect(await screen.findByRole("button", { name: "Oakmond ya añadido" })).toBeDisabled();
  });
});
