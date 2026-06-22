import { useBoardStore } from "../../state/board-store";

function VerticalBars() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="4" height="10" rx="1" fill="currentColor" />
      <rect x="9" y="3" width="4" height="10" rx="1" fill="currentColor" />
    </svg>
  );
}

function HorizontalBars() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="10" height="4" rx="1" fill="currentColor" />
      <rect x="3" y="9" width="10" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

/** Segmented control switching the board split between columns (vertical) and rows (horizontal). */
export function OrientationToggle() {
  const orientation = useBoardStore((s) => s.orientation);
  const setOrientation = useBoardStore((s) => s.setOrientation);

  const seg = (active: boolean) =>
    `flex h-[26px] w-8 items-center justify-center rounded-md transition-colors ${
      active
        ? "bg-surface text-muted shadow-[0_1px_1.5px_rgba(20,24,33,0.1)]"
        : "text-disabled hover:bg-[#ECEEF1]"
    }`;

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-line-field bg-field p-0.5">
      <button
        type="button"
        aria-label="División en columnas"
        aria-pressed={orientation === "vertical"}
        onClick={() => setOrientation("vertical")}
        className={seg(orientation === "vertical")}
      >
        <VerticalBars />
      </button>
      <button
        type="button"
        aria-label="División en filas"
        aria-pressed={orientation === "horizontal"}
        onClick={() => setOrientation("horizontal")}
        className={seg(orientation === "horizontal")}
      >
        <HorizontalBars />
      </button>
    </div>
  );
}
