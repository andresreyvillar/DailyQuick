import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../lib/notes-api", () => ({
  listDay: vi.fn(),
  readNote: vi.fn(),
  writeNote: vi.fn(),
  ensureDay: vi.fn(),
  createProject: vi.fn(),
  revealNote: vi.fn(),
}));

// The real editor is Milkdown/ProseMirror (can't run in jsdom); stub it as a textarea
// that forwards its value to `onChange`, so we can test the persistence wiring.
// Stub the diary panel + sources dialog + per-project sync button (their own tests cover them).
vi.mock("../diary/DiaryPanel", () => ({ DiaryPanel: () => null }));
vi.mock("../diary/DiarySourcesDialog", () => ({ DiarySourcesDialog: () => null }));
vi.mock("../diary/ProjectSyncButton", () => ({ ProjectSyncButton: () => null }));

vi.mock("../editor/MarkdownEditor", () => ({
  MarkdownEditor: ({
    value,
    onChange,
    accent,
  }: {
    value: string;
    onChange: (md: string) => void;
    accent?: string;
  }) => (
    <textarea
      aria-label="editor"
      data-accent={accent}
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

import { revealNote, writeNote } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { ProjectColumn } from "./ProjectColumn";

const mockWriteNote = vi.mocked(writeNote);
const mockRevealNote = vi.mocked(revealNote);
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

  it("recoloring via the accent palette persists the new color", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.click(screen.getByLabelText("Color de Oakmond"));
    fireEvent.click(screen.getByLabelText("Teal"));
    expect(mockWriteNote).toHaveBeenCalledWith(
      "2026-06-21",
      "oakmond",
      expect.objectContaining({
        frontmatter: expect.objectContaining({ color: "#2F9AA8", title: "Oakmond" }),
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

  it("opens an actions menu with a destructive delete item", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.click(screen.getByRole("button", { name: "Acciones de Oakmond" }));
    expect(screen.getByText("Eliminar proyecto")).toBeInTheDocument();
  });

  it("clicking delete shows an inline confirmation and deletes nothing yet", () => {
    const deleteProject = vi.fn();
    useBoardStore.setState({ deleteProject });
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.click(screen.getByRole("button", { name: "Acciones de Oakmond" }));
    fireEvent.click(screen.getByText("Eliminar proyecto"));
    expect(screen.getByText(/¿Eliminar/)).toBeInTheDocument();
    expect(deleteProject).not.toHaveBeenCalled();
  });

  it("confirming calls deleteProject; cancel closes without deleting", () => {
    const deleteProject = vi.fn();
    useBoardStore.setState({ deleteProject });
    render(<ProjectColumn slug="oakmond" />);

    // Cancel leaves the project alone.
    fireEvent.click(screen.getByRole("button", { name: "Acciones de Oakmond" }));
    fireEvent.click(screen.getByText("Eliminar proyecto"));
    fireEvent.click(screen.getByText("Cancelar"));
    expect(deleteProject).not.toHaveBeenCalled();
    expect(screen.queryByText(/¿Eliminar/)).not.toBeInTheDocument();

    // Confirming deletes.
    fireEvent.click(screen.getByRole("button", { name: "Acciones de Oakmond" }));
    fireEvent.click(screen.getByText("Eliminar proyecto"));
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(deleteProject).toHaveBeenCalledWith("oakmond");
  });

  it("offers 'Vincular fuentes' in the actions menu", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.click(screen.getByRole("button", { name: "Acciones de Oakmond" }));
    expect(screen.getByText("Vincular fuentes")).toBeInTheDocument();
  });

  it("reveals the note in Finder for the viewed day from the actions menu", () => {
    render(<ProjectColumn slug="oakmond" />);
    fireEvent.click(screen.getByRole("button", { name: "Acciones de Oakmond" }));
    fireEvent.click(screen.getByText("Mostrar en Finder"));
    expect(mockRevealNote).toHaveBeenCalledWith("2026-06-21", "oakmond");
  });

  it("passes the project's accent to the editor", () => {
    render(<ProjectColumn slug="oakmond" />);
    expect(screen.getByLabelText("editor")).toHaveAttribute("data-accent", "#E54D2E");
  });
});
