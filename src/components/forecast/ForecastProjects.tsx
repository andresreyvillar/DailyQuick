import { useEffect, useState } from "react";

import { accentForKey } from "../../lib/accent-palette";
import { listForecast, type ForecastProject } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

type Load =
  | { kind: "loading" }
  | { kind: "ready"; items: ForecastProject[] }
  | { kind: "error" };

/** Read-only strip of the day's forecasted projects; clicking a chip creates that project column. */
export function ForecastProjects() {
  const dayKey = useBoardStore((s) => s.dayKey);
  const projects = useBoardStore((s) => s.projects);
  const createProjectFromForecast = useBoardStore((s) => s.createProjectFromForecast);

  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!dayKey) return;
    let active = true;
    setLoad({ kind: "loading" });
    listForecast(dayKey)
      .then((items) => active && setLoad({ kind: "ready", items }))
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

  if (load.kind === "loading") {
    return <span className="text-[12.5px] text-faint">Cargando forecast…</span>;
  }
  if (load.kind === "error") {
    return <span className="text-[12.5px] text-muted">No se pudo leer el forecast.</span>;
  }
  if (load.items.length === 0) {
    return <span className="text-[12.5px] text-faint">Sin forecast.</span>;
  }

  const existing = new Set(projects.map((p) => p.frontmatter.title.toLowerCase()));

  async function create(project: ForecastProject) {
    try {
      await createProjectFromForecast(project);
      setToast(`Proyecto "${project.name}" creado desde el forecast`);
    } catch {
      setToast("No se pudo crear el proyecto (¿ya existe?).");
    }
  }

  return (
    <>
      <ul className="flex flex-wrap items-center gap-2">
        {load.items.map((project) => {
          const added = existing.has(project.name.toLowerCase());
          return (
            <li key={project.code}>
              <button
                type="button"
                disabled={added}
                aria-label={added ? `${project.name} ya añadido` : `Crear proyecto ${project.name}`}
                title={project.name}
                onClick={() => void create(project)}
                className="flex h-[38px] items-center gap-2 overflow-hidden rounded-[var(--chip-radius,8px)] border border-line-field bg-surface px-[9px] hover:border-[#CFD4DB] disabled:cursor-default disabled:opacity-55 disabled:hover:border-line-field"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--chip-icon-radius,5px)]"
                  style={{
                    backgroundColor: accentForKey(project.code),
                    boxShadow: "var(--chip-icon-shadow, none)",
                    transform: "rotate(var(--chip-icon-rot, 0deg))",
                  }}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <rect x="2.6" y="8.2" width="2.6" height="4.8" rx="0.7" fill="#fff" />
                    <rect x="6.7" y="5.2" width="2.6" height="7.8" rx="0.7" fill="#fff" />
                    <rect x="10.8" y="3" width="2.6" height="10" rx="0.7" fill="#fff" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-col justify-center gap-px">
                  <span className="truncate text-[12px] leading-tight text-body">{project.name}</span>
                  {added && (
                    <span className="text-[10px] leading-none text-faint">añadido</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

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
