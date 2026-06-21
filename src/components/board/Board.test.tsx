import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
}));

import { listDay, readNote } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { Board } from "./Board";

const mockListDay = vi.mocked(listDay);
const mockReadNote = vi.mocked(readNote);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBoardStore.setState({ dayKey: null, projects: [], orientation: "vertical" });
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

  it("shows an empty state and no columns when the day has no projects", () => {
    render(<Board />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});
