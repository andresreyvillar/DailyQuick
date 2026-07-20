import { todayKey } from "../../lib/date-key";
import { useBoardStore } from "../../state/board-store";
import { useThemeStore } from "../../state/theme-store";
import { CalendarEvents } from "../calendar/CalendarEvents";
import { CalendarFilter } from "../calendar/CalendarFilter";
import { ForecastProjects } from "../forecast/ForecastProjects";
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
  const theme = useThemeStore((s) => s.theme);

  // "vertical" split = side-by-side columns; "horizontal" split = stacked rows.
  const direction = orientation === "vertical" ? "flex-row" : "flex-col";

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

      <div className="flex items-center gap-2.5 border-b border-line-soft bg-subtle px-5 py-[9px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-faint">Hoy</span>
        <CalendarEvents />
        <CalendarFilter />
      </div>

      <div className="flex items-center gap-2.5 border-b border-line-soft bg-subtle px-5 py-[9px]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-faint">Forecast</span>
        <ForecastProjects />
      </div>

      {projects.length === 0 ? (
        <div
          data-testid="empty-state"
          className="flex flex-1 flex-col items-center justify-center gap-1 bg-sunken text-center"
        >
          <p className="text-[14px] font-medium text-muted">No hay proyectos para hoy todavía.</p>
          <p className="text-[12.5px] text-faint">
            Crea uno con “+ Nuevo proyecto” o desde un evento del calendario.
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
    </main>
  );
}
