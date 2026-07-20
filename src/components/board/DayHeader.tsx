import { dayOffset, parseDateKey } from "../../lib/date-key";

const DATE_FMT = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Human relative label for a whole-day offset from today. */
function relativeLabel(offset: number): string {
  if (offset === 0) return "Hoy";
  if (offset === -1) return "Ayer";
  if (offset === 1) return "Mañana";
  if (offset < 0) return `hace ${-offset} días`;
  return `en ${offset} días`;
}

/**
 * Prominent header showing the selected day's date (the visual anchor). The date sits in a
 * fixed-width slot so the navigation controls beside it never shift as the label length changes, and
 * today/past/future is signalled with a color accent + a relative label.
 */
export function DayHeader({ dayKey }: { dayKey: string }) {
  const date = parseDateKey(dayKey);
  const offset = dayOffset(dayKey);
  const isToday = offset === 0;
  const label = DATE_FMT.format(date);
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div data-testid="date-slot" className="date-slot shrink-0">
      <h1
        className={`board-date whitespace-nowrap leading-none tracking-[-0.01em] ${isToday ? "" : "text-muted"}`}
        style={isToday ? { color: "var(--date-accent)" } : undefined}
      >
        {capitalized} <span className="font-medium text-disabled">· {date.getFullYear()}</span>
      </h1>
      <div className="mt-1 flex h-[18px] items-center">
        {isToday ? (
          <span
            className="rounded-full px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.05em] text-white"
            style={{ backgroundColor: "var(--date-accent)" }}
          >
            Hoy
          </span>
        ) : (
          <span className="text-[11.5px] font-medium text-faint">{relativeLabel(offset)}</span>
        )}
      </div>
    </div>
  );
}
