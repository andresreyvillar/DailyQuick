const DATE_FMT = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** Prominent header showing the selected day's date (the visual anchor). */
export function DayHeader({ date = new Date() }: { date?: Date }) {
  const label = DATE_FMT.format(date);
  const capitalized = label.charAt(0).toUpperCase() + label.slice(1);
  return (
    <h1 className="text-[18px] font-semibold tracking-[-0.01em] text-strong">
      {capitalized} <span className="font-medium text-disabled">· {date.getFullYear()}</span>
    </h1>
  );
}
