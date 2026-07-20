import { type DragEvent } from "react";

import { nextAccent } from "../../lib/accent-palette";
import { DND_MIME, parseDrag } from "../../lib/board-dnd";
import { todayKey } from "../../lib/date-key";
import { useBoardStore } from "../../state/board-store";
import { useThemeStore } from "../../state/theme-store";
import { CalendarEvents } from "../calendar/CalendarEvents";
import { CalendarFilter } from "../calendar/CalendarFilter";
import { ForecastProjects } from "../forecast/ForecastProjects";
import { RecommendedProjects } from "../forecast/RecommendedProjects";
import { AddProjectButton } from "./AddProjectButton";
import { CarryOverButton } from "./CarryOverButton";
import { DayHeader } from "./DayHeader";
import { DayNavigator } from "./DayNavigator";
import { OrientationToggle } from "./OrientationToggle";
import { ProjectColumn } from "./ProjectColumn";
import { SearchPanel } from "./SearchPanel";
import { ThemeSelector } from "./ThemeSelector";

/** The current-day board: header + calendar strip + per-project panes. */
export function Board() {
  const projects = useBoardStore((s) => s.projects);
  const orientation = useBoardStore((s) => s.orientation);
  const dayKey = useBoardStore((s) => s.dayKey);
  const contextCollapsed = useBoardStore((s) => s.contextCollapsed);
  const toggleContext = useBoardStore((s) => s.toggleContext);
  const createProject = useBoardStore((s) => s.createProject);
  const createProjectFromForecast = useBoardStore((s) => s.createProjectFromForecast);
  const createProjectFromEvent = useBoardStore((s) => s.createProjectFromEvent);
  const theme = useThemeStore((s) => s.theme);

  // "vertical" split = side-by-side columns; "horizontal" split = stacked rows.
  const direction = orientation === "vertical" ? "flex-row" : "flex-col";

  // Dropping a context chip (forecast / calendar event / recent) on the board creates that project.
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const payload = parseDrag(e.dataTransfer.getData(DND_MIME));
    if (!payload) return;
    if (payload.kind === "forecast") {
      void createProjectFromForecast(payload.project);
    } else if (payload.kind === "event") {
      void createProjectFromEvent(payload.event);
    } else {
      const used = projects.map((p) => p.frontmatter.color).filter((c): c is string => Boolean(c));
      void createProject(payload.title, payload.color ?? nextAccent(used));
    }
  }

  return (
    <main className="flex h-screen flex-col bg-surface">
      <header className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
        <div className="flex items-center gap-3.5">
          <DayHeader dayKey={dayKey ?? todayKey()} />
          <DayNavigator />
        </div>
        <div className="flex items-center gap-2.5">
          <SearchPanel />
          <CarryOverButton />
          <AddProjectButton />
          <OrientationToggle />
          <ThemeSelector />
        </div>
      </header>

      {theme === "citrus" && <div className="citrus-strip" aria-hidden="true" />}

      {/* Day-context region: compact, collapsible (calendar events + forecast). */}
      <div className="border-b border-line-soft bg-subtle">
        {contextCollapsed ? (
          <div className="flex items-center px-5 py-1.5">
            <button
              type="button"
              aria-label="Mostrar contexto del día"
              aria-expanded={false}
              onClick={toggleContext}
              className="flex h-6 items-center gap-1.5 rounded-md px-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-faint hover:bg-hover"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Contexto
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-5 pb-1 pt-1.5">
              <button
                type="button"
                aria-label="Ocultar contexto del día"
                aria-expanded={true}
                onClick={toggleContext}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-faint hover:bg-hover"
              >
                <svg width="10" height="10" viewBox="0 0 16 16" className="rotate-90" aria-hidden="true">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-faint">Hoy</span>
              <CalendarEvents />
              <CalendarFilter />
            </div>
            <div className="flex items-center gap-2.5 px-5 pb-2 pl-[calc(1.25rem+2rem)]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-faint">Forecast</span>
              <ForecastProjects />
              <RecommendedProjects />
            </div>
          </>
        )}
      </div>

      <div
        data-testid="board-dropzone"
        className="flex min-h-0 flex-1 flex-col"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {projects.length === 0 ? (
          <div
            data-testid="empty-state"
            className="flex flex-1 flex-col items-center justify-center gap-1 bg-sunken text-center"
          >
            <p className="text-[14px] font-medium text-muted">No hay proyectos para hoy todavía.</p>
            <p className="text-[12.5px] text-faint">
              Crea uno con “+ Nuevo proyecto”, o arrastra un evento o forecast aquí.
            </p>
          </div>
        ) : (
          <div className={`board-canvas flex flex-1 gap-3.5 overflow-auto bg-sunken p-4 ${direction}`}>
            {projects.map((project) => (
              <div key={project.slug} className="min-w-0 flex-1">
                <ProjectColumn slug={project.slug} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
