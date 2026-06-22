import { useEffect, useState } from "react";

import { listCalendars, type CalendarInfo } from "../../lib/notes-api";
import { useCalendarStore } from "../../state/calendar-store";

/** Button + popover to choose which Apple calendars are visible. */
export function CalendarFilter() {
  const hidden = useCalendarStore((s) => s.hidden);
  const toggle = useCalendarStore((s) => s.toggle);
  const [calendars, setCalendars] = useState<CalendarInfo[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    listCalendars()
      .then(setCalendars)
      .catch(() => setCalendars([]));
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Filtrar calendarios"
        onClick={() => setOpen((o) => !o)}
        className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100"
      >
        Calendarios
      </button>
      {open && (
        <ul className="absolute z-10 mt-1 max-h-72 w-56 overflow-auto rounded border border-gray-200 bg-white p-1 shadow">
          {calendars.map((calendar) => (
            <li key={calendar.id}>
              <label className="flex items-center gap-2 px-2 py-1 text-sm">
                <input
                  type="checkbox"
                  checked={!hidden.includes(calendar.id)}
                  onChange={() => toggle(calendar.id)}
                />
                {calendar.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
