import { useEffect, useState } from "react";

import { listEvents, type CalendarEvent } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

type State =
  | { kind: "loading" }
  | { kind: "ready"; events: CalendarEvent[] }
  | { kind: "error" };

function formatTime(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

/** Read-only strip of the selected day's Apple Calendar events. */
export function CalendarEvents() {
  const dayKey = useBoardStore((s) => s.dayKey);
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!dayKey) return;
    let active = true;
    setState({ kind: "loading" });
    listEvents(dayKey)
      .then((events) => active && setState({ kind: "ready", events }))
      .catch(() => active && setState({ kind: "error" }));
    return () => {
      active = false;
    };
  }, [dayKey]);

  if (state.kind === "error") {
    return (
      <div role="status" className="text-sm text-gray-500">
        Concede acceso al Calendario para ver tus eventos.
      </div>
    );
  }
  if (state.kind === "loading") {
    return (
      <div role="status" className="text-sm text-gray-400">
        Cargando eventos…
      </div>
    );
  }
  if (state.events.length === 0) {
    return <div className="text-sm text-gray-400">Sin eventos.</div>;
  }
  return (
    <ul className="flex flex-wrap gap-2 text-sm">
      {state.events.map((event, index) => (
        <li key={`${event.start}:${index}`} className="rounded bg-gray-100 px-2 py-0.5">
          <span className="font-medium">{event.title}</span>
          {!event.all_day && <span className="ml-1 text-gray-500">{formatTime(event.start)}</span>}
        </li>
      ))}
    </ul>
  );
}
