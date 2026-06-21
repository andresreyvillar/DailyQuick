import { useBoardStore } from "../../state/board-store";

/** Toggle the board split between vertical (columns) and horizontal (rows). */
export function OrientationToggle() {
  const orientation = useBoardStore((s) => s.orientation);
  const toggleOrientation = useBoardStore((s) => s.toggleOrientation);

  return (
    <button
      type="button"
      onClick={toggleOrientation}
      aria-label="Cambiar orientación del split"
      aria-pressed={orientation === "horizontal"}
      className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100"
    >
      {orientation === "vertical" ? "Columnas" : "Filas"}
    </button>
  );
}
