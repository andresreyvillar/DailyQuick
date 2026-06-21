const FORMATTER = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Prominent header showing the board's date in a human-readable form. */
export function DayHeader({ date = new Date() }: { date?: Date }) {
  return (
    <h1 className="text-2xl font-bold capitalize tracking-tight">
      {FORMATTER.format(date)}
    </h1>
  );
}
