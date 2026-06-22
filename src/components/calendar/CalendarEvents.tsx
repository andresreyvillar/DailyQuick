import { useEffect, useState } from "react";

import { visibleEvents } from "../../lib/calendar-filter";
import { listEvents, type CalendarEvent } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";
import { useCalendarStore } from "../../state/calendar-store";

type Load = { kind: "loading" } | { kind: "ready"; events: CalendarEvent[] } | { kind: "error" };

// Local ISO "YYYY-MM-DDTHH:MM:SS" → "HH:MM" (deterministic, no locale drift).
function hhmm(iso: string): string {
  return iso.length >= 16 ? iso.slice(11, 16) : "";
}

/** Read-only strip of the day's events as chips; clicking a chip opens an actions popover. */
export function CalendarEvents() {
  const dayKey = useBoardStore((s) => s.dayKey);
  const hidden = useCalendarStore((s) => s.hidden);
  const projects = useBoardStore((s) => s.projects);
  const createProjectFromEvent = useBoardStore((s) => s.createProjectFromEvent);
  const addEventToProject = useBoardStore((s) => s.addEventToProject);

  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [submenu, setSubmenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!dayKey) return;
    let active = true;
    setLoad({ kind: "loading" });
    listEvents(dayKey)
      .then((events) => active && setLoad({ kind: "ready", events }))
      .catch(() => active && setLoad({ kind: "error" }));
    return () => {
      active = false;
    };
  }, [dayKey]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  function close() {
    setOpenKey(null);
    setSubmenu(false);
  }

  async function createFrom(event: CalendarEvent) {
    close();
    try {
      await createProjectFromEvent(event);
      setToast(`Nuevo proyecto creado desde "${event.title}"`);
    } catch {
      setToast("No se pudo crear el proyecto (¿ya existe?).");
    }
  }

  async function addTo(slug: string, projectTitle: string, event: CalendarEvent) {
    close();
    await addEventToProject(slug, event);
    const when = event.all_day ? "" : `${hhmm(event.start)} `;
    setToast(`"${when}${event.title}" añadido a "${projectTitle}"`);
  }

  if (load.kind === "error") {
    return (
      <div role="status" className="text-[12.5px] text-muted">
        Concede acceso al Calendario para ver tus eventos.
      </div>
    );
  }
  if (load.kind === "loading") {
    return (
      <div role="status" className="text-[12.5px] text-faint">
        Cargando eventos…
      </div>
    );
  }

  const events = visibleEvents(load.events, hidden);

  return (
    <>
      {events.length === 0 ? (
        <span className="text-[12.5px] text-faint">Sin eventos.</span>
      ) : (
        <ul className="flex flex-wrap items-center gap-2">
          {events.map((event, index) => {
            const key = `${event.start}:${index}`;
            const open = openKey === key;
            return (
              <li key={key} className="relative">
                <button
                  type="button"
                  aria-label={`Acciones de ${event.title}`}
                  onClick={() => {
                    setSubmenu(false);
                    setOpenKey(open ? null : key);
                  }}
                  className="flex h-[26px] items-center gap-[7px] rounded-[7px] border border-[#E9EBEF] bg-surface pl-2.5 pr-[7px] hover:border-[#CFD4DB] hover:bg-[#FCFCFD]"
                >
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-disabled" aria-hidden="true" />
                  {!event.all_day && <span className="font-mono text-[11px] text-faint">{hhmm(event.start)}</span>}
                  <span className="text-[12.5px] text-body">{event.title}</span>
                  <span className={`text-[14px] ${open ? "text-muted" : "text-[#BCC1C9]"}`} aria-hidden="true">
                    +
                  </span>
                </button>

                {open && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={close} aria-hidden="true" />
                    <div className="absolute left-0 top-[33px] z-50 w-[248px] rounded-[10px] border border-line bg-surface p-1 shadow-[0_8px_28px_rgba(20,24,33,0.16)]">
                      {!submenu ? (
                        <>
                          <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint">
                            <span className="h-[7px] w-[7px] rounded-full bg-disabled" aria-hidden="true" />
                            {event.all_day ? event.title : `${hhmm(event.start)} · ${event.title}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => void createFrom(event)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-hover"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#EEF3FC] text-[15px] text-[#4F7FD6]">
                              +
                            </span>
                            <span>
                              <span className="block text-[13px] font-semibold text-strong">Nuevo proyecto</span>
                              <span className="block text-[11px] text-faint">Crea una columna desde el evento</span>
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setSubmenu(true)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left hover:bg-hover"
                          >
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-hover text-muted">↳</span>
                            <span className="flex-1">
                              <span className="block text-[13px] font-semibold text-strong">Añadir a un proyecto…</span>
                              <span className="block text-[11px] text-faint">Inserta el evento como nota</span>
                            </span>
                            <span className="text-faint" aria-hidden="true">›</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-label="Volver"
                            onClick={() => setSubmenu(false)}
                            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint hover:bg-hover"
                          >
                            ‹ Añadir a…
                          </button>
                          {projects.length === 0 ? (
                            <div className="px-2 py-1.5 text-[12px] text-faint">No hay proyectos hoy.</div>
                          ) : (
                            projects.map((project) => (
                              <button
                                key={project.slug}
                                type="button"
                                onClick={() => void addTo(project.slug, project.frontmatter.title, event)}
                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-body hover:bg-hover"
                              >
                                <span
                                  className="h-[7px] w-[7px] rounded-full"
                                  style={{ backgroundColor: project.frontmatter.color ?? "#9AA0A9" }}
                                  aria-hidden="true"
                                />
                                {project.frontmatter.title}
                              </button>
                            ))
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-[18px] left-1/2 z-[70] flex -translate-x-1/2 items-center gap-2 rounded-[9px] bg-ink px-3.5 py-2.5 text-[12.5px] font-medium text-white shadow-[0_8px_24px_rgba(20,24,33,0.28)]"
        >
          <span className="h-[7px] w-[7px] rounded-full bg-[#5CC08A]" aria-hidden="true" />
          {toast}
        </div>
      )}
    </>
  );
}
