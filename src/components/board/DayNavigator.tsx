import { useBoardStore } from "../../state/board-store";

/** Previous / today / next day controls for the board. */
export function DayNavigator() {
  const goToPreviousDay = useBoardStore((s) => s.goToPreviousDay);
  const goToToday = useBoardStore((s) => s.goToToday);
  const goToNextDay = useBoardStore((s) => s.goToNextDay);

  const arrow =
    "flex h-7 w-7 items-center justify-center rounded-[7px] text-[15px] text-muted hover:bg-hover";

  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label="Día anterior" onClick={() => void goToPreviousDay()} className={arrow}>
        ‹
      </button>
      <button
        type="button"
        aria-label="Hoy"
        onClick={() => void goToToday()}
        className="h-7 rounded-[7px] border border-line px-3 text-[13px] font-semibold text-body hover:bg-hover"
      >
        Hoy
      </button>
      <button type="button" aria-label="Día siguiente" onClick={() => void goToNextDay()} className={arrow}>
        ›
      </button>
    </div>
  );
}
