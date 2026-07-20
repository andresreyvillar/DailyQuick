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
import { RecommendedProjects } from "./RecommendedProjects";

const mockListForecast = vi.mocked(listForecast);
const mockListDay = vi.mocked(listDay);
const mockCreateProject = vi.mocked(createProject);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ dayKey: "2026-07-20", projects: [] });
  mockListForecast.mockResolvedValue([]);
  mockListDay.mockResolvedValue([]);
});

describe("RecommendedProjects", () => {
  it("recommends a recent project not in forecast or board, excluding the rest", async () => {
    useBoardStore.setState({
      dayKey: "2026-07-20",
      projects: [{ slug: "oakmond", frontmatter: { title: "Oakmond", color: "#4F7FD6", order: 0 }, body: "" }],
    });
    mockListForecast.mockResolvedValue([{ code: "HAN2602", name: "Celonis" }]);
    mockListDay.mockImplementation(async (key: string) =>
      key === "2026-07-19"
        ? [
            { slug: "duin", title: "Duin", color: "#3A9D6B", order: 0 },
            { slug: "celonis", title: "Celonis", color: null, order: 1 }, // in forecast → excluded
            { slug: "oakmond", title: "Oakmond", color: null, order: 2 }, // on board → excluded
          ]
        : [],
    );

    render(<RecommendedProjects />);
    expect(await screen.findByText("Duin")).toBeInTheDocument();
    expect(screen.queryByText("Celonis")).not.toBeInTheDocument();
    expect(screen.queryByText("Oakmond")).not.toBeInTheDocument();
  });

  it("creates the project (reusing its color) when a chip is clicked", async () => {
    mockListForecast.mockResolvedValue([]);
    mockListDay.mockImplementation(async (key: string) =>
      key === "2026-07-19" ? [{ slug: "duin", title: "Duin", color: "#3A9D6B", order: 0 }] : [],
    );
    mockCreateProject.mockResolvedValue({ slug: "duin", title: "Duin", color: "#3A9D6B", order: 0 });

    render(<RecommendedProjects />);
    fireEvent.click(await screen.findByRole("button", { name: "Añadir Duin" }));
    await waitFor(() =>
      expect(mockCreateProject).toHaveBeenCalledWith("2026-07-20", "Duin", "#3A9D6B"),
    );
  });

  it("shows nothing when there are no recommendations", async () => {
    render(<RecommendedProjects />);
    await waitFor(() => expect(mockListDay).toHaveBeenCalled());
    expect(screen.queryByText("Recientes")).not.toBeInTheDocument();
  });
});
