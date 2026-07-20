import { useState, type FormEvent } from "react";

import { ACCENTS, nextAccent } from "../../lib/accent-palette";
import { useBoardStore } from "../../state/board-store";
import { ColorPicker } from "../ui/ColorPicker";

/** "+ Nuevo proyecto" pill that opens an inline form to create a project (title + color). */
export function AddProjectButton() {
  const createProject = useBoardStore((s) => s.createProject);
  const projects = useBoardStore((s) => s.projects);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(ACCENTS[0].hex);
  const [error, setError] = useState<string | null>(null);

  function usedColors(): string[] {
    return projects.map((p) => p.frontmatter.color).filter((c): c is string => Boolean(c));
  }

  function openForm() {
    // Default to the first accent not already on the board, recomputed each time the form opens.
    setColor(nextAccent(usedColors()));
    setError(null);
    setOpen(true);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await createProject(title, color);
      setTitle("");
      setError(null);
      setOpen(false);
    } catch {
      setError("No se pudo crear el proyecto");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Nuevo proyecto"
        onClick={openForm}
        className="flex h-[30px] items-center gap-1.5 rounded-lg bg-ink px-[13px] text-[13px] font-semibold text-white hover:opacity-90"
      >
        <span className="text-[15px] leading-none">+</span> Nuevo proyecto
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        aria-label="Título del proyecto"
        value={title}
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Proyecto"
        className="h-[30px] rounded-lg border border-line-field bg-field px-2.5 text-[13px] text-strong placeholder:text-faint focus:border-line focus:bg-surface focus:outline-none"
      />
      <ColorPicker value={color} onChange={setColor} label="Color del proyecto" />
      <button
        type="submit"
        className="h-[30px] rounded-lg bg-ink px-3 text-[13px] font-semibold text-white hover:opacity-90"
      >
        Crear
      </button>
      {error && (
        <span role="alert" className="text-[12px] text-[#CF6470]">
          {error}
        </span>
      )}
    </form>
  );
}
