import { useEffect, useState } from "react";

import { search, type SearchHit } from "../../lib/notes-api";
import { useBoardStore } from "../../state/board-store";

/** Search box + results dropdown; opening a result navigates the board to that day. */
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
      <input
        type="search"
        aria-label="Buscar notas"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar…"
        className="rounded border border-gray-300 px-2 py-1 text-sm"
      />
      {hits.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-80 w-80 overflow-auto rounded border border-gray-200 bg-white shadow">
          {hits.map((hit) => (
            <li key={`${hit.day_key}:${hit.slug}`}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => {
                  void goToDay(hit.day_key);
                  setQuery("");
                  setHits([]);
                }}
              >
                <span className="font-medium">{hit.title}</span>
                <span className="ml-2 text-gray-400">{hit.day_key}</span>
                {hit.snippet && <div className="truncate text-gray-500">{hit.snippet}</div>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
