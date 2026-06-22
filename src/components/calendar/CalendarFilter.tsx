import { useEffect, useState } from "react";

import { listCalendars, type CalendarInfo } from "../../lib/notes-api";
import { useCalendarStore } from "../../state/calendar-store";

/** "Calendarios" button + popover to choose which Apple calendars are visible. */
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
    <div className="relative ml-auto">
      <button
        type="button"
        aria-label="Filtrar calendarios"
        onClick={() => setOpen((o) => !o)}
        className="flex h-[26px] items-center gap-1.5 rounded-[7px] px-2.5 text-[12.5px] font-medium text-muted hover:bg-[#EEF0F3]"
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="3" y="3.5" width="10" height="9" rx="1.5" stroke="#7C828C" strokeWidth="1.3" />
          <path d="M3 6h10" stroke="#7C828C" strokeWidth="1.3" />
        </svg>
        Calendarios
      </button>
      {open && (
        <ul className="absolute right-0 z-50 mt-1 max-h-72 w-56 overflow-auto rounded-[10px] border border-line bg-surface p-1 shadow-[0_8px_28px_rgba(20,24,33,0.16)]">
          {calendars.map((calendar) => (
            <li key={calendar.id}>
              <label className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-body hover:bg-hover">
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
