import { useEffect, useState } from "react";

import { search, type SearchHit } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

/** Search field + results dropdown; opening a result navigates the board to that day. */
export function SearchPanel() {
  const goToDay = useBoardStore((s) => s.goToDay);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setHits([]);
      return;
    }
    const timer = setTimeout(() => {
      void search(trimmed).then(setHits);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.2" stroke="currentColor" strokeWidth="1.4" />
          <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <input
        type="search"
        aria-label="Buscar notas"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar en todas las notas…"
        className="h-[30px] w-[230px] rounded-lg border border-line-field bg-field pl-8 pr-3 text-[13px] text-strong placeholder:text-faint focus:border-line focus:bg-surface focus:outline-none"
      />
      {hits.length > 0 && (
        <ul className="absolute z-50 mt-1.5 max-h-80 w-80 overflow-auto rounded-[10px] border border-line bg-surface py-1 shadow-[0_8px_28px_rgba(20,24,33,0.16)]">
          {hits.map((hit) => (
            <li key={`${hit.day_key}:${hit.slug}`}>
              <button
                type="button"
                className="block w-full rounded-md px-3 py-2 text-left text-[13px] hover:bg-hover"
                onClick={() => {
                  void goToDay(hit.day_key);
                  setQuery("");
                  setHits([]);
                }}
              >
                <span className="font-medium text-strong">{hit.title}</span>
                <span className="ml-2 font-mono text-[11px] text-faint">{hit.day_key}</span>
                {hit.snippet && <div className="truncate text-[12px] text-muted">{hit.snippet}</div>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
