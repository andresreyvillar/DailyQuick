import { useEffect, useState } from "react";

import { addDays } from "../../lib/date-key";
import { listDay, type NoteSummary } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

/** Header action: copy the previous day's projects into the current day (disabled when nothing to copy). */
export function CarryOverButton() {
  const dayKey = useBoardStore((s) => s.dayKey);
  const projects = useBoardStore((s) => s.projects);
  const importPreviousDay = useBoardStore((s) => s.importPreviousDay);
  const [previous, setPrevious] = useState<NoteSummary[]>([]);

  useEffect(() => {
    if (!dayKey) {
      setPrevious([]);
      return;
    }
    let active = true;
    listDay(addDays(dayKey, -1))
      .then((p) => active && setPrevious(p))
      .catch(() => active && setPrevious([]));
    return () => {
      active = false;
    };
  }, [dayKey]);

  const todaySlugs = new Set(projects.map((p) => p.slug));
  const disabled = previous.every((p) => todaySlugs.has(p.slug));

  return (
    <button
      type="button"
      aria-label="Copiar proyectos del día anterior"
      title={
        disabled
          ? "No hay proyectos del día anterior para copiar"
          : "Copiar los proyectos del día anterior"
      }
      disabled={disabled}
      onClick={() => void importPreviousDay()}
      className="flex h-[30px] items-center gap-1.5 rounded-lg border border-line-field bg-field px-2.5 text-[12.5px] font-medium text-body hover:bg-hover disabled:cursor-not-allowed disabled:opacity-40"
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      Copiar de ayer
    </button>
  );
}
