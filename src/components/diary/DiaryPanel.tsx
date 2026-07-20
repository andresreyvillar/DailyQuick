import { useEffect, useState } from "react";

import { readDiary, type DiaryEntry } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

const SOURCE_LABEL: Record<string, string> = { mail: "Mail", slack: "Slack" };

/** Read-only "Diario" panel at the top of a project frame: an AI day-summary plus its source events. */
export function DiaryPanel({ slug }: { slug: string }) {
  const dayKey = useBoardStore((s) => s.dayKey);
  const [entry, setEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    if (!dayKey) return;
    let active = true;
    readDiary(dayKey, slug)
      .then((e) => active && setEntry(e))
      .catch(() => active && setEntry(null));
    return () => {
      active = false;
    };
  }, [dayKey, slug]);

  if (!entry) return null;

  return (
    <div className="mx-4 mt-3 rounded-[10px] border border-line bg-subtle px-3 py-2.5">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-faint">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1l1.6 4.4L14 7l-4.4 1.6L8 13l-1.6-4.4L2 7l4.4-1.6z" />
        </svg>
        Diario
      </div>
      <p className="text-[12.5px] leading-snug text-body">{entry.summary}</p>
      {entry.events.length > 0 && (
        <ul className="mt-2 flex flex-col gap-1">
          {entry.events.map((event, index) => (
            <li key={index} className="flex items-start gap-2 text-[11.5px] text-muted">
              <span className="mt-px font-mono text-[10px] leading-none text-faint">{event.time}</span>
              <span className="mt-px rounded bg-hover px-1 text-[9.5px] font-semibold uppercase tracking-[0.04em] text-faint">
                {SOURCE_LABEL[event.source] ?? event.source}
              </span>
              <span className="min-w-0 flex-1 leading-snug">
                <span className="font-semibold text-body">{event.who}</span> {event.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
