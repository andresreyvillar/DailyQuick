import { useEffect, useState } from "react";

import { visibleEvents } from "../../lib/calendar-filter";
import { listEvents, type CalendarEvent } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { useCalendarStore } from "../../state/calendar-store";

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
  const hidden = useCalendarStore((s) => s.hidden);
  const projects = useBoardStore((s) => s.projects);
  const createProjectFromEvent = useBoardStore((s) => s.createProjectFromEvent);
  const addEventToProject = useBoardStore((s) => s.addEventToProject);
  const [state, setState] = useState<State>({ kind: "loading" });
  const [error, setError] = useState<string | null>(null);

  async function createProjectFor(event: CalendarEvent) {
    try {
      await createProjectFromEvent(event);
      setError(null);
    } catch {
      setError("No se pudo crear el proyecto (¿ya existe?).");
    }
  }

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
  const events = visibleEvents(state.events, hidden);
  if (events.length === 0) {
    return <div className="text-sm text-gray-400">Sin eventos.</div>;
  }
  return (
    <div className="flex flex-col gap-1">
      {error && (
        <span role="alert" className="text-sm text-red-600">
          {error}
        </span>
      )}
      <ul className="flex flex-wrap gap-2 text-sm">
        {events.map((event, index) => (
          <li
            key={`${event.start}:${index}`}
            className="flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5"
          >
            <span className="font-medium">{event.title}</span>
            {!event.all_day && <span className="text-gray-500">{formatTime(event.start)}</span>}
            <button
              type="button"
              aria-label={`Crear proyecto desde ${event.title}`}
              onClick={() => void createProjectFor(event)}
              className="ml-1 rounded border border-gray-300 px-1 text-xs hover:bg-white"
            >
              + proyecto
            </button>
            {projects.length > 0 && (
              <select
                aria-label={`Añadir ${event.title} a un proyecto`}
                value=""
                onChange={(e) => {
                  if (e.target.value) void addEventToProject(e.target.value, event);
                }}
                className="rounded border border-gray-300 text-xs"
              >
                <option value="">Añadir a…</option>
                {projects.map((project) => (
                  <option key={project.slug} value={project.slug}>
                    {project.frontmatter.title}
                  </option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
