import { type DragEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";

import { nextAccent } from "../../lib/accent-palette";
import { DND_MIME, parseDrag } from "../../lib/board-dnd";
import { shouldDeleteOnDrop } from "../../lib/board-reorder";
import { todayKey } from "../../lib/date-key";
import { useBoardStore } from "../../state/board-store";
import { useThemeStore } from "../../state/theme-store";
import { DeleteConfirm } from "./DeleteConfirm";
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
  const reorderProject = useBoardStore((s) => s.reorderProject);
  const deleteProject = useBoardStore((s) => s.deleteProject);
  const theme = useThemeStore((s) => s.theme);

  // Pointer drag to reorder frames, or drag off the board + hold to delete (see board-reorder helpers).
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);
  const [drag, setDrag] = useState<{ from: number; slug: string; title: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ slug: string; title: string } | null>(null);

  function onGripDown(e: ReactPointerEvent, from: number, slug: string, title: string) {
    e.preventDefault();
    dragStartRef.current = Date.now();
    setDrag({ from, slug, title });
  }

  useEffect(() => {
    if (!drag) return;
    const current = drag;
    function onUp(e: PointerEvent) {
      const rect = dropzoneRef.current?.getBoundingClientRect();
      const inside = rect
        ? e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        : true;
      if (shouldDeleteOnDrop(inside, Date.now() - dragStartRef.current)) {
        setPendingDelete({ slug: current.slug, title: current.title });
      } else if (inside) {
        const target = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-frame-index]");
        const to = target ? Number((target as HTMLElement).dataset.frameIndex) : current.from;
        if (!Number.isNaN(to)) void reorderProject(current.from, to);
      }
      setDrag(null);
    }
    window.addEventListener("pointerup", onUp);
    return () => window.removeEventListener("pointerup", onUp);
  }, [drag, reorderProject]);

  // "vertical" = side-by-side columns; "horizontal" = stacked rows; "grid" = wrapping card grid.
  const isGrid = orientation === "grid";
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
      <header className="flex items-center justify-between gap-3 overflow-x-auto border-b border-line-soft px-5 py-3.5">
        <div className="flex shrink-0 items-center gap-3.5">
          <DayHeader dayKey={dayKey ?? todayKey()} />
          <DayNavigator />
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
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
        ref={dropzoneRef}
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
          <div
            data-testid="board-canvas"
            className={
              isGrid
                ? "board-canvas grid flex-1 content-start gap-3.5 overflow-auto bg-sunken p-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]"
                : `board-canvas flex flex-1 gap-3.5 overflow-auto bg-sunken p-4 ${direction}`
            }
          >
            {projects.map((project, index) => (
              <div
                key={project.slug}
                data-frame-index={index}
                className={`relative flex flex-col ${isGrid ? "min-h-[260px] min-w-0" : "min-w-0 flex-1"} ${
                  drag?.slug === project.slug ? "opacity-60" : ""
                }`}
              >
                <div
                  role="button"
                  aria-label={`Mover ${project.frontmatter.title}`}
                  title="Arrastra para reordenar; suéltalo fuera del tablero para eliminar"
                  onPointerDown={(e) => onGripDown(e, index, project.slug, project.frontmatter.title)}
                  className="flex h-4 shrink-0 cursor-grab items-center justify-center text-disabled hover:text-muted active:cursor-grabbing"
                >
                  <svg width="18" height="6" viewBox="0 0 18 6" fill="currentColor" aria-hidden="true">
                    <circle cx="3" cy="3" r="1.3" />
                    <circle cx="9" cy="3" r="1.3" />
                    <circle cx="15" cy="3" r="1.3" />
                  </svg>
                </div>
                <div className="min-h-0 flex-1">
                  <ProjectColumn slug={project.slug} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pendingDelete && (
        <DeleteConfirm
          title={pendingDelete.title}
          onConfirm={() => {
            void deleteProject(pendingDelete.slug);
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </main>
  );
}
