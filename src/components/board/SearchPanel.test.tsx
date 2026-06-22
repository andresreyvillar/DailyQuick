import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
  search: vi.fn(),
}));

import { search } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { SearchPanel } from "./SearchPanel";

const mockSearch = vi.mocked(search);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ dayKey: "2026-06-21", projects: [] });
});

describe("SearchPanel", () => {
  it("searches after debounce and renders the hits", async () => {
    mockSearch.mockResolvedValue([
      { day_key: "2026-06-20", slug: "oakmond", title: "Oakmond", snippet: "reunión" },
    ]);
    render(<SearchPanel />);
    fireEvent.change(screen.getByLabelText("Buscar notas"), { target: { value: "oak" } });

    await waitFor(() => expect(mockSearch).toHaveBeenCalledWith("oak"));
    expect(await screen.findByText("Oakmond")).toBeInTheDocument();
    expect(screen.getByText("reunión")).toBeInTheDocument();
  });

  it("opening a result navigates to its day", async () => {
    mockSearch.mockResolvedValue([
      { day_key: "2026-06-18", slug: "a", title: "Alpha", snippet: "" },
    ]);
    const goToDay = vi.fn();
    useBoardStore.setState({ goToDay });
    render(<SearchPanel />);
    fireEvent.change(screen.getByLabelText("Buscar notas"), { target: { value: "al" } });

    fireEvent.click(await screen.findByText("Alpha"));
    expect(goToDay).toHaveBeenCalledWith("2026-06-18");
  });

  it("does not search for a blank query", async () => {
    render(<SearchPanel />);
    fireEvent.change(screen.getByLabelText("Buscar notas"), { target: { value: "   " } });
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(mockSearch).not.toHaveBeenCalled();
  });
});
