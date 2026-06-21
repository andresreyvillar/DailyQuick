import { useBoardStore } from "../../state/board-store";

/** Previous / today / next day controls for the board. */
export function DayNavigator() {
  const goToPreviousDay = useBoardStore((s) => s.goToPreviousDay);
  const goToToday = useBoardStore((s) => s.goToToday);
  const goToNextDay = useBoardStore((s) => s.goToNextDay);

  const btn = "rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100";

  return (
    <div className="flex items-center gap-1">
      <button type="button" aria-label="Día anterior" onClick={() => void goToPreviousDay()} className={btn}>
        ←
      </button>
      <button type="button" aria-label="Hoy" onClick={() => void goToToday()} className={btn}>
        Hoy
      </button>
      <button type="button" aria-label="Día siguiente" onClick={() => void goToNextDay()} className={btn}>
        →
      </button>
    </div>
  );
}
