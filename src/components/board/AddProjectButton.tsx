import { useState, type FormEvent } from "react";

import { useBoardStore } from "../../state/board-store";

const DEFAULT_COLOR = "#3E63DD";

/** "+" affordance that opens an inline form to create a project (title + color). */
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
        className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
      >
        +
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
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <input
        type="color"
        aria-label="Color del proyecto"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="h-7 w-8 cursor-pointer border-0 bg-transparent p-0"
      />
      <button type="submit" className="rounded border border-gray-300 px-3 py-1 text-sm">
        Crear
      </button>
      {error && (
        <span role="alert" className="text-sm text-red-600">
          {error}
        </span>
      )}
    </form>
  );
}
