import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({ readDiary: vi.fn() }));

import { readDiary } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { DiaryPanel } from "./DiaryPanel";

const mockReadDiary = vi.mocked(readDiary);

beforeEach(() => {
  vi.clearAllMocks();
  useBoardStore.setState({ dayKey: "2026-07-20" });
});

describe("DiaryPanel", () => {
  it("renders the summary and events when there is an entry", async () => {
    mockReadDiary.mockResolvedValue({
      summary: "Abelardo pidió X; Lide comentó Y.",
      events: [
        { time: "10:12", source: "mail", who: "Abelardo", text: "pide X" },
        { time: "12:40", source: "slack", who: "Lide", text: "comenta Y" },
      ],
    });

    render(<DiaryPanel slug="duin" />);

    expect(await screen.findByText(/Abelardo pidió X/)).toBeInTheDocument();
    expect(screen.getByText("Diario")).toBeInTheDocument();
    expect(screen.getByText("Lide")).toBeInTheDocument();
    expect(screen.getByText("10:12")).toBeInTheDocument();
  });

  it("renders nothing when there is no diary entry", async () => {
    mockReadDiary.mockResolvedValue(null);
    const { container } = render(<DiaryPanel slug="duin" />);
    await waitFor(() => expect(mockReadDiary).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
