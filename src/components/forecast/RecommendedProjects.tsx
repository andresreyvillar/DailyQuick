import { useEffect, useState } from "react";

import { accentForKey, nextAccent } from "../../lib/accent-palette";
import { addDays } from "../../lib/date-key";
import { listDay, listForecast, type NoteSummary } from "../../lib/notes-api";
import { recommendedFromRecent } from "../../lib/recommend";
import { useBoardStore } from "../../state/board-store";

const RECENT_DAYS = 5;

type Raw = { recentByDay: NoteSummary[][]; forecastNames: string[] };

/** Chips for projects touched in the last 5 days that aren't in today's forecast or on the board. */
export function RecommendedProjects() {
  const dayKey = useBoardStore((s) => s.dayKey);
  const projects = useBoardStore((s) => s.projects);
  const createProject = useBoardStore((s) => s.createProject);

  const [raw, setRaw] = useState<Raw>({ recentByDay: [], forecastNames: [] });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!dayKey) return;
    let active = true;
    const days = Array.from({ length: RECENT_DAYS }, (_, i) => addDays(dayKey, -(i + 1)));
    Promise.all([listForecast(dayKey), ...days.map((key) => listDay(key))])
      .then((results) => {
        if (!active) return;
        const [forecast, ...recent] = results;
        setRaw({
          recentByDay: recent as NoteSummary[][],
          forecastNames: (forecast as { name: string }[]).map((f) => f.name),
        });
      })
      .catch(() => active && setRaw({ recentByDay: [], forecastNames: [] }));
    return () => {
      active = false;
    };
  }, [dayKey]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Recompute on every render so a just-created project drops out of the recommendations immediately.
  const items = recommendedFromRecent(
    raw.recentByDay,
    raw.forecastNames,
    projects.map((p) => p.frontmatter.title),
  );

  if (items.length === 0) return null;

  async function add(item: NoteSummary) {
    const used = projects.map((p) => p.frontmatter.color).filter((c): c is string => Boolean(c));
    try {
      await createProject(item.title, item.color ?? nextAccent(used));
      setToast(`Proyecto "${item.title}" añadido`);
    } catch {
      setToast("No se pudo añadir el proyecto (¿ya existe?).");
    }
  }

  return (
    <>
      <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-faint">Recientes</span>
      <ul className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <button
              type="button"
              aria-label={`Añadir ${item.title}`}
              title={item.title}
              onClick={() => void add(item)}
              className="flex h-[30px] items-center gap-2 rounded-[var(--chip-radius,8px)] border border-dashed border-line-field bg-surface px-2.5 text-[12px] text-body hover:border-[#CFD4DB]"
            >
              <span
                className="h-[7px] w-[7px] shrink-0 rounded-full"
                style={{ backgroundColor: item.color ?? accentForKey(item.slug) }}
                aria-hidden="true"
              />
              {item.title}
            </button>
          </li>
        ))}
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
