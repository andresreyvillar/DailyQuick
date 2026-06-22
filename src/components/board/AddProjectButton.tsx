import { useState, type FormEvent } from "react";

import { useBoardStore } from "../../state/board-store";

const DEFAULT_COLOR = "#4F7FD6";

/** "+ Nuevo proyecto" pill that opens an inline form to create a project (title + color). */
export function AddProjectButton() {
  const createProject = useBoardStore((s) => s.createProject);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await createProject(title, color);
      setTitle("");
      setColor(DEFAULT_COLOR);
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
        onClick={() => setOpen(true)}
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
      <input
        type="color"
        aria-label="Color del proyecto"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="h-7 w-8 cursor-pointer rounded-md border border-line bg-transparent p-0.5"
      />
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
