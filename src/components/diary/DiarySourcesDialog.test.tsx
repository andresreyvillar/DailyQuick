import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({ readDiarySource: vi.fn(), setDiarySource: vi.fn() }));

import { readDiarySource, setDiarySource } from "../../lib/notes-api";
import { DiarySourcesDialog } from "./DiarySourcesDialog";

const mockReadDiarySource = vi.mocked(readDiarySource);
const mockSetDiarySource = vi.mocked(setDiarySource);

beforeEach(() => {
  vi.clearAllMocks();
  mockSetDiarySource.mockResolvedValue(undefined);
});

describe("DiarySourcesDialog", () => {
  it("defaults the search terms to the project title when none are saved", async () => {
    mockReadDiarySource.mockResolvedValue({ searchTerms: [] });
    render(<DiarySourcesDialog slug="duin" title="Duin" onClose={vi.fn()} />);
    await waitFor(() => expect(mockReadDiarySource).toHaveBeenCalled());
    expect(screen.getByLabelText("Términos de búsqueda")).toHaveValue("Duin");
  });

  it("pre-fills saved terms and saves the parsed list", async () => {
    mockReadDiarySource.mockResolvedValue({ searchTerms: ["Duin", "RevOps Duin"] });
    const onClose = vi.fn();
    render(<DiarySourcesDialog slug="duin" title="Duin" onClose={onClose} />);

    expect(await screen.findByDisplayValue("Duin, RevOps Duin")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Términos de búsqueda"), {
      target: { value: "Duin, RevOps, Abelardo" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() =>
      expect(mockSetDiarySource).toHaveBeenCalledWith("duin", {
        searchTerms: ["Duin", "RevOps", "Abelardo"],
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
