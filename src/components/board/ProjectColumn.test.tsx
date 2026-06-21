import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
}));

import { writeNote } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { ProjectColumn } from "./ProjectColumn";

const mockWriteNote = vi.mocked(writeNote);

const FRONTMATTER = { title: "Oakmond", color: "#E54D2E", order: 1, created: "2026-06-21" };

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  mockWriteNote.mockResolvedValue(undefined);
  useBoardStore.setState({
    dayKey: "2026-06-21",
    projects: [{ slug: "oakmond", frontmatter: { ...FRONTMATTER }, body: "old" }],
    orientation: "vertical",
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ProjectColumn", () => {
  it("persists edits via write_note after the debounce, preserving frontmatter", () => {
    render(<ProjectColumn slug="oakmond" />);
    const textarea = screen.getByLabelText("Notas de Oakmond");

    fireEvent.change(textarea, { target: { value: "new body" } });
    expect(mockWriteNote).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockWriteNote).toHaveBeenCalledWith("2026-06-21", "oakmond", {
      frontmatter: FRONTMATTER,
      body: "new body",
    });
  });

  it("flushes a pending edit on blur", () => {
    render(<ProjectColumn slug="oakmond" />);
    const textarea = screen.getByLabelText("Notas de Oakmond");

    fireEvent.change(textarea, { target: { value: "blurred" } });
    fireEvent.blur(textarea);

    expect(mockWriteNote).toHaveBeenCalledWith(
      "2026-06-21",
      "oakmond",
      expect.objectContaining({ body: "blurred" }),
    );
  });
});
