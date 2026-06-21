import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
}));

// The real editor is Milkdown/ProseMirror (can't run in jsdom); stub it as a textarea
// that forwards its value to `onChange`, so we can test the persistence wiring.
vi.mock("../editor/MarkdownEditor", () => ({
  MarkdownEditor: ({ value, onChange }: { value: string; onChange: (md: string) => void }) => (
    <textarea aria-label="editor" defaultValue={value} onChange={(e) => onChange(e.target.value)} />
  ),
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
  it("persists editor changes via write_note after the debounce, preserving frontmatter", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.change(screen.getByLabelText("editor"), { target: { value: "# nuevo" } });
    expect(mockWriteNote).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockWriteNote).toHaveBeenCalledWith("2026-06-21", "oakmond", {
      frontmatter: FRONTMATTER,
      body: "# nuevo",
    });
  });

  it("changing the color control persists the new color", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.change(screen.getByLabelText("Color de Oakmond"), { target: { value: "#3e63dd" } });
    expect(mockWriteNote).toHaveBeenCalledWith(
      "2026-06-21",
      "oakmond",
      expect.objectContaining({
        frontmatter: expect.objectContaining({ color: "#3e63dd", title: "Oakmond" }),
      }),
    );
  });

  it("renaming via the title keeps the slug and persists the new title", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.dblClick(screen.getByRole("heading", { level: 2, name: "Oakmond" }));
    const input = screen.getByLabelText("Renombrar Oakmond");
    fireEvent.change(input, { target: { value: "Oakmond HQ" } });
    fireEvent.blur(input);
    expect(mockWriteNote).toHaveBeenCalledWith(
      "2026-06-21",
      "oakmond",
      expect.objectContaining({
        frontmatter: expect.objectContaining({ title: "Oakmond HQ" }),
      }),
    );
  });
});
