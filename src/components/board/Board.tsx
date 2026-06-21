import { useBoardStore } from "../../state/board-store";
import { DayHeader } from "./DayHeader";
import { OrientationToggle } from "./OrientationToggle";
import { ProjectColumn } from "./ProjectColumn";

/** The current-day board: date header + per-project panes + split toggle. */
export function Board() {
  const projects = useBoardStore((s) => s.projects);
  const orientation = useBoardStore((s) => s.orientation);

  // "vertical" split = side-by-side columns; "horizontal" split = stacked rows.
  const layout =
    orientation === "vertical" ? "flex-row divide-x" : "flex-col divide-y";

  return (
    <main className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <DayHeader />
        <OrientationToggle />
      </div>

      {projects.length === 0 ? (
        <div
          data-testid="empty-state"
          className="flex flex-1 items-center justify-center text-gray-500"
        >
          No hay proyectos para hoy todavía.
        </div>
      ) : (
        <div className={`flex flex-1 divide-gray-200 ${layout}`}>
          {projects.map((project) => (
            <div key={project.slug} className="flex-1 overflow-auto">
              <ProjectColumn slug={project.slug} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
